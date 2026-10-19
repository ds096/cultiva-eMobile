# cultiva-e — contexto do produto

Atualizado em 18/10/2026. Nome canônico neste repositório: `contex.md`.

Este documento reúne decisões do responsável pelo produto. Requisito aprovado não significa funcionalidade implementada. Consulte o [acordo de trabalho](AGENTS.md), a [trilha de aprendizagem](guia.md) e o [guia visual](GUIA-VISUAL.MD).

## 1. Propósito, público e aprendizagem

O cultiva-e ajuda o produtor a organizar o planejamento e a execução de atividades por talhão, registrar custos e consultar o histórico mesmo em locais sem conexão, após a preparação necessária para uso offline.

Problemas atendidos:

- Registros dispersos em cadernos, planilhas e mensagens.
- Dificuldade de planejar e acompanhar atividades por talhão.
- Esquecimento de tarefas e execução fora do período previsto.
- Ausência de histórico organizado sobre o que foi feito, quando e com quais custos.
- Dificuldade de consultar e registrar informações sem conexão.

A interface deve favorecer registros rápidos, compreensíveis e com poucos passos. Não exigir informações sem utilidade clara nem transformar o primeiro uso em cadastro extenso. O perfil inicial é o produtor, que acessa apenas os próprios registros. Não incluir cadastro de propriedades ou perfis adicionais nesta versão.

Este é o primeiro aplicativo do responsável. A reconstrução também é uma trilha de aprendizagem: ele escreve o código, o agente orienta e revisa, uma pequena atividade por vez. O tema já foi validado pelo responsável e deve ser preservado.

## 2. Decisões técnicas aprovadas

| Tema | Decisão e limite |
| --- | --- |
| Aplicativo | React Native com Expo; plataforma inicial Android. |
| Linguagem | TypeScript com verificação estrita. |
| Navegação | Expo Router; telas em `src/app/`, demais responsabilidades fora dessa pasta. |
| Interface | React Native Paper, tema em `src/theme/theme.ts` e padrões do guia visual. Instalação exige autorização. |
| Etapa local | Perfil por e-mail normalizado, sem senha, sem comprovação de identidade e sem autorização remota. Informar essa limitação no acesso. |
| Persistência local | MMKV aprovado; exige compilação Android própria e não está incluído no Expo Go. Instalação e funcionamento ainda não comprovados neste repositório. |
| Backend | Futuro backend próprio com Node.js, TypeScript e Fastify; responsável pelas validações definitivas e autorização. |
| Banco remoto | MongoDB; modelagem física, índices, driver/ODM e hospedagem pendentes. |
| Autenticação definitiva | Solução consolidada sob controle do backend; solução específica pendente. O perfil local não a substitui. |
| Operação offline integrada | Primeiro acesso conectado; depois persistência local, fotos e sincronização posterior. Esse requisito não será simulado como autenticação na etapa local. |
| Dispositivos | Um celular por produtor como premissa; sem bloqueio de login em outro aparelho. Resolução de edições concorrentes entre vários dispositivos fora do escopo inicial. |
| Sincronização | Entre celular e backend próprio; contratos e tratamento de falhas pendentes. |
| Fotos | Arquivo persistente no celular e armazenamento de objetos no servidor. |
| Revisões | Exibir versão atual e preservar histórico das entidades editáveis. Lançamentos não são editáveis. |
| Números | Decimais no domínio com política comum, strings decimais canônicas no JSON e momento documentado de arredondamento dos totais. Detalhamento pendente. |
| Integrações | Sem APIs de terceiros no escopo inicial; a comunicação com o backend próprio continua necessária. |

A sequência aprovada é construir o fluxo local primeiro e depois autenticação, backend e sincronização. Contratos locais devem separar interface, regras e armazenamento para permitir essa evolução, sem afirmar que a integração já existe.

## 3. Funcionalidades obrigatórias e jornada

