import { useEffect, useRef, useState } from "react";
import type { ComponentRef } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Switch, Text } from "react-native-paper";
import {
  DatePickerModal,
  pt,
  registerTranslation,
} from "react-native-paper-dates";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePreventRemove } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useProfile } from "../context/ProfileContext";
import { planRepository } from "../repositories/planRepository";
import { normalizePlanInput } from "../domain/plan";
import {
  ACTIVITY_CATEGORIES,
  calculatePlannedEndDate,
  normalizeActivityName,
  normalizePlanActivityInput,
  validateEstimatedDurationDays,
  validatePlannedStartDate,
  type ActivityCategory,
  type PlanActivityInput,
} from "../domain/activity";
import {
  FormButton,
  FormField,
  type FormInput,
} from "../components/FormControls";
import { theme, tokens } from "../theme/theme";

registerTranslation("pt", pt);

const emptyActivity = {
  name: "",
  startDate: "",
  duration: "",
  notes: "",
  category: "" as ActivityCategory | "",
  notify: false,
};
type ActivityFields = typeof emptyActivity;
type ActivityErrors = Partial<Record<keyof ActivityFields, string>>;
type DraftActivity = { id: string; input: PlanActivityInput };

// A interface usa DD/MM/AAAA; o domínio normaliza o dia para meia-noite UTC.
function toDomainDate(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) throw new Error("Informe uma data real no formato DD/MM/AAAA.");
  return validatePlannedStartDate(`${match[3]}-${match[2]}-${match[1]}`);
}
function formatDate(value: string): string {
  return value.slice(0, 10).split("-").reverse().join("/");
}

// Trabalha com componentes locais para evitar mudanças de dia por fuso horário.
function dateFromDisplay(value: string): Date | undefined {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(0);
  date.setFullYear(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  date.setHours(12, 0, 0, 0);
  return date;
}

function dateToDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");
  return `${day}/${month}/${year}`;
}

