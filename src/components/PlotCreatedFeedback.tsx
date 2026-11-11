import { useIsFocused, useLocalSearchParams, useNavigation } from "expo-router";
import type { NavigationProp } from "expo-router/react-navigation";
import { Snackbar, Text } from "react-native-paper";
import { tokens } from "../theme/theme";

type FeedbackRoutes = {
  plans: { plotCreated?: string };
};

// A confirmação acompanha a navegação e é removida ao encerrar o aviso.
export default function PlotCreatedFeedback() {
  const { plotCreated } = useLocalSearchParams<{ plotCreated?: string }>();
  const navigation = useNavigation<NavigationProp<FeedbackRoutes>>();
  const isFocused = useIsFocused();

  return (
    <Snackbar
      visible={isFocused && plotCreated === "true"}
      onDismiss={() => navigation.setParams({ plotCreated: undefined })}
      duration={4000}
      // A tela de Planos já reserva os insets para todo o conteúdo.
      wrapperStyle={{
        position: "relative",
        paddingBottom: 0,
        paddingHorizontal: 0,
      }}
      style={{ backgroundColor: tokens.color.successBg }}
    >
      <Text
        style={{ color: tokens.color.success }}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        Talhão cadastrado com sucesso! Salvo neste dispositivo.
      </Text>
    </Snackbar>
  );
}
