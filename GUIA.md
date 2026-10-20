# cultiva-e — guia de aprendizagem e implementação

## Inspeção para início do módulo 2 — 19/10/2026

Avaliação da árvore atual, posterior aos registros históricos abaixo. Módulo 2 iniciado pela inspeção; nenhuma atividade de implementação ou módulo declarado concluído.

- Estrutura encontrada: `src/app/index.tsx`, `src/app/_layout.tsx` e `src/theme/theme.ts`. A entrada `index.js` registra diretamente a tela inicial; o layout com `Stack` ainda não participa desse fluxo.
- O tema contém os tokens da paleta aprovada e o mapeamento para Paper, mas não é aplicado à tela. A tela exibe uma saudação e usa fundo branco fixo. A alteração em andamento nessa saudação foi preservada.
- O manifesto declara Expo `~58.0.16`, React `19.3.0` e React Native `0.88.0`. Paper está ausente; Router aparece na instalação local como `extraneous`, fora do manifesto. Não considerar essa instalação reproduzível. Nome npm, nome visível e slug ainda estão como `meuprojeto`/`MeuProjeto`.
- `tsconfig.json` estende a base Expo, mas não habilita `strict`. Não existe script `typecheck`. O arquivo de configuração ESLint existe, mas sua dependência `eslint-config-expo` está ausente.
- Verificações com executáveis locais: `tsc --noEmit` falhou por falta de `react-native-paper`; ESLint falhou ao carregar `eslint-config-expo/flat`. `npm ls --depth=0` identificou diversos pacotes `extraneous`. Compilação e teste no celular não executados nesta inspeção.
- Conceito apresentado: criar arquivos na pasta de rotas não ativa a navegação; tokens centralizados também precisam ser conectados à interface. Compreensão pelo responsável ainda a revisar.
- Próximo exercício: atividade 2.1, ler `tokens` e `theme`, identificando cor principal, fundo, espaçamento e tipografia. Antes da atividade 2.2, regularizar em uma atividade própria as dependências e a configuração estrita, respeitando as autorizações registradas e consultando a documentação correspondente.

Nenhuma dependência instalada nem código do aplicativo alterado nesta avaliação. Este diagnóstico prevalece sobre afirmações antigas de ausência de `src/` ou aprovação dos checks.

Atualizado em 18/10/2026. Consulte [contex.md](contex.md) para regras do produto, [AGENTS.md](AGENTS.md) para o acordo de colaboração e [GUIA-VISUAL.MD](GUIA-VISUAL.MD) para a direção visual.

## Como usar esta trilha

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

| Módulo | Resultado principal | Estado |
| --- | --- | --- |
| 0. Produto e diagnóstico | Entender o produto e a situação real do projeto | Concluído pelo responsável em 18/10/2026 |
| 1. Fundamentos e estrutura | Compreender responsabilidades e fluxo de dados | Pendente |
| 2. Base visual e navegação | Preparar componentes e caminhos entre telas | Pendente |
| 3. Acesso por perfil local | Selecionar e restaurar um perfil local | Pendente |
| 4. Persistência e talhões | Manter cadastros e revisões no dispositivo | Pendente |
| 5. Planos de manejo | Criar modelos próprios de atividades | Pendente |
| 6. Atividades dos talhões | Importar cópias e organizar o planejamento | Pendente |
| 7. Insumos e cálculos | Cadastrar aquisições e definir cálculos confiáveis | Pendente |
| 8. Lançamento único | Registrar execução uma única vez, sem edição posterior | Pendente |
| 9. Fotos e histórico | Preservar fotos e consultar o que foi realizado | Pendente |
| 10. Calendário e lembretes | Consultar a agenda e receber notificações locais | Pendente |
| 11. Backend e autenticação | Identificar o produtor e proteger seus dados remotos | Pendente |
| 12. Sincronização | Enviar e reconciliar dados e fotos com segurança | Pendente |
| 13. Qualidade e distribuição | Validar e distribuir a versão Android | Pendente |

As tecnologias já aprovadas não precisam ser escolhidas novamente. Decisões detalhadas pendentes devem ser resolvidas antes da atividade que depende delas. A arquitetura crescerá com necessidades concretas, sem construir todas as camadas antecipadamente.

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

**Objetivo:** construir a primeira tela da jornada e compreender seus limites.

