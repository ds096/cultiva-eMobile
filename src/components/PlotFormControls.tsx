import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import type { ComponentProps, RefObject } from "react";
import { theme, tokens } from "../theme/theme";

type FieldProps = Pick<
  ComponentProps<typeof TextInput>,
  | "value"
  | "onChangeText"
  | "keyboardType"
  | "placeholder"
  | "editable"
  | "returnKeyType"
  | "submitBehavior"
  | "onSubmitEditing"
> & {
  inputRef?: RefObject<PlotFormInput | null>;
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

// Expõe somente a instância do campo Paper para permitir focus() entre campos.
export type PlotFormInput = { focus: () => void };

// Mantém o rótulo acima do campo, mesmo vazio, sem depender do placeholder.
export function PlotFormField({
  id,
  label,
  hint,
  error,
  inputRef,
  ...input
}: FieldProps) {
  const { fontScale } = useWindowDimensions();
  return (
    <View style={styles.field}>
      <Text nativeID={`${id}-label`} variant="labelLarge">
        {label}
      </Text>
      <TextInput
        {...input}
        ref={(instance: unknown) => {
          // Paper ainda usa tipos antigos de ref; expomos somente focus() validado.
          const focus =
            typeof instance === "object" &&
            instance !== null &&
            "focus" in instance
              ? instance.focus
              : undefined;
          if (inputRef) {
            inputRef.current =
              typeof focus === "function"
                ? { focus: () => focus.call(instance) }
                : null;
          }
        }}
        testID={id}
        accessibilityLabel={label}
        accessibilityLabelledBy={`${id}-label`}
        accessibilityHint={error || hint}
        mode="outlined"
        error={Boolean(error)}
        outlineColor={tokens.color.controlBorder}
        activeOutlineColor={tokens.color.primary}
        outlineStyle={styles.outline}
        // Cresce com a fonte do sistema em vez de cortar o texto ampliado.
        style={[
          styles.input,
          { height: Math.max(tokens.size.input, 24 * fontScale + 32) },
        ]}
        contentStyle={styles.inputContent}
      />
      {(error || hint) && (
        <Text
          variant="bodyMedium"
          accessibilityRole={error ? "alert" : undefined}
          accessibilityLiveRegion="polite"
          style={error ? styles.error : styles.secondary}
        >
          {error ? `${error}` : hint}
        </Text>
      )}
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "remove";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
};

// Usa o ícone de lixeira da biblioteca adotada no projeto.
// O botão do Paper mantém feedback de toque e o nome da cultura para o TalkBack.
export function PlotRemoveButton({
  cropName,
  onPress,
  disabled,
}: {
  cropName: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <IconButton
      icon={({ color, size }) => (
        <MaterialDesignIcons name="delete-outline" color={color} size={size} />
      )}
      size={24}
      iconColor={tokens.color.error}
      accessibilityLabel={`Remover cultura ${cropName}`}
      accessibilityHint="Remove esta cultura do formulário."
      onPress={onPress}
      disabled={disabled}
      style={styles.removeIconButton}
    />
  );
}

// O ripple do Paper permite texto sem limite de linhas e alvo mínimo de 52.
// Button do Paper limita seu rótulo interno a uma linha na versão instalada.
export function PlotFormButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityLabel,
}: ButtonProps) {
  const primary = variant === "primary";
  const color = disabled
    ? tokens.color.textSecondary
    : primary
      ? tokens.color.onPrimary
      : variant === "remove"
        ? tokens.color.error
        : tokens.color.primary;
  return (
    <TouchableRipple
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      rippleColor={
        primary ? tokens.color.primaryPressed : tokens.color.surfaceMuted
      }
      style={[
        styles.button,
        primary ? styles.primary : styles.secondaryButton,
        variant === "remove" && styles.remove,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.buttonContent}>
        {loading && <ActivityIndicator size="small" color={color} />}
        <Text variant="labelLarge" style={[styles.buttonLabel, { color }]}>
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
}

// Todos os valores visuais vêm do tema aprovado, sem nova paleta na tela.
const styles = StyleSheet.create({
  // O desenho ocupa 24 × 24; o alvo de toque permanece em 48 × 48.
  removeIconButton: {
    width: tokens.size.touch,
    height: tokens.size.touch,
    margin: 0,
  },
  field: { gap: tokens.space.sm },
  input: { backgroundColor: tokens.color.surface, fontSize: 16 },
  inputContent: { ...theme.fonts.bodyLarge },
  outline: { borderRadius: tokens.radius.input },
  secondary: { color: tokens.color.textSecondary },
  error: { color: tokens.color.error },
  button: {
    borderRadius: tokens.radius.input,
    overflow: "hidden",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: tokens.color.primary,
    borderColor: tokens.color.primary,
  },
  secondaryButton: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.primary,
  },
  remove: { borderColor: tokens.color.border },
  disabled: {
    backgroundColor: tokens.color.surfaceMuted,
    borderColor: tokens.color.border,
  },
  buttonContent: {
    minHeight: tokens.size.button,
    paddingVertical: tokens.space.sm,
    paddingHorizontal: tokens.space.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space.sm,
  },
  buttonLabel: { textAlign: "center", flexShrink: 1 },
});
