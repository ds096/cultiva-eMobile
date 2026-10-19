# cultiva-eV2 — acordo de trabalho

Aplicativo Expo/React Native para organização do trabalho do produtor rural. Priorizar Android, padrões mobile-first, desempenho, acessibilidade e compatibilidade entre plataformas.

## Fontes e estado atual — 19/10/2026

- Ler [CONTEXT.md](CONTEXT.md), [GUIA.md](GUIA.md) e [GUIA-VISUAL.md](GUIA-VISUAL.md) antes de implementar. Estes são os nomes reais; referências antigas a `contex.md` são links desatualizados.
- O responsável reiniciou o projeto com `npx create-expo-app@latest MeuProjeto --template blank`, após problemas de compilação. Os diagnósticos de 18/10 nos guias pertencem à versão anterior; não descrevem a árvore atual.
- Base atual: Expo `~58.0.16`, React `19.3.0`, React Native `0.88.0`, `expo-dev-client` e `expo-status-bar`. Entrada `index.js` → `App.js`, ainda em JavaScript. Usa npm e `package-lock.json`; não há `bun.lock`.
- Após autorização em 19/10, foram instaladas as bibliotecas de preparação, navegação e interface da tabela abaixo. Existem `eslint.config.js` e `tsconfig.json` com `strict`, `allowJs` e `checkJs`, verificando o JavaScript atual sem migrá-lo ainda. Scripts: `npm run lint` e `npm run typecheck`.
- Ainda não existem `src/`, tema ou rotas. Router e Paper estão instalados, mas a entrada continua `index.js` → `App.js`; ativar navegação e aplicar o tema são próximas atividades. MMKV não está instalado. A paleta histórica permanece aprovada; tema e logo `assets/images/logo_plus_name.png` estão ausentes.
- O responsável relatou executar `npx expo run:android` e visualizar “Open up App.js to start working on your app!” no celular. Esse era o texto do `App.js` no início da inspeção; indica carregamento da tela inicial, não implementação das funcionalidades. Durante esta atividade, foi observada uma alteração externa para “Olá mundo!”, preservada pelo agente.
- Nome solicitado: `cultiva-eV2`; nome técnico npm e slug: `cultiva-ev2`. A pasta de trabalho já é `cultiva-ev2`. O identificador Android `com.daniels096.MeuProjeto` é preservado: nome visível e identidade instalada são coisas distintas. Alterar o identificador exige decisão explícita, pois cria outra identidade de aplicativo.
- `android/` foi gerado e está ignorado pelo Git; não existe `ios/`. Configurar por `app.json`/plugins e aplicar via Prebuild, sem editar arquivos gerados manualmente. Alterações nativas exigem nova compilação/instalação para aparecer no celular.

## Colaboração e aprendizagem

- O responsável escreve o código; o agente explica e revisa uma pequena atividade por vez. Implementar diretamente quando solicitado, como nesta atualização documental e de nome.
- Explicar problema, conceito, entradas, resultado e verificações. Código novo ou alterado, inclusive exemplos, deve conter comentários explicativos; arquivos JSON não aceitam comentários.
- Não instalar bibliotecas sem autorização. Uma solicitação para listar necessidades não autoriza instalação. Não configurar ferramentas com comandos que instalem dependências silenciosamente.
- Respeitar alterações em andamento e não restaurar arquivos antigos automaticamente. Desenvolver arquitetura conforme necessidades concretas.
- Construir fluxo local primeiro; backend, autenticação e sincronização depois. Seguir os módulos do GUIA.md, sem implementar um módulo inteiro de uma vez.
- Registrar atividade, data, aprendizado, verificações, bloqueios e próximo exercício. O módulo 0 foi declarado concluído em 18/10, mas sua inspeção técnica precisa considerar o reinício. Não declarar etapas posteriores concluídas.

## Produto e invariantes

- Organizar talhões, planos de manejo, atividades, insumos, lançamento único, histórico, fotos, consulta offline, calendário, lembretes e sincronização. Sem cadastro de propriedades ou perfis adicionais nesta versão.
- Etapa local: perfil por e-mail normalizado, sem senha e sem comprovação de identidade. Explicar a limitação; separação local não é autenticação nem autorização remota. Não inserir registros fictícios em perfis reais.
- Planos são criados pelo produtor. Importar gera cópias independentes; alterações no plano não mudam cópias existentes. Reenvios técnicos não podem duplicar importações.
- Atividades: Em aberto ou Concluída; Atrasada é derivada do prazo vencido sem conclusão. Nunca criar Iniciada. Data final não antecede a inicial; datas de calendário são distintas de instantes de auditoria.
- Uma atividade admite apenas um lançamento, mesmo com duplo toque ou reenvio. Salvar conclui a atividade. Desde o salvamento local, seus dados e fotos são imutáveis; permitir consulta e reenvio técnico, não edição. Não apagar histórico em cascata.
- Cada aquisição é um cadastro de insumo. Esgotamento manual; sem baixa automática ou estoque calculado. Preservar dados históricos. Quantidades positivas, custos não negativos e unidades compatíveis.
- Definir política decimal antes dos cálculos: decimais no domínio, strings decimais canônicas no JSON e arredondamento documentado. Distinguir zero de não informado.
- Entidades editáveis preservam revisões. Fotos precisam de arquivos persistentes, não apenas caminhos temporários.
- Situação da atividade e estado de sincronização são independentes. Não afirmar sincronização sem backend; diferenciar falta de conexão, rejeição e foto pendente.
- Backend futuro: Node.js, TypeScript, Fastify e MongoDB, com autorização definitiva no servidor. Autenticação, contratos de sincronização e migração de perfis locais ainda pendentes. Não associar dados à conta apenas pela coincidência de e-mail.
- Definir campos obrigatórios, precisão, exclusão de atividades com lançamento, tratamento de lançamento incorreto/rejeitado, regras de fotos e de lembretes antes das respectivas implementações. Falha/permissão negada de lembrete não impede salvar.

