import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../components/Menu";
import { theme, tokens } from "../theme/theme";

// Tela provisória: centraliza o aviso na área disponível acima do menu fixo.
export default function PlansScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: tokens.space.lg,
        }}
      >
        <Text variant="bodyLarge" style={{ textAlign: "center" }}>
          Tela em desenvolvimento
        </Text>
      </SafeAreaView>
    </View>
  );
}