São obrigatórios: acesso, gestão de talhões, planos de manejo, importação e gestão de atividades, cadastro de insumos, lançamento único, histórico e consulta sem edição, fotos, operação offline, sincronização, calendário e lembretes. Calendário e lembretes foram confirmados nesta conversa; suas regras específicas ainda precisam ser definidas.

Jornada da versão integrada:

1. O produtor realiza o primeiro acesso conectado, com autenticação definitiva.
2. Encontra talhões e planos vazios, com orientação para criar seus próprios cadastros.
3. Cadastra um talhão e cria um plano com atividades e datas previstas.
4. Importa o plano para um ou mais talhões ou cria atividades diretamente no talhão.
5. Consulta o planejamento e o calendário, identifica atividades em aberto ou atrasadas e faz ajustes permitidos. Recebe lembretes conforme regras a definir.
6. Cadastra insumos antes de selecioná-los em um lançamento, quando houver uso de insumos.
7. Registra a execução em lançamento único, com custos, insumos, observações e fotos aplicáveis.
8. Consulta histórico e detalhes do lançamento, sem opção de editar.
9. Sem conexão, os registros ficam persistidos localmente e indicados como pendentes até serem aceitos pelo backend. Fotos podem ter envio pendente separado.

Na etapa de aprendizagem local, o primeiro passo é selecionar um perfil por e-mail. Não apresentar essa seleção como autenticação, nem exibir confirmação de sincronização sem backend. Não inserir dados fictícios em perfis reais.

## 4. Regras de negócio

### Talhões e acesso

- Permitir cadastrar, consultar e editar talhões.
- Cada produtor acessa apenas os próprios registros, fotos e revisões na versão autenticada. Separação local por e-mail não equivale a uma barreira de segurança.
- Definir campos e obrigatoriedade no contrato antes de implementar o cadastro; não transformar sugestões antigas em exigências.
- Preservar revisões das entidades editáveis e apresentar a versão atual.

### Planos e atividades

- Planos são criados pelo produtor; não existem planos padrão fornecidos pelo sistema.
- Um plano pode ser usado em vários talhões. A importação cria cópias independentes das atividades; alterações posteriores no plano não modificam cópias existentes.
- Preservar referência de origem quando útil, sem substituir a cópia por referência mutável.
- Permitir criar atividades diretamente no talhão, editar e excluir atividades planejadas, inclusive importadas.
- Situações de negócio: **Em aberto** e **Concluída**. Apresentar **Atrasada** quando a data final prevista passou e a atividade não está concluída. Não criar situação “Iniciada”.
- A data final prevista não pode anteceder a inicial.
- Datas planejadas e de execução são datas de calendário; instantes de auditoria e sincronização são conceitos separados para evitar mudança de dia por fuso horário.
- A regra para excluir atividade que possui lançamento está pendente. Não apagar lançamento ou histórico em cascata.
- Repetir tecnicamente uma importação não pode duplicar atividades. Nova importação intencional deve ser distinguida de reenvio.

### Lançamentos

- Uma atividade admite somente um lançamento, inclusive com duplo toque, reenvios ou requisições simultâneas do mesmo celular. Registrar a execução conclui a atividade.
- Campos previstos: data de execução, observações, insumos usados, quantidade de cada insumo, valor total da mão de obra, outros custos, custo total e fotos.
- Nem todo lançamento utiliza insumos, fotos ou gastos. Não tornar todos os campos obrigatórios sem regra definida.
- O formulário pode ser ajustado antes de salvar. Eventual rascunho não é lançamento salvo e não está automaticamente incluído no escopo.
- Após salvamento local, o lançamento é imutável, mesmo antes da sincronização. Não criar tela, ação, caso de uso ou endpoint para editar seus dados de negócio.
- Consultar detalhes pelo histórico do talhão. Preservar conteúdo original e auditoria de criação e sincronização.
- Atualizar estado de envio ou associar resultado do upload de foto já prevista não altera os dados de negócio. Reenvio técnico mantém o conteúdo original.
- O tratamento de lançamento salvo incorretamente ou rejeitado pelo backend está pendente. Não convertê-lo em edição, exclusão ou substituição automática.

