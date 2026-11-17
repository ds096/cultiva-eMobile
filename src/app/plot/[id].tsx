import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../../theme/theme";

// A rota permanece disponível enquanto os detalhes do talhão são desenvolvidos.
export default function PlotDetailsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
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
