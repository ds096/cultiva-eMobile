import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "../theme/theme";

export default function Layout() {
  return (
    // Compartilha o tema com todas as telas.
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="plots"
          options={{
            title: "Meus Talhões",
            headerBackVisible: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