### Insumos, quantidades e custos

- Cadastrar identificação, quantidade, unidade de medida e custo total da aquisição. Cada nova aquisição é um novo cadastro.
- Não implementar baixa automática, saldo disponível ou bloqueio por estoque calculado.
- O produtor marca manualmente o insumo como esgotado; ele deixa de estar disponível para novas utilizações.
- Manter insumos esgotados e seus valores nos lançamentos anteriores, sem modificar o histórico.
- Quantidade cadastrada maior que zero; quantidades utilizadas positivas; custos não negativos; unidades compatíveis.
- Não presumir conversão automática entre unidades incompatíveis.
- Definir precisão, normalização, cálculos, arredondamento e representação de valores ausentes antes de implementar cálculos. A política detalhada mencionada no material anterior não foi fornecida integralmente nesta conversa.

### Calendário e lembretes

- Ambos fazem parte da versão planejada. Construir consulta do planejamento no calendário e notificações locais na etapa local.
- Definir antes da implementação quais datas aparecem, filtros, ações, horários, antecedência, repetição, cancelamento e reagendamento.
- Tratar ausência ou revogação de permissão e falhas de agendamento sem impedir salvar os registros. O comportamento específico será acordado no módulo.
- Não concluir, alterar ou excluir atividades apenas porque um lembrete foi exibido.

## 5. Experiência e qualidade

Interface em português, simples para uso no campo, com tons verdes, fundos claros e tipografia legível. Usar os tokens aprovados; não substituir a paleta pela padrão da biblioteca. Manter áreas de toque confortáveis, termos consistentes, suporte a teclado, telas estreitas e fontes ampliadas.

Cada funcionalidade deve contemplar os estados aplicáveis: carregamento, vazio, erro, validação, salvamento local, sincronização pendente e rejeição. Situação da atividade e estado de envio são informações diferentes. Distinguir falha de conexão de rejeição pelo servidor, e registro aceito de foto ainda pendente.

## 6. Estado observado em 18/10/2026

Esta é uma inspeção do repositório, não comprovação de funcionamento do aplicativo:

- `package.json` declara Expo `~58.0.14`, React Native `0.88.0` e Expo Router `~58.0.23`; `tsconfig.json` habilita `strict`. Existe `package-lock.json`; não foi encontrado `bun.lock`.
- [src/theme/theme.ts](src/theme/theme.ts) existe e foi validado pelo responsável. A verificação técnica do projeto ainda encontra dependência ausente; isso não revoga a validação visual declarada.
- Na conferência final, o único arquivo encontrado sob `src/` foi o tema. Não há telas, layout ou provedor de estado presentes. A estrutura inicial de navegação ainda precisa ser construída em atividade acordada.
- Na inspeção inicial, `src/app/_layout.tsx` mencionava telas ausentes `index` e `plots`; `src/state/AppProvider.tsx` referenciava módulos ausentes: `components/ActionButton`, `components/ErrorMessage`, `components/Screen`, `data/mmkv`, `data/repository`, `domain/commands`, `domain/models` e `services/notifications`, sob `src/`. Ambos os arquivos deixaram de estar presentes durante esta entrega, sem alteração deles pelo agente. Essas referências são registro histórico do diagnóstico, não uma lista de arquivos que devem ser recriados automaticamente.
- `react-native-paper` é importado pelo tema, mas não consta no manifesto. `expo-crypto` era importado pelo provedor anteriormente observado e também não consta no manifesto; não há necessidade atual comprovada de instalá-lo. MMKV é uma decisão aprovada, sem dependência declarada ou implementação local correspondente encontrada. Nenhuma biblioteca foi instalada nesta entrega.
- Há alterações em andamento, incluindo remoção do layout, realocação do tema e arquivos ainda não rastreados pelo Git. Não restaurar nem remover esses arquivos automaticamente.
- O guia visual existe, mas contém referência antiga a `CONTEXT.md` e menção à imagem `assets/images/logo_plus_name.png`, ausente neste repositório. Também descreve componentes e navegação de uma entrega anterior que não estão comprovados aqui. O contexto canônico é este arquivo; o guia visual não foi alterado nesta entrega.
- Não foi encontrado `Plano.md` nesta inspeção. Decisões históricas citadas pelo responsável são registradas como fornecidas por ele, não como documento conferido.