**Funcionalidades:** selecionar um perfil por e-mail, restaurar a seleção e sair preservando registros.

**Conceitos:** formulário controlado, normalização, validação, estado assíncrono, seleção persistida e diferença entre identificação, autenticação e autorização.

**Pré-requisitos:** módulo 2; definir normalização e validação de e-mail. Aprovar a preparação do MMKV e da compilação Android quando necessária. A implementação mínima de armazenamento do perfil começa aqui e será ampliada no módulo 4.

### O que a tela deve conter

| Elemento | Comportamento esperado |
| --- | --- |
| Identidade | Nome cultiva-e e apresentação conforme tema; tratar a logo ausente antes de referenciá-la. |
| Explicação | Informar claramente que é um perfil salvo no dispositivo, sem senha e sem autenticação remota. |
| Campo de e-mail | Rótulo visível, teclado apropriado, digitação acessível e regras de normalização acordadas. |
| Validação | Identificar campo vazio ou formato inválido e explicar como corrigir; não afirmar que o e-mail foi comprovado. |
| Ação principal | Botão “Continuar”, com prevenção de submissão repetida durante o processamento. |
| Carregamento | Indicar que o perfil está sendo aberto; não deixar a tela parecer travada. |
| Erros | Informar falha de leitura ou gravação e permitir nova tentativa, preservando o valor digitado. |
| Teclado e acessibilidade | Campo e botão alcançáveis com teclado aberto, rótulos acessíveis e suporte à ampliação de fonte. |
| Destino | Depois de abrir o perfil, encaminhar à área de talhões; na primeira utilização, apresentar estado vazio. |

Não incluir senha, confirmação de e-mail ou recuperação de senha nesta etapa. Um formulário de login real virá com o contrato de autenticação do módulo 11.

**Pequenas atividades:**

1. **3.1 — Esboçar a tela:** desenhar os elementos e escrever as mensagens antes de programar.
2. **3.2 — Construir o formulário:** aplicar componentes e tema; verificar teclado e acessibilidade.
3. **3.3 — Validar a entrada:** implementar as regras acordadas e explicar o que a validação comprova e o que não comprova.
4. **3.4 — Persistir a seleção:** criar o contrato mínimo de perfil e sua implementação local, sem alegar conexão com servidor.
5. **3.5 — Navegar e restaurar:** abrir a área interna após sucesso e restaurar a seleção ao reiniciar, tratando erro de leitura.
6. **3.6 — Sair:** encerrar a seleção sem apagar registros; conferir a separação entre perfis locais sem apresentá-la como segurança remota.

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
3. **4.3 — Cadastrar e consultar:** implementar formulário, lista e detalhes em atividades separadas.
4. **4.4 — Editar com revisão:** mostrar versão atual e preservar versões anteriores; testar falha de gravação sem apagar dados.

**Critérios de conclusão:** cadastros sobrevivem ao reinício, pertencem ao perfil correto e edições preservam histórico. Estados vazio, inválido e erro são compreensíveis. Não acrescentar cadastro de propriedades.

**Perguntas de revisão:** por que um nome não é um bom identificador? Como diferenciar a versão atual de uma revisão? O que ocorre se a gravação falhar?

## Módulo 5 — Planos de manejo

**Objetivo:** criar modelos de planejamento definidos pelo produtor.

**Funcionalidades:** criar, consultar e ajustar planos com atividades e datas previstas, respeitando revisões aplicáveis.

**Conceitos:** composição de entidades, validação de intervalos, datas de calendário e modelo reutilizável.

**Pré-requisitos:** módulo 4; definir campos dos planos e atividades e a interpretação das datas ao reutilizar o plano.

**Pequenas atividades:**

1. **5.1 — Definir o plano:** descrever dados e regras com um exemplo de teste, sem inserir planos padrão em perfis reais.
2. **5.2 — Cadastrar a estrutura:** salvar e consultar um plano inicialmente vazio.
3. **5.3 — Incluir atividades:** adicionar descrição e datas conforme contrato; validar fim igual ou posterior ao início.
4. **5.4 — Revisar alterações:** permitir ajustes autorizados e preservar as revisões previstas.

**Critérios de conclusão:** planos pertencem ao produtor, persistem e tratam intervalos inválidos. Datas não mudam de dia por conversão indevida de fuso.

