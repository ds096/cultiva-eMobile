import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../../theme/theme";
import PlotCreatedFeedback from "../../components/PlotCreatedFeedback";
import { PlanCard } from "../../components/PlanCard";
import { useProfile } from "../../context/ProfileContext";
import type { Plan } from "../../domain/plan";
import { planRepository } from "../../repositories/planRepository";

type LoadStatus = "loading" | "ready" | "error";

// Inclui a confirmação e o conteúdo na mesma área segura inferior.
export default function PlansScreen() {
  const { email } = useProfile();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  // Recarrega os planos do perfil ao abrir a tela ou voltar do cadastro.
  const loadPlans = useCallback(() => {
    if (!email) {
      setPlans([]);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    try {
      setPlans(planRepository.list(email));
      setStatus("ready");
    } catch {
      // Falha de leitura não deve ser apresentada como uma lista vazia.
      setPlans([]);
      setStatus("error");
    }
  }, [email]);

  useFocusEffect(loadPlans);

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <PlotCreatedFeedback />
      {/* Fora da lista, o botão permanece no topo durante a rolagem. */}
      <View style={styles.header}>
        <Button
          mode="contained"
          onPress={() => router.push("/createPlan")}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
          labelStyle={styles.createButtonLabel}
        >
          Criar novo plano
        </Button>
      </View>
      {status === "ready" ? (
        <FlatList
          style={styles.list}
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPressDetails={(id) =>
                router.push({ pathname: "/plan/[id]", params: { id } })
              }
            />
          )}
          ListEmptyComponent={
            <Text variant="bodyLarge">
              Você ainda não criou um plano de manejo.
            </Text>
          }
        />
      ) : (
        <View style={styles.status}>
          {status === "loading" ? (
            <Text variant="bodyLarge" accessibilityLiveRegion="polite">
              Carregando planos de manejo...
            </Text>
          ) : (
            <>
              <Text variant="bodyLarge" accessibilityRole="alert">
                Não foi possível carregar os planos de manejo.
              </Text>
              <Button
                onPress={loadPlans}
                contentStyle={styles.createButtonContent}
              >
                Tentar novamente
              </Button>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: tokens.space.md,
  },
  createButton: {
    borderRadius: tokens.radius.card,
  },
  createButtonContent: {
    minHeight: tokens.size.button,
  },
  createButtonLabel: {
    flexShrink: 1,
    flexWrap: "wrap",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space.md,
    paddingBottom: tokens.space.md,
    gap: tokens.space.md,
  },
  status: {
    paddingHorizontal: tokens.space.md,
    gap: tokens.space.sm,
  },
});
