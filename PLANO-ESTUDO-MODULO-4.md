# Plano de estudo — módulo 4: Persistência e talhões

Elaborado em 28/10/2026. Estado: planejamento; módulo ainda pendente.

Objetivo: conseguir cadastrar, listar, consultar e editar talhões do perfil local, mantendo dados após reiniciar o aplicativo e preservando versões anteriores. Você escreve a implementação, uma atividade por vez; os exemplos abaixo são pontos de partida comentados, não uma funcionalidade já entregue.

## Ponto de partida real

A inspeção atual encontrou Expo `~58.0.16`, entrada `expo-router/entry`, MMKV `^4.3.2` e Nitro Modules declarados. `src/context/PerfilContext.tsx` já fornece `email`, `selectProfile` e `clearProfile`. `src/repositories/perfilRepository.ts` guarda apenas a seleção, em `cultiva-e-perfil` / `perfil.email`. `src/app/plots.tsx` ainda é uma tela temporária com saída; não existe cadastro de talhões.

Portanto, não é necessário começar instalando MMKV ou refazendo o acesso. Antes dos exercícios de persistência, conferir no Android a restauração da seleção e a saída. Dependência instalada e verificações estáticas não comprovam funcionamento nativo. Os diagnósticos de 18/10 nos documentos são históricos.

## Ritmo de estudo

Reserve sessões de 45–75 minutos, ajustáveis ao seu ritmo: cerca de 10 minutos para conceitos, 30–45 para implementar e o restante para verificar e explicar o resultado. Se não terminar, retome a mesma atividade. Não avance apenas porque o tempo acabou.

| Sessão | Etapa do guia | Entrega pequena | Conceito principal |
| --- | --- | --- | --- |
| 1 | 4.1 | Contrato do talhão e exemplos | Entidade, identidade e campos obrigatórios |
| 2 | 4.1 | Tipos e validação do nome | Tipo estático versus validação em execução |
| 3 | 4.2 | Leitura/gravação isoladas por perfil | Chave, JSON e persistência |
| 4 | 4.2 | Tratamento de conteúdo inválido e falhas | Ausência não é erro de leitura |
| 5 | 4.3 | Lista e estado vazio | Memória versus disco |
| 6 | 4.3 | Formulário de criação | Entrada controlada e confirmação de gravação |
| 7 | 4.3 | Consulta de detalhes | Parâmetro de rota e busca pelo identificador |
| 8 | 4.4 | Edição com revisão | Imutabilidade e versão esperada |
| 9 | 4.4 | Consulta das revisões e testes integrados | Evidência de persistência e recuperação |

## Sessão 1 — Decidir o contrato antes de programar

**Problema:** sem um contrato, cada tela pode guardar dados diferentes ou transformar uma sugestão em campo obrigatório.

**Proposta para discutir, ainda não aprovada:** começar somente com nome obrigatório. Campos de área, cultura, localização e observações só entram se você confirmar sua utilidade e regras. Se incluir área, definir unidade, precisão e representação decimal antes de implementá-la; não improvisar cálculos com ponto flutuante.

| Decisão | Proposta didática | O que confirmar |
| --- | --- | --- |
| Nome | Remover espaços externos; rejeitar vazio | Limite de tamanho e aceitação de nomes repetidos |
| Identificador | Gerado uma vez e preservado na edição | Estratégia de geração compatível com a base instalada |
| Perfil | E-mail normalizado obtido do contexto | Manter a convenção já usada no acesso |
| Revisões | Cadastro é revisão 1; mudança efetiva acrescenta revisão | Aprovar essa política e não criar revisão ao salvar sem mudanças |
| Auditoria | Registrar instante de criação de cada revisão | Apresentação local de data e horário |
| Exclusão | Sem ação de excluir neste módulo | Tratar exclusão em decisão própria, preservando histórico |

Não usar nome, posição na lista ou apenas horário como identidade. A geração real de IDs é uma tarefa explícita antes do cadastro: verificar APIs disponíveis; se exigir dependência, solicitar autorização antes de instalar. Nos exercícios isolados, pode-se fornecer um ID fixo de teste, sem reutilizá-lo em cadastros reais.

**Entradas de estudo:** `"  Talhão Norte  "`, `""`, `"   "` e dois talhões com o mesmo nome. Escreva o resultado esperado de cada uma conforme as regras acordadas. Use somente um perfil de teste separado.

