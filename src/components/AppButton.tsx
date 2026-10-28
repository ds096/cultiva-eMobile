import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, TouchableRipple } from "react-native-paper";
import { theme, tokens } from "../theme/theme";

// Mantém o contrato compartilhado por acesso, saída e recuperação.
type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

// O texto pode quebrar em várias linhas, respeitando a ampliação da fonte.
export function AppButton({ title, onPress, loading = false, disabled = false }: AppButtonProps) {
  const unavailable = disabled || loading;
  return (
    <TouchableRipple
      onPress={onPress}
      disabled={unavailable}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      rippleColor={tokens.color.primaryPressed}
      style={[styles.button, unavailable && styles.disabled]}
    >
      <View style={styles.content}>
        {/* O estado busy já comunica o processamento ao leitor de tela. */}
        {loading && <ActivityIndicator accessible={false} color={theme.colors.onSurfaceDisabled} size="small" />}
        <Text variant="labelLarge" style={[styles.label, unavailable && styles.disabledLabel]}>{title}</Text>
      </View>
    </TouchableRipple>
  );
}

// Altura mínima, sem altura fixa ou truncamento do rótulo.
const styles = StyleSheet.create({
  button: { minHeight: tokens.size.button, minWidth: tokens.size.touch, borderRadius: tokens.radius.input, backgroundColor: theme.colors.primary, overflow: "hidden" },
  content: { minHeight: tokens.size.button, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: tokens.space.sm, padding: tokens.space.md },
  label: { flexShrink: 1, textAlign: "center", color: theme.colors.onPrimary },
  disabled: { backgroundColor: theme.colors.surfaceDisabled },
  disabledLabel: { color: theme.colors.onSurfaceDisabled },
});
