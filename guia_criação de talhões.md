# Guia de criação de talhões

Atualizado em 11/11/2026. Material de aprendizagem baseado nos arquivos presentes nesta data.

Este guia explica como [PlotFormControls.tsx](src/components/PlotFormControls.tsx) apresenta os controles e como [createPlot.tsx](src/app/createPlot.tsx) coordena o cadastro. Leia o código junto do texto, uma função por vez.

## 1. O caminho dos dados

O produtor preenche os campos, adiciona culturas à lista e aciona **Salvar talhão**. A tela valida os valores, monta um `PlotInput` e pede ao repositório que grave o cadastro. Somente depois da gravação bem-sucedida ela limpa o formulário.

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/PlotFormControls.tsx` | Aparência, interação e acessibilidade dos campos e botões. |
| `src/app/createPlot.tsx` | Estado do formulário, eventos, validação para orientar o preenchimento e solicitação de salvamento. |
| `src/domain/plot.ts` | Tipos e regras dos dados do talhão e das culturas. |
| `src/repositories/plotRepository.ts` | Identificação do perfil, leitura e gravação local no MMKV. |
| `src/theme/theme.ts` | Cores, tipografia, espaçamentos e medidas compartilhadas. |
| `src/context/ProfileContext.tsx` | Perfil local selecionado, consultado pela tela com `useProfile()`. |

Os controles recebem informações da tela por **props**, que são parâmetros de um componente. Os eventos retornam à tela por funções, como `onChangeText` e `onPress`. Os controles não gravam no MMKV.

O perfil é uma seleção local por e-mail, sem comprovação de identidade. Separar documentos por perfil não equivale a autenticação nem a autorização em um servidor.

## 2. O que existe no arquivo PlotFormControls

Apesar do nome do arquivo, não existe um componente único chamado `PlotFormControls`. Ele exporta três componentes e um tipo: `PlotFormField`, `PlotFormButton`, `PlotRemoveButton` e `PlotFormInput`.

### PlotFormField: um campo com rótulo e orientação

O componente reúne o rótulo visível, um `TextInput` do React Native Paper e uma mensagem auxiliar ou de erro abaixo dele. Isso evita repetir a mesma estrutura em cada campo da tela.

| Prop | Para que serve |
| --- | --- |
| `id` | Identifica o campo nos testes e participa da ligação com seu rótulo acessível. |
| `label` | Texto visível acima do campo. |
| `value` | Valor que a tela quer mostrar. |
| `onChangeText` | Função chamada quando o usuário altera o texto. |
| `keyboardType` | Solicita teclado adequado, como decimal ou numérico. |
| `placeholder` | Exemplo opcional dentro do campo vazio; não substitui o rótulo. |
| `editable` | Permite ou bloqueia edição. |
| `hint` | Orientação auxiliar quando não há erro. |
| `error` | Mensagem específica de validação; tem prioridade sobre `hint`. |
| `inputRef` | Referência usada para chamar `focus()` naquele campo. |
| `returnKeyType` | Solicita a apresentação da tecla de confirmação, como próxima ou concluir. |
| `submitBehavior` | Controla o comportamento da confirmação em relação ao foco. |
| `onSubmitEditing` | Executa a ação definida para a confirmação no teclado. |

`FieldProps` usa `Pick` para selecionar somente algumas propriedades do `TextInput`. A interseção com as propriedades próprias acrescenta `id`, `label`, `error` e as demais informações do componente.

Na função, a desestruturação separa as propriedades próprias. `...input` reúne o restante e o encaminha ao `TextInput`. Por isso o evento de confirmação fornecido pela tela chega ao campo do Paper.

O campo é **controlado**: seu texto vem de `value`. Ao digitar, `onChangeText` pede à tela uma atualização de estado; o novo valor volta ao componente na renderização seguinte.

A aparência usa contorno, tokens do tema e fonte de corpo. A altura considera a escala de fonte do sistema, com um mínimo de 56 unidades. O rótulo permanece acima do valor, inclusive quando o campo está vazio. Erros recebem estilo próprio e recursos de anúncio para o leitor de tela.

### PlotFormInput: uma referência para foco

O tipo `PlotFormInput` expõe somente `focus()`. A referência não guarda o texto digitado: ela permite realizar uma ação sobre o campo que está na tela.

O callback de `ref` recebe a instância fornecida pelo Paper, confere se existe um método `focus` e cria uma pequena interface para a tela usá-lo. A verificação trata o valor como desconhecido antes de acessar sua função. Ao remover a instância, a referência volta a `null`.

Na tela, `areaRef.current?.focus()` significa: se a referência da área estiver disponível, coloque o foco nela. O operador `?.` evita chamar um método quando `current` ainda é `null`.

### PlotFormButton: uma ação com texto

Esse componente usa `TouchableRipple` do Paper, `Text` e, durante carregamento, `ActivityIndicator`. Foi composto dessa forma para permitir quebra de linha no rótulo e crescimento vertical com a fonte do sistema.

| Prop | Comportamento |
| --- | --- |
| `label` | Texto do botão. |
| `onPress` | Função executada ao tocar. |
| `variant` | Escolhe a aparência `primary`, `secondary` ou `remove`; o padrão é `primary`. |
| `disabled` | Bloqueia a interação e aplica a aparência de indisponibilidade. |
| `loading` | Mostra o indicador e também bloqueia a interação. |
| `accessibilityLabel` | Descrição específica; quando ausente, usa o próprio `label`. |

A ação principal aparece em verde. A secundária tem fundo claro e contorno verde. O botão tem altura mínima de 52, papel acessível de botão e estado de indisponibilidade/processamento.

A variante textual `remove` continua disponível no componente, mas a tela atual usa `PlotRemoveButton` para remover culturas.

### PlotRemoveButton: a lixeira da cultura

Esse componente usa `IconButton` do Paper e recebe `cropName`, `onPress` e `disabled`. O desenho da lixeira é composto por formas nativas, pois a árvore inspecionada não possui a fonte de ícones prevista no guia visual.

O desenho ocupa 24 × 24, enquanto a área de toque ocupa 48 × 48. A descrição acessível inclui o nome da cultura, como “Remover cultura Café”. O componente apenas chama `onPress`; a tela decide qual item retirar.

## 3. Como a tela organiza o formulário

`CreatePlotScreen` é o componente padrão da rota `createPlot.tsx`. A estrutura possui dois blocos: identificação do talhão e culturas. A ação principal fica depois deles.

`SafeAreaView` protege as bordas laterais e inferior. A área superior é atendida pelo cabeçalho da navegação. `KeyboardAvoidingView` considera a altura desse cabeçalho para ajustar o espaço quando o teclado aparece. Um único `ScrollView` contém os campos, as culturas e o botão de salvar.

Os estilos usam os tokens do tema. O formulário tem uma coluna e largura máxima de 480 unidades. Os cards podem crescer, e nomes de culturas podem quebrar linha ao lado da lixeira. No estado atual, a lista vazia mostra a contagem de culturas, seguida de uma `View` vazia.

## 4. Estado: o que muda enquanto o produtor preenche

| Estado ou referência | Conteúdo e finalidade |
| --- | --- |
| `fields` | Textos de nome, área, ano, nome da cultura e quantidade. |
| `crops` | Culturas já adicionadas à lista do formulário. |
| `errors` | Mensagens específicas dos campos ou da lista de culturas. |
| `feedback` | Aviso geral temporário de sucesso ou erro. |
| `saving` | Estado visual usado para bloquear controles durante o salvamento. |
| `scrollRef` | Acesso à rolagem para voltar ao topo ao mostrar feedback. |
| `nextCropId` | Contador de identidades auxiliares das culturas do formulário. |
| `saveLock` | Trava imediata contra repetição da mesma submissão. |
| Referências dos campos | Acesso ao foco de área, ano, nome da cultura e quantidade. |

`useState` guarda informações que precisam atualizar a interface. `useRef` mantém informações entre renderizações sem solicitar uma renderização quando `current` muda.

`FormErrors` combina `Partial` e `Record`: associa nomes conhecidos de campos a mensagens, permitindo que só os campos com erro estejam presentes. `FormCrop` reúne os dados de `Crop` com um `id` auxiliar.

## 5. O que acontece ao digitar

`updateField(field, value)` cria um novo objeto de campos, preservando os demais valores. Também remove a mensagem específica daquele campo, limpa o aviso geral e libera a trava para uma nova tentativa de cadastro.

Limpar a mensagem ao editar não comprova que o novo valor ficou válido. A validação será executada novamente ao adicionar a cultura ou salvar o talhão.

Os textos numéricos ficam como strings durante a edição. Assim, o usuário pode deixar o campo vazio ou digitar a parte inicial de um decimal. A conversão acontece antes da validação.

## 6. Adicionar e remover culturas

`handleAddCrop()` verifica o nome e converte a quantidade com `Number`. A quantidade precisa ser um inteiro positivo. Se houver erro, a tela mantém os textos e leva o foco ao primeiro campo inválido da cultura.

Quando os valores são válidos, a função chama `validateCrop`, cria um `id` auxiliar, acrescenta a cultura a uma nova lista e limpa somente os dois campos da cultura. Nome, área e ano do talhão permanecem preenchidos.

O contador é incrementado antes do atualizador de estado. A função passada a `setCrops` apenas produz a nova lista, sem alterar o contador durante sua execução.

O `id` da cultura serve para distinguir itens e usar `key` na renderização. Ele não é o UUID persistido do talhão. Antes de salvar, o `map` retira esses IDs auxiliares e monta culturas apenas com nome e quantidade.

`handleRemoveCrop(id)` usa `filter` para produzir outra lista sem o item escolhido. A remoção afeta somente o formulário em preenchimento; não exclui registros já persistidos.

## 7. Avançar pelo teclado

O avanço foi conectado nesta atividade:

| Campo confirmado | Destino |
| --- | --- |
| Nome do talhão | Área |
| Área | Ano de plantio |
| Ano de plantio, inclusive vazio | Nome da cultura |
| Nome da cultura | Quantidade de plantas |
| Quantidade de plantas | Tenta adicionar a cultura. |

Nos quatro primeiros campos, `returnKeyType` solicita a tecla de próxima ação, `submitBehavior="submit"` evita o fechamento automático do teclado e `onSubmitEditing` chama o foco do próximo campo.

No último, a ação é Concluir. `handleAddCrop()` retorna `true` quando inclui a cultura; só nesse caso o handler fecha o teclado. Se os dados forem inválidos, a mensagem fica junto do campo e o foco vai para a correção. Confirmar pelo teclado não grava o talhão.

A configuração e os handlers foram verificados em testes simulados. A apresentação das teclas e o comportamento nativo ainda precisam ser conferidos nos teclados dos aparelhos, especialmente os numéricos.

## 8. Salvar o talhão

`handleSavePlot()` começa conferindo a trava de submissão. Depois prepara os valores e executa as validações:

| Informação | Tratamento atual |
| --- | --- |
| Nome | Deve conter texto depois de retirar espaços externos. |
| Área | Troca vírgula por ponto, converte para número e exige valor finito positivo. |
| Ano | Vazio vira `undefined`; quando informado, exige inteiro seguro positivo. |
| Culturas | Deve existir pelo menos uma na lista. |
| Cultura ainda digitada | Bloqueia salvar e orienta tocar em Adicionar cultura. |

Por exemplo, a área digitada como `2,5` é convertida para `2.5`. O ano vazio representa ausência, e não zero. O código atual usa `number` nesses dados; isso não implementa a política decimal definitiva prevista para quantidades e custos do produto.

Se houver erro, a tela preenche `errors`, mostra o aviso geral e encerra a tentativa antes de gravar. Quando tudo está válido, ativa a trava, marca `saving`, exige um perfil selecionado e monta o `PlotInput`.

A chamada `plotRepository.create(email, input)` faz a persistência local. O repositório normaliza novamente os dados, gera um UUID, registra o instante de salvamento e cria a revisão inicial. Grava um documento com `schemaVersion: 1` e a lista `plots`, separado pela chave do perfil normalizado.

O MMKV é síncrono nesse fluxo: não há `await` nem espera artificial. Por isso o estado visual de carregamento pode ser muito breve ou não aparecer entre renderizações.

Após sucesso, a tela limpa os cinco campos, a lista de culturas, as mensagens específicas e o contador auxiliar. A trava continua ativa até nova edição. Se a gravação falhar, os valores são preservados e a trava é liberada para tentar novamente. O `finally` encerra `saving` em ambos os caminhos.

## 9. Feedback geral e erros dos campos

Há dois estados independentes: `feedback` para o resultado geral e `errors` para orientar o preenchimento. O desaparecimento do aviso geral não remove automaticamente os erros dos campos.

**Situação do código inspecionado:** a tela atualmente renderiza um aviso próprio com `View` e `Text`, dentro do fluxo do formulário, por até cinco segundos. `useEffect` agenda a limpeza, cancela o temporizador anterior quando o aviso muda e faz a limpeza ao desmontar a tela. Editar ou adicionar/remover cultura também pode fechar o aviso antes do prazo. `showFeedback` fecha o teclado e pede rolagem para o topo.

**Diferença em relação aos pedidos anteriores:** o requisito registrado é usar Snackbar do Paper por três segundos, sem cobrir o formulário. Essa versão não está na tela encontrada durante esta atividade. O avanço pelo teclado foi implementado agora; o feedback existente foi preservado. Os registros antigos do `GUIA.md` descrevem entregas anteriores e não substituem a leitura do arquivo atual.

## 10. Verificações e limitações desta atividade

Atividade de 11/11/2026: conectado o avanço pelo teclado, atualizado o simulador de testes para executar e limpar `useEffect` e escrito este guia. Nenhuma dependência instalada.

Os dois testes específicos de teclado passaram: os quatro destinos de foco e a inclusão da cultura pelo último campo sem salvar o talhão. Eles executam os handlers reais com referências simuladas; não comprovam a apresentação do teclado nativo.

Na suíte completa, sete testes passaram e cinco falharam. As falhas restantes estão relacionadas à expectativa de Snackbar e às mensagens que diferem da tela atual. O simulador inicialmente não oferecia `useEffect`; esse suporte foi acrescentado para permitir exercitar a tela presente. Não interpretar esses resultados como aprovação do fluxo completo.

`npm run lint` continua com o import inexistente de `../components/Menu` em `plans.tsx` e avisos anteriores. `npm run typecheck` continua com esse import e a declaração ausente de `eslint-config-expo/flat`. Essas pendências não foram corrigidas nesta atividade.

Para repetir a verificação específica, execute na raiz do projeto:

```powershell
# Verifica os handlers do avanço entre campos e da conclusão da cultura.
node --test --test-name-pattern="confirmar no teclado|concluir no último" tests/createPlot.test.cjs

