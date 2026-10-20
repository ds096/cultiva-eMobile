import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "../theme/theme";

export default function Layout() {
  return (
    // Compartilha o tema com todas as telas.
    <PaperProvider theme={theme}>
      {/* Gerencia as rotas do aplicativo. */}
      <Stack />
    </PaperProvider>
  );
}
