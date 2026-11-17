# Guia de layout — lista de talhões

## Objetivo

Construir uma lista de talhões clara e acolhedora, usando o tema do cultiva-e e separando o card em um componente reutilizável. Você fará as alterações em pequenas etapas e poderá trazer cada uma para revisão antes de avançar.

**Resultado esperado:** cada card mostra o nome do talhão, todas as culturas e a quantidade de plantas de cada uma, além de um botão **Ver detalhes**. Acima da lista, um botão **Cadastrar Novo Talhão** abre o cadastro.

Referências do projeto: [guia visual](GUIA-VISUAL.md), [tema](src/theme/theme.ts), [regras do produto](CONTEXT.md) e [trilha de aprendizagem](GUIA.md).

## 1. Conheça o ponto de partida

A tela está em `src/app/(drawer)/plots.tsx`. Ela usa `useFocusEffect` para carregar os registros do perfil quando a tela recebe foco, `FlatList` para apresentá-los e `getCurrentRevision(item).data.name` para obter o nome atual. A navegação existente usa `router.push("/createPlot")` para cadastrar e a rota `/plot/[id]` com o ID para detalhes.

O card atual exibe somente o nome. A lista de culturas está em `getCurrentRevision(item).data.crops`; cada cultura possui `name` e `quantity`. A tela já distingue carregamento, erro e lista vazia. Preserve esses comportamentos e a separação por perfil ao trabalhar no layout. Confira também o estado atual da rota de detalhes antes de testar: a evolução dessa tela para histórico está prevista para uma etapa posterior no `GUIA.md`.

A tela atual também possui uma ação de sair e tratamento próprio de erro de saída. Antes de reorganizá-la, confira a navegação existente e preserve o acesso à saída e o tratamento de falhas. Uma falha de leitura não deve ser apresentada como lista vazia.

## 2. Pense na experiência antes do código

Uma proposta de organização, em uma coluna:

1. Cabeçalho da tela já fornecido pela navegação, seguido de um texto curto de orientação, se necessário. Evite repetir o título sem função.
2. Botão principal **Cadastrar Novo Talhão**, antes dos cards e acessível também quando a lista estiver vazia.
3. Lista de cards: nome em destaque; rótulo **Culturas**; cada cultura acompanhada de sua quantidade, por exemplo, **Café arábica — 1.200 plantas**; botão secundário **Ver detalhes**.
4. Na ausência de registros, apresente **Você ainda não possui talhões cadastrados.** próximo da ação de cadastro, sem duplicar o botão.

**UI** trata da apresentação: cores, tipografia, espaçamento e forma. **UX** trata do uso: o produtor consegue identificar o talhão, compreender suas culturas e encontrar a próxima ação? A hierarquia visual ajuda nessa resposta: nome primeiro, dados depois e ação por último. O guia visual prevê futuramente acesso ao planejamento e histórico; não crie ações sem destino funcional nesta atividade.

## 3. Aplique o tema

Importe `tokens` de `src/theme/theme.ts` e reutilize seus valores; não copie códigos hexadecimais para a tela. A tabela associa as escolhas à função visual:

| Elemento | Referência | Por quê |
| --- | --- | --- |
| Fundo da tela | `tokens.color.background` | Separa o fundo das superfícies. |
| Card | `tokens.color.surface`, borda `tokens.color.border`, `tokens.radius.card` | Agrupa os dados sem sombra excessiva. |
| Espaçamento | `tokens.space.md` no card e nas laterais; `sm` entre itens relacionados | Dá respiro e mantém consistência. |
| Nome | Texto do Paper com variante `titleMedium` | Usa a escala de título de card do tema. |
| Culturas | `bodyLarge` ou `bodyMedium`, com texto principal e secundário do tema | Mantém as informações legíveis. |
| Cadastro | `Button` do Paper com `mode="contained"` | Destaca a ação principal. |
| Detalhes | `Button` com `mode="outlined"` | Diferencia a ação de cada card da ação principal. |

Os controles precisam ter área de toque de pelo menos 48 × 48 e o botão principal altura mínima de 52, permitindo crescimento com fonte ampliada. Confirme o tamanho efetivo dos componentes no aparelho: a aparência padrão do Paper não garante essas medidas. Prefira `minHeight`, sem fixar a altura do card. Use uma separação consistente entre cards, por exemplo 16.

## 4. Crie o componente de card

Crie `src/components/PlotCard.tsx`. Sua responsabilidade é **apresentar** um talhão e avisar quando a pessoa solicitar detalhes. A tela continua responsável por carregar dados e decidir a navegação.

Uma interface possível é:

```tsx
import type { Plot } from "../domain/plot";

type PlotCardProps = {
  plot: Plot;
  onPressDetails: (id: string) => void;
};
```

