import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../../theme/theme";

// Tela provisória de Insumos (/supplies): centraliza o aviso na tela.
export default function SuppliesScreen() {
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
