import { Button } from "react-native-paper";

// Define o contrato das propriedades.
type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

// Componente reutilizável de botão.
export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
    >
      {title}
    </Button>
  );
}