### Verificações desta entrega documental

- Typecheck executado com o TypeScript local (`tsc --noEmit`): a primeira execução encontrou 13 diagnósticos preexistentes, incluindo os módulos ausentes acima e parâmetro `operation` implicitamente tipado como `any` no provedor então presente. Após a mudança observada na árvore de arquivos, a nova execução **falhou com um diagnóstico: `react-native-paper` ausente no import do tema**. A redução de erros decorre da remoção dos arquivos, não de correções realizadas nesta entrega documental.
- Lint: **bloqueado antes da execução**. Não há configuração ESLint na raiz nem executável local instalado. A implementação local do comando Expo foi inspecionada e tenta configurar/instalar dependências nessa situação. Não foi executada essa instalação automática.
- Esses resultados não autorizam correções de código nesta atividade. Resolver a preparação e os erros em pequenas atividades acordadas, sem declarar o aplicativo validado.

## 7. Decisões pendentes e momento de definição

| Pendência | Definir antes de |
| --- | --- |
| Preparação de lint, dependências ausentes e compilação Android | Validar as primeiras implementações; instalações dependem de autorização. |
| Campos e obrigatoriedade de talhões, planos, atividades e insumos | Implementar o respectivo formulário e contrato. |
| E-mail normalizado e ciclo de vida do perfil local | Implementar o acesso local. |
| Política decimal completa e unidades | Implementar cálculos e lançamentos. |
| Exclusão de atividade com lançamento | Disponibilizar essa operação. |
| Calendário e regras de lembretes | Implementar o módulo 10. |
| Limites e política de arquivos/fotos | Implementar captura e persistência de fotos. |
| Autenticação, sessão remota, segurança e autorização | Implementar acesso remoto e APIs. |
| Modelagem, índices, driver/ODM e hospedagem MongoDB | Implementar persistência do backend. |
| Contratos de sincronização e transição do perfil local para conta real | Enviar dados locais ao backend; não associar automaticamente dados apenas por coincidência de e-mail. |
| Lançamento incorreto ou rejeitado e revisões rejeitadas | Liberar os respectivos fluxos de tratamento. |

## 8. Progresso confirmado em 18/10/2026

- O responsável informou que concluiu o módulo 0 — Produto e diagnóstico. Essa conclusão registra a etapa de aprendizagem e diagnóstico, não o funcionamento do aplicativo.
- Confirmou que nesta primeira versão haverá apenas seleção de perfil por e-mail. Autenticação definitiva, backend e sincronização permanecem para etapas posteriores; a seleção local não comprova identidade.
- Não houve novas decisões de produto nem mudanças nas regras durante o módulo. As pendências da seção 7 continuam abertas.
- Os bloqueios de preparação não foram resolvidos. A conferência do repositório confirmou que `src/` contém somente `src/theme/theme.ts`, sem telas, layout ou provedor. O tema validado permanece preservado.
- Na conferência desta atualização documental, a verificação de tipos continuou falhando apenas pela ausência de `react-native-paper`. O lint permaneceu bloqueado por falta de executável local e configuração; nenhuma instalação ou alteração de código foi realizada.

O próximo passo de aprendizagem é a atividade 1.1 — Ler TypeScript, do [guia](guia.md). A preparação da base executável será tratada nas atividades acordadas do módulo 1, com autorização prévia para instalações.