## Arquitetura e direção visual

- Adotar TypeScript estrito na preparação acordada; Expo Router para navegação e React Native Paper para interface. MMKV foi escolhido para persistência local, mas requer instalação e validação em development build.
- Separar interface, regras e armazenamento. Rotas em `src/app/`; componentes, tema, domínio e serviços fora dela. Não criar essas camadas antecipadamente nesta base blank.
- Interface em português, tema claro, fonte do sistema, uma coluna em telas estreitas, suporte a teclado, áreas seguras, fonte ampliada e TalkBack. Não comunicar estados apenas pela cor.
- Centralizar tokens em `src/theme/theme.ts` quando criado. Preservar a paleta do guia: principal `#166534`, pressionado `#14532D`, fundo `#F7FAF7`, superfície `#FFFFFF`, superfície secundária `#EEF2EF`, texto `#17251C`, texto secundário `#526158`, borda `#D4DED6`, contorno de controle `#6B7C70`. Demais tokens e estados estão no GUIA-VISUAL.md.
- Corpo/campos/botões 16; títulos 24; espaçamentos 4/8/16/24/32; cantos 12 para controles e 16 para cards. Botão mínimo 52, campo 56, alvo de toque 48 × 48, permitindo crescimento e quebra de texto.
- Navegação planejada: Talhões, Calendário, Insumos, Planos de manejo e Configurações. Não presumir que componentes descritos no guia já existam. Não inventar logo aprovada.
- Preparar estados vazio, carregamento, erro, validação e salvamento; estados de envio somente quando implementados. Datas `dd/MM/aaaa` e valores em reais na apresentação.

## Dependências a preparar por etapa

O responsável autorizou a instalação das etapas Preparação, Navegação e Interface em 19/10/2026. Essas bibliotecas foram instaladas via `expo install`; persistência, fotos e lembretes continuam para etapas futuras. Consultar documentação e dependências pares: `expo install` resolve versões conhecidas pelo SDK, mas não garante compatibilidade de toda biblioteca externa.

| Etapa | Necessidade |
| --- | --- |
| Lint | `eslint` e `eslint-config-expo` como dependências de desenvolvimento, mais configuração ESLint. |
| TypeScript | `typescript` e `@types/react` como desenvolvimento, `tsconfig.json` baseado no Expo com `strict`, e migração acordada de `.js` para `.tsx`. React Native já fornece seus tipos. |
| Navegação | `expo-router` e dependências indicadas na instalação oficial: `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants` e `expo-status-bar` (este já declarado). Configurar entrada e rotas junto da instalação. |
| Interface | `react-native-paper`; conferir integração de ícones e dependências pares da versão escolhida. `expo-system-ui` para aplicar a preferência nativa de tema claro no Android. |
| Persistência | MMKV e dependências nativas exigidas pela versão compatível; preparar somente no módulo local correspondente. |
| Fotos/lembretes | Avaliar `expo-image-picker`, `expo-file-system` e `expo-notifications` ao definir os respectivos contratos. Calendário de consulta não exige automaticamente acesso ao calendário do aparelho. |

Complementos da instalação: `@react-native-vector-icons/material-design-icons` para os ícones previstos no guia e `react-dom` na versão indicada pelo Expo, pois a resolução automática de uma dependência do Router trouxe uma versão incompatível com React 19.3.0. Isso não conclui suporte web. O instalador adicionou os plugins `expo-router` e `expo-status-bar` a `app.json`. Após adicionar módulos nativos, recompilar o development build antes de usá-los no celular.

Após autorização, usar `npx expo install <pacotes> --dev` para ferramentas de desenvolvimento e `npx expo install <pacotes>` para runtime. Não adicionar bibliotecas futuras apenas por constarem na lista.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done. Se faltarem ferramentas/configurações, registrar o bloqueio sem instalar automaticamente nem afirmar aprovação.

Verificação atualizada de 19/10/2026, após a instalação autorizada: `npm run lint` e `npm run typecheck` passaram; `expo install --check` confirmou as versões e `npm ls --all` não encontrou conflitos. Os bloqueios de ferramentas registrados na entrega anterior foram resolvidos. Prebuild Android executado com `--no-install --no-clean`, incluindo o plugin explícito `expo-system-ui` para aplicar o tema claro. Compilação e teste no celular ainda pendentes; esses checks não validam navegação ou interface ainda não implementadas.

O npm reportou 26 vulnerabilidades (7 moderadas, 19 altas) na árvore instalada. A auditoria propôs, para Expo e React Native, versões antigas incompatíveis com o SDK atual; não executar `npm audit fix --force` automaticamente. Avaliação das dependências transitivas permanece pendente.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
