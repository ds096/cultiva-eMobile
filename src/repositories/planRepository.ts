import * as Crypto from "expo-crypto";
import { createMMKV } from "react-native-mmkv";
import { normalizePlanInput } from "../domain/plan";
import type { Plan, PlanInput } from "../domain/plan";
import { normalizeEmail } from "../utilities/email";

type Storage = ReturnType<typeof createMMKV>;
let storage: Storage | null = null;

function getStorage(): Storage {
  if (storage === null) {
    storage = createMMKV({ id: "cultiva-e-planos" });
  }
  return storage;
}

function profileKey(email: string): string {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Selecione um perfil.");
  return `plans:${encodeURIComponent(normalized)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Valida toda a lista antes de permitir qualquer alteração no documento.
function readPlan(value: unknown, profileEmail: string): Plan {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    value.profileEmail !== profileEmail ||
    typeof value.name !== "string" ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    (value.description !== undefined && typeof value.description !== "string")
  ) {
    throw new Error("Plano armazenado inválido.");
  }
  const input = normalizePlanInput({
    name: value.name,
    description: value.description,
  });
  return { id: value.id, profileEmail, createdAt: value.createdAt, ...input };
}

function save(profileEmail: string, plans: Plan[]): void {
  getStorage().set(
    profileKey(profileEmail),
    JSON.stringify({ schemaVersion: 1, plans }),
  );
}

function assertUnique(
  plans: Plan[],
  input: PlanInput,
  exceptId?: string,
): void {
  const name = input.name.trim().toLowerCase();
  const description = (input.description?.trim() ?? "").toLowerCase();
  if (
    plans.some(
      (plan) =>
        plan.id !== exceptId &&
        plan.name.trim().toLowerCase() === name &&
        (plan.description?.trim() ?? "").toLowerCase() === description,
    )
  ) {
    throw new Error("Já existe um plano com este nome e descrição.");
  }
}

export const planRepository = {
  list(profileEmail: string): Plan[] {
    const email = normalizeEmail(profileEmail);
    const raw = getStorage().getString(profileKey(email));
    if (raw === undefined) return [];
    let document: unknown;
    try {
      document = JSON.parse(raw);
    } catch {
      throw new Error("JSON dos planos inválido.");
    }
    if (!isRecord(document)) throw new Error("Documento de planos inválido.");
    if (document.schemaVersion !== 1)
      throw new Error("Versão do documento não suportada.");
    if (!Array.isArray(document.plans))
      throw new Error("Lista de planos inválida.");
    const plans = document.plans.map((value: unknown) =>
      readPlan(value, email),
    );
    // IDs duplicados tornariam edição e exclusão ambíguas.
    if (new Set(plans.map((plan) => plan.id)).size !== plans.length) {
      throw new Error("IDs de planos duplicados.");
    }
    return plans;
  },

  getById(profileEmail: string, id: string): Plan | undefined {
    return planRepository.list(profileEmail).find((plan) => plan.id === id);
  },

  create(profileEmail: string, input: PlanInput): Plan {
    const email = normalizeEmail(profileEmail);
    const normalized = normalizePlanInput(input);
    const plans = planRepository.list(email);
    assertUnique(plans, normalized);
    const plan: Plan = {
      id: Crypto.randomUUID(),
      profileEmail: email,
      createdAt: new Date().toISOString(),
      ...normalized,
    };
    save(email, [...plans, plan]);
    return plan;
  },

  update(profileEmail: string, id: string, input: PlanInput): Plan {
    const email = normalizeEmail(profileEmail);
    const normalized = normalizePlanInput(input);
    const plans = planRepository.list(email);
    const index = plans.findIndex((plan) => plan.id === id);
    if (index === -1) throw new Error("Plano não encontrado.");
    assertUnique(plans, normalized, id);
    const plan: Plan = { ...plans[index], ...normalized };
    plans[index] = plan;
    save(email, plans);
    return plan;
  },

  remove(profileEmail: string, id: string): void {
    const email = normalizeEmail(profileEmail);
    const plans = planRepository.list(email);
    if (!plans.some((plan) => plan.id === id))
      throw new Error("Plano não encontrado.");
    save(
      email,
      plans.filter((plan) => plan.id !== id),
    );
  },
};
