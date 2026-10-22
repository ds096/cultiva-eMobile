import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { normalizarEmail, validarEmail } from "../utilities/email";

export default function Acesso() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleContinuar() {
    const emailNormalizado = normalizarEmail(email);

    if (!validarEmail(emailNormalizado)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      // Simulação temporária de operação assíncrona.
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      console.log("E-mail válido:", emailNormalizado);
      router.push("/plots");

      // Na próxima aula, salvaremos o perfil localmente.
    } catch {
      setErro("Não foi possível continuar.");
    } finally {
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
        onPress={handleContinuar}
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