**Verificação:** explicar por que renomear um talhão não deve mudar seu ID. Registrar os campos e as regras aprovados antes da sessão 2.

## Sessão 2 — Modelar e validar sem depender da tela

**Problema:** regras dentro do formulário ficam difíceis de reutilizar na edição.

Após aprovar o contrato mínimo, criar `src/domain/plot.ts`. A pasta passa a existir para uma necessidade concreta: tipos e regras do talhão. Os exemplos seguintes pressupõem somente nome e a política de revisões proposta.

```ts
// Conteúdo editável; ID e perfil não são digitados no formulário.
export type PlotInput = Readonly<{
  name: string;
}>;

// Cada revisão contém uma cópia completa dos campos daquela versão.
export type PlotRevision = Readonly<{
  version: number;
  savedAt: string; // Instante de auditoria ISO, não data de calendário.
  data: PlotInput;
}>;

// A última revisão é a versão atual; as anteriores permanecem preservadas.
export type Plot = Readonly<{
  id: string;
  profileEmail: string;
  revisions: readonly PlotRevision[];
}>;

// Normaliza somente o que foi combinado e impede nome vazio.
export function normalizePlotInput(input: PlotInput): PlotInput {
  const name = input.name.trim();
  if (name.length === 0) {
    throw new Error("Informe o nome do talhão.");
  }
  return { name };
}

// Um cadastro sem revisão indica conteúdo inválido, não um talhão vazio.
export function getCurrentRevision(plot: Plot): PlotRevision {
  const revision = plot.revisions[plot.revisions.length - 1];
  if (!revision) {
    throw new Error("O talhão não possui uma revisão válida.");
  }
  return revision;
}
```

`Readonly` ajuda o TypeScript a impedir alterações acidentais; não congela objetos em execução e não valida JSON. Evitar `push` e atribuição em objetos antigos continua sendo parte da implementação.

**Como implementar:** escrever os tipos, depois a normalização e, por último, a leitura da revisão atual. Não criar tela nesta sessão. Acrescentar limite de tamanho somente depois da decisão da sessão 1.

**Verificação:** nome com espaços retorna nome limpo; vazio gera erro; ler revisão atual não modifica as anteriores. Explicar a diferença entre o talhão e uma versão de seus dados.

## Sessão 3 — Salvar e reler por perfil

**Problema:** estado React desaparece ao encerrar o processo; o cadastro precisa permanecer no dispositivo e ser consultado no perfil correto.

Criar `src/repositories/plotRepository.ts`, separado do repositório de seleção. Reutilizar a ideia de inicialização tardia já usada no projeto. Proposta inicial: uma instância para talhões e uma chave por perfil, contendo um documento com versão do formato e lista de talhões. Isso simplifica o exercício com poucos registros; medir volume e tempo antes de expandir para listas grandes.

Trecho inicial do arquivo — ainda não constitui o repositório completo:

```ts
import { createMMKV } from "react-native-mmkv";
import { normalizeEmail } from "../utilities/email";

// A instância só é criada quando uma operação realmente precisa dela.
let storage: ReturnType<typeof createMMKV> | null = null;

function getStorage() {
  if (storage === null) {
    storage = createMMKV({ id: "cultiva-e-talhoes" });
  }
  return storage;
}

// A chave separa os registros locais e rejeita ausência de perfil.
function getProfileKey(email: string): string {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error("Selecione um perfil antes de acessar talhões.");
  }
  return `plots:${encodeURIComponent(normalized)}`;
}

// undefined significa que a chave não existe; falhas continuam sendo erros.
function readRaw(email: string): string | undefined {
  return getStorage().getString(getProfileKey(email));
}
```

O e-mail deve vir do contexto, com a validação já aplicada pelo fluxo de acesso. Separação por chave organiza dados locais; não comprova identidade nem constitui segurança contra alguém com acesso ao dispositivo.

**Como completar, em ordem:**

1. Definir o documento `{ schemaVersion: 1, plots: [...] }`. `schemaVersion` identifica o formato do arquivo; `version` identifica a revisão de um talhão.
2. Criar `list(profileEmail)` e `findById(profileEmail, id)`. Ausência de chave retorna lista vazia; ID não encontrado após leitura válida retorna `null`.
3. Na sessão 4, implementar a validação do documento lido antes de liberar gravações reais.
4. Criar `create` e `update` como operações específicas. Manter a função de gravar o documento privada, usando `JSON.stringify` e `set`.
5. Toda alteração deve reler a versão persistida mais recente, validar, construir o próximo documento e realizar uma única gravação com atual e histórico juntos. Não salvar histórico e versão atual em chaves separadas neste exercício.

