# Guia dos componentes

Este guia descreve os componentes próprios de `src/components` e seus usos no código atual. Componentes são partes da interface que recebem dados e ações, retornam elementos visuais e podem ser reutilizadas por uma tela. As telas continuam responsáveis por coordenar seus fluxos; as regras de talhão ficam em `src/domain` e a persistência em `src/repositories`.

## Mapa rápido

| Componente | Arquivo | Onde é chamado |
| --- | --- | --- |
| `AppDrawerContent` | [AppDrawerContent.tsx](AppDrawerContent.tsx) | [Layout do Drawer](../app/(drawer)/_layout.tsx) |
| `PlotCard` | [PlotCard.tsx](PlotCard.tsx) | [Lista de talhões](../app/(drawer)/plots.tsx) |
| `PlotCreatedFeedback` | [PlotCreatedFeedback.tsx](PlotCreatedFeedback.tsx) | [Tela de planos](../app/(drawer)/plans.tsx) |
| `PlotFormField` | [PlotFormControls.tsx](PlotFormControls.tsx) | [Cadastro de talhão](../app/createPlot.tsx) |
| `PlotFormButton` | [PlotFormControls.tsx](PlotFormControls.tsx) | [Cadastro de talhão](../app/createPlot.tsx) |
| `PlotRemoveButton` | [PlotFormControls.tsx](PlotFormControls.tsx) | [Cadastro de talhão](../app/createPlot.tsx) |
| `ProfileLanding` | [ProfileLanding.tsx](ProfileLanding.tsx) | [Tela inicial](../app/index.tsx) |

`AppDrawerContent`, `PlotCreatedFeedback` e `ProfileLanding` são exportações padrão: são importados sem chaves. `PlotCard` e os três controles de `PlotFormControls` são exportações nomeadas e usam chaves no import.

## AppDrawerContent

**Função:** monta o conteúdo personalizado do menu lateral: logo, lista de destinos e botão “Sair do perfil”.

**Entrada:** recebe `props` do tipo `DrawerContentComponentProps`, fornecidas pelo próprio Drawer. Essas propriedades são repassadas à área rolável e à lista de rotas. Os destinos e ícones são configurados no layout do Drawer, não neste componente.

**Funcionamento:** usa `useProfile()` para chamar `clearProfile`. Ao sair, uma referência impede toques repetidos antes da próxima renderização; o estado de carregamento também desabilita o botão. Se a remoção falhar, um `Snackbar` permite informar o erro e fechá-lo. A saída encerra a seleção local de perfil; ela não é uma operação de autenticação remota.

O rodapé usa os insets inferiores e laterais para ficar dentro da área segura. O `Snackbar` participa do fluxo do rodapé e não reaplica esses insets.

```tsx
// Em src/app/(drawer)/_layout.tsx
<Drawer drawerContent={(props) => <AppDrawerContent {...props} />}>
  {/* telas do Drawer */}
</Drawer>
```

## PlotCard

**Função:** apresenta um talhão em um card com o nome, as culturas e a quantidade de plantas de cada uma. O botão “Ver detalhes” solicita à tela a abertura dos detalhes.

**Entradas:**

- `plot: Plot`: objeto do talhão, com seu identificador e suas revisões.
- `onPressDetails: (id: string) => void`: função fornecida pela tela, chamada com o ID do talhão quando o botão é pressionado.

**Funcionamento:** `getCurrentRevision(plot).data` obtém os dados da revisão atual. O componente percorre `crops` com `map`, formata as quantidades com `toLocaleString("pt-BR")` e usa “planta” para a quantidade 1 e “plantas” para as demais. O card usa cores, espaçamento e borda arredondada dos tokens do tema. Atualmente, o índice da lista é usado como `key` para cada cultura.

Na tela de talhões, a `FlatList` entrega cada `item` ao componente. A função `handleViewDetails` recebe o ID e navega para `/plot/[id]`; o card não acessa o repositório nem executa a navegação diretamente.

```tsx
// Em src/app/(drawer)/plots.tsx, dentro da FlatList:
renderItem={({ item }) => (
  <PlotCard plot={item} onPressDetails={handleViewDetails} />
)}
```

## PlotCreatedFeedback

**Função:** apresenta a confirmação de que o primeiro talhão foi salvo neste dispositivo.

**Entrada:** não recebe props. Lê o parâmetro de rota `plotCreated` e verifica se a tela está em foco. O aviso só fica visível quando o parâmetro é a string `"true"` e a tela está focada.

**Funcionamento:** mostra um `Snackbar` por 4.000 ms; ao fechá-lo, remove o parâmetro da rota. Seu wrapper tem posição relativa e não acrescenta insets, pois a tela de planos já reserva a área segura.

