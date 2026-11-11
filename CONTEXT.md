# cultiva-e — contexto do produto

Revisado em 11/11/2026. Este arquivo registra decisões de produto e pendências; consulte o código e o [guia de aprendizagem](GUIA.md) para verificar implementação e progresso.

Este documento reúne decisões do responsável pelo produto. Requisito aprovado não significa funcionalidade implementada. Consulte o [acordo de trabalho](AGENTS.md), a [trilha de aprendizagem](GUIA.md) e o [guia visual](GUIA-VISUAL.md).

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
| Interface | React Native Paper, tema em `src/theme/theme.ts` e padrões do guia visual. Novas instalações exigem autorização. |
| Etapa local | Perfil por e-mail normalizado, sem senha, sem comprovação de identidade e sem autorização remota. Informar essa limitação no acesso. |
| Persistência local | MMKV aprovado; exige compilação Android própria e não está incluído no Expo Go. A dependência e os repositórios locais estão presentes; validar alterações no Android quando aplicável. |
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
- Talhão: nome, área em hectares e ao menos uma cultura com quantidade são obrigatórios; ano de plantio e localização são opcionais. A área aceita decimais com vírgula ou ponto na interface, deve ser finita e positiva e não tem limite fixo de casas decimais nem arredondamento automático.
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

## 6. Implementação e progresso

O repositório contém rotas em `src/app/`, domínio de talhões, contexto de perfil e repositórios locais. O repositório de talhões possui leitura, consulta por ID e criação com revisão inicial. A existência do código não comprova que o fluxo completo tenha sido testado em aparelho ou concluído.

O [GUIA.md](GUIA.md) organiza os módulos e registra o histórico de aprendizagem. Seus registros datados são retratos das atividades, não necessariamente do estado atual. Antes de afirmar que uma etapa está concluída, confira os critérios, o código e as verificações relevantes junto ao responsável.

## 7. Decisões pendentes e momento de definição

| Pendência | Definir antes de |
| --- | --- |
| Campos e obrigatoriedade de planos, atividades e insumos | Implementar o respectivo formulário e contrato. |
| Política decimal de custos e unidades | Implementar cálculos e lançamentos. |
| Exclusão de atividade com lançamento | Disponibilizar essa operação. |
| Calendário e regras de lembretes | Implementar essas funcionalidades. |
| Limites e política de arquivos e fotos | Implementar captura e persistência de fotos. |
| Autenticação, sessão remota, segurança e autorização | Implementar acesso remoto e APIs. |
| Modelagem, índices, driver/ODM e hospedagem MongoDB | Implementar persistência do backend. |
| Contratos de sincronização e transição do perfil local para conta real | Enviar dados locais ao backend; não associar dados automaticamente apenas por coincidência de e-mail. |
| Lançamento incorreto ou rejeitado e revisões rejeitadas | Liberar os respectivos fluxos de tratamento. |