As operações MMKV usadas aqui são síncronas. Evitar tornar a sequência de leitura/alteração/gravação assíncrona sem necessidade. Uma gravação de documento reduz falhas parciais entre campos, mas não representa uma transação geral nem solução de concorrência entre processos. A proposta assume um único fluxo JavaScript de escrita.

**Verificação:** gravar um cadastro de teste, encerrar e abrir novamente o app e reler. Sair deve remover apenas a seleção; nunca executar `clearAll` nos dados dos talhões.

## Sessão 4 — Distinguir vazio, incompatibilidade e falha

**Problema:** fazer `catch { return [] }` esconde corrupção e permite sobrescrever registros existentes como se não houvesse nada.

**Como implementar:** ler JSON para uma variável `unknown` e validar sua estrutura com funções pequenas. Não usar `JSON.parse(raw) as Plot[]` como se isso comprovasse validade.

O validador precisa conferir:

- Documento objeto, `schemaVersion` suportada e `plots` como lista.
- IDs não vazios e únicos; cada `profileEmail` igual ao perfil normalizado solicitado.
- Pelo menos uma revisão por talhão; versões inteiras sequenciais começando em 1.
- Instantes de auditoria válidos e campos de cada revisão dentro do contrato aprovado.
- Nome válido em todas as revisões, não apenas na atual.

| Resultado da leitura | Comportamento |
| --- | --- |
| Chave ausente | Lista vazia real; permitir cadastro |
| Documento válido sem talhões | Estado vazio; permitir cadastro |
| JSON inválido ou estrutura incorreta | Erro de leitura; preservar conteúdo e bloquear gravações |
| Versão de formato desconhecida | Explicar incompatibilidade; não substituir nem migrar silenciosamente |
| Falha do MMKV | Oferecer nova tentativa; não assumir lista vazia |

Migração futura terá leitura do formato anterior, transformação e validação antes da gravação. Não precisa construir um sistema de migrações inteiro agora, mas precisa impedir que uma versão desconhecida seja sobrescrita.

**Verificação:** simular conteúdo inválido em armazenamento de teste, nunca em perfil real. Confirmar que a tentativa de leitura não altera o texto original. Uma implementação em memória do armazenamento pode simular falhas sem mexer no MMKV real.

## Sessão 5 — Mostrar lista e estado vazio

**Entrada:** e-mail selecionado no `useProfile`. **Resultado:** somente os talhões desse perfil, exibindo o nome da última revisão.

**Como implementar:**

1. Evoluir a tela atual `src/app/plots.tsx`; preservar a saída existente.
2. Carregar pelo repositório e manter estado da consulta separado da lista. Erro não pode aparecer como “Você ainda não possui talhões cadastrados”.
3. Preparar carregamento, lista pronta, vazio e erro com “Tentar novamente”. A leitura síncrona pode terminar sem um indicador perceptível; não adicionar atraso artificial.
4. Usar o ID do talhão como chave da lista, nunca índice ou nome.
5. Atualizar a consulta ao retornar de criação/edição. Escolher recarga ao foco como solução inicial; criar contexto de talhões somente se houver necessidade real de estado compartilhado.
6. Limpar dados exibidos quando o perfil mudar, antes de carregar o novo perfil. Não mostrar temporariamente a lista anterior.

**Mensagem vazia:** “Você ainda não possui talhões cadastrados.” Ação: “Adicionar talhão”. Não inserir registros de exemplo automaticamente.

**Verificação:** perfil A possui um talhão; perfil B permanece vazio; retornar a A recupera o cadastro. Usar perfis exclusivamente de teste.

## Sessão 6 — Criar o formulário

Criar inicialmente a rota `src/app/plot-new.tsx`, mantendo a rota existente `/plots`. Aplicar tema e componentes compartilhados. Usar campo Paper com rótulo persistente e botão “Salvar talhão”, área segura, rolagem e tratamento de teclado.

O fluxo a implementar é:

