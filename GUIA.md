# cultiva-eV2 — guia de aprendizagem e implementação

## Como usar esta trilha

### Progresso da atividade 4.3.1 e próximas telas — 05/11/2026

- Atividade documental: o responsável confirmou a conclusão da **4.3.1**. O módulo 4 permanece em andamento; a criação em `createPlot` será desenvolvida na atividade 4.3.2. A tela `[id]` fica adiada para a atividade 9.3, pois apresentará o histórico das atividades realizadas no talhão, após a implementação de atividades e lançamentos.
- Este status prevalece sobre o registro anterior “Consulta de detalhes do talhão”: aquele registro descreve uma intervenção anterior, não a conclusão da tela nem sua validação pelo responsável.
- Aprendizado: separar listagem, consulta de um registro e criação permite desenvolver e verificar uma pequena parte por vez. Concluir a 4.3.1 não conclui todo o fluxo de talhões.
- Verificações desta atualização documental: lint sem erros, com seis avisos de imports `Menu` não utilizados; typecheck bloqueado pelo TS7016 preexistente em `eslint.config.js:3`. Conferência do diff sem erros de espaços. Nenhuma tela implementada ou dependência instalada nesta atividade; testes em aparelho não realizados.
- Próximo exercício: preparar o formulário `createPlot` na atividade 4.3.2, confirmando campos, unidades e regras pendentes. A tela `[id]` será desenvolvida mais adiante, no módulo 9; não é requisito para concluir o módulo 4.

### Padronização dos nomes — 05/11/2026

- Atividade: renomeado o arquivo atual `plotsScreen.tsx` para `plots.tsx`, preservando seu conteúdo e atualizando menu, redirecionamento e registro protegido para `/plots`. Componentes de tela usam `Screen`: `PlotsScreen`, `PlotDetailsScreen`, `CreatePlotScreen`, `PlansScreen`, `CreatePlanScreen`, `CalendarScreen`, `SuppliesScreen`, `SettingsScreen` e `AccessScreen`.
- Contexto e repositório passaram a `src/context/ProfileContext.tsx` e `src/repositories/profileRepository.ts`, com símbolos e imports correspondentes atualizados. As strings persistidas `cultiva-e-perfil` e `perfil.email` foram preservadas.
- Aprendizado: o arquivo define o endereço no Expo Router; o nome do componente identifica a tela no código. Renomear símbolos não exige renomear chaves de armazenamento. Os nomes antigos nos registros datados abaixo descrevem o estado daquela entrega.
- Verificações: lint sem erros, com seis avisos preexistentes de `Menu` não utilizado; typecheck continua bloqueado apenas pelo TS7016 em `eslint.config.js:3`. Conferência das referências em `src` não encontrou nomes antigos; `git diff --check` sem erros. Nenhuma dependência instalada.
- Próximo exercício: conferir entrada, menu Talhões e detalhes no Android após as renomeações. Teste em aparelho continua pendente; esta atividade não conclui o módulo 4.

### Consulta de detalhes do talhão — 05/11/2026