**Fluxo:** após criar o primeiro talhão, `createPlot.tsx` navega para `/plans` com `plotCreated: "true"`. A tela de planos renderiza `<PlotCreatedFeedback />`. Nos cadastros seguintes, o destino é `/plots` sem esse parâmetro. A tela de planos ainda apresenta conteúdo em desenvolvimento.

## PlotFormControls

O arquivo reúne controles visuais do cadastro de talhão. Eles utilizam o tema compartilhado em [theme.ts](../theme/theme.ts); os dados e as ações continuam nas mãos da tela.

### PlotFormField

**Função:** apresenta um campo de texto com rótulo sempre visível, orientação ou erro. O campo cresce conforme a escala de fonte do sistema e associa o rótulo ao input para acessibilidade.

**Entradas principais:**

- `id` e `label`: identificam o campo e seu rótulo; `id` também é usado como `testID`.
- `value` e `onChangeText`: valor exibido e função chamada quando o usuário digita. A tela mantém o estado.
- `hint` e `error`: orientação e erro; quando há erro, ele tem prioridade sobre a orientação.
- `keyboardType`, `placeholder`, `editable`, `returnKeyType`, `submitBehavior` e `onSubmitEditing`: opções encaminhadas ao `TextInput` do Paper.
- `inputRef`: referência opcional que expõe apenas `focus()`, usando o tipo `PlotFormInput`.

Em `createPlot.tsx`, há campos para nome, área, ano, nome da cultura e quantidade. A tela fornece referências e ações para avançar pelo teclado. No último campo, a confirmação tenta adicionar a cultura; salvar o talhão continua sendo uma ação separada.

```tsx
// Exemplo simplificado: a tela mantém nome e setNome no estado.
<PlotFormField
  id="plot-name"
  label="Nome"
  value={nome}
  onChangeText={setNome}
  error={erroNome}
/>
```

### PlotFormButton

**Função:** apresenta um botão com efeito de toque e rótulo que pode ocupar mais de uma linha.

**Entradas:** `label` e `onPress`; `variant` opcional (`primary`, padrão, `secondary` ou `remove`); `disabled`, `loading` e `accessibilityLabel` opcionais. Enquanto `loading` é verdadeiro, o botão mostra um indicador e não aceita toque. O estado acessível informa quando está desabilitado ou ocupado.

**Onde é chamado:** no cadastro, “Adicionar cultura” usa a variante secundária e “Salvar talhão” usa a variante padrão. A tela fornece as funções de adicionar e salvar, além do estado de salvamento. A variante `remove` existe no controle, mas não é usada nessas chamadas atuais.

### PlotRemoveButton

**Função:** mostra uma lixeira para remover uma cultura do formulário, com ícone de 24 e área de toque de 48 × 48.

**Entradas:** `cropName`, `onPress` e `disabled`. O nome compõe o rótulo acessível, permitindo identificar qual cultura será removida.

**Onde é chamado:** em `createPlot.tsx`, uma vez para cada cultura adicionada. A função recebida remove a cultura correspondente da lista do formulário; o componente não altera armazenamento diretamente.

## ProfileLanding

**Função:** decide para qual tela abrir um perfil local e oferece recuperação quando a leitura dos talhões falha.

**Entrada:** `email`, recebido da tela inicial. `index.tsx` renderiza o componente quando existe um perfil selecionado e usa o e-mail como `key`, para remontá-lo quando o perfil muda.

**Funcionamento:** consulta `plotRepository.list(email)`. Se houver talhões, redireciona para `/calendar`; se a lista estiver vazia, para `/plots`. Se a leitura falhar, mantém uma tela de erro com “Tentar novamente” e “Sair do perfil”; uma falha ao sair também é apresentada. Uma falha de leitura não é tratada como lista vazia.

```tsx
// Em src/app/index.tsx: sem e-mail, exibe o formulário de acesso.
return email ? <ProfileLanding key={email} email={email} /> : <AccessForm />;
```

Essa seleção por e-mail é local e não comprova identidade. O componente consulta o repositório, mas não cria talhões.

## Como conferir e manter este guia

Ao criar, remover ou alterar um componente, confira suas props, estados e chamadas em `src` e atualize o mapa e a seção correspondente. Por exemplo, `rg -n 'PlotFormField' src` encontra a declaração e seus usos. Examine também a tela chamadora: o nome de uma prop não explica sozinho o que a ação faz. Componentes de bibliotecas como React Native Paper aparecem dentro destes arquivos, mas não são componentes próprios catalogados neste guia.