1. Ler o perfil do contexto, nunca de um campo editável do formulário.
2. Validar os campos e manter erros próximos das entradas.
3. Gerar o ID uma vez para a tentativa de cadastro; manter esse ID caso seja necessário repetir a gravação.
4. Obter instante de auditoria e construir revisão 1 com os dados normalizados.
5. Chamar `plotRepository.create`; impedir ID repetido e nunca sobrescrever um cadastro existente nessa operação.
6. Somente após sucesso, confirmar “Salvo neste dispositivo” e voltar à lista.

Reutilizar o aprendizado do acesso: trava imediata contra repetição, estado visual de processamento e liberação da trava se houver falha. O repositório também verifica ID repetido. Não confundir isso com unicidade de nome, que depende da regra acordada.

**Falha de gravação:** preservar formulário, não navegar e permitir tentar novamente. Se a confirmação da escrita for incerta, reler pelo mesmo ID antes de tentar criar outro cadastro.

**Verificação:** vazio, espaços, nome válido, duplo toque e erro de gravação. Não mostrar “Sincronizado” nem “Aguardando sincronização”: este módulo ainda não implementa fila ou backend.

## Sessão 7 — Consultar detalhes e organizar rotas

Proposta incremental de rotas:

| Arquivo | Finalidade |
| --- | --- |
| `src/app/plots.tsx` | Lista já existente |
| `src/app/plot-new.tsx` | Cadastro |
| `src/app/plot/[id].tsx` | Consulta |
| `src/app/plot-edit/[id].tsx` | Edição, na sessão 8 |

