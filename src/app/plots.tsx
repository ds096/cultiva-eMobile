import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { AppButton } from "../components/AppButton";
import { useProfile } from "../context/PerfilContext";

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
    // Tela temporária para estudar navegação.
    <View style={{ flex: 1, padding: 24 }}>
      <Text variant="headlineSmall">Meus talhões</Text>
      {erro !== "" && <Text>{erro}</Text>}
      <AppButton title="Sair" onPress={handleExit} />
    </View>
  );
}
