// Cada cultura registra sua própria quantidade de plantas.
export type Crop = Readonly<{
  name: string;
  quantity: number;
}>;

// Coordenadas em graus decimais, sem depender de APIs de localização.
export type Coordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

// Somente ano e localização podem ser omitidos no cadastro.
export type PlotInput = Readonly<{
  name: string;
  area: number;
  crops: readonly Crop[];
  plantingYear?: number;
  location?: Coordinates;
}>;

// Cada revisão guarda os dados daquela versão e o instante do salvamento.
export type PlotRevision = Readonly<{
  version: number;
  savedAt: string;
  data: PlotInput;
}>;

// A identidade fica separada dos dados editáveis, preservados nas revisões.
export type Plot = Readonly<{
  id: string;
  profileEmail: string;
  revisions: readonly PlotRevision[];
}>;

// Remove apenas espaços externos; mantém maiúsculas e espaços internos.
export function normalizePlotName(name: string): string {
  const normalizedName = name.trim();
  if (normalizedName.length === 0) {
    throw new Error("Informe o nome do talhão.");
  }
  return normalizedName;
}

// Rejeita zero, negativos, NaN e infinitos antes de usar a área.
export function validatePlotArea(area: number): number {
  if (!Number.isFinite(area) || area <= 0) {
    throw new Error("Informe uma área finita maior que zero.");
  }
  return area;
}

// Retorna uma nova cultura normalizada, sem modificar o objeto recebido.
export function validateCrop(crop: Crop): Crop {
  const name = crop.name.trim();
  if (name.length === 0) {
    throw new Error("Informe o nome da cultura.");
  }
  // isInteger também rejeita NaN e infinitos.
  if (!Number.isInteger(crop.quantity) || crop.quantity <= 0) {
    throw new Error(
      "Informe uma quantidade inteira maior que zero para a cultura.",
    );
  }
  return { name, quantity: crop.quantity };
}

// Os extremos e o zero são coordenadas válidas; valores não finitos não são.
export function validateCoordinates(location: Coordinates): Coordinates {
  const { latitude, longitude } = location;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Informe uma latitude finita entre -90 e 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Informe uma longitude finita entre -180 e 180.");
  }
  return { latitude, longitude };
}

// Ausência é undefined; não há restrição de negócio aprovada contra anos futuros.
export function validatePlantingYear(year: number): number {
  // Inteiro seguro evita aceitar anos que o JavaScript não representa exatamente.
  if (!Number.isSafeInteger(year) || year <= 0) {
    throw new Error("Informe um ano de plantio inteiro positivo válido.");
  }
  return year;
}

// // Combina as regras e cria cópias; não altera entradas nem revisões existentes.
// export function normalizePlotInput(input: PlotInput): PlotInput {
//   const name = normalizePlotName(input.name);
//   const area = validatePlotArea(input.area);
//   if (!Array.isArray(input.crops)) {
//     throw new Error("Informe a lista de culturas do talhão.");
//   }
//   // Lista vazia e nomes repetidos permanecem permitidos, sem deduplicação.
//   const crops = Array.from(input.crops, validateCrop);
//   const plantingYear = validatePlantingYear(input.plantingYear);
//   const location = input.location === undefined
//     ? undefined
//     : validateCoordinates(input.location);

//   return {
//     name,
//     area,
//     crops,
//     ...(plantingYear === undefined ? {} : { plantingYear }),
//     ...(location === undefined ? {} : { location }),
//   };
// }

// // O histórico segue a ordem de criação; consultar não ordena nem altera revisões.
// export function getCurrentRevision(plot: Plot): PlotRevision {
//   const revision = plot.revisions[plot.revisions.length - 1];
//   if (revision === undefined) {
//     throw new Error("O talhão não possui revisões.");
//   }
//   return revision;
// }
