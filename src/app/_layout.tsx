import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "../theme/theme";
import { ProfileProvider, useProfile } from "../context/PerfilContext";

// Define a disponibilidade das telas a partir da seleção local de perfil.
function Navigation() {
  const { email } = useProfile();

  return (
    <Stack>
      <Stack.Protected guard={!email}>
        <Stack.Screen name="index" options={{ title: "Entrar" }} />
      </Stack.Protected>

      <Stack.Protected guard={!!email}>
        <Stack.Screen name="talhoes" options={{ title: "Meus Talhões" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <ProfileProvider>
      <Navigation />
    </ProfileProvider>
  );
}