export default function CreatePlanScreen() {
  const { email } = useProfile();
  const headerHeight = useHeaderHeight();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [guidedEntry, setGuidedEntry] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [activity, setActivity] = useState({ ...emptyActivity });
  const [activityErrors, setActivityErrors] = useState<ActivityErrors>({});
  const [activities, setActivities] = useState<DraftActivity[]>([]);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const saveLock = useRef(false);
  const nextActivityId = useRef(0);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const descriptionRef = useRef<FormInput>(null);
  const activityNameRef = useRef<FormInput>(null);
  const activityDurationRef = useRef<FormInput>(null);
  const activityNotesRef = useRef<FormInput>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cancela transições pendentes ao sair da tela, evitando abrir modais atrasados.
  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );

  function afterModalClose(action: () => void) {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    // Aguarda o fechamento do modal nativo antes de abrir outro ou mostrar o teclado.
    transitionTimer.current = setTimeout(() => {
      transitionTimer.current = null;
      action();
    }, 300);
  }
  function cancelGuidedEntry() {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
    setGuidedEntry(false);
  }
  function finishCategory() {
    setCategoryOpen(false);
    if (guidedEntry) afterModalClose(() => setDateOpen(true));
  }
  function finishDate() {
    setDateOpen(false);
    if (guidedEntry) {
      afterModalClose(() => {
        setGuidedEntry(false);
        activityDurationRef.current?.focus();
      });
    }
  }
  // Detecta campos preenchidos para evitar perder uma atividade não adicionada.
  const hasPendingActivity = Object.values(activity).some((value) =>
    typeof value === "string" ? value.trim() !== "" : value,
  );
  const dirty = Boolean(
    name || description || activities.length || hasPendingActivity,
  );

  // Confirma o descarte tanto pelo cabeçalho quanto pelo botão Voltar do Android.
  const disablePrevention = usePreventRemove(
    dirty && !leaving,
    ({ repeat }) => {
      Alert.alert("Descartar alterações?", "O plano ainda não foi salvo.", [
        { text: "Continuar editando", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => {
            setLeaving(true);
            repeat();
          },
        },
      ]);
    },
  );
  function showFeedback(message: string) {
    setFeedback(message);
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
  function updateActivity<K extends keyof ActivityFields>(
    field: K,
    value: ActivityFields[K],
  ) {
    setActivity((previous) => ({ ...previous, [field]: value }));
    setActivityErrors((previous) => ({ ...previous, [field]: undefined }));
    setFeedback("");
  }
  function handleAddActivity() {
    const errors: ActivityErrors = {};
    let startDate: string | undefined;
    const duration = activity.duration.trim()
      ? Number(activity.duration)
      : undefined;
    try {
      normalizeActivityName(activity.name);
    } catch {
      errors.name = "Informe o nome da atividade.";
    }
    try {
      startDate = toDomainDate(activity.startDate);
    } catch {
      errors.startDate = "Informe uma data real no formato DD/MM/AAAA.";
    }
    try {
      if (activity.duration.trim() && !/^\d+$/.test(activity.duration.trim()))
        throw new Error();
      validateEstimatedDurationDays(duration);
    } catch {
      errors.duration = "Informe uma duração em dias inteiros positivos.";
    }
    if (!errors.startDate && !errors.duration) {
      try {
        calculatePlannedEndDate(startDate, duration);
      } catch {
        errors.duration = "A duração deve resultar em uma data até 31/12/9999.";
      }
    }
    setActivityErrors(errors);
    if (Object.keys(errors).length) {
      showFeedback("Revise os campos da atividade antes de adicioná-la.");
      return;
    }
    const input = normalizePlanActivityInput({
      name: activity.name,
      category: activity.category || undefined,
      plannedStartDate: startDate,
      estimatedDurationDays: duration,
      notes: activity.notes,
      notify: activity.notify,
    });
    // ID temporário para o rascunho; o repositório gera os IDs persistentes.
    const draft = { id: String(nextActivityId.current++), input };
    setActivities((previous) => [...previous, draft]);
    setActivity({ ...emptyActivity });
    setFeedback("");
    Keyboard.dismiss();
  }
  function handleRemoveActivity(item: DraftActivity) {
    Alert.alert(
      "Remover atividade?",
      `Remover "${item.input.name}" deste plano?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setActivities((previous) =>
              previous.filter(({ id }) => id !== item.id),
            );
            setFeedback("");
          },
        },
      ],
    );
  }
  function handleSavePlan() {
    if (saveLock.current) return;
    setNameError("");
    try {
      normalizePlanInput({ name, description });
    } catch {
      setNameError("Informe o nome do plano.");
      showFeedback("Revise os campos indicados antes de salvar.");
      return;
    }
    // Não descarta silenciosamente uma atividade digitada, mas ainda não adicionada.
    if (hasPendingActivity) {
      showFeedback(
        "Toque em Adicionar atividade ou limpe os campos da atividade antes de salvar o plano.",
      );
      return;
    }
    saveLock.current = true;
    setSaving(true);
    try {
      if (!email) throw new Error("Perfil não identificado.");
      planRepository.createWithActivities(
        email,
        { name, description },
        activities.map(({ input }) => input),
      );
    } catch {
      showFeedback(
        "Não foi possível salvar o plano. Verifique se já existe um plano com o mesmo nome e descrição. Seus campos foram mantidos; tente novamente.",
      );
      saveLock.current = false;
      setSaving(false);
      return;
    }
    // A saída só é liberada após a escrita; a trava impede gravação duplicada.
    setLeaving(true);
    disablePrevention();
    Keyboard.dismiss();
    router.dismissTo("/plans");
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.screen}>
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
            {feedback ? (
              <View style={styles.feedback}>
                <Text
                  variant="bodyLarge"
                  style={styles.error}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  {feedback}
                </Text>
              </View>
            ) : null}
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
                  Identificação do plano
                </Text>
              </View>
              <FormField
                id="plan-name"
                label="Nome"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setNameError("");
                  setFeedback("");
                }}
                error={nameError}
                editable={!saving}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => descriptionRef.current?.focus()}
              />
              <FormField
                id="plan-description"
                inputRef={descriptionRef}
                label="Descrição"
                value={description}
                onChangeText={(value) => {
                  setDescription(value);
                  setFeedback("");
                }}
                editable={!saving}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => activityNameRef.current?.focus()}
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
                  Atividades do plano
                </Text>
              </View>
              <FormField
                id="activity-name"
                inputRef={activityNameRef}
                label="Nome"
                value={activity.name}
                onChangeText={(value) => updateActivity("name", value)}
                error={activityErrors.name}
                editable={!saving}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  setGuidedEntry(true);
                  setCategoryOpen(true);
                }}
              />
              <View style={styles.categoryField}>
                <Text variant="labelLarge">Categoria</Text>
                {/* Campo de seleção com aparência consistente com os demais campos. */}
                <Pressable
                  style={styles.categoryControl}
                  onPress={() => {
                    Keyboard.dismiss();
                    cancelGuidedEntry();
                    setCategoryOpen(true);
                  }}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Categoria"
                  accessibilityValue={{
                    text: activity.category || "Nenhuma categoria selecionada",
                  }}
                  accessibilityHint="Abre as opções de categoria"
                  accessibilityState={{
                    expanded: categoryOpen,
                    disabled: saving,
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.categoryValue,
                      !activity.category && styles.secondary,
                    ]}
                  >
                    {activity.category || "Selecione uma categoria"}
                  </Text>
                  <MaterialDesignIcons
                    name="chevron-down"
                    size={24}
                    color={tokens.color.textSecondary}
                  />
                </Pressable>
              </View>
              <Modal
                visible={categoryOpen}
                transparent
                animationType={guidedEntry ? "none" : "fade"}
                onRequestClose={() => {
                  setCategoryOpen(false);
                  cancelGuidedEntry();
                }}
              >
                <SafeAreaView
                  style={styles.modalBackdrop}
                  edges={["top", "bottom", "left", "right"]}
                >
                  {/* A área externa fecha o modal sem interferir nos toques da lista. */}
                  <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                      setCategoryOpen(false);
                      cancelGuidedEntry();
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar seleção de categoria"
                  />
                  <View style={styles.modalCard} accessibilityViewIsModal>
                    {/* A lista rola em telas pequenas e com fonte ampliada. */}
                    <ScrollView keyboardShouldPersistTaps="handled">
                      {ACTIVITY_CATEGORIES.map((category) => (
                        <Pressable
                          key={category}
                          style={styles.categoryOption}
                          accessibilityRole="radio"
                          accessibilityState={{
                            checked: activity.category === category,
                          }}
                          onPress={() => {
                            updateActivity("category", category);
                            finishCategory();
                          }}
                        >
                          <Text
                            variant="bodyLarge"
                            style={styles.categoryValue}
                          >
                            {category}
                          </Text>
                          {activity.category === category && (
                            <MaterialDesignIcons
                              name="check"
                              size={24}
                              color={tokens.color.primary}
                            />
                          )}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </SafeAreaView>
              </Modal>
              <View style={styles.categoryField}>
                <Text variant="labelLarge">Data inicial</Text>
                <Pressable
                  testID="activity-start"
                  style={styles.categoryControl}
                  onPress={() => {
                    Keyboard.dismiss();
                    cancelGuidedEntry();
                    setDateOpen(true);
                  }}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Data inicial"
                  accessibilityValue={{
                    text: activity.startDate || "Nenhuma data selecionada",
                  }}
                  accessibilityHint="Abre o calendário para selecionar uma data"
                  accessibilityState={{ disabled: saving, expanded: dateOpen }}
                >
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.categoryValue,
                      !activity.startDate && styles.secondary,
                    ]}
                  >
                    {activity.startDate || "Selecione uma data"}
                  </Text>
                  <MaterialDesignIcons
                    name="calendar"
                    size={24}
                    color={tokens.color.textSecondary}
                  />
                </Pressable>
                {activityErrors.startDate ? (
                  <Text
                    variant="bodyMedium"
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                    style={styles.error}
                  >
                    {activityErrors.startDate}
                  </Text>
                ) : null}
              </View>
              <DatePickerModal
                locale="pt"
                mode="single"
                visible={dateOpen}
                animationType={guidedEntry ? "none" : "slide"}
                date={dateFromDisplay(activity.startDate)}
                allowEditing={false}
                // A biblioteca interpreta anos de 1 a 99 como 1901 a 1999.
                startYear={100}
                endYear={9999}
                onDismiss={() => {
                  setDateOpen(false);
                  cancelGuidedEntry();
                }}
                onConfirm={({ date }) => {
                  if (date) updateActivity("startDate", dateToDisplay(date));
                  finishDate();
                }}
              />
              <FormField
                id="activity-duration"
                inputRef={activityDurationRef}
                label="Duração em dias"
                keyboardType="number-pad"
                value={activity.duration}
                onChangeText={(value) => updateActivity("duration", value)}
                error={activityErrors.duration}
                editable={!saving}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => activityNotesRef.current?.focus()}
              />
              <FormField
                id="activity-notes"
                inputRef={activityNotesRef}
                label="Observações"
                value={activity.notes}
                onChangeText={(value) => updateActivity("notes", value)}
                editable={!saving}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
              />
              <View style={styles.switchRow}>
                <Text variant="bodyLarge" style={styles.sectionTitle}>
                  Solicitar lembrete
                </Text>
                <Switch
                  value={activity.notify}
                  onValueChange={(value) => updateActivity("notify", value)}
                  disabled={saving}
                  accessibilityLabel="Solicitar lembrete para esta atividade"
                />
              </View>
              <FormButton
                label="Adicionar atividade"
                variant="secondary"
                onPress={handleAddActivity}
                disabled={saving}
              />
              <Text variant="titleMedium" accessibilityRole="header">
                Atividades adicionadas ({activities.length})
              </Text>
              {activities.map((item) => (
                <View key={item.id} style={styles.activityCard}>
                  <Text variant="bodyLarge">Nome: {item.input.name}</Text>
                  {item.input.category ? (
                    <Text variant="bodyLarge">
                      Categoria: {item.input.category}
                    </Text>
                  ) : null}
                  {item.input.plannedStartDate ? (
                    <Text variant="bodyLarge">
                      Início: {formatDate(item.input.plannedStartDate)}
                    </Text>
                  ) : null}
                  {item.input.estimatedDurationDays ? (
                    <Text variant="bodyLarge">
                      Duração: {item.input.estimatedDurationDays} dia(s)
                    </Text>
                  ) : null}
                  {item.input.notes ? (
                    <Text variant="bodyLarge">
                      Observações: {item.input.notes}
                    </Text>
                  ) : null}
                  <FormButton
                    label="Remover atividade"
                    accessibilityLabel={`Remover atividade ${item.input.name}`}
                    variant="remove"
                    onPress={() => handleRemoveActivity(item)}
                    disabled={saving}
                  />
                </View>
              ))}
            </View>
            <FormButton
              label={saving ? "Salvando plano..." : "Salvar plano"}
              onPress={handleSavePlan}
              disabled={saving}
              loading={saving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Mesmos tokens, áreas seguras e organização em uma coluna do cadastro de talhão.
const styles = StyleSheet.create({
  categoryField: { gap: tokens.space.sm },
  categoryControl: {
    minHeight: tokens.size.input,
    borderWidth: 1,
    borderColor: tokens.color.controlBorder,
    borderRadius: tokens.radius.input,
    backgroundColor: tokens.color.surface,
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.sm,
  },
  categoryValue: { flex: 1 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: tokens.space.md,
  },
  modalCard: {
    maxHeight: "85%",
    width: "100%",
    maxWidth: tokens.size.formWidth,
    alignSelf: "center",
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.sm,
  },
  categoryOption: {
    minHeight: tokens.size.touch,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.sm,
    paddingVertical: tokens.space.sm,
  },

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
  error: { color: tokens.color.error },
  feedback: {
    backgroundColor: tokens.color.errorBg,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
  },
  activityCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.card,
    padding: tokens.space.md,
    gap: tokens.space.sm,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.sm,
  },
});
