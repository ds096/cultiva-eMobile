import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "expo-router/drawer";
import { Image, View } from "react-native";
import { Button, Divider, Snackbar } from "react-native-paper";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme/theme";
import { useProfile } from "../context/ProfileContext";

// Conteúdo personalizado apresentado dentro do Drawer.
export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const { clearProfile } = useProfile();
  const insets = useSafeAreaInsets();
  // A ref bloqueia até um segundo toque antes da próxima renderização.
  const logoutInProgress = useRef(false);
  // Controla a execução da operação de saída.
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Controla a apresentação da mensagem de erro.
  const [showError, setShowError] = useState(false);
  // Encerra somente a seleção do perfil local.
  async function handleLogout() {
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;
    setIsLoggingOut(true);
    setShowError(false);
    try {
      await clearProfile();
    } catch {
      // O contexto mantém o perfil selecionado quando a remoção falha.
      setShowError(true);
    } finally {
      logoutInProgress.current = false;
      setIsLoggingOut(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
      }}
    >
      {/* Área rolável com logo e destinos principais. */}
      <DrawerContentScrollView
        {...props}
        // O inset inferior pertence ao rodapé; o ScrollView já trata o topo.
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <Image
          source={require("../../assets/logo_plus_name.png")}
          resizeMode="contain"
          accessibilityLabel="Logo cultiva-e"
          style={{
            width: "100%",
            height: 110,
            marginBottom: 16,
          }}
        />

        {/* Reutiliza as rotas, ícones e seleção do Drawer. */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Ação independente das rotas de navegação. */}
      <View
        style={{
          padding: 16,
          // Soma a margem visual à área ocupada por botões ou gestos do Android.
          paddingBottom: 16 + insets.bottom,
          paddingLeft: 16 + insets.left,
          paddingRight: 16 + insets.right,
          gap: 8,
        }}
      >
        {/* Dentro do Drawer e no fluxo, para não cobrir o botão de saída. */}
        <Snackbar
          visible={showError}
          onDismiss={() => setShowError(false)}
          duration={8000}
          wrapperStyle={{
            position: "relative",
            // O rodapé já aplica os insets; evita somá-los de novo no Snackbar.
            paddingBottom: 0,
            paddingHorizontal: 0,
          }}
          action={{ label: "Fechar", onPress: () => setShowError(false) }}
        >
          Não foi possível sair do perfil. Tente novamente.
        </Snackbar>
        <Divider />

        <Button
          mode="text"
          textColor={theme.colors.error}
          icon={() => (
            <MaterialDesignIcons
              name="logout"
              size={24}
              color={theme.colors.error}
            />
          )}
          onPress={handleLogout}
          loading={isLoggingOut}
          disabled={isLoggingOut}
          accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
          contentStyle={{ minHeight: 52 }}
        >
          Sair do perfil
        </Button>
      </View>
    </View>
  );
}