- `plot` é a entrada com o registro completo; use `getCurrentRevision(plot).data` uma vez dentro do componente para obter nome e culturas atuais.
- `onPressDetails` é uma função recebida da tela. Ao pressionar **Ver detalhes**, o componente chama `onPressDetails(plot.id)`; a tela decide como navegar.
- A função não deve ser executada durante a renderização: use um callback, como `onPress={() => onPressDetails(plot.id)}`.
- Para cada cultura, apresente o nome e sua própria quantidade. Para singular e plural, considere `quantity === 1 ? "planta" : "plantas"`.

Ao renderizar `crops.map`, cada item precisa de uma `key` estável e única entre irmãos. O contrato atual de `Crop` contém nome e quantidade, sem ID; não presuma que os nomes sejam únicos. Para esta lista sem edição nem reordenação no próprio card, o índice pode ser usado como solução local; se futuramente a lista puder ser reordenada ou editada nessa apresentação, revise a identidade dos itens. Não use o índice como chave dos próprios talhões: esses já têm `id`.

Use componentes do React Native Paper para textos e botão, e `View`/`StyleSheet` para a composição. Faça o nome e os textos quebrarem linha naturalmente; não limite a altura nem o número de linhas para esconder culturas ou nomes longos. Comente o código onde isso ajudar a explicar uma decisão, sem repetir o que já é evidente.

## 5. Ligue o card à tela

Na tela de lista, importe `PlotCard`. No `renderItem`, passe o `item` como `plot` e uma função que receba o ID e execute a navegação já existente:

```tsx
router.push({
  pathname: "/plot/[id]",
  params: { id },
});
```

O ID identifica o talhão selecionado; a tela de destino pode consultar o registro do perfil ativo. Passar o objeto inteiro pela rota duplicaria dados que podem mudar e é desnecessário para essa navegação. Mantenha `keyExtractor={(item) => item.id}` na `FlatList`.

Depois, substitua o botão atual de adicionar pelo botão do Paper com o texto solicitado, preservando `router.push("/createPlot")`. Posicione-o no cabeçalho rolável da lista para aparecer tanto com registros quanto no estado vazio. Use `contentContainerStyle` para margens e espaçamento; não coloque a `FlatList` dentro de um `ScrollView` da mesma direção.

## 6. Estados e acessibilidade

- **Carregamento:** indique que os talhões estão sendo carregados, com texto legível e, se desejar, indicador visual.
- **Vazio:** explique a ausência de registros e mantenha o cadastro disponível. Vazio só deve aparecer após uma leitura bem-sucedida.
- **Erro:** informe que não foi possível carregar e preserve os caminhos existentes de recuperação e saída. Não apague dados locais para corrigir uma falha visual.
- **Leitor de tela:** mantenha textos em ordem lógica e identifique cada ação de detalhes com o nome do talhão no rótulo acessível, por exemplo, “Ver detalhes do talhão Central”. Verifique no TalkBack se o nome e as culturas são lidos sem duplicações.
- **Áreas seguras:** confira o `SafeAreaView` existente e como o layout pai aplica insets. Aplique o espaço inferior uma única vez, para que o último card e os controles fiquem acima da barra Android de três botões e também funcionem por gestos.
- **Conteúdo variável:** teste uma e várias culturas, nomes compridos, tela estreita e fonte ampliada. Cards devem crescer e permitir rolagem; não dependa apenas de cor para transmitir informação.

## 7. Sequência sugerida de prática

1. Identifique no código o caminho do registro até `data.crops`. Confira no domínio os tipos e a revisão atual.
2. Desenhe a organização de um card com duas culturas e defina a hierarquia dos textos.
3. Crie o componente com suas props e apresente nome e culturas usando os tokens. Revise o resultado antes de adicionar a ação.
4. Conecte o botão de detalhes por callback e integre o componente à `FlatList`.
5. Ajuste a ação de cadastro, o estado vazio e a apresentação de carregamento e erro, preservando a lógica existente.
6. Execute `npm run lint` e `npm run typecheck`, além dos testes relevantes existentes. Registre falhas anteriores separadamente de eventuais problemas novos.
7. No Android, use um perfil de teste separado para conferir: cadastro e retorno; talhão correto ao tocar em detalhes; várias culturas e quantidades; estado vazio; nomes longos; fontes ampliadas; TalkBack; rolagem e barra de navegação em três botões e por gestos. Registre o que foi efetivamente testado.

## Critérios para considerar a atividade concluída

- O card é um componente fora de `src/app`, recebe dados e callback e não consulta o repositório diretamente.
- Cada talhão mostra dados da revisão atual, todas as culturas e a quantidade correspondente; detalhes abre a rota com o ID correto.
- O cadastro está disponível inclusive com lista vazia, e os estados de carregamento, vazio e erro continuam distintos.
- Cores, medidas e tipografia seguem o tema; o conteúdo permanece acessível, legível e acima da navegação do Android.
- As verificações de código e os testes em dispositivo realizados, assim como eventuais limitações, foram registrados.