- Atividade 4.3: implementada `src/app/plot/[id].tsx`, com `useLocalSearchParams`, perfil de `useProfile` e consulta `plotRepository.findById(email, id)`. O método foi acrescentado reutilizando `list`, preservando validação, separação por perfil e propagação de falhas.
- Aprendizado: a rota transporta apenas a identidade; `getCurrentRevision` seleciona a última revisão na ordem do histórico, conforme o domínio existente. A tela mostra nome, área, culturas com quantidades e, quando presentes, ano e coordenadas, incluindo zero. A unidade da área não foi presumida, pois não está definida no contrato atual.
- Interface: consulta ao receber foco, carregamento, não encontrado e erro com nova tentativa; tema compartilhado, rolagem e áreas seguras. Não há escrita de dados ou histórico nesta atividade.
- Navegação: detalhes incluídos em `Stack.Protected` com perfil selecionado. Referências à antiga rota `plots` foram alinhadas ao arquivo atual `plotsScreen.tsx`, preservando sua renomeação em andamento. Removido o import inexistente `rout` da lista. A proteção é local e não comprova identidade nem autoriza acesso remoto.
- Verificações: lint terminou com zero erros e seis avisos preexistentes de `Menu` não utilizado. Typecheck encontrou somente o TS7016 preexistente em `eslint.config.js:3`. Nove verificações isoladas em memória passaram, cobrindo ausência, revisão atual, coordenada zero, opcionais ausentes, id inexistente, separação por perfil, preservação do documento, JSON inválido e falha de leitura. Nenhuma dependência instalada ou dado real alterado.
- Bloqueios e próximo exercício: resolver o diagnóstico de tipos em atividade própria; conectar o botão da lista aos detalhes e conferir em Android a consulta, retorno, acesso direto sem perfil, fonte ampliada e TalkBack. A lista atual ainda exibe somente nomes. Validação visual e MMKV real não realizados; módulo 4 continua pendente.
- Referências consultadas: [parâmetros de rota](https://docs.expo.dev/router/reference/url-parameters/) e [rotas protegidas](https://docs.expo.dev/router/advanced/protected/) do Expo Router, após conferir o SDK 58 instalado.

### Leitura validada dos talhões — 02/11/2026

- Atividade 4.2: atualizado `src/repositories/plotRepository.ts`, mantido como `.ts` porque não contém JSX. Preservados a instância `cultiva-e-talhoes`, as chaves por e-mail e o padrão de inicialização sob demanda do `perfilRepository`; a seleção de perfil continua separada dos documentos de talhões.
- Aprendizado: `readRaw` lê texto; somente chave ausente retorna lista vazia. `JSON.parse` verifica sintaxe, enquanto as verificações seguintes conferem documento, `schemaVersion: 1`, lista, perfil normalizado, identidade e todas as revisões. Objetos tipados são construídos após validar os campos, sem `as Plot[]`.
- Dados de cada revisão seguem o contrato atual de `normalizePlotInput`, inclusive a exigência atual de ao menos uma cultura (o registro de 30/10 descreve uma versão anterior). A leitura valida sem reescrever textos históricos, ordenar revisões, gravar ou apagar dados. Versão da revisão deve ser inteiro positivo seguro e `savedAt` uma string interpretável como data.
- Verificações: 28 cenários em memória passaram, incluindo ausência, documento vazio válido, normalização de e-mail, JSON inválido, perfil divergente, revisões e dados inválidos, opcionais válidos e falha de leitura. MMKV real e aparelho não foram acessados. Lint: zero erros e sete avisos preexistentes de `Menu` não utilizado. Typecheck: bloqueado pelo TS7016 preexistente em `eslint.config.js:3`, sem diagnóstico no arquivo alterado.
- Próximo exercício: acompanhar um documento válido e outro inválido pelas etapas de `list()`. Gravação e integração com telas continuam para atividades posteriores; o módulo 4 não está concluído.
- Complemento de 02/11/2026: comentários do repositório ampliados a pedido do responsável, explicando `unknown`, refinamento de tipos, `ReturnType`, `map`, opcionais, propagação de erros e a diferença entre estrutura e regra de negócio. Apenas comentários alterados; próximo exercício e bloqueio de TypeScript permanecem os mesmos.

### Contrato e validações de talhões — 30/10/2026

- Atividade 4.1: preenchido `src/domain/plot.ts`, que estava vazio, com os tipos da aula (`Crop`, `Coordinates`, `PlotInput`, `PlotRevision` e `Plot`) e funções de validação. Nome, área e lista de culturas são obrigatórios; ano e localização são opcionais. Dados editáveis permanecem dentro das revisões.
- Regras: nomes recebem `trim` e não podem ficar vazios; área finita positiva; quantidade inteira positiva por cultura; coordenadas finitas nos limites inclusivos de latitude e longitude. Ano, se informado, é inteiro positivo seguro; nenhum limite histórico ou bloqueio de ano futuro foi definido. Lista vazia e culturas repetidas continuam permitidas, sem deduplicação.
- Aprendizado: tipos descrevem o contrato; validadores verificam valores durante a execução e lançam erros. `normalizePlotInput` combina as regras e devolve cópias sem modificar a entrada. `getCurrentRevision` consulta a última revisão e rejeita histórico vazio; não cria nem altera revisões. Essas funções recebem dados tipados, não substituem um futuro leitor de JSON externo.
- Verificações: cenários executados em memória passaram, incluindo `NaN`, infinitos, zero, negativos, frações, nomes vazios, limites geográficos, opcionais ausentes, culturas repetidas e entradas congeladas. Lint: zero erros e sete avisos de imports `Menu` não utilizados em telas existentes. Typecheck: falhou somente com o TS7016 já registrado em `eslint.config.js:3` (`eslint-config-expo/flat` sem declaração de tipos).
- Nenhuma biblioteca instalada ou dado de perfil gravado. Próximo exercício: acompanhar uma entrada válida e outra inválida por `normalizePlotInput` antes de integrar cadastro e persistência. O módulo 4 não está concluído.

### Correção da tela de acesso e destino de Continuar — 29/10/2026

- Atividade: logo fixa fora da rolagem, próxima ao topo e com margens laterais de 16. Largura calculada pela tela e áreas seguras, limitada à largura do formulário; altura explicitamente igual a um terço da largura. Textos, campo de e-mail e botão ficam logo abaixo. A tela agora protege a área segura superior, pois o cabeçalho nativo está oculto.
- Diagnóstico e aprendizado: no emulador 1080 × 2400, a área da imagem ocupava 1424 pixels de altura, apesar da intenção de proporção 3:1. Dimensões explícitas reduziram essa área para 332 pixels. O emulador também precisava de recarga para aplicar os arquivos atuais. Imagem local e `resizeMode="contain"` não substituem a definição do espaço ocupado no layout.
- Navegação: o botão mantém a validação e salva pelo contexto. O grupo de acesso usa `redirectTo="/plots"` quando existe perfil selecionado; a saída retorna a `/`. O destino fica explícito no layout, sem depender da ordem das telas nem navegar antes da atualização do contexto.
- Verificações: teste no emulador confirmou logo em `[42,105][1038,437]`, campo e botão visíveis sem rolagem, validação de e-mail vazio, seleção de um perfil de teste isolado seguida de abertura de “Meus talhões” e saída de volta ao acesso com campo vazio. Durante a digitação, a posição da logo permaneceu fixa. O perfil de teste foi encerrado; nenhum cadastro de produção foi criado.
- Lint passou. Typecheck continua com apenas o erro preexistente TS7016 em `eslint.config.js:3`. Nenhuma biblioteca instalada ou alteração nativa nesta atividade. Sem validação de iOS/TalkBack; próximo exercício: conferir o fluxo no celular e com fonte ampliada.
- Referência: [redirecionamento explícito de rotas protegidas no Expo SDK 58](https://docs.expo.dev/router/advanced/protected/#redirect-to-a-specific-route).

### Logo, espaço da tela de acesso e abertura nativa — 28/10/2026

- Atividade: a tela de acesso usa `assets/logo_plus_name.png` na proporção original de 3:1, com largura máxima de 320. O formulário começa próximo ao topo; o título que repetia o nome da logo foi removido e a mensagem de erro só ocupa espaço quando existe. Rolagem, teclado e ampliação de fonte foram preservados.
- Caminhos conferidos: as imagens estão em `assets/` na raiz; não existe `src/assets/`. `app.json` usa `assets/icon.png` como ícone instalado e `assets/logo_plus_name.png` como imagem da abertura, com fundo `#F7FAF7`, largura 200 e ajuste `contain`.
- Preparação autorizada: instalado `expo-splash-screen` `~58.0.12` via Expo. A primeira tentativa falhou por restrição de rede; a instalação com acesso à rede concluiu. O npm também atualizou dependências transitivas exigidas pelo pacote.
- Aprendizado: alterações na interface podem aparecer ao recarregar o app conectado ao servidor de desenvolvimento. Ícone e splash pertencem à aplicação nativa e exigem aplicar a configuração com Prebuild e compilar/instalar novamente. `npx expo run:android` realiza essa build local; não é necessário usar EAS para esse teste.
- Verificações: lint passou; typecheck encontrou somente o TS7016 preexistente em `eslint.config.js:3`. A verificação Expo do pacote passou usando o mapa local de versões, sem consulta online; `npm ls --all --omit=dev` terminou sem conflitos. Prebuild Android concluído com `--no-install`; o comando regenerou a pasta nativa. A integração do splash, as imagens geradas, a identidade Android e a configuração CMake 4.1.2 foram conferidas.
- Limites: compilação e instalação não executadas nesta atividade. A conexão com o emulador não pôde ser verificada porque o serviço ADB não iniciou no ambiente restrito. O npm reportou 9 vulnerabilidades (5 baixas, 4 altas); nenhuma correção automática de auditoria foi aplicada.
- Próximo exercício: executar `npx expo run:android`, conferir a tela de acesso com teclado e fonte ampliada e observar o novo ícone. Para validar a abertura final, usar uma build release, por exemplo `npx expo run:android --variant release`, pois builds de desenvolvimento podem mostrar a abertura de forma diferente.
- Referências: [SplashScreen no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen/) e [compilação local com Expo CLI](https://docs.expo.dev/more/expo-cli/#compiling-android).

### Telas provisórias do menu — 28/10/2026

- Atividade: criadas as rotas `calendar`, `supplies`, `plans` e `settings`, contendo somente “Tela em desenvolvimento” centralizado e o menu inferior. O menu agora abre essas telas e destaca a rota ativa. Talhões mantém seu conteúdo existente.
- Ajuste de nomenclatura solicitado em 28/10/2026: Insumos usa o arquivo `supplies.tsx`, o componente `Supplies` e a rota `/supplies`, substituindo `inputs`. As referências do menu e do layout foram atualizadas em conjunto.
- Aprendizado: cada arquivo de tela em `src/app/` define uma rota. As novas telas foram incluídas no grupo que exige perfil local selecionado e tiveram o cabeçalho ocultado. Essa restrição local não equivale a autenticação remota.
- Verificações: lint passou; typecheck encontrou somente o erro preexistente TS7016 em `eslint.config.js:3`, relacionado a `eslint-config-expo/flat`. Nenhuma dependência instalada. Navegação e aparência em aparelho ainda não verificadas.
- Próximo exercício: abrir cada opção, conferir o destaque do menu e o botão Voltar no Android, incluindo fonte ampliada. As funcionalidades dos módulos continuam pendentes.

### Ícone na tela de acesso — 28/10/2026

- Atividade: adicionado `assets/icon.png` acima do título em `src/app/index.tsx`, centralizado, com largura máxima de 160, proporção quadrada e descrição acessível.
- Aprendizado: `Image` com recurso local inclui a imagem no aplicativo; `contain` preserva seu conteúdo sem recortar. Nenhuma dependência adicionada.
- Verificações: lint passou; typecheck continua bloqueado pelo TS7016 em `eslint.config.js:3`, sem diagnóstico na tela alterada. Validação visual em aparelho pendente.
- Próximo exercício: conferir o ícone e o acesso ao formulário com teclado aberto em tela estreita.

### Ajuste do nome instalado — 28/10/2026

- Atividade: alterado `expo.name` em `app.json` de `MeuProjeto` para `cultiva-e`, conforme solicitado. Identificador Android preservado como `com.daniels096.MeuProjeto`.
- Aprendizado: `expo.name` define o nome visível; renomear o arquivo APK não altera esse rótulo. A mudança exige nova compilação e instalação.
- Verificações: Expo Prebuild Android executado com `--no-install`; `app_name` gerado confirmado como `cultiva-e` e configuração CMake 4.1.2 preservada. Lint passou. Typecheck falhou em `eslint.config.js:3` com TS7016, por ausência de declaração de tipos para `eslint-config-expo/flat`, fora do ajuste de nome.
- Pendência e próximo exercício: gerar um novo APK pelo fluxo de compilação utilizado e conferir o nome no instalador e abaixo do ícone no celular. APK e teste em aparelho não realizados nesta atividade. Nenhuma dependência instalada.
- Referência: [configuração do Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/config/app/#name).

Você escreve o código; o agente explica, propõe uma atividade pequena e revisa seu resultado. Peça implementação pelo agente somente quando desejar essa ajuda. Todo código novo ou alterado, inclusive exemplos, deve ter comentários explicativos. Nenhuma biblioteca será instalada sem sua autorização.

A primeira tela vista pelo produtor é a de acesso, mas a construção começa por entender o problema e preparar a base que sustenta essa tela. Vamos desenvolver o fluxo local primeiro; autenticação definitiva, backend e sincronização vêm depois. “Local primeiro” não significa que essas partes remotas sejam opcionais.

Cada atividade segue este ciclo:

1. Entender o problema e explicar o conceito envolvido.
2. Definir entradas, resultado esperado e regras ainda pendentes.
3. Implementar apenas uma pequena parte, com comentários.
4. Verificar o comportamento e executar as verificações disponíveis.
5. Revisar o resultado, explicar com suas palavras e registrar o progresso.

Um módulo agrupa várias atividades; não é uma tarefa para executar de uma vez. Se uma atividade ficar grande, dividi-la antes de começar. Usar dados de teste separados de perfis reais. Não avançar sobre decisões de produto ainda abertas nem confundir demonstração temporária com funcionalidade pronta.

## Mapa e progresso

**Base já validada pelo responsável:** `src/theme/theme.ts`. Essa validação não conclui o módulo de interface nem garante compilação do aplicativo.

| Módulo                       | Resultado principal                                    | Estado                                               |
| ---------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| 0. Produto e diagnóstico     | Entender o produto e a situação real do projeto        | Concluído pelo responsável em 18/10/2026             |
| 1. Fundamentos e estrutura   | Compreender responsabilidades e fluxo de dados         | Concluído pelo responsável; confirmado em 23/10/2026 |
| 2. Base visual e navegação   | Preparar componentes e caminhos entre telas            | Concluído pelo responsável; confirmado em 23/10/2026 |
| 3. Acesso por perfil local   | Selecionar e restaurar um perfil local                 | Concluído por decisão do responsável em 28/10/2026   |
| 4. Persistência e talhões    | Manter cadastros e revisões no dispositivo             | Em andamento; 4.3.1 concluída pelo responsável em 05/11/2026; detalhes e criação pendentes |
| 5. Planos de manejo          | Criar modelos próprios de atividades                   | Pendente                                             |
| 6. Atividades dos talhões    | Importar cópias e organizar o planejamento             | Pendente                                             |
| 7. Insumos e cálculos        | Cadastrar aquisições e definir cálculos confiáveis     | Pendente                                             |
| 8. Lançamento único          | Registrar execução uma única vez, sem edição posterior | Pendente                                             |
| 9. Fotos e histórico         | Preservar fotos e consultar o que foi realizado        | Pendente                                             |
| 10. Calendário e lembretes   | Consultar a agenda e receber notificações locais       | Pendente                                             |
| 11. Backend e autenticação   | Identificar o produtor e proteger seus dados remotos   | Pendente                                             |
| 12. Sincronização            | Enviar e reconciliar dados e fotos com segurança       | Pendente                                             |
| 13. Qualidade e distribuição | Validar e distribuir a versão Android                  | Pendente                                             |

As tecnologias já aprovadas não precisam ser escolhidas novamente. Decisões detalhadas pendentes devem ser resolvidas antes da atividade que depende delas. A arquitetura crescerá com necessidades concretas, sem construir todas as camadas antecipadamente.

**Atualização de 23/10/2026:** o responsável confirmou a conclusão do módulo 2 e das etapas anteriores à 3.5, que está em andamento. Esse progresso de aprendizagem não elimina os problemas encontrados na inspeção atual. Os diagnósticos datados ao final deste guia são históricos; a estrutura atual está descrita abaixo.

## Estrutura e fluxo de dados atuais — 23/10/2026

| Arquivo em `src/`                  | Responsabilidade atual                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `app/_layout.tsx`                  | Aplica o tema com `PaperProvider` e monta `ProfileProvider` e `Navigation`, com as rotas `index` e `plots`.   |
| `app/index.tsx`                    | Tela `Access`: entrada de e-mail, validação, gravação e solicitação de navegação.                             |
| `app/plots.tsx`                    | Tela temporária `Plots`, com título e ação de saída; ainda não cadastra talhões.                              |
| `components/AppButton.tsx`         | Botão compartilhado baseado no Paper, com propriedades de carregamento e desabilitação.                       |
| `context/PerfilContext.tsx`        | Estado compartilhado do e-mail, `ProfileProvider`, `useProfile`, `selectProfile` e `clearProfile`.            |
| `repositories/perfilRepository.ts` | Encapsula leitura, gravação e remoção da seleção no MMKV.                                                     |
| `utilities/email.ts`               | `normalizeEmail` remove espaços externos e converte para minúsculas; `validateEmail` verifica formato básico. |
| `theme/theme.ts`                   | Centraliza tokens e configuração visual do Paper.                                                             |

A entrada ativa declarada no `package.json` é `expo-router/entry`. O `index.js` da raiz permanece no projeto, mas não é a entrada declarada. MMKV e Nitro Modules já constam nas dependências, ao contrário do estado registrado após o reinício de 19/10. Nesta atividade não houve instalação ou comprovação de funcionamento nativo em aparelho.

**Contrato persistido atual:** a instância MMKV usa o identificador `cultiva-e-perfil`; a chave `perfil.email` guarda uma única string de e-mail selecionado. `save(email)` grava, `get()` declara retorno `string | undefined | null` e `remove()` apaga essa seleção. Ainda não há entidades, listas ou revisões de talhões, planos, atividades e lançamentos. A seleção local não comprova identidade nem fornece autorização remota.

**Memória e disco:** o contexto inicializa seu estado lendo o repositório; suas operações atualizam disco e estado React. Entretanto, as telas ainda chamam o repositório diretamente, sem chamar essas operações. Portanto, salvar ou remover a seleção pela tela não atualiza automaticamente o e-mail observado pela navegação. O fluxo a consolidar na etapa 3.5 é tela → contexto → repositório → MMKV, com o contexto refletindo a seleção em memória para a navegação.

**Nomes das funções:** identificadores de funções e componentes em inglês; textos da interface e comentários em português. Nesta atualização: `Acesso` → `Access`, `Navegacao` → `Navigation`, `PerfilProvider` → `ProfileProvider`, `usePerfil` → `useProfile`, `entrar` → `selectProfile`, `sair` → `clearProfile`, `handleContinuar` → `handleContinue`, `handleSair` → `handleExit`, `normalizarEmail` → `normalizeEmail` e `validarEmail` → `validateEmail`. Arquivos, tipos, variáveis e chaves persistidas não foram renomeados; mudar uma chave persistida exigiria tratar os dados existentes.

**Avaliação estrutural e atualização dos ajustes em 23/10/2026:**

- A separação entre rotas, componentes, contexto, repositório, utilitários e tema é adequada ao tamanho atual. Não há necessidade imediata de criar novas camadas.
- Corrigido: o layout agora declara `plots`, correspondendo ao arquivo `plots.tsx`, e mantém o título “Meus Talhões”.
- O acesso e a saída modificam diretamente o repositório, deixando o contexto desatualizado. Resolver essa integração durante a etapa 3.5; a saída completa pertence à 3.6.
- A leitura inicial do MMKV no contexto e na tela não trata falhas. Definir recuperação e mensagem de erro antes de concluir a restauração.
- O contexto promete `email: string | null`, mas o estado também admite `undefined`: há erro de tipos a resolver definindo um contrato único para ausência de seleção.
- Corrigido: `PaperProvider` envolve o provedor de perfil e a navegação, recebendo `theme`. Isso aplica o tema aos componentes Paper; a tela de acesso ainda usa componentes nativos com cores e medidas próprias e não explica a limitação do perfil local.
- Teclado, áreas seguras, fonte ampliada e TalkBack precisam de validação em aparelho; a inspeção não comprova esses critérios. O botão compartilhado ainda não aplica explicitamente as medidas mínimas do guia.

Referências consultadas: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) e [rotas protegidas do Expo Router](https://docs.expo.dev/router/advanced/protected/). As restrições de navegação são locais e não equivalem a autorização em servidor.

## Módulo 0 — Produto e diagnóstico

**Objetivo:** compreender o que será construído e separar intenção de implementação.

**Funcionalidades:** mapear a jornada do produtor, do acesso ao histórico, e os estados sem conexão.

**Conceitos:** requisito, regra de negócio, escopo, critério de aceitação e evidência de funcionamento.

**Pré-requisitos:** leitura do contexto e acesso ao repositório; nenhuma instalação.

**Pequenas atividades:**

1. **0.1 — Explicar a jornada:** escrever com suas palavras como um produtor cadastra um talhão, planeja uma atividade e registra sua execução. Distinguir perfil local de conta autenticada.
2. **0.2 — Ler o projeto:** localizar manifesto, configuração e tema; verificar a ausência atual de layout, telas e provedor e entender para que servirão, sem criá-los ainda.
3. **0.3 — Conferir limites:** revisar obrigatórios, exclusões e decisões pendentes do contexto; registrar dúvidas específicas.
4. **0.4 — Planejar a preparação:** listar bloqueios de compilação e lint e combinar pequenas correções futuras. Solicitar autorização antes de qualquer instalação.

**Critérios de conclusão:** conseguir descrever a jornada, apontar os bloqueios reais e explicar por que código existente não é prova de funcionamento. Nenhum requisito novo criado por suposição.

**Perguntas de revisão:** qual problema cada funcionalidade resolve? O que está aprovado e o que foi testado? Por que selecionar um e-mail não autentica alguém?

## Módulo 1 — Fundamentos e estrutura

**Objetivo:** entender como a interface conversa com regras e armazenamento.

**Funcionalidades:** preparar a estrutura mínima que permitirá construir telas e acrescentar estado compartilhado quando necessário.

**Conceitos:** componente, propriedades, estado, evento, renderização, tipos, função assíncrona e separação de responsabilidades. Repositório é a interface usada para ler e salvar dados; não é a tela nem necessariamente o banco remoto.

**Pré-requisitos:** módulo 0 revisado e autorização para qualquer mudança de código acordada.

**Pequenas atividades:**

1. **1.1 — Ler TypeScript:** explicar tipos de entrada e saída, valores opcionais e erros; manter `strict` habilitado.
2. **1.2 — Ler React:** identificar propriedades, estado e eventos em um exemplo pequeno comentado.
3. **1.3 — Desenhar o fluxo:** representar tela → operação de negócio → repositório, distinguindo estado em memória de dado persistido.
4. **1.4 — Preparar a base executável:** resolver em tarefas separadas os pré-requisitos que impedem a inicialização. Preservar trabalho existente e preparar somente a estrutura necessária à primeira tela, sem recriar automaticamente o antigo provedor.

**Critérios de conclusão:** explicar onde fica cada responsabilidade e iniciar uma base mínima após resolver seus bloqueios autorizados. Registrar resultados reais do lint e typecheck, inclusive impedimentos.

**Perguntas de revisão:** quando uma mudança de estado redesenha a tela? Por que um componente não deveria concentrar apresentação, cálculo e acesso ao disco?

## Módulo 2 — Base visual e navegação

**Estado:** concluído pelo responsável, confirmado em 23/10/2026. Pendências técnicas observadas na árvore atual estão registradas na avaliação acima.

**Objetivo:** aplicar o tema existente e preparar uma interface consistente.

**Funcionalidades:** estrutura de tela, campo, botão, mensagem de erro e navegação inicial.

**Conceitos:** tokens visuais, composição, provedor de tema, layout de rotas, acessibilidade e áreas seguras.

**Pré-requisitos:** módulo 1; leitura do guia visual; consultar a documentação correspondente ao Expo instalado antes de tocar em APIs. Paper já foi escolhido, mas sua instalação depende de autorização.

**Pequenas atividades:**

1. **2.1 — Ler o tema validado:** identificar cores semânticas, tamanhos e tipografia sem reescrevê-los.
2. **2.2 — Ligar a base visual:** configurar apenas os provedores necessários e entender sua função.
3. **2.3 — Construir componentes:** implementar e verificar um componente compartilhado por atividade; criar abstrações somente quando houver utilidade clara.
4. **2.4 — Navegar:** criar a rota inicial necessária e compreender a função de `_layout.tsx`. Manter componentes e regras fora de `src/app/`.

**Critérios de conclusão:** tema aplicado, navegação inicial funcionando e controles utilizáveis com teclado, tela estreita e fonte ampliada. A imagem de logo citada no guia visual está ausente: resolver seu fornecimento ou apresentação acordada antes de usá-la, sem inventar uma logo aprovada.

**Perguntas de revisão:** qual diferença entre token e cor fixa na tela? O que um provedor compartilha? Por que todas as telas não devem conter seus próprios botões diferentes?

## Módulo 3 — Acesso por perfil local

**Estado em 28/10/2026:** concluído por decisão expressa do responsável. Foram solicitados somente os itens 2, 3, 4 e 6 de `PENDENCIAS-MODULO-3.md`: aviso de perfil local, tema/teclado/acessibilidade, prevenção de repetição e TypeScript estrito. Essa conclusão registra o progresso acordado; não comprova testes em aparelho. O estado vazio (item 5) e a matriz de validação funcional (item 7) ficaram fora desta implementação. Os registros de 23/10 abaixo são históricos.

**Estado em 23/10/2026:** atividades 3.1, 3.2, 3.3 e 3.4 concluídas pelo responsável; 3.5 em andamento; 3.6 pendente.

**Objetivo:** construir a primeira tela da jornada e compreender seus limites.

**Funcionalidades:** selecionar um perfil por e-mail, restaurar a seleção e sair preservando registros.

**Conceitos:** formulário controlado, normalização, validação, estado assíncrono, seleção persistida e diferença entre identificação, autenticação e autorização.

**Pré-requisitos:** módulo 2; definir normalização e validação de e-mail. Aprovar a preparação do MMKV e da compilação Android quando necessária. A implementação mínima de armazenamento do perfil começa aqui e será ampliada no módulo 4.

### O que a tela deve conter

| Elemento                 | Comportamento esperado                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Identidade               | Nome cultiva-e e apresentação conforme tema; tratar a logo ausente antes de referenciá-la.                     |
| Explicação               | Informar claramente que é um perfil salvo no dispositivo, sem senha e sem autenticação remota.                 |
| Campo de e-mail          | Rótulo visível, teclado apropriado, digitação acessível e regras de normalização acordadas.                    |
| Validação                | Identificar campo vazio ou formato inválido e explicar como corrigir; não afirmar que o e-mail foi comprovado. |
| Ação principal           | Botão “Continuar”, com prevenção de submissão repetida durante o processamento.                                |
| Carregamento             | Indicar que o perfil está sendo aberto; não deixar a tela parecer travada.                                     |
| Erros                    | Informar falha de leitura ou gravação e permitir nova tentativa, preservando o valor digitado.                 |
| Teclado e acessibilidade | Campo e botão alcançáveis com teclado aberto, rótulos acessíveis e suporte à ampliação de fonte.               |
| Destino                  | Depois de abrir o perfil, encaminhar à área de talhões; na primeira utilização, apresentar estado vazio.       |

Não incluir senha, confirmação de e-mail ou recuperação de senha nesta etapa. Um formulário de login real virá com o contrato de autenticação do módulo 11.

**Pequenas atividades:**

1. **3.1 — Esboçar a tela:** desenhar os elementos e escrever as mensagens antes de programar.
2. **3.2 — Construir o formulário:** aplicar componentes e tema; verificar teclado e acessibilidade.
3. **3.3 — Validar a entrada:** implementar as regras acordadas e explicar o que a validação comprova e o que não comprova.
4. **3.4 — Persistir a seleção:** criar o contrato mínimo de perfil e sua implementação local, sem alegar conexão com servidor.
5. **3.5 — Navegar e restaurar:** abrir a área interna após sucesso e restaurar a seleção ao reiniciar, tratando erro de leitura.
6. **3.6 — Sair:** encerrar a seleção sem apagar registros; conferir a separação entre perfis locais sem apresentá-la como segurança remota.

### Pendências obrigatórias da etapa 3.5

Tratar os pontos 2, 3 e 5 de [REVISAO-PERFIL.md](REVISAO-PERFIL.md) em pequenas atividades. Ainda não foram implementados:

- **2 — Integrar telas e contexto:** usar `selectProfile` no acesso e `clearProfile` na saída, via `useProfile`, em vez de modificar o repositório diretamente. Manter tratamento de erros e centralizar a decisão de navegação no layout. A integração da saída entra neste ajuste; a verificação completa de preservação dos registros e separação dos perfis continua na etapa 3.6.
- **3 — Tratar restauração:** centralizar a leitura no contexto, remover a leitura duplicada da tela e tratar falhas de leitura e inicialização do MMKV. Exibir erro com “Tentar novamente”, sem apagar dados ou confundir falha com ausência de perfil.
- **5 — Unificar o contrato:** usar `string | null` no estado e no retorno do repositório, convertendo resultado ausente para `null` após leitura bem-sucedida. Manter erro de leitura como estado separado; resolver o erro de TypeScript sem ocultá-lo com coerções.

**Verificação da etapa 3.5:** conferir entrada com atualização imediata do contexto, restauração após reiniciar, ausência de seleção e recuperação de falha de leitura; executar lint e typecheck. Os ajustes 1 (rota) e 4 (provedor de tema) já foram aplicados, mas não concluem esta etapa. Enquanto o ponto 2 estiver pendente, a entrada pode continuar sem abrir `plots`, pois o contexto ainda não reflete a seleção salva.

**Critérios de conclusão:** testar entrada vazia e inválida, variações normalizáveis acordadas, duplo toque, falha de armazenamento, reinício e saída. Nenhuma mensagem promete autenticação ou sincronização. O destino inicial pode ser uma tela vazia real, sem cadastros fictícios.

**Perguntas de revisão:** por que normalizar antes de identificar o perfil? O que deve persistir após fechar o app? Por que não podemos proteger uma API apenas com o e-mail enviado pelo celular?

## Módulo 4 — Persistência e talhões

**Objetivo:** construir o primeiro cadastro completo e confiável no dispositivo.

**Funcionalidades:** cadastrar, listar, consultar e editar talhões; mostrar vazios, falhas e revisões.

**Conceitos:** entidade, identificador estável, contrato de dados, repositório, persistência, revisão e recuperação de falhas.

**Pré-requisitos:** módulo 3; definir campos obrigatórios e política de revisões antes de implementar. MMKV preparado com autorização e testado na compilação Android adequada.

**Pequenas atividades:**

1. **4.1 — Definir o contrato:** acordar os dados de um talhão e exemplos de entradas válidas e inválidas.
2. **4.2 — Salvar e reler:** ampliar o repositório local sem acoplar a tela ao formato interno de armazenamento.
3. **4.3 — Cadastrar e listar:** implementar formulário e lista em atividades separadas. A consulta ao histórico em `[id]` fica para o módulo 9.
4. **4.4 — Editar com revisão:** mostrar versão atual e preservar versões anteriores; testar falha de gravação sem apagar dados.

### Etapas da atividade 4.3

**4.3.1 — Etapa concluída:** conclusão informada pelo responsável em 05/11/2026. Esse registro não inclui a conclusão das telas `[id]` e `createPlot` e não representa nova validação técnica ou em aparelho.

**4.3.2 — Criar talhão em `createPlot` — a desenvolver:**

- Conferir o contrato existente antes do formulário: obrigatoriedade, unidade e precisão da área, culturas e quantidades, ano e coordenadas opcionais. Resolver divergências e regras pendentes antes de implementar entradas ou conversões.
- Abrir a tela pela ação “Adicionar talhão” da lista. Construir campos com rótulos persistentes, indicação de opcionais, mensagens de validação e suporte a teclado, rolagem e fonte ampliada.
- Manter o preenchimento separado do registro salvo. Validar pelas regras do domínio e criar identidade estável e primeira revisão pelo fluxo de persistência, vinculadas ao perfil local ativo.
- Preparar estados de validação, salvamento e falha; preservar os valores quando houver erro e impedir cadastros duplicados por toques repetidos. Confirmar sucesso apenas após a gravação local, sem afirmar sincronização.
- Definir o destino após salvar e atualizar a lista para apresentar o novo talhão. Acordar o comportamento de Voltar ou sair com alterações não salvas, sem presumir persistência de rascunho nem perder preenchimento silenciosamente.
- Verificar entrada válida, campos inválidos, opcionais, falha de gravação, repetição de toque, saída do formulário e permanência após reiniciar o aplicativo, usando perfil de teste separado.

**Questões para `createPlot`:** quais campos são obrigatórios? Como informar unidade e aceitar valores decimais conforme o contrato? Como incluir culturas e suas quantidades? Quando um cadastro passa a existir? O que acontece se salvar falhar ou o produtor tocar duas vezes? Para onde navegar após salvar e como tratar a saída sem salvar?

**Critérios de conclusão:** formulário `createPlot` e listagem desenvolvidos e verificados; cadastros sobrevivem ao reinício, pertencem ao perfil correto e edições preservam histórico. Estados vazio, inválido, carregamento, salvamento e erro são compreensíveis. Não acrescentar cadastro de propriedades. A conclusão da 4.3.1, isoladamente, não conclui o módulo 4. A tela `[id]` não faz parte dos critérios deste módulo; será desenvolvida na atividade 9.3.

**Perguntas de revisão:** por que um nome não é um bom identificador? Como diferenciar a versão atual de uma revisão? O que ocorre se a gravação falhar?

## Módulo 5 — Menu lateral e cabeçalho compartilhado

**Estado — 05/11/2026:** opção D (menu lateral com áreas principais) escolhida pelo responsável. Planejamento atualizado; implementação e validação pendentes. Este módulo passa a tratar do menu; o cadastro de planos anteriormente descrito aqui fica pendente de replanejamento, sem alteração dos módulos subsequentes.

**Objetivo:** criar uma navegação compartilhada, com botão de menu imediatamente à esquerda do título da tela no cabeçalho fixo.

**Funcionalidades:** abrir e fechar um painel lateral, navegar entre as cinco áreas principais e indicar a área atual. O menu lateral substitui o menu inferior nas telas internas.

**Conceitos:** layout compartilhado, rotas, cabeçalho, estado de abertura, destinos principais versus ações de criação, histórico de navegação e acessibilidade.

**Pré-requisitos:** base visual e navegação dos módulos anteriores; conferir as rotas existentes e a documentação correspondente ao Expo instalado antes de implementar. Usar Expo Router e o tema compartilhado. Caso a solução exija novas dependências, apresentar a necessidade e obter autorização antes de instalar.

**Referência visual aprovada:** alternativa **D**, à direita na [imagem do menu lateral](docs/referencias/navegacao-2026-11-05/02-menu-lateral.png). O [registro do estudo](docs/referencias/navegacao-2026-11-05/REFERENCIAS.md) preserva a comparação original; sua recomendação inicial por B foi substituída pela decisão do responsável por D. A posição do botão segue a decisão abaixo, mesmo que a imagem mostre a marca no cabeçalho.

### Onde o menu aparece

| Tela ou grupo | Cabeçalho e botão do menu | Destino listado no painel |
| --- | --- | --- |
| `index` — acesso | Não exibir o menu lateral nem seu botão | Não |
| Talhões | Sim, botão imediatamente à esquerda do título | Talhões |
| Calendário | Sim, botão imediatamente à esquerda do título | Calendário |
| Insumos | Sim, botão imediatamente à esquerda do título | Insumos |
| Planos de manejo | Sim, botão imediatamente à esquerda do título | Planos de manejo |
| Configurações | Sim, botão imediatamente à esquerda do título | Configurações |
| Criação de talhão e de plano | Sim, como nas demais telas internas | Não; acessar pelos botões em Talhões e Planos |
| Detalhes, edição e demais telas internas, atuais ou futuras | Sim; única exceção de tela é `index` | Não automaticamente; manter somente as cinco áreas principais |

**Comportamento acordado:**

- O cabeçalho permanece visível durante a rolagem. Exibir o ícone de menu à esquerda e, imediatamente ao lado, o título da tela atual, como “Criar talhão”; não substituir o título apenas pelo nome do aplicativo.
- Tocar no botão abre o painel pela lateral esquerda, sobre o conteúdo, sem estreitar a tela ao fundo. Exibir os cinco destinos com ícones e rótulos completos, na ordem Talhões, Calendário, Insumos, Planos de manejo e Configurações.
- Selecionar um destino fecha o painel e navega para a área escolhida. Tocar na área já ativa fecha o painel sem duplicar a rota. Destacar a seleção também por texto/peso ou forma, não apenas pela cor; telas de criação e detalhes mantêm a indicação de sua área de origem.
- Fechar pelo botão de fechar, pelo toque fora do painel ou pelo botão Voltar do Android. Com o painel aberto, Voltar primeiro fecha o painel; com ele fechado, respeita o histórico da tela.
- Criar talhão continua acessível por “Adicionar talhão” em Talhões; Criar plano, por botão correspondente em Planos. Essas telas possuem o botão do menu, mas não são itens do painel.
- Preservar uma ação explícita de retorno nas telas secundárias sem retirar o menu nem inserir outro controle entre ele e o título. Definir sua posição na atividade 5.2. Antes de permitir sair de um formulário alterado, definir e verificar o tratamento de rascunho ou confirmação de descarte; não perder dados silenciosamente.
- Compartilhar o cabeçalho e o painel pelo layout, mantendo os componentes fora de `src/app/`. Não copiar uma implementação independente em cada tela. A seleção local de perfil continua com suas regras existentes; o menu não representa autenticação remota.
- Respeitar áreas seguras, tema claro, fonte ampliada e alvo de toque mínimo de 48 × 48. Anunciar “Abrir menu de navegação” e o estado aberto/fechado; ao abrir, levar o foco ao painel e impedir interação com o fundo; ao fechar sem navegar, devolver o foco ao botão. Permitir rolagem do painel quando os itens não couberem.

**Pequenas atividades:**

1. **5.1 — Mapear destinos e telas:** conferir os nomes reais das rotas, associar as cinco áreas aos destinos e separar presença do botão de presença no painel. Registrar `index` como única exceção de tela.
2. **5.2 — Preparar o cabeçalho:** implementar o botão imediatamente à esquerda do título em um layout compartilhado. Verificar título, posição fixa, áreas seguras e ação de retorno em uma tela principal e uma secundária.
3. **5.3 — Construir o painel:** apresentar as cinco áreas com seleção, abertura e fechamento acessíveis, aplicando o tema existente. Não incluir itens de criação.
4. **5.4 — Integrar a navegação:** ligar os destinos, fechar o painel após a escolha e evitar duplicação de rota. Aplicar a todas as telas internas, inclusive criação e detalhes, e retirar o menu inferior. Verificar os botões de criação dentro de Talhões e Planos e o tratamento de saída de formulários alterados.
5. **5.5 — Validar a experiência:** percorrer todas as telas existentes, testar retorno Android, seleção de área, abertura/fechamento, teclado, fonte ampliada, tela estreita e TalkBack. Executar lint e typecheck e registrar resultados, limitações e próximo exercício.

**Critérios de conclusão:** `index` sem menu; todas as telas internas com botão imediatamente à esquerda do título; painel com somente cinco áreas; cadastros acessíveis dentro de suas áreas; nenhum menu inferior remanescente; navegação sem duplicação, retorno funcional e saída de formulários sem perda silenciosa. Conferir acessibilidade e comportamento no Android antes de declarar a implementação concluída.

**Perguntas de revisão:** por que uma tela pode ter o botão do menu sem aparecer entre seus destinos? Qual a diferença entre abrir uma área e criar um registro? Como o layout evita repetir cabeçalhos? O que deve acontecer ao pressionar Voltar com o painel aberto?

**Registro desta atualização:** atividade documental de 05/11/2026; aprendizado: distinguir destinos do painel, telas que exibem o botão e ações de criação. Próximo exercício: iniciar 5.1, conferindo as rotas atuais. Nenhuma implementação do menu ou instalação de biblioteca realizada nesta atualização. Verificações: referência PNG presente; conteúdo anterior ao módulo 5 e do módulo 6 em diante preservado integralmente, conferido por hash. Lint sem erros, com seis avisos existentes de imports não utilizados. Typecheck bloqueado pelo TS7016 já registrado em `eslint.config.js:3`; isso não valida nem conclui a futura implementação do menu.

## Módulo 6 — Atividades dos talhões

**Objetivo:** transformar planos em planejamento independente de cada talhão.

**Funcionalidades:** importar planos para um ou mais talhões, criar atividades diretamente e editar ou excluir atividades planejadas conforme regras autorizadas.

**Conceitos:** cópia versus referência, origem, operação identificada, idempotência e estado derivado. Idempotência significa que repetir tecnicamente a mesma operação não repete seu efeito.

**Pré-requisitos:** módulo 5; definir importação intencional versus reenvio e limites de exclusão. Não liberar exclusão com lançamento sem regra aprovada.

**Pequenas atividades:**

1. **6.1 — Criar diretamente:** cadastrar e consultar atividade de um talhão.
2. **6.2 — Importar cópias:** gerar atividades independentes e preservar a origem quando pertinente.
3. **6.3 — Evitar duplicações:** distinguir tentativa repetida de nova importação solicitada.
4. **6.4 — Gerir planejamento:** permitir ajustes e exclusões autorizados; apresentar Em aberto e Atrasada. A conclusão será produzida pelo lançamento no módulo 8.

**Critérios de conclusão:** editar o plano não altera atividades importadas; repetir uma operação não duplica cópias; nova importação intencional é distinguível. Não existe situação Iniciada nem exclusão em cascata do histórico.

**Perguntas de revisão:** por que não basta guardar uma referência ao plano? Atrasada precisa ser armazenada como situação independente? Como distinguir um reenvio de uma ação nova?

## Módulo 7 — Insumos e cálculos

**Objetivo:** preparar dados e cálculos antes de registrar custos de execução.

**Funcionalidades:** cadastrar aquisições, consultar insumos disponíveis e marcar esgotamento manualmente.

**Conceitos:** decimal, unidade, precisão, arredondamento, representação no JSON e valor histórico.

**Pré-requisitos:** módulo 6; definir a política decimal completa e unidades compatíveis. Qualquer biblioteca de cálculo exige autorização prévia.

**Pequenas atividades:**

1. **7.1 — Especificar cálculos:** acordar casas decimais, normalização, rateio aplicável, arredondamento e diferença entre zero e não informado; escrever exemplos esperados.
2. **7.2 — Cadastrar aquisição:** identificação, quantidade positiva, unidade e custo não negativo.
3. **7.3 — Marcar esgotamento:** retirar o insumo das novas seleções sem apagá-lo do histórico.
4. **7.4 — Verificar cálculos:** testar os exemplos acordados, incluindo frações e unidades incompatíveis.

**Critérios de conclusão:** regras numéricas documentadas e verificadas; cada aquisição é um cadastro; nenhuma baixa automática ou bloqueio por estoque calculado. Não converter unidades incompatíveis por suposição.

**Perguntas de revisão:** por que representação e arredondamento afetam dinheiro? Por que esgotar um insumo não pode apagar sua participação em um lançamento antigo?

## Módulo 8 — Lançamento único

**Objetivo:** registrar execução com consistência e imutabilidade.

**Funcionalidades:** formulário de execução, seleção opcional de insumos, quantidades, mão de obra, outros custos, total e observações; consulta sem edição. Fotos serão integradas no módulo seguinte.

**Conceitos:** operação atômica, invariantes, idempotência, conteúdo imutável e separação entre dados de negócio e metadados de envio.

**Pré-requisitos:** módulo 7; definir obrigatoriedade dos campos e cálculos. Definir previamente a forma de representar anexos opcionais, sem exigir foto nem implementar upload agora.

**Pequenas atividades:**

1. **8.1 — Montar o formulário:** permitir ajustes antes de salvar e uso de insumos somente quando aplicável.
2. **8.2 — Registrar uma vez:** salvar o lançamento e concluir a atividade como uma única operação de negócio consistente.
3. **8.3 — Bloquear alterações posteriores:** fornecer somente consulta; não criar caminho de edição para lançamento ainda não enviado.
4. **8.4 — Testar repetições e falhas:** verificar duplo toque, reexecução e reinício sem duplicar ou concluir atividade sem lançamento salvo.

**Critérios de conclusão:** uma atividade tem no máximo um lançamento; execução salva conclui a atividade; campos opcionais não impedem um registro válido. Imutabilidade vale desde o salvamento local. A proteção equivalente no backend será validada no módulo 11.

**Perguntas de revisão:** desabilitar um botão basta para evitar duplicidade? Por que salvar lançamento e concluir atividade precisam ser consistentes? Qual diferença entre alterar observação e atualizar estado de envio?

## Módulo 9 — Fotos e histórico

**Objetivo:** preservar evidências e consultar o trabalho realizado.

**Funcionalidades:** adicionar fotos antes de salvar novos lançamentos, persistir arquivos, exibir histórico do talhão e detalhes somente para leitura.

**Conceitos:** arquivo temporário versus persistente, referência a arquivo, permissão, auditoria e integridade de histórico.

**Pré-requisitos:** módulo 8; definir origem das fotos, limites e tratamento de falhas. Consultar APIs atuais e obter autorização antes de instalar módulos necessários.

**Pequenas atividades:**

1. **9.1 — Definir o contrato de fotos:** acordar arquivos e referências esperados, cancelamento e falha de salvamento.
2. **9.2 — Anexar antes de salvar:** preparar arquivos persistentes e permitir ajustes apenas no formulário ainda não salvo.
3. **9.3 — Desenvolver `[id]` para consultar o histórico do talhão:** apresentar as atividades realizadas e permitir abrir os detalhes de seus lançamentos, com custos, insumos e fotos originais, somente para leitura. Desenvolver após os módulos de atividades e lançamento único, conforme detalhamento abaixo.
4. **9.4 — Conferir permanência:** reiniciar o app e acessar offline; testar permissão negada e arquivo indisponível com mensagem compreensível.

### Atividade 9.3 — Tela `[id]` adiada para o histórico

**Estado:** a desenvolver, por decisão do responsável em 05/11/2026. Esta tela pertence à etapa posterior de consulta do trabalho realizado, e não ao cadastro inicial de talhões do módulo 4.

- Entrada: identificador do talhão selecionado e perfil local ativo. Consultar pelo repositório somente os dados desse perfil; não criar registros ou revisões ao abrir a tela.
- Resultado: identificar o talhão e apresentar seu histórico de atividades realizadas, com acesso aos lançamentos correspondentes. Distinguir os dados atuais do talhão dos dados históricos preservados em cada execução.
- Definir antes de implementar a ordem do histórico, os dados resumidos em cada item e a navegação para os detalhes do lançamento. Não misturar atividades planejadas ainda em aberto com execuções realizadas.
- Preparar carregamento, histórico vazio, identificador inválido, talhão não encontrado e falha de leitura com nova tentativa. Ausência de histórico não equivale a erro de leitura.
- Conectar o acesso a partir da lista de talhões e prever retorno. Aplicar tema compartilhado, menu do módulo 5, áreas seguras, rolagem, fonte ampliada e TalkBack.
- Preservar a consulta sem edição dos dados e fotos dos lançamentos desde o salvamento local, inclusive quando houver envio pendente no futuro. Não afirmar sincronização sem backend.
- Verificar talhão correto, separação entre perfis, histórico vazio e preenchido, consulta após reinício e sem conexão, dados históricos após alterações de cadastros e retorno no Android. Usar registros de teste separados de perfis reais.

**Questões para `[id]`:** quais informações permitem reconhecer uma atividade realizada? Em que ordem apresentar as execuções? Como abrir um lançamento e voltar ao histórico? Como diferenciar dados atuais do talhão de informações preservadas no lançamento? Como mostrar ausência de execuções, falha de leitura e foto indisponível? Como garantir que a consulta não permita alterar o histórico?

**Critérios de conclusão:** lançamentos sem foto continuam válidos; fotos sobrevivem ao reinício; insumos esgotados continuam visíveis no histórico. Não anexar ou substituir fotos de lançamento já salvo sob pretexto de completar o módulo.

**Perguntas de revisão:** guardar o endereço de um arquivo temporário preserva a foto? Como consultar um lançamento se o cadastro de origem foi alterado depois?

## Módulo 10 — Calendário e lembretes

**Objetivo:** tornar o planejamento consultável por data e ajudar a lembrar atividades.

**Funcionalidades:** calendário, consulta das atividades por período e notificações locais. Ambos são obrigatórios.

**Conceitos:** projeção de dados, permissão, agendamento, reconciliação e limitações de execução em segundo plano.

**Pré-requisitos:** módulo 9; decidir datas exibidas, navegação e filtros, antecedência, horário, repetição, reagendamento e comportamento na saída ou troca de perfil. Verificar documentação da versão instalada antes de implementar notificações.

**Pequenas atividades:**

1. **10.1 — Definir cenários:** registrar exemplos de calendário e quando cada lembrete deve existir ou ser cancelado.
2. **10.2 — Construir a consulta:** visualizar atividades do período e abrir detalhes, com alternativa legível em tela estreita conforme guia visual.
3. **10.3 — Solicitar permissão:** explicar a finalidade e tratar recusa sem bloquear registros.
4. **10.4 — Agendar e reconciliar:** ajustar lembretes após edição, conclusão, exclusão permitida, saída e reinício conforme regras acordadas.

**Critérios de conclusão:** calendário corresponde às atividades; reagendamento não gera lembretes duplicados; recusa ou falha não perde registros. Validar comportamento em Android e registrar limites observados, sem prometer entrega de notificação não comprovada.

**Perguntas de revisão:** o calendário precisa duplicar os dados das atividades? O que fazer com um lembrete quando a atividade é concluída? Qual diferença entre agendar e comprovar que a notificação apareceu?

## Módulo 11 — Backend e autenticação

**Objetivo:** criar a parte remota e proteger dados por identidade verificada.

**Funcionalidades:** primeiro acesso conectado, sessão real, APIs do produtor, validações definitivas, persistência MongoDB e armazenamento remoto de fotos.

**Conceitos:** cliente e servidor, contrato de API, autenticação, autorização, validação, índices, concorrência e armazenamento de objetos.

**Pré-requisitos:** fluxo local dos módulos anteriores validado; escolher solução consolidada de autenticação e definir modelagem, driver/ODM e hospedagem. Instalações continuam sujeitas a autorização.

**Pequenas atividades:**

1. **11.1 — Desenhar contratos:** definir requisições, respostas e erros, representação decimal, datas, revisões e identidade de operações.
2. **11.2 — Preparar o servidor:** construir a base Node.js/TypeScript/Fastify e persistência MongoDB em pequenas entregas verificáveis.
3. **11.3 — Autenticar e autorizar:** implementar o fluxo da solução escolhida e autorização em cada acesso a registros, revisões e fotos; não confiar no e-mail informado pelo cliente.
4. **11.4 — Implementar operações:** começar por talhões e seguir as funcionalidades locais; garantir lançamento único diante de requisições simultâneas e não criar endpoint de edição de lançamento.
5. **11.5 — Preparar fotos:** definir acesso e upload de objetos conforme os contratos, preservando autoria e referências.

**Critérios de conclusão:** testar dois produtores e impedir acesso cruzado, inclusive a fotos; rejeitar entradas inválidas; garantir unicidade e imutabilidade no servidor. Não afirmar integração completa enquanto a sincronização não existir.

**Perguntas de revisão:** por que repetir validação no servidor? Como o backend distingue identidade comprovada de um campo enviado pelo celular? Que regra precisa continuar verdadeira com duas requisições simultâneas?

## Módulo 12 — Sincronização

**Objetivo:** conectar o fluxo offline ao backend sem perder ou duplicar informações.

**Funcionalidades:** fila persistente, envio e consulta de resultados, reenvios, sincronização de fotos e indicação de pendências e rejeições.

**Conceitos:** fila de saída, idempotência, confirmação, falha parcial, reconciliação e compatibilidade de dados.

**Pré-requisitos:** módulo 11; fechar contratos de sincronização, transição dos perfis locais para contas autenticadas e tratamento dos registros rejeitados. Não associar dados automaticamente pela coincidência de e-mail.

**Pequenas atividades:**

1. **12.1 — Definir a transição:** acordar como preservar e atribuir os dados locais à conta real e como lidar com formatos antigos.
2. **12.2 — Persistir a fila:** manter operação e conteúdo necessário ao reenvio mesmo após reinício.
3. **12.3 — Enviar e conferir:** tratar sucesso, falta de resposta e repetição sem duplicar importações ou lançamentos.
4. **12.4 — Enviar fotos:** diferenciar aceitação do registro de conclusão do upload dos arquivos previstos.
5. **12.5 — Tratar rejeições:** exibir motivos e apenas ações autorizadas; jamais oferecer edição de lançamento salvo como correção implícita.

**Critérios de conclusão:** testar queda de conexão antes e depois da aceitação, reinício durante envio, reenvio e falha isolada de foto. Não perder conteúdo nem afirmar “sincronizado” prematuramente. Conflitos entre vários celulares permanecem fora do escopo inicial.

**Perguntas de revisão:** se o servidor salvou mas a resposta se perdeu, o que o celular deve fazer? Como distinguir rejeição de regra de falta de internet? Por que uma foto pendente não equivale a um registro completamente sincronizado?

## Módulo 13 — Qualidade e distribuição

**Objetivo:** verificar a jornada completa e preparar uma versão Android utilizável.

**Funcionalidades:** experiência completa, recuperação de falhas, diagnóstico e distribuição pelo fluxo EAS acordado.

**Conceitos:** testes por risco, acessibilidade, desempenho, configuração de ambiente, compilação, distribuição e compatibilidade de versões.

**Pré-requisitos:** módulo 12; ambiente Android disponível, decisões de distribuição e credenciais apropriadas. Consultar documentação atual de EAS antes de usar suas APIs ou comandos; não publicar por iniciativa própria.

**Pequenas atividades:**

1. **13.1 — Rever a jornada:** acesso, cadastros, importação, insumos, execução, fotos, histórico, calendário e lembretes.
2. **13.2 — Testar adversidades:** falta de rede, reinício, erro de disco, rejeição remota, sessão expirada e permissões negadas conforme contratos definidos.
3. **13.3 — Conferir usabilidade:** TalkBack, fonte ampliada, teclado, tela estreita e listas com volume representativo de teste.
4. **13.4 — Preparar distribuição:** verificar lint, tipos e testes relevantes; documentar ambiente, resultados, limitações e procedimento de compilação e distribuição Android com EAS.

**Critérios de conclusão:** jornada validada em dispositivo, regras críticas verificadas e bloqueios resolvidos ou explicitamente delimitados antes da distribuição. Registrar o que foi realmente testado; compilação bem-sucedida não substitui teste da experiência.

**Perguntas de revisão:** quais falhas causariam perda de confiança ou dados? O que foi testado em aparelho e o que só foi inspecionado? Como uma atualização preserva registros ainda não enviados?
