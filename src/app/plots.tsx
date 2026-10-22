import { View } from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import { AppButton } from "../components/AppButton";

export default function Plots() {
  return (
    // Tela temporária para estudar navegação.
    <View style={{ flex: 1, padding: 24 }}>
      <Text variant="headlineSmall">Meus talhões</Text>
      <AppButton title="Login" onPress={() => router.push("/")} />
    </View>
  );
}
