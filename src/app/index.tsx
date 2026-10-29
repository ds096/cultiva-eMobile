import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { useProfile } from "../context/PerfilContext";
import { theme, tokens } from "../theme/theme";
import { normalizeEmail, validateEmail } from "../utilities/email";

// Seleciona um perfil local sem comprovar a identidade do produtor.
export default function Access() {
  const { selectProfile } = useProfile();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Define ambas as dimensões para a imagem local não reservar sua altura original.
  const logoWidth = Math.max(
    0,
    Math.min(
      width - insets.left - insets.right - tokens.space.md * 2,
      tokens.size.formWidth,
    ),
  );
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [focused, setFocused] = useState(false);
  // A trava muda imediatamente, antes da próxima renderização.
  const submitting = useRef(false);

  function handleContinue() {
    if (submitting.current) return;
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    submitting.current = true;
    setErro("");
    setCarregando(true);
    try {
      // MMKV é síncrono: não acrescentamos espera artificial para mostrar animação.
      selectProfile(normalizedEmail);
      // O layout observa o perfil salvo e redireciona para /plots.
      // Mantém a trava até esta tela ser desmontada.
    } catch {
      // Libera nova tentativa apenas na falha, preservando o texto digitado.
      submitting.current = false;
      setCarregando(false);
      setErro("Não foi possível salvar o perfil. Tente novamente.");
    }
  }

  return (
    // Sem cabeçalho nativo, a própria tela protege também a margem superior.
    <SafeAreaView style={styles.screen}>
      {/* Fora da rolagem: a logo fica fixa no topo, com margens de 16. */}
      <View style={styles.brand}>
        <Image
          source={require("../../assets/logo_plus_name.png")}
          style={{ width: logoWidth, height: logoWidth / 3 }}
          resizeMode="contain"
          accessible
          accessibilityLabel="cultiva-e"
        />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Text variant="bodyLarge">
              Este perfil fica salvo neste dispositivo. Não há senha nem
              verificação de identidade.
            </Text>
            <Text nativeID="email-label" variant="bodyLarge">
              Informe seu e-mail
            </Text>
            <TextInput
              style={[styles.input, focused && styles.focused]}
              accessibilityLabel="Informe seu e-mail"
              accessibilityLabelledBy="email-label"
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                setErro("");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              selectionColor={theme.colors.primary}
              editable={!carregando}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            {/* Só ocupa espaço quando existe um erro, anunciado ao leitor de tela. */}
            {erro !== "" && (
              <Text
                variant="bodyLarge"
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={styles.error}
              >
                {erro}
              </Text>
            )}
            <AppButton
              title={carregando ? "Abrindo perfil…" : "Continuar"}
              onPress={handleContinue}
              loading={carregando}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Medidas mínimas e rolagem permitem crescimento com a escala de fonte.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: theme.colors.background },
  brand: {
    alignItems: "center",
    flexShrink: 0,
    paddingTop: tokens.space.md,
    paddingHorizontal: tokens.space.md,
    paddingBottom: tokens.space.sm,
  },
  container: {
    flexGrow: 1,
    // Começa perto do topo, sem distribuir espaço vazio acima do formulário.
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: tokens.space.md,
    paddingTop: tokens.space.sm,
    paddingBottom: tokens.space.md,
  },
  form: {
    width: "100%",
    maxWidth: tokens.size.formWidth,
    gap: tokens.space.md,
  },
  input: {
    ...theme.fonts.bodyLarge,
    minHeight: tokens.size.input,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: tokens.color.controlBorder,
    borderRadius: tokens.radius.input,
    padding: tokens.space.md,
  },
  focused: { borderColor: theme.colors.primary },
  error: { color: theme.colors.error },
});
