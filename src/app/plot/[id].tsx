import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../../components/AppButton";
import { useProfile } from "../../context/ProfileContext";
import { getCurrentRevision, type PlotInput } from "../../domain/plot";
import { plotRepository } from "../../repositories/plotRepository";
import { theme, tokens } from "../../theme/theme";

// A união distingue ausência confirmada de uma falha no armazenamento.
type LoadState =
  | { status: "loading" | "not-found" | "error" }
  | { status: "ready"; data: PlotInput; email: string; id: string };

export default function PlotDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { email } = useProfile();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  // A rota fornece só a identidade; os dados atuais vêm do perfil selecionado.
  const loadPlot = useCallback(() => {
    if (!email || typeof id !== "string" || id.trim() === "") {
      setState({ status: "not-found" });
      return;
    }

    try {
      const plot = plotRepository.findById(email, id);
      if (!plot) {
        setState({ status: "not-found" });
        return;
      }
      // O domínio define a última revisão do histórico como a atual.
      setState({
        status: "ready",
        data: getCurrentRevision(plot).data,
        email,
        id,
      });
    } catch {
      // Nunca converte erro em talhão vazio nem modifica os dados salvos.
      setState({ status: "error" });
    }
  }, [email, id]);

  // Reconsulta ao voltar à tela e quando mudar o perfil ou o parâmetro.
  useFocusEffect(loadPlot);

  // Evita mostrar dados anteriores no intervalo de uma troca de perfil ou id.
  const current =
    state.status === "ready" && state.email === email && state.id === id;

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {state.status === "loading" ||
        (state.status === "ready" && !current) ? (
          <>
            <ActivityIndicator accessibilityLabel="Carregando talhão" />
            <Text variant="bodyLarge">Carregando talhão…</Text>
          </>
        ) : state.status === "error" ? (
          <>
            <Text variant="bodyLarge" accessibilityRole="alert">
              Não foi possível carregar o talhão. Tente novamente.
            </Text>
            <AppButton title="Tentar novamente" onPress={loadPlot} />
          </>
        ) : state.status === "not-found" ? (
          <Text variant="bodyLarge">Talhão não encontrado neste perfil.</Text>
        ) : state.status === "ready" ? (
          <View style={styles.card}>
            <Text variant="headlineSmall" accessibilityRole="header">
              {state.data.name}
            </Text>
            {/* O contrato ainda não define unidade da área; não presumimos hectares. */}
            <Text variant="bodyLarge">
              Área: {String(state.data.area).replace(".", ",")}
            </Text>
            <Text variant="titleMedium" accessibilityRole="header">
              Culturas
            </Text>
            {/* Culturas não têm id e podem repetir nomes; a lista é somente leitura. */}
            {state.data.crops.map((crop, index) => (
              <Text key={index} variant="bodyLarge">
                {crop.name} — Quantidade de plantas: {crop.quantity}
              </Text>
            ))}
            {/* undefined significa ausência; coordenadas zero continuam visíveis. */}
            {state.data.plantingYear !== undefined && (
              <Text variant="bodyLarge">
                Ano de plantio: {state.data.plantingYear}
              </Text>
            )}
            {state.data.location !== undefined && (
              <>
                <Text variant="titleMedium" accessibilityRole="header">
                  Localização
                </Text>
                <Text variant="bodyLarge">
                  Latitude:{" "}
                  {String(state.data.location.latitude).replace(".", ",")}
                </Text>
                <Text variant="bodyLarge">
                  Longitude:{" "}
                  {String(state.data.location.longitude).replace(".", ",")}
                </Text>
              </>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// Rolagem e alturas livres acomodam nomes longos e fonte ampliada.
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: tokens.space.md, gap: tokens.space.md },
  card: {
    padding: tokens.space.md,
    gap: tokens.space.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.card,
    backgroundColor: theme.colors.surface,
  },
});
