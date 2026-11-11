import { useState } from "react";
import { Button, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useProfile } from "../../context/ProfileContext";
import { theme } from "../../theme/theme";

export default function SettingsScreen() {
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
    // O cabeçalho protege o topo; a área segura mantém a rolagem acima da barra.
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        {erro !== "" && <Text>{erro}</Text>}
        <Button title="Sair" onPress={handleExit} />
      </ScrollView>
    </SafeAreaView>
  );
}
