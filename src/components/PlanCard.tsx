import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import type { Plan } from "../domain/plan";
import { tokens } from "../theme/theme";

type PlanCardProps = {
  plan: Plan;
  onPressDetails: (id: string) => void;
};

// Segue o mesmo padrão visual do card de talhão e identifica o plano na ação.
export function PlanCard({ plan, onPressDetails }: PlanCardProps) {
  const count = plan.activities.length;
  return (
    <View style={styles.card}>
      <Text variant="titleMedium">{plan.name}</Text>
      {plan.description ? <Text>{plan.description}</Text> : null}
      <Text>
        {count} {count === 1 ? "atividade" : "atividades"}
      </Text>
      <Button
        mode="outlined"
        onPress={() => onPressDetails(plan.id)}
        accessibilityLabel={`Ver detalhes do plano ${plan.name}`}
        contentStyle={styles.buttonContent}
      >
        Ver detalhes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.sm,
  },
  buttonContent: { minHeight: tokens.size.touch },
});
