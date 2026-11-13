// Lista oficial: as const preserva cada nome como um valor literal do tipo.
export const ACTIVITY_CATEGORIES = [
  "Adubação e correção do solo",
  "Poda e manejo das plantas",
  "Controle de pragas e doenças",
  "Irrigação",
  "Plantio e replantio",
  "Colheita e pós-colheita",
  "Monitoramento e análises",
  "Outros",
] as const;

// Deriva os valores aceitos da própria lista, evitando mantê-los em dois lugares.
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

// Dados editáveis da atividade-modelo; somente nome e indicador são obrigatórios.
export type PlanActivityInput = Readonly<{
  name: string;
  description?: string;
  category?: ActivityCategory;
  plannedStartDate?: string;
  estimatedDurationDays?: number;
  notes?: string;
  notify: boolean;
}>;

// A atividade salva acrescenta uma identidade aos dados informados.
export type PlanActivity = PlanActivityInput & Readonly<{ id: string }>;

// Remove espaços externos e rejeita nomes vazios ou valores de outro tipo.
export function normalizeActivityName(name: string): string {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Informe o nome da atividade.");
  }
  return name.trim();
}

// Apenas ausência e texto vazio viram undefined; outros tipos geram erro.
export function normalizeOptionalText(value?: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string")
    throw new Error("Texto da atividade inválido.");
  return value.trim() || undefined;
}

// Compara sem diferenciar maiúsculas e retorna o nome oficial da lista.
export function normalizeActivityCategory(
  category?: string,
): ActivityCategory | undefined {
  const normalized = normalizeOptionalText(category);
  if (normalized === undefined) return undefined;
  const match = ACTIVITY_CATEGORIES.find(
    (item) => item.toLowerCase() === normalized.toLowerCase(),
  );
  if (!match) throw new Error("Categoria da atividade inválida.");
  return match;
}

// Valida uma data de calendário sem convertê-la em instante ou aplicar fuso horário.
export function validatePlannedStartDate(value?: string): string | undefined {
  const date = normalizeOptionalText(value);
  if (date === undefined) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error("Informe uma data válida no formato AAAA-MM-DD.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // Fevereiro tem 29 dias em anos bissextos, respeitando a regra dos séculos.
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    year === 0 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > days[month - 1]
  ) {
    throw new Error("Informe uma data válida no formato AAAA-MM-DD.");
  }
  return date;
}

// A duração ausente é aceita; quando informada, deve ser um inteiro seguro positivo.
export function validateEstimatedDurationDays(
  value?: number,
): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("Informe uma duração em dias inteiros positivos.");
  }
  return value;
}

// Soma dias de calendário em UTC para não deslocar a data por fuso horário.
// O contrato aceita anos de 0001 a 9999; resultados fora dele são inválidos.
export function calculatePlannedEndDate(
  startDate?: string,
  durationDays?: number,
): string | undefined {
  const start = validatePlannedStartDate(startDate);
  const duration = validateEstimatedDurationDays(durationDays);
  if (start === undefined || duration === undefined) return undefined;
  const [year, month, day] = start.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCDate(date.getUTCDate() + duration);
  if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() > 9999) {
    throw new Error("A data final calculada está fora do intervalo permitido.");
  }
  return date.toISOString().slice(0, 10);
}

// Não atribui valor padrão: a interface deve fornecer true ou false explicitamente.
export function validateActivityNotify(value: boolean): boolean {
  if (typeof value !== "boolean")
    throw new Error("Indicador de notificação inválido.");
  return value;
}

// Reúne as validações e devolve novos dados sem alterar o objeto recebido.
export function normalizePlanActivityInput(
  input: PlanActivityInput,
): PlanActivityInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Atividade inválida.");
  }
  const startDate = validatePlannedStartDate(input.plannedStartDate);
  const duration = validateEstimatedDurationDays(input.estimatedDurationDays);
  // Verifica também se a combinação permite calcular uma data final válida.
  calculatePlannedEndDate(startDate, duration);
  return {
    name: normalizeActivityName(input.name),
    description: normalizeOptionalText(input.description),
    category: normalizeActivityCategory(input.category),
    plannedStartDate: startDate,
    estimatedDurationDays: duration,
    notes: normalizeOptionalText(input.notes),
    notify: validateActivityNotify(input.notify),
  };
}