# Confere a suíte completa, incluindo as divergências de feedback registradas acima.
node --test tests/createPlot.test.cjs tests/plotRepository.test.cjs

# Verificações estáticas existentes, sem instalar ferramentas automaticamente.
npm run lint
npm run typecheck
```

## 11. Exercício de leitura e teste manual

Use um perfil de teste separado. Acompanhe primeiro uma cultura, depois o talhão inteiro:

1. Identifique onde o texto digitado entra em `fields` e onde a cultura passa a integrar `crops`.
2. Confirme pelo teclado cada campo, deixando o ano vazio, e confira os destinos de foco.
3. Tente concluir uma cultura sem nome ou com quantidade zero. Confira foco, mensagens e preservação dos textos.
4. Adicione duas culturas e remova apenas uma pela lixeira.
5. Tente salvar com área inválida. Espere o aviso geral desaparecer e confira que o erro específico permanece.
6. Corrija os dados, salve e confira que o formulário foi limpo. Consulte o cadastro pela lista e após reiniciar o aplicativo.

Explique com suas palavras por que preencher a cultura ainda não a coloca na lista, por que os campos só devem ser limpos após gravar e por que o contador auxiliar não substitui o ID do talhão.

Próximo exercício: conferir o avanço no Android e alinhar, em atividade própria, código e testes com o requisito de Snackbar de três segundos. Fonte ampliada, TalkBack, iOS e persistência real continuam exigindo verificação em dispositivo. O módulo 4 permanece em andamento.
