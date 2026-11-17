import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import type { Plot } from "../domain/plot";
import { getCurrentRevision } from "../domain/plot";
import { tokens } from "../theme/theme";

type PlotCardProps = {
  plot: Plot;
  onPressDetails: (id: string) => void;
};

export function PlotCard({ plot, onPressDetails }: PlotCardProps) {
  const currentData = getCurrentRevision(plot).data;

  return (
    <View style={styles.card}>
      <Text variant="titleMedium">{currentData.name}</Text>
      <Text variant="labelMedium">Culturas</Text>
      {currentData.crops.map((crop, index) => (
        <View key={index}>
          <Text>
            {crop.name} — {crop.quantity.toLocaleString("pt-BR")}{" "}
            {crop.quantity === 1 ? "planta" : "plantas"}
          </Text>
        </View>
      ))}
      <Button mode="outlined" onPress={() => onPressDetails(plot.id)}>
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
});
