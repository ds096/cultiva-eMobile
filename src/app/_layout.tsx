import { Stack } from "expo-router";
import { theme } from "../theme/theme";
import { AppButton } from "../components/AppButton";
import { ProfileProvider, useProfile } from "../context/PerfilContext";
import { ActivityIndicator, PaperProvider, Text } from "react-native-paper";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define a disponibilidade das telas a partir da seleção local de perfil.
function Navigation() {
  const { email, restorationStatus, restoreProfile } = useProfile();

  if (restorationStatus !== "ready") {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
            gap: 16,
          }}
        >
          {/* Cada situação possui uma mensagem explícita. */}
          {restorationStatus === "loading" ? (
            <>
              <ActivityIndicator accessibilityLabel="Restaurando perfil" />
              <Text>Restaurando o perfil salvo neste dispositivo…</Text>
            </>
          ) : (
            <>
              <Text accessibilityRole="alert">
                Não foi possível recuperar o perfil salvo. Tente novamente.
              </Text>

              {/* Repete a leitura sem apagar a seleção persistida. */}
              <AppButton title="Tentar novamente" onPress={restoreProfile} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <Stack>
      <Stack.Protected guard={!email}>
        <Stack.Screen name="index" options={{ title: "Entrar" }} />
      </Stack.Protected>

      <Stack.Protected guard={!!email}>
        <Stack.Screen name="plots" options={{ title: "Meus Talhões" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    // Disponibiliza o tema personalizado aos componentes Paper descendentes.
    <PaperProvider theme={theme}>
      <ProfileProvider>
        <Navigation />
      </ProfileProvider>
    </PaperProvider>
  );
}
