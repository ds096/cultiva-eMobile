import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../../theme/theme";
import PlotCreatedFeedback from "../../components/PlotCreatedFeedback";

// Inclui a confirmação e o conteúdo na mesma área segura inferior.
export default function PlansScreen() {
  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <PlotCreatedFeedback />
      <View
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
      </View>
    </SafeAreaView>
  );
}
