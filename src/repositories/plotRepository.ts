// O repositório traduz o texto armazenado em dados que o restante do app pode usar.
import { createMMKV } from "react-native-mmkv";
import { normalizeEmail } from "../utilities/email";
import { normalizePlotInput } from "../domain/plot";
import type { Crop, Plot, PlotInput, PlotRevision } from "../domain/plot";

/**
 * Repositório responsável por recuperar e validar os talhões
 * armazenados localmente no MMKV.
 *
 * Responsabilidades:
 * - Separar os dados por perfil.
 * - Ler e converter dados JSON.
 * - Validar talhões, campos e revisões.
 * - Retornar os talhões do perfil.
 * - Tratar erros e dados inválidos.
 *
 * Funções:
 * getStorage()    - Inicializa e reutiliza o MMKV.
 * getProfileKey() - Define a chave de cada perfil.
 * readRaw()       - Recupera a string armazenada.
 * isRecord()      - Verifica se o valor é um objeto.
 * readInput()     - Valida os campos do talhão.
 * readRevision()  - Valida cada revisão.
 * readPlot()      - Valida a identidade e as revisões.
 * list()          - Retorna os talhões do perfil.
 */

// ReturnType obtém o tipo retornado por createMMKV, sem duplicar sua definição.
type Storage = ReturnType<typeof createMMKV>;

// Fora das funções, esta variável permite reutilizar a mesma instância.
// null indica que ainda não abrimos o armazenamento, não que ele está vazio.
let storage: Storage | null = null;

// Como no profileRepository, adia a criação até alguém precisar ler os dados.
function getStorage(): Storage {
  if (storage === null) {
    // O id identifica o armazenamento de talhões, separado da seleção de perfil.
    // Se createMMKV lançar um erro, storage continua null para outra tentativa.
    storage = createMMKV({
      id: "cultiva-e-talhoes",
    });
  }

  return storage;
}

// Cada perfil tem uma chave dentro do mesmo armazenamento de talhões.
// A chave é o endereço dos dados
function getProfileKey(email: string): string {
  const normalized = normalizeEmail(email);

  // Uma string vazia é falsy: !normalized impede ler sem identificar um perfil.
  if (!normalized) {
    throw new Error("Selecione um perfil.");
  }

  return `plots:${encodeURIComponent(normalized)}`;
}

// raw significa "bruto": ainda é texto, sem conversão ou validação de JSON.
// A chave pode não existir.
function readRaw(email: string): string | undefined {
  const key = getProfileKey(email);

  return getStorage().getString(key);
}

// O resultado de readRaw é um registro?

function isRecord(value: unknown): value is Record<string, unknown> {
  // typeof null e typeof [] retornam "object"; por isso há três verificações.
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Recebe dados desconhecidos e devolve PlotInput somente após validá-los.
// Primeiro conferimos a estrutura; depois aplicamos as regras do domínio.
function readInput(value: unknown): PlotInput {
  // || significa "ou": basta uma condição inválida para rejeitar a entrada.
  // A avaliação para no primeiro true, evitando acessar propriedades de null.
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.area !== "number" ||
    !Array.isArray(value.crops)
  ) {
    throw new Error("Dados do talhão inválidos.");
  }

  // Ser um array não garante que seus itens sejam culturas válidas.
  // map verifica cada item e constrói uma nova lista, sem alterar a original.
  const crops = value.crops.map((crop: unknown): Crop => {
    if (
      !isRecord(crop) ||
      typeof crop.name !== "string" ||
      typeof crop.quantity !== "number"
    ) {
      throw new Error("Cultura armazenada inválida.");
    }
    return { name: crop.name, quantity: crop.quantity };
  });

  // Opcional significa que pode faltar, não que qualquer valor seja aceito.
  // Comparamos com undefined para não confundir ausência com o número zero.
  const plantingYear = value.plantingYear;
  if (plantingYear !== undefined && typeof plantingYear !== "number") {
    throw new Error("Ano de plantio armazenado inválido.");
  }

  // Reutiliza o tipo de location do contrato, incluindo a possibilidade de ausência.
  let location: PlotInput["location"];
  if (value.location !== undefined) {
    if (
      !isRecord(value.location) ||
      typeof value.location.latitude !== "number" ||
      typeof value.location.longitude !== "number"
    ) {
      throw new Error("Localização armazenada inválida.");
    }
    location = {
      latitude: value.location.latitude,
      longitude: value.location.longitude,
    };
  }

  // Os campos já têm tipos conhecidos: não precisamos forçar "as PlotInput".
  // O spread (...) adiciona os opcionais somente quando estão presentes.
  const input: PlotInput = {
    name: value.name,
    area: value.area,
    crops,
    ...(plantingYear !== undefined ? { plantingYear } : {}),
    ...(location !== undefined ? { location } : {}),
  };

  // Ter o tipo correto não basta: uma área numérica ainda pode ser negativa.
  // O domínio verifica nomes, área, culturas, ano e limites das coordenadas.
  // Ignoramos sua cópia normalizada para preservar os textos lidos do histórico.
  // Se houver erro, a execução para aqui e não chega ao return.
  normalizePlotInput(input);
  return input;
}

