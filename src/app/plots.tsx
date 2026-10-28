import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { AppButton } from "../components/AppButton";
import Menu from "../components/Menu";
import { useProfile } from "../context/PerfilContext";
import { theme } from "../theme/theme";

export default function Plots() {
  // A operação atualiza armazenamento e estado compartilhado.
  const { clearProfile } = useProfile();

  // Guarda uma falha de saída para apresentá-la na própria tela.
  const [erro, setErro] = useState("");

  // Solicita a saída e mantém o perfil ativo se a remoção falhar.
  function handleExit() {
    setErro("");

    try {
      // Após remover a seleção, o provedor atualiza email para null.
      clearProfile();
    } catch {
      // A mensagem permite compreender por que a tela permaneceu aberta.
      setErro("Não foi possível sair do perfil. Tente novamente.");
    }
  }
  return (
    // O conteúdo rola separadamente; o menu ocupa o rodapé sem cobrir a tela.
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <Text variant="headlineSmall">Meus talhões</Text>
        {erro !== "" && <Text>{erro}</Text>}
        <AppButton title="Sair" onPress={handleExit} />
      </ScrollView>
      <Menu />
    </View>
  );
}
