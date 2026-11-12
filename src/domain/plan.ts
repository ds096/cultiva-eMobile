export type PlanInput = Readonly<{
  name: string;
  description?: string;
}>;

export type Plan = Readonly<{
  id: string;
  profileEmail: string;
  name: string;
  createdAt: string;
  description?: string;
}>;

// Remove espaços externos sem alterar a capitalização do nome.
export function normalizePlanName(name: string): string {
  const normalizedName = name.trim();
  if (normalizedName.length === 0) {
    throw new Error("Informe o nome do plano.");
  }
  return normalizedName;
}

// Uma descrição vazia é tratada como ausência de descrição.
export function normalizePlanDescription(
  description?: string,
): string | undefined {
  const normalizedDescription = description?.trim();
  return normalizedDescription || undefined;
}

// Normaliza os dados sem modificar o objeto recebido.
export function normalizePlanInput(input: PlanInput): PlanInput {
  return {
    name: normalizePlanName(input.name),
    description: normalizePlanDescription(input.description),
  };
}