// Uma revisão reúne número da versão, instante de salvamento e dados do talhão.
// Esta função é chamada para cada revisão, não apenas para a mais recente.
function readRevision(value: unknown): PlotRevision {
  // isSafeInteger exige um inteiro representável com precisão pelo JavaScript.
  // Date.parse tenta interpretar a data; isFinite rejeita um resultado NaN.
  // Isso não exige um formato específico de data nem verifica a ordem das versões.
  if (
    !isRecord(value) ||
    typeof value.version !== "number" ||
    !Number.isSafeInteger(value.version) ||
    value.version <= 0 ||
    typeof value.savedAt !== "string" ||
    !Number.isFinite(Date.parse(value.savedAt))
  ) {
    throw new Error("Revisão do talhão inválida.");
  }

  return {
    version: value.version,
    savedAt: value.savedAt,
    // A revisão só é válida se seus dados internos também forem válidos.
    data: readInput(value.data),
  };
}

// A identidade fica no Plot; os dados editáveis ficam dentro de revisions.
// profileEmail já vem normalizado e deve coincidir com o e-mail armazenado.
function readPlot(value: unknown, profileEmail: string): Plot {
  // Um id vazio, outro perfil ou um histórico vazio impedem devolver o talhão.
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    value.id.trim() === "" ||
    value.profileEmail !== profileEmail ||
    !Array.isArray(value.revisions) ||
    value.revisions.length === 0
  ) {
    throw new Error("Talhão armazenado inválido.");
  }

  return {
    id: value.id,
    profileEmail,
    // map preserva a ordem do histórico e interrompe a leitura se um item falhar.
    revisions: value.revisions.map(readRevision),
  };
}

export const plotRepository = {
  // Reutiliza a leitura validada do perfil; ausência não esconde falhas de leitura.
  findById(profileEmail: string, id: string): Plot | undefined {
    return plotRepository.list(profileEmail).find((plot) => plot.id === id);
  },

  // Entrada: e-mail do perfil selecionado. Saída: lista de talhões validados.
  // O fluxo de perfil fornece o e-mail; este método não altera a seleção.
  // Em caso de falha, lança um erro para a tela tratar, em vez de simular sucesso.
  list(profileEmail: string): Plot[] {
    // Usamos o mesmo e-mail normalizado na chave e na comparação de cada talhão.
    const normalizedEmail = normalizeEmail(profileEmail);
    // 1. readRaw localiza a chave e lê seu texto. Ainda não temos objetos Plot.
    // Falhas do MMKV seguem para quem chamou list; não significam lista vazia.
    const raw = readRaw(normalizedEmail);

    // 2. Sem chave, não há talhões salvos: devolvemos uma lista vazia.
    // A comparação exata evita tratar texto vazio ou corrompido como ausência.
    if (raw === undefined) {
      return [];
    }

    // 3. JSON.parse transforma texto JSON em um valor JavaScript.
    // JSON válido pode conter null, um número ou uma estrutura inesperada.
    // unknown nos obriga a conferir o resultado antes de usá-lo como documento.
    let plotsJSON: unknown;

    try {
      plotsJSON = JSON.parse(raw);
    } catch {
      // Apenas a conversão fica no try: este erro indica falha de sintaxe JSON.
      // Não gravamos [] por cima do texto inválido; ele permanece para recuperação.
      throw new Error("JSON dos talhões inválido.");
    }

    // 4. Esperamos um objeto que contenha schemaVersion e plots.
    // isRecord rejeita null, arrays e valores primitivos antes de ler esses campos.
    if (!isRecord(plotsJSON)) {
      throw new Error("Documento de talhões inválido.");
    }

    // 5. "in" verifica a presença do campo; !== 1 rejeita versões não suportadas.
    // schemaVersion é a versão do formato JSON, diferente da versão de uma revisão.
    // Ler um formato desconhecido como se fosse o atual poderia interpretar dados errados.
    if (!("schemaVersion" in plotsJSON) || plotsJSON.schemaVersion !== 1) {
      throw new Error("Versão do documento não suportada.");
    }

    // 6. O campo plots precisa existir e conter um array, mesmo sem talhões.
    // Esta etapa valida a lista; a próxima valida o conteúdo de cada item.
    if (!("plots" in plotsJSON) || !Array.isArray(plotsJSON.plots)) {
      throw new Error("Lista de talhões inválida.");
    }

    // 7. readPlot confere cada talhão, suas revisões e os dados de cada revisão.
    // map reúne os resultados em Plot[]; o tipo vem das verificações, sem cast.
    // Se um item falhar, list lança o erro e não devolve uma lista parcial.
    return plotsJSON.plots.map((plot: unknown) =>
      readPlot(plot, normalizedEmail),
    );
  },
};
