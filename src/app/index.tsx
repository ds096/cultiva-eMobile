import { useState } from "react";
import { useProfile } from "../context/PerfilContext";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { normalizeEmail, validateEmail } from "../utilities/email";

// Apresenta o formulário de seleção do perfil neste dispositivo.
export default function Access() {
  const { selectProfile } = useProfile();

  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Valida e salva a seleção antes de solicitar a navegação.
  function handleContinue() {
    const normalizedEmail = normalizeEmail(email);

    // Impede que uma entrada inválida chegue ao armazenamento.
    if (!validateEmail(normalizedEmail)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      // A operação salva no MMKV e, após sucesso, atualiza o contexto.
      selectProfile(normalizedEmail);
    } catch {
      // Preserva o texto digitado para permitir uma nova tentativa.
      setErro("Não foi possível salvar o perfil.");
    } finally {
      // Encerra o estado de processamento mesmo quando ocorre falha.
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cultiva-e</Text>

      <Text>Informe seu e-mail</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(texto) => {
          setEmail(texto);
          setErro("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="seuemail@exemplo.com"
        editable={!carregando}
      />

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      <Pressable
        style={styles.botao}
        onPress={handleContinue}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Continuar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    gap: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
  },
  erro: {
    color: "red",
  },
  botao: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});
