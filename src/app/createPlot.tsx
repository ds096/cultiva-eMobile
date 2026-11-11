import { useState, useRef, useEffect } from "react";
import type { ComponentRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { plotRepository } from "../repositories/plotRepository";
import { useProfile } from "../context/ProfileContext";
import {
  type Crop,
  type PlotInput,
  normalizePlotName,
  validatePlotArea,
  validatePlantingYear,
  validateCrop,
} from "../domain/plot";
import {
  PlotFormButton,
  PlotFormField,
  PlotRemoveButton,
  type PlotFormInput,
} from "../components/PlotFormControls";
import { theme, tokens } from "../theme/theme";

type FormCrop = Crop & { id: string };
const emptyFields = {
  name: "",
  area: "",
  plantingYear: "",
  cropName: "",
  cropQuantity: "",
};
type Field = keyof typeof emptyFields;
type FormErrors = Partial<Record<Field | "crops", string>>;
type Feedback = { kind: "success" | "error"; message: string };
// O aviso geral é temporário; os erros dos campos têm um estado independente.
const feedbackDuration = 5000;

// Cadastro local: valida antes de gravar e só limpa o formulário após confirmação.
export default function CreatePlotScreen() {
  const [fields, setFields] = useState(emptyFields);
  const [crops, setCrops] = useState<FormCrop[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [saving, setSaving] = useState(false);
  const { email } = useProfile();
  const headerHeight = useHeaderHeight();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const nextCropId = useRef(0);
  const saveLock = useRef(false);
  // Cada referência permite levar o foco ao campo seguinte sem fechar o teclado.
  const areaRef = useRef<PlotFormInput>(null);
  const yearRef = useRef<PlotFormInput>(null);
  const cropNameRef = useRef<PlotFormInput>(null);
  const cropQuantityRef = useRef<PlotFormInput>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), feedbackDuration);
    // Uma nova tentativa reinicia o prazo; sair da tela cancela o temporizador.
    return () => clearTimeout(timer);
  }, [feedback]);

  // Leva o aviso ao usuário mesmo quando Salvar é acionado no fim da rolagem.
  function showFeedback(kind: Feedback["kind"], message: string) {
    setFeedback({ kind, message });
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  // Uma nova edição inicia outro cadastro e remove a confirmação anterior.
  function updateField(field: Field, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFeedback(null);
    saveLock.current = false;
  }

  function handleAddCrop() {
    const cropErrors: FormErrors = {};
    if (!fields.cropName.trim())
      cropErrors.cropName = "Informe o nome da cultura.";
    const quantity = Number(fields.cropQuantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      cropErrors.cropQuantity =
        "Informe uma quantidade inteira maior que zero.";
    }
    setErrors((previous) => ({ ...previous, ...cropErrors, crops: undefined }));
    if (Object.keys(cropErrors).length > 0) {
      // A confirmação no último campo mantém o foco no primeiro dado inválido.
      if (cropErrors.cropName) cropNameRef.current?.focus();
      else cropQuantityRef.current?.focus();
      return false;
    }

    // Reutiliza as regras do domínio e retira os campos auxiliares ao persistir.
    const crop = validateCrop({ name: fields.cropName, quantity });
    const formCrop = { ...crop, id: String(nextCropId.current) };
    nextCropId.current += 1;
    // O atualizador permanece puro, mesmo se o React o executar novamente.
    setCrops((previous) => [...previous, formCrop]);
    setFields((previous) => ({ ...previous, cropName: "", cropQuantity: "" }));
    setErrors((previous) => ({
      ...previous,
      cropName: undefined,
      cropQuantity: undefined,
    }));
    setFeedback(null);
    saveLock.current = false;
    return true;
  }

  function handleRemoveCrop(id: string) {
    // Remove apenas a cultura selecionada deste formulário ainda não salvo.
    setCrops((previous) => previous.filter((crop) => crop.id !== id));
    setFeedback(null);
    saveLock.current = false;
  }

  function handleSavePlot() {
    if (saveLock.current) return;
    const validation: FormErrors = {};
    const area = Number(fields.area.trim().replace(",", "."));
    const plantingYear = fields.plantingYear.trim()
      ? Number(fields.plantingYear)
      : undefined;

    // Validação por campo mantém a orientação perto do valor que precisa mudar.
    try {
      normalizePlotName(fields.name);
    } catch {
      validation.name = "Informe o nome do talhão.";
    }
    try {
      validatePlotArea(area);
    } catch {
      validation.area = "Informe uma área maior que zero.";
    }
    if (plantingYear !== undefined) {
      try {
        validatePlantingYear(plantingYear);
      } catch {
        validation.plantingYear =
          "Informe um ano inteiro positivo ou deixe em branco.";
      }
    }
    if (crops.length === 0)
      validation.crops = "Adicione pelo menos uma cultura ao talhão.";
    // Não descarta silenciosamente uma cultura digitada, mas ainda não adicionada.
    if (fields.cropName.trim() || fields.cropQuantity.trim()) {
      validation.crops =
        "Toque em Adicionar cultura para incluir os dados preenchidos antes de salvar.";
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      showFeedback("error", "Revise os campos indicados antes de salvar.");
      return;
    }

    saveLock.current = true;
    setSaving(true);
    try {
      if (!email) throw new Error("Perfil não identificado.");
      const input: PlotInput = {
        name: fields.name,
        area,
        plantingYear,
        crops: crops.map(({ name, quantity }) => ({ name, quantity })),
      };
      // MMKV é síncrono: não há espera artificial nem confirmação de sincronização.
      plotRepository.create(email, input);
      setFields({ ...emptyFields });
      setCrops([]);
      nextCropId.current = 0;
      setErrors({});
      showFeedback("success", "Talhão cadastrado com sucesso!");
      // Mantém a trava após sucesso até uma nova edição, evitando toque repetido.
    } catch {
      showFeedback(
        "error",
        "Não foi possível salvar o talhão. Seus campos foram mantidos. Tente novamente.",
      );
      saveLock.current = false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.screen}>
      {/* O cabeçalho nativo mantém o retorno e protege a área segura superior. */}

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.form}>
            {/* Apenas o aviso geral expira; a validação permanece em cada campo. */}
            {feedback && (
              <View
                testID="plot-feedback"
                style={[
                  styles.feedback,
                  feedback.kind === "success"
                    ? styles.success
                    : styles.errorFeedback,
                ]}
              >
                <Text
                  variant="bodyLarge"
                  style={
                    feedback.kind === "success"
                      ? styles.successText
                      : styles.error
                  }
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  {feedback.message}
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelLarge" style={styles.step}>
                  01
                </Text>
                <Text
                  variant="titleLarge"
                  accessibilityRole="header"
                  style={styles.sectionTitle}
                >
                  Identificação do talhão
                </Text>
              </View>
              <PlotFormField
                id="plot-name"
                // Confirmação envia o evento sem desfocar antes do próximo campo.
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => areaRef.current?.focus()}
                label="Nome"
                value={fields.name}
                onChangeText={(value: string) => updateField("name", value)}
                error={errors.name}
                editable={!saving}
              />
              <PlotFormField
                id="plot-area"
                inputRef={areaRef}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => yearRef.current?.focus()}
                label="Área (ha)"
                keyboardType="decimal-pad"
                value={fields.area}
                onChangeText={(value: string) => updateField("area", value)}
                error={errors.area}
                editable={!saving}
              />
              <PlotFormField
                id="plot-year"
                inputRef={yearRef}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => cropNameRef.current?.focus()}
                label="Ano de plantio (opcional)"
                keyboardType="number-pad"
                value={fields.plantingYear}
                onChangeText={(value: string) =>
                  updateField("plantingYear", value)
                }
                error={errors.plantingYear}
                editable={!saving}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelLarge" style={styles.step}>
                  02
                </Text>
                <Text
                  variant="titleLarge"
                  accessibilityRole="header"
                  style={styles.sectionTitle}
                >
                  Culturas do talhão
                </Text>
              </View>

              <PlotFormField
                id="crop-name"
                inputRef={cropNameRef}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => cropQuantityRef.current?.focus()}
                label="Nome da cultura"
                value={fields.cropName}
                onChangeText={(value: string) => updateField("cropName", value)}
                error={errors.cropName}
                editable={!saving}
              />
              <PlotFormField
                id="crop-quantity"
                inputRef={cropQuantityRef}
                returnKeyType="done"
                submitBehavior="submit"
                onSubmitEditing={() => {
                  // Concluir inclui a cultura; o botão Salvar confirma o talhão.
                  if (handleAddCrop()) Keyboard.dismiss();
                }}
                label="Quantidade de plantas"
                keyboardType="number-pad"
                value={fields.cropQuantity}
                onChangeText={(value: string) =>
                  updateField("cropQuantity", value)
                }
                error={errors.cropQuantity}
                editable={!saving}
              />
              <PlotFormButton
                label="Adicionar cultura"
                variant="secondary"
                onPress={handleAddCrop}
                disabled={saving}
              />

              <View style={styles.crops}>
                <Text variant="titleMedium" accessibilityRole="header">
                  Culturas adicionadas ({crops.length})
                </Text>
                {/* Um único ScrollView evita listas aninhadas e mantém o botão alcançável. */}
                {crops.length === 0 ? (
                  <View style={styles.cropInfo}></View>
                ) : (
                  crops.map((crop) => (
                    <View key={crop.id} style={styles.cropCard}>
                      <View style={[styles.cropInfo, styles.cropText]}>
                        <Text variant="titleMedium">{crop.name}</Text>
                        <Text variant="bodyLarge" style={styles.secondary}>
                          {crop.quantity.toLocaleString("pt-BR")}{" "}
                          {crop.quantity === 1 ? "planta" : "plantas"}
                        </Text>
                      </View>
                      <PlotRemoveButton
                        cropName={crop.name}
                        onPress={() => handleRemoveCrop(crop.id)}
                        disabled={saving}
                      />
                    </View>
                  ))
                )}
                {errors.crops && (
                  <Text
                    variant="bodyMedium"
                    style={styles.error}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    {errors.crops}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.footer}>
              <PlotFormButton
                label={saving ? "Salvando talhão…" : "Salvar talhão"}
                onPress={handleSavePlot}
                disabled={saving}
                loading={saving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Uma coluna, largura confortável e espaços do guia, sem alturas fixas nos cards.
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    alignItems: "center",
    padding: tokens.space.md,
    paddingBottom: tokens.space.xl,
  },
  form: {
    width: "100%",
    maxWidth: tokens.size.formWidth,
    gap: tokens.space.lg,
  },
  intro: { gap: tokens.space.sm, paddingTop: tokens.space.sm },
  section: {
    backgroundColor: tokens.color.surface,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.sm,
  },
  sectionTitle: { flex: 1 },
  step: {
    color: tokens.color.primary,
    backgroundColor: tokens.color.surfaceMuted,
    borderRadius: tokens.radius.input,
    padding: tokens.space.sm,
  },
  secondary: { color: tokens.color.textSecondary },
  crops: { gap: tokens.space.md, marginTop: tokens.space.sm },
  empty: {
    backgroundColor: tokens.color.surfaceMuted,
    borderRadius: tokens.radius.input,
    padding: tokens.space.md,
    gap: tokens.space.sm,
  },
  cropCard: {
    // Reserva espaço para a lixeira sem impedir a quebra de nomes longos.
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.md,
  },
  cropInfo: { gap: tokens.space.xs },
  cropText: { flex: 1 },
  footer: { gap: tokens.space.md },
  feedback: {
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.sm,
  },
  success: { backgroundColor: tokens.color.successBg },
  errorFeedback: { backgroundColor: tokens.color.errorBg },
  successText: { color: tokens.color.success },
  error: { color: tokens.color.error },
});