**Perguntas de revisão:** qual a diferença entre plano e execução? Por que uma data de plantio não é necessariamente um instante com horário e fuso?

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
3. **9.3 — Consultar o histórico:** listar execuções e abrir detalhes com custos, insumos e fotos originais.
4. **9.4 — Conferir permanência:** reiniciar o app e acessar offline; testar permissão negada e arquivo indisponível com mensagem compreensível.

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

## Registro das próximas atividades

### Preparação após o reinício — 19/10/2026

O projeto foi recriado com o template blank. A pedido do responsável, o agente instalou as bibliotecas de preparação (ESLint e TypeScript), navegação (Expo Router e dependências) e interface (Paper, ícones e System UI). Criou configuração ESLint e TypeScript estrito com verificação dos arquivos JavaScript atuais, preservando `App.js` e a mensagem “Olá mundo!”.

Conceito desta atividade: instalar disponibiliza a biblioteca; configurar rotas e provedores é uma atividade posterior. A entrada permanece `index.js` → `App.js`. Próximo exercício: compreender a verificação de tipos e preparar a primeira rota em uma atividade pequena. O tema antigo não existe na nova base; sua paleta continua documentada no guia visual. Os registros abaixo descrevem o estado anterior ao reinício, não o estado técnico atual.

Verificações: lint e typecheck passaram; versões conferidas pelo Expo; árvore npm sem conflitos. Prebuild Android aplicado sem instalação adicional e sem recriar a pasta, com o plugin de System UI explícito. Teste da nova compilação no celular pendente. A auditoria npm reportou 26 alertas (7 moderados e 19 altos), ainda a avaliar; não foram aplicadas correções forçadas que alterariam o SDK.

O tema foi validado pelo responsável. O módulo 0 foi declarado concluído pelo responsável em 18/10/2026; os demais módulos continuam pendentes. Os bloqueios técnicos permanecem abertos, conforme [contex.md](contex.md). A conclusão do diagnóstico não comprova funcionamento do aplicativo.

| Atividade | Estado | Evidência ou próximo passo |
| --- | --- | --- |
| 0 — Produto e diagnóstico | Concluído pelo responsável em 18/10/2026 | Confirmada a seleção de perfil por e-mail na primeira versão, sem novas decisões de produto. Bloqueios de preparação ainda não resolvidos; `src/` contém somente o tema. |
| 1.1 — Ler TypeScript | Pendente | Explicar tipos de entrada e saída, valores opcionais e erros; manter `strict` habilitado. |

Depois de cada atividade, registrar: identificador, data, objetivo, o que você implementou, conceitos compreendidos, verificações executadas, bloqueios e próximo exercício. Atualizar também o contexto se houver decisão de produto aprovada.

**Diagnóstico atualizado nesta entrega:** somente o tema está presente sob `src/`; o typecheck falha pela ausência de `react-native-paper`. O lint está bloqueado por falta de preparação e não foi executado para evitar instalação automática. O diagnóstico inicial e a mudança observada na árvore de arquivos estão em [contex.md](contex.md). A resolução será feita em atividades acordadas; não instalar dependências nem alterar o tema para encobrir esses problemas.

### Persistencia do CMake no Windows — 20/10/2026

A pedido do responsavel, configuracao CMake 4.1.2 persistida com plugin Expo local para o app e patch-package para Reanimated 4.7.1. Mantido o diretorio cultiva-ev2. Adicionado script typecheck para executar o TypeScript ja instalado. Detalhes e comandos em CMAKE-WINDOWS.md.

Conceito: android/ e node_modules/ sao gerados; a fonte permanente da configuracao fica no plugin e no patch versionaveis. Verificacoes aprovadas: plugin sem duplicacao, Prebuild regenerado e repetido, patch no arquivo original, postinstall local duas vezes, lint, tipos e compatibilidade Expo. Build Debug arm64 passou em 5m 9s. Teste em aparelho, release e outras arquiteturas nao executados. npm ci completo nao executado; testada a restauracao do arquivo original da dependencia. Alertas de depreciacao e auditoria registrados no documento tecnico.

Proximo exercicio: identificar por que reinstalar dependencias remove edicoes manuais e como postinstall reaplica o patch; depois executar o aplicativo no celular para conferir a experiencia. Nenhum modulo funcional declarado concluido.
