import { View } from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import { AppButton } from "../components/AppButton";
import { perfilRepository } from "../repositories/perfilRepository";

export default function Plots() {
  // Remove a seleção local e solicita o retorno à tela de acesso.
  function handleExit() {
    perfilRepository.remove();
    router.replace("/");
  }
  return (
    // Tela temporária para estudar navegação.
    <View style={{ flex: 1, padding: 24 }}>
      <Text variant="headlineSmall">Meus talhões</Text>
      <AppButton title="Sair" onPress={handleExit} />
    </View>
  );
}