Os colchetes representam parâmetro de rota no Expo Router. Acrescentar as novas telas ao trecho protegido do layout; proteger apenas `plots` não protege automaticamente suas rotas irmãs. Isso continua sendo controle de navegação local, não autorização remota. Referências: [notação de rotas](https://docs.expo.dev/router/basics/notation/) e [rotas protegidas](https://docs.expo.dev/router/advanced/protected/).

**Como implementar:** ler o ID com `useLocalSearchParams` do `expo-router`, conferir que é uma string válida, obter o perfil do contexto e chamar `findById` dentro desse perfil. Não passar o objeto completo como parâmetro nem pesquisar em todos os perfis.

Exibir nome atual, número da revisão e instante de salvamento formatado para o usuário. Preparar “Talhão não encontrado” e erro de leitura como situações distintas. Não criar botões funcionais de planejamento e histórico de lançamentos antes dos módulos correspondentes.

**Verificação:** ID existente abre detalhe; ID ausente não quebra a tela; ID do perfil A não encontra registro no perfil B.

## Sessão 8 — Editar preservando revisões

**Problema:** substituir o nome antigo no mesmo objeto elimina o histórico. Ler um formulário antigo e salvar sem conferir a versão também pode sobrescrever uma alteração mais recente.

Acrescentar esta função a `src/domain/plot.ts`, usando os tipos e funções da sessão 2:

```ts
// Produz uma nova versão em memória; a persistência continua no repositório.
export function revisePlot(
  plot: Plot,
  input: PlotInput,
  expectedVersion: number,
  savedAt: string,
): Plot {
  const current = getCurrentRevision(plot);
  if (current.version !== expectedVersion) {
    throw new Error("Este talhão mudou. Reabra os dados antes de editar.");
  }

  const data = normalizePlotInput(input);
  if (data.name === current.data.name) {
    return plot; // Sem mudança efetiva, preserva a mesma revisão.
  }

  // Não altera a lista anterior nem os dados das versões já salvas.
  return {
    ...plot,
    revisions: [
      ...plot.revisions,
      { version: current.version + 1, savedAt, data },
    ],
  };
}
```

`savedAt` deve ser um instante ISO válido, fornecido pela operação de salvamento. A função permite injetar um valor conhecido no exercício; na integração, validar esse contrato. Quando novos campos forem aprovados, atualizar a comparação de mudança e o validador de todas as revisões.

**Como integrar:** ao abrir o formulário, guardar a versão carregada como `expectedVersion`. Ao salvar, o repositório relê o documento, encontra o talhão no perfil atual, chama `revisePlot`, substitui apenas esse item numa nova lista e grava o documento inteiro. Se a função retornar o mesmo objeto, não é necessário gravar.

Não atualizar a lista visível antes de a gravação terminar. Se a escrita falhar, o formulário permanece aberto e a versão anterior continua sendo a última confirmada. Uma divergência de versão deve pedir reabertura dos dados, sem descartar silenciosamente o texto digitado.

**Exercício:** cadastrar “Talhão Norte”, editar para “Talhão Norte — café”, consultar revisão 1 e revisão 2. Salvar novamente sem mudar nada deve manter a revisão 2, se essa política for aprovada.

**Verificação:** mesmo ID e perfil, duas revisões preservadas, formulário antigo rejeitado, falha de gravação sem publicação de sucesso.

## Sessão 9 — Consultar revisões e conferir o conjunto

Na consulta do talhão, acrescentar uma seção “Revisões do cadastro”, mostrando número, instante e campos de cada versão em leitura. Diferenciar essas revisões do histórico de atividades executadas, que será construído depois.

| Cenário | Resultado esperado |
| --- | --- |
| Primeiro cadastro | Revisão 1, pertencente ao perfil selecionado |
| Reinício completo | Cadastro e revisões continuam presentes |
| Sair e entrar novamente | Seleção muda; registros permanecem |
| Trocar entre perfis de teste | Nenhuma lista, detalhe ou revisão cruza perfis |
| Edição válida | Mesmo ID, nova revisão, anteriores intactas |
| Edição sem alteração | Nenhuma nova revisão, conforme proposta aprovada |
| Versão esperada antiga | Conflito informado; registro atual preservado |
| Nome inválido | Mensagem próxima do campo e nada gravado |
| Duplo toque | Um cadastro; nenhuma revisão duplicada |
| Falha ao ler | Erro explícito, sem estado vazio enganoso |
| Falha ao salvar | Sem mensagem de sucesso, com formulário preservado |
| JSON inválido/formato futuro | Escrita bloqueada, conteúdo original preservado |
| Modo avião e reinício | Consulta e edição locais continuam funcionando |
| Fonte ampliada, teclado e TalkBack | Conteúdo e ações alcançáveis e compreensíveis |

Testar regras puras e falhas com armazenamento simulado; confirmar persistência real com MMKV em Android. O sucesso de um desses testes não substitui o outro. Não instalar um framework de testes automaticamente.

Ao terminar cada pequena implementação, executar as verificações existentes:

```powershell
# Confere padrões e problemas estáticos do projeto.
npm run lint

# Confere os contratos TypeScript sem gerar arquivos de saída.
npm run typecheck
```

O módulo estará pronto para revisão quando cadastro, lista, consulta, edição e revisões passarem pelos cenários acima e você conseguir explicar onde cada responsabilidade está. Permanecem fora desta etapa: propriedades, planos, atividades, insumos, fotos, backend e sincronização.

## Registro de aprendizagem

Depois de cada sessão, anotar data, objetivo, arquivos implementados, conceito aprendido, testes executados com resultados, bloqueios e próximo exercício. Atualizar o progresso no guia somente com evidências ou decisão explícita do responsável.

Registro desta entrega, 28/10/2026: elaborado o plano e exemplos comentados a partir dos guias e código atual; nenhuma funcionalidade do módulo implementada e nenhuma biblioteca instalada. Aprendizado central: seleção de perfil, documento persistido e revisão de entidade têm responsabilidades distintas. Decisões pendentes: contrato dos campos, política de revisões e geração de IDs. Testes nativos não executados. Próximo exercício: sessão 1, confirmar o contrato mínimo do talhão.

Verificações desta entrega documental: `npm run lint` passou (saída 0). `npm run typecheck` falhou (saída 1) com TS7016 em `eslint.config.js:3`, por ausência de declaração para `eslint-config-expo/flat` na árvore presente durante a execução. Esse bloqueio precisa ser resolvido em atividade própria; nenhuma instalação ou correção de configuração foi feita neste planejamento. `git diff --check` não apontou erros de espaços nas alterações rastreadas. Os exemplos são material de estudo e não foram incorporados ao aplicativo; lint e typecheck do projeto não os validam automaticamente.

## Referências para acompanhar as sessões

- [Guia do projeto](GUIA.md), módulo 4; [contexto do produto](CONTEXT.md); [guia visual](GUIA-VISUAL.md).
- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), correspondente à versão declarada no projeto.
- [Índice oficial Expo](https://docs.expo.dev/llms.txt), consultado antes das orientações de integração.
- [MMKV — documentação oficial](https://github.com/margelo/react-native-mmkv): inicialização, leitura e escrita síncronas e armazenamento de objetos como JSON. Conferir também os tipos da versão instalada ao implementar.

Referências externas consultadas em 28/10/2026. As escolhas de contrato e arquitetura deste plano são propostas para este projeto, não exigências dessas bibliotecas.
