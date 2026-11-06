import { Stack } from "expo-router";
import { theme } from "../theme/theme";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <Stack>
      <Stack.Protected guard={!email} redirectTo="/plots">
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!email} redirectTo="/">
        <Stack.Screen name="plots" options={{ title: "Meus Talhões" }} />
        <Stack.Screen
          name="plot/[id]"
          options={{ title: "Detalhes do talhão" }}
        />
        <Stack.Screen name="calendar" options={{ title: "Calendário" }} />
        <Stack.Screen name="supplies" options={{ title: "Insumos" }} />
        <Stack.Screen name="plans" options={{ title: "Planos de Atividade" }} />
        <Stack.Screen name="settings" options={{ title: "Configurações" }} />
        <Stack.Screen name="createPlan" options={{ title: "Criar Plano" }} />
        <Stack.Screen name="createPlot" options={{ title: "Criar Talhão" }} />
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
