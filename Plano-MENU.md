# Plano de estudo — reconstrução do menu

Preparado em **30/10/2026**, com base no código atual. **Você implementa; este documento orienta.** Nenhuma etapa abaixo está marcada como implementada. Faça uma atividade, confira o resultado e só então avance. Os exemplos contêm comentários e indicam onde entram; não cole todos os blocos de uma vez.

## 1. Resultado que vamos construir

Um menu com cinco botões, imagens PNG locais e rótulos em português. O layout renderiza uma única instância. A rota atual determina qual botão está selecionado, e a tela de configurações permite ligar ou desligar o destaque visual. `createPlan` e `createPlot` ficam disponíveis como telas de criação, sem virar opções do menu.

### O que existe de verdade hoje

| Arquivo/estado observado | Consequência para o estudo |
| --- | --- |
| Expo `~58.0.16`, Router `~58.0.24`, React Native `0.88.0`; entrada `expo-router/entry` | Continuaremos com Expo Router e TypeScript. |
| `src/components/Menu.tsx` desenha ícones usando várias `View` | Substituiremos essas formas por `Image` com PNG. |
| `src/app/_layout.tsx` coloca `<Menu />` dentro de `<Stack>` | O menu deve sair de dentro do navegador e ocupar espaço como seu irmão. |
| As telas já não renderizam o menu, mas ainda o importam | Remover esses imports durante a integração. |
| A configuração está em `src/app/settings.tsx` | Neste plano, “config.tsx” significa essa tela existente. Não criaremos duas rotas equivalentes. |
| `createPlan.tsx` e `createPlot.tsx` existem, como telas provisórias | Registrá-las no grupo protegido; corrigir nomes de funções e comentários copiados. |
| `plots.tsx` exporta uma função chamada `Settings`; `settings.tsx`, `Plots`; as duas criações, `Supplies` | O arquivo define a rota, mas esses nomes confundem a leitura. Renomear as funções sem renomear as rotas. |
| `assets/` contém `icon.png`, `icon2.png` e `logo_plus_name.png` | Os cinco PNGs do menu ainda precisam ser fornecidos. Não usar a logo como substituto silencioso. |
| MMKV e Nitro já estão instalados; há `perfilRepository.ts` | Podemos estudar persistência sem instalar outra biblioteca. Não mexer no armazenamento do perfil. |

Os registros antigos de base blank nos guias são históricos. O tema, o contexto de perfil e as rotas já existem. Este plano complementa a trilha; não conclui os módulos de talhões, planos ou persistência de entidades.

## 2. Decisões técnicas para entender antes de copiar

### 2.1 “O estado também será uma prop”: sim, com duas responsabilidades

Uma **prop** é um valor recebido do componente pai. **Estado** é informação que React mantém entre renderizações. Um valor de estado pode ser passado como prop, sem precisar ser duplicado com outro `useState` no filho.

Vamos trabalhar com:

| Valor | Origem | Quem recebe | Por quê |
| --- | --- | --- | --- |
| `activeRoute` | `usePathname()` no layout, validado contra as cinco rotas | `Menu` por prop | É um estado derivado da navegação. Funciona também com Voltar e abertura direta de rota. |
| `highlightEnabled` | `useState` no contexto de preferências | Configurações pelo contexto; menu por prop | É a escolha independente do usuário. |
| `selected` | Comparação entre `activeRoute` e o destino do item | Botão e acessibilidade | Informa qual tela está aberta. |
| `highlighted` | `selected && highlightEnabled` | Estilos do botão | Decide se aplicamos fundo suave, borda e negrito. |

**Por que não `useState("plots")` dentro do menu?** Ele poderia ficar incorreto ao voltar pelo Android, abrir uma rota diretamente ou navegar por outro botão. A navegação já mantém essa informação. Também não precisamos de `useEffect` para copiar a rota para outro estado.

Desativar o destaque remove fundo/borda/negrito de seleção. O botão continua anunciando sua seleção ao TalkBack. Seleção real e preferência visual são informações diferentes. Quando ligado, o destaque terá borda e peso de texto, além de cor.

### 2.2 Onde renderizar

Usaremos `View` externa com duas áreas: navegador com `flex: 1` e menu no rodapé. O menu não terá `position: "absolute"`; assim não cobre conteúdo. Dentro de `Stack`, ficam declarações de telas e grupos de proteção.

Manter `Stack` é uma escolha de escopo: preserva a estrutura atual e ensina composição. Um navegador `Tabs` seria outra solução adequada para abas com histórico próprio, mas exigiria estudar e reorganizar mais partes agora. Este menu personalizado **não cria históricos independentes de abas**; Voltar segue o histórico do Stack.

### 2.3 Telas de criação e visibilidade

Proposta adotada pelos exemplos: mostrar o menu somente nas cinco telas principais. Em `/createPlan` e `/createPlot`, escondê-lo para dar espaço à criação e usar botão Voltar. Isso é uma escolha de experiência, não uma exigência do Router.

Se preferir manter o menu nas criações, decida isso antes da etapa 5: será necessário escolher entre nenhum item selecionado e a seção de origem selecionada. Não presumiremos que `/createPlan` é `/plans`. Nos exemplos abaixo, as criações têm `activeRoute = null` e menu oculto.

### 2.4 Preferência: memória primeiro, disco depois

Primeiro vamos testar tudo em memória. Depois salvaremos a preferência com MMKV, já presente. Proposta: preferência **deste dispositivo**, compartilhada por seus perfis locais, inicialmente ligada e preservada ao sair. Isso simplifica uma preferência visual sem alterar dados do produtor.

Se você quiser preferência por perfil, decida antes da etapa 7: a chave deverá considerar a identidade local, a restauração ocorrerá na troca de perfil e um perfil não herdará o estado do anterior. Não implemente apenas uma chave global e anuncie que é por perfil. A seleção de e-mail local não é autenticação remota.

### 2.5 PNG e aparência

Usaremos `Image` do React Native, já disponível. Não precisamos instalar `expo-image` para cinco ícones locais pequenos. PNGs ficam fora de `src/app/`, com caminhos estáticos. Preservaremos suas cores; não aplicaremos `tintColor` automaticamente, pois isso pode destruir desenhos coloridos. O destaque ficará no botão.

A escolha de PNG solicitada aqui substitui, **apenas no menu**, a direção histórica de ícones vetoriais do guia visual. Preserve família visual consistente e rótulos completos.

## 3. Mapa das etapas

| Etapa | Pequenas atividades | Entrega verificável |
| --- | --- | --- |
| 0 | Ler contratos e decidir escopo visual | Explicar seleção versus destaque |
| 1 | Preparar cinco PNGs | Arquivos com nomes e caminhos corretos |
| 2 | Tipos, lista de itens e `getActiveMenuRoute` | Rotas principais reconhecidas; criações retornam `null` |
| 3 | `MenuIcon`, `Menu`, `handleNavigate`, estilos | Menu controlado por props, com PNGs |
| 4 | `MenuPreferencesProvider` e `useMenuPreferences` | Estado compartilhado em memória |
| 5 | `Navigation`, `Layout` e novas rotas | Um menu, fora do Stack, somente onde previsto |
| 6 | `Settings` e `handleHighlightChange` | Switch altera o destaque imediatamente |
| 7 | Repositório, restauração e falhas | Preferência sobrevive a reinício |
| 8 | Botões para criação, Voltar e áreas seguras | Criações acessíveis sem entrar no menu |
| 9 | Matriz de verificação e registro | Evidências e pendências documentadas |

**Ritmo sugerido:** uma função por sessão. As etapas 3 a 6 são uma integração: depois de mudar a assinatura de `Menu`, o layout antigo precisará das props. Não conclua que a etapa está validada enquanto o consumidor ainda não foi atualizado.

## Etapa 0 — Confirmar o comportamento

Antes de editar, escreva com suas palavras:

1. Em `/settings`, qual item é selecionado? Configurações.
2. Ao desligar o destaque, a rota muda? Não.
3. Ao usar Voltar, quem informa a tela atual? Expo Router.
4. Uma tela sem botão no menu deixa de ser rota? Não.
5. Ao fechar o aplicativo na versão em memória, a preferência permanece? Não; isso virá na etapa 7.

Registre sua decisão sobre esconder o menu nas criações e sobre preferência por dispositivo. Os próximos exemplos seguem as propostas acima.

## Etapa 1 — Preparar as imagens

Crie `assets/menu/` e coloque seus arquivos:

| Destino | Arquivo |
| --- | --- |
| Calendário | `assets/menu/calendar.png` |
| Talhões | `assets/menu/plots.png` |
| Insumos | `assets/menu/supplies.png` |
| Planos de manejo | `assets/menu/plans.png` |
| Configurações | `assets/menu/settings.png` |

Prefira fundo transparente, desenho centralizado e margens internas semelhantes. A caixa exibida será 24 × 24 unidades lógicas. Para nitidez, pode fornecer imagens de 24, 48 e 72 pixels como `plots.png`, `plots@2x.png` e `plots@3x.png`, repetindo o padrão para os demais. A base sem sufixo deve existir.

O `require` precisa de caminho literal conhecido pelo empacotador; não monte o caminho concatenando o nome do item. [Referência de imagens locais e densidades](https://reactnative.dev/docs/images).

**Verificação:** confira nome, extensão e letras maiúsculas/minúsculas. Os exemplos seguintes só funcionarão depois de os arquivos existirem. Se novas imagens não forem reconhecidas no Windows, reinicie o servidor de desenvolvimento existente. Não instale bibliotecas.

## Etapa 2 — Contratos e dados do menu

Crie `src/components/menuItems.ts`. Este arquivo contém dados e uma função pura, sem JSX. Copie os blocos 2.1, 2.2 e 2.3 nessa ordem no mesmo arquivo.

### 2.1 Tipos: quais valores aceitamos?

```ts
import type { ImageSourcePropType } from "react-native";

// Apenas as cinco telas principais podem ser destinos de itens do menu.
export type MenuRoute =
  | "/calendar"
  | "/plots"
  | "/supplies"
  | "/plans"
  | "/settings";

// Cada item reúne seu rótulo, sua rota e uma imagem local.
export type MenuItem = {
  label: string;
  href: MenuRoute;
  icon: ImageSourcePropType;
};
```

`MenuRoute` restringe os destinos. `ImageSourcePropType` descreve valores aceitos por `Image.source`. Tipos ajudam na edição, mas não comprovam que o PNG existe nem que o botão está legível.

### 2.2 Lista: conteúdo sem duplicar JSX

```ts
// Caminhos relativos a src/components; o destino é assets/menu na raiz.
export const menuItems: readonly MenuItem[] = [
  { label: "Calendário", href: "/calendar", icon: require("../../assets/menu/calendar.png") },
  { label: "Talhões", href: "/plots", icon: require("../../assets/menu/plots.png") },
  { label: "Insumos", href: "/supplies", icon: require("../../assets/menu/supplies.png") },
  { label: "Planos de manejo", href: "/plans", icon: require("../../assets/menu/plans.png") },
  { label: "Configurações", href: "/settings", icon: require("../../assets/menu/settings.png") },
];
```

Preservamos a ordem atual. `readonly` evita operações acidentais de alteração da lista pelo TypeScript. As telas de criação não entram aqui.

### 2.3 Função `getActiveMenuRoute`

**Entrada:** caminho atual como string. **Saída:** uma rota principal ou `null`. **Responsabilidade:** reconhecer destinos, sem navegar e sem modificar estado.

```ts
// Uma rota desconhecida não deve selecionar um botão por aproximação.
export function getActiveMenuRoute(pathname: string): MenuRoute | null {
  const item = menuItems.find((candidate) => candidate.href === pathname);
  return item?.href ?? null;
}
```

`find` procura o item; `?.` permite não encontrar; `?? null` explicita a ausência. Não usamos `includes` ou `startsWith`: `/createPlan` não é uma opção do menu.

**Confira mentalmente:** `/settings` → `/settings`; `/createPlan` → `null`; `/createPlot` → `null`; `/` → `null`. **Pergunta:** por que retornar a primeira opção para uma rota desconhecida mostraria informação falsa?

## Etapa 3 — Reconstruir `Menu.tsx`, função por função

Após preparar os PNGs, substitua o conteúdo de `src/components/Menu.tsx` pelos blocos 3.1 a 3.4, na ordem. As formas antigas (`iconParts`, `iconPart`, `ViewStyle`) deixam de ser necessárias.

### 3.1 Imports, contrato e função `MenuIcon`

**Entrada de `MenuIcon`:** uma imagem. **Saída:** imagem decorativa. **Por quê:** o botão já anuncia o rótulo; anunciar a imagem de novo repetiria informação.

```tsx
import { router } from "expo-router";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../theme/theme";
import { menuItems } from "./menuItems";
import type { MenuItem, MenuRoute } from "./menuItems";

// O pai informa a seleção real e a preferência visual separadamente.
type MenuProps = {
  activeRoute: MenuRoute | null;
  highlightEnabled: boolean;
};

// O botão fornece a descrição acessível; a imagem preserva sua proporção.
function MenuIcon({ source }: { source: ImageSourcePropType }) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={styles.icon}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
```

### 3.2 Função `Menu` e evento `handleNavigate`

Leia a função inteira antes de copiar. `Menu` recebe props e produz a interface. `handleNavigate` recebe um item e solicita navegação somente quando ele não é a tela atual. Não altera `highlightEnabled` nem salva nada.

```tsx
// A rota permanece sob controle do Router; o menu apenas apresenta e navega.
export default function Menu({ activeRoute, highlightEnabled }: MenuProps) {
  const { width, fontScale } = useWindowDimensions();

  // Mais espaço para rótulos completos e para fontes ampliadas.
  const itemWidth = fontScale > 1.6
    ? "100%"
    : width < 400 || fontScale > 1.2
      ? "50%"
      : "20%";

  // navigate reutiliza uma rota existente quando possível; push sempre empilha.
  function handleNavigate(item: MenuItem) {
    if (item.href !== activeRoute) {
      router.navigate(item.href);
    }
  }

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.menu}>
      <View style={styles.items}>
        {menuItems.map((item) => {
          // Seleção acessível continua verdadeira mesmo sem destaque visual.
          const selected = activeRoute === item.href;
          const highlighted = selected && highlightEnabled;

          return (
            <TouchableRipple
              key={item.href}
              onPress={() => handleNavigate(item)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              style={[
                styles.item,
                { width: itemWidth },
                highlighted && styles.highlighted,
              ]}
            >
              <View style={styles.content}>
                <MenuIcon source={item.icon} />
                {/* O rótulo pode crescer e quebrar em várias linhas. */}
                <Text style={[styles.label, highlighted && styles.highlightedLabel]}>
                  {item.label}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
```

Usamos papel de botão porque são ações de navegação personalizadas sobre Stack. `map` transforma cada item em um botão; a função de `onPress` só chama `handleNavigate` no toque. [Semântica de navegação do Router](https://docs.expo.dev/router/basics/navigation/).

### 3.3 Estilos

```tsx
// Tokens existentes evitam criar uma paleta paralela ao tema aprovado.
const styles = StyleSheet.create({
  menu: {
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    minWidth: tokens.size.touch,
    minHeight: tokens.size.button,
    borderRadius: tokens.radius.input,
    borderWidth: 2,
    borderColor: "transparent",
  },
  highlighted: {
    backgroundColor: tokens.color.surfaceMuted,
    borderColor: theme.colors.primary,
  },
  content: {
    alignItems: "center",
    paddingVertical: tokens.space.sm,
    paddingHorizontal: tokens.space.xs,
    gap: tokens.space.xs,
  },
  icon: { width: 24, height: 24 },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurface,
    textAlign: "center",
    alignSelf: "stretch",
  },
  highlightedLabel: { fontWeight: "700" },
});
```

### 3.4 Conferir a escolha responsiva

Os limites de largura e escala são um ponto inicial de projeto, não garantia de acessibilidade. Duas colunas dão mais espaço que as três atuais. Fonte muito ampliada usa uma coluna, mas aumenta bastante a altura do rodapé. Na etapa 9, se isso deixar a tela sem área útil em aparelho baixo ou paisagem, **não reduza a fonte**: revise a navegação para uma apresentação recolhível ou outro arranjo acordado antes de concluir. Não dê altura fixa aos rótulos.

**Pergunta:** por que `selected` não deve depender de `highlightEnabled`? **Resultado esperado após a integração:** PNGs preservados, apenas o botão atual destacado e nenhum destaque com a preferência desligada.

## Etapa 4 — Estado compartilhado em memória

Crie `src/context/MenuPreferencesContext.tsx`. Este primeiro arquivo é completo e temporariamente não usa disco.

```tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// O contexto oferece o valor e uma operação; a tela não acessa armazenamento.
type MenuPreferencesValue = {
  highlightEnabled: boolean;
  changeHighlight: (enabled: boolean) => void;
};

// null permite identificar um consumidor fora do provedor.
const MenuPreferencesContext = createContext<MenuPreferencesValue | null>(null);

// Um único estado abastece tanto Configurações quanto o layout.
export function MenuPreferencesProvider({ children }: { children: ReactNode }) {
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  // Recebe o novo valor do controle, evitando inverter valores antigos.
  function changeHighlight(enabled: boolean) {
    setHighlightEnabled(enabled);
  }

  return (
    <MenuPreferencesContext.Provider value={{ highlightEnabled, changeHighlight }}>
      {children}
    </MenuPreferencesContext.Provider>
  );
}

// Centraliza o acesso ao contexto e denuncia erro de montagem.
export function useMenuPreferences() {
  const value = useContext(MenuPreferencesContext);
  if (value === null) {
    throw new Error("useMenuPreferences precisa de MenuPreferencesProvider");
  }
  return value;
}
```

Estude nessa ordem: o tipo do contrato; `createContext`; `MenuPreferencesProvider`; `changeHighlight`; `useMenuPreferences`. O provedor recebe `children`, devolve os filhos envolvidos pelo contexto e mantém o booleano. O hook não cria outro estado; acessa o mesmo provedor.

**Por que não guardar dentro de `Settings`?** Ao desmontar essa tela, perderíamos sua instância; o menu também precisaria ser informado por um ancestral comum. **Limite desta etapa:** reiniciar o app volta para ligado.

## Etapa 5 — Integrar no `_layout.tsx`

O nome especial é `_layout.tsx`, com sublinhado. Preserve o tratamento atual de restauração do perfil e seus retornos de carregamento/erro.

### 5.1 Imports e hooks de `Navigation`

No import existente de `expo-router`, adicione `usePathname`. No de `react-native`, adicione `View`. Acrescente:

```tsx
// O layout liga navegação, preferências e apresentação do menu.
import { getActiveMenuRoute } from "../components/menuItems";
import {
  MenuPreferencesProvider,
  useMenuPreferences,
} from "../context/MenuPreferencesContext";
```

Dentro de `Navigation`, logo após o `useProfile()` existente e **antes de qualquer `if` com retorno**, adicione:

```tsx
// Hooks devem executar sempre na mesma ordem, inclusive durante a restauração.
const pathname = usePathname();
const { highlightEnabled } = useMenuPreferences();
const activeRoute = getActiveMenuRoute(pathname);
const showMenu = !!email && activeRoute !== null;
```

O Router atualiza `pathname`; cada nova renderização recalcula `activeRoute`. Não escreva um efeito para sincronizar os dois. `usePathname` é a API para ler o caminho atual. [API do SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/router/).

### 5.2 Substituir somente o retorno de sucesso de `Navigation`

Mantenha integralmente o `if (restorationStatus !== "ready")` existente. Troque o `return` que atualmente contém o Stack pelo bloco abaixo:

```tsx
// O navegador ocupa o restante da tela; o rodapé reserva sua própria altura.
return (
  <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <View style={{ flex: 1 }}>
      <Stack>
        {/* O acesso continua redirecionando para Talhões após selecionar perfil. */}
        <Stack.Protected guard={!email} redirectTo="/plots">
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Todas as telas internas, inclusive criações, exigem seleção local. */}
        <Stack.Protected guard={!!email} redirectTo="/">
          <Stack.Screen name="plots" options={{ title: "Meus Talhões" }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="supplies" options={{ headerShown: false }} />
          <Stack.Screen name="plans" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="createPlan" options={{ title: "Criar plano" }} />
          <Stack.Screen name="createPlot" options={{ title: "Criar talhão" }} />
        </Stack.Protected>
      </Stack>
    </View>

    {/* Menu é irmão da área do Stack, nunca uma tela registrada nele. */}
    {showMenu && (
      <Menu activeRoute={activeRoute} highlightEnabled={highlightEnabled} />
    )}
  </View>
);
```

Arquivos de rota são descobertos automaticamente; `Stack.Screen` permite configurar opções e incluí-los na proteção. Deixar criações fora do menu não restringe acesso por URL. Precisamos colocá-las explicitamente no grupo protegido. Isso é controle local de navegação, não autorização de servidor. [Rotas protegidas, incluindo `redirectTo` no SDK 58](https://docs.expo.dev/router/advanced/protected/).

### 5.3 Função `Layout`

Substitua somente a função exportada `Layout`:

```tsx
// Os consumidores recebem o tema, o perfil e uma única preferência compartilhada.
export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <ProfileProvider>
        <MenuPreferencesProvider>
          <Navigation />
        </MenuPreferencesProvider>
      </ProfileProvider>
    </PaperProvider>
  );
}
```

Remova o antigo `<Menu />` de dentro de Stack. Remova imports não usados de Menu em `calendar`, `plots`, `supplies`, `plans`, `settings`, `createPlan` e `createPlot`. Não acrescente Menu de volta nessas telas.

**Verificação:** acesso e restauração sem menu; cinco destinos com uma única instância; criações sem menu; saída volta ao acesso. Não altere a lógica de `selectProfile`/`clearProfile`.

## Etapa 6 — Configurações controla o destaque

Altere `src/app/settings.tsx`, sem criar `config.tsx`. Renomeie a função exportada de `Plots` para `Settings`. Preserve `handleExit`, `clearProfile`, o erro de saída e o botão Sair.

### 6.1 Preparar os imports e valores

Adicione `Switch` ao import do Paper, `SafeAreaView` de `react-native-safe-area-context`, `tokens` ao import do tema e o hook abaixo. Se já houver algum desses imports, apenas complete-o.

```tsx
// A tela consome a mesma preferência usada pelo menu no layout.
import { useMenuPreferences } from "../context/MenuPreferencesContext";
```

Dentro de `Settings`, antes do retorno, adicione:

```tsx
// O erro de preferência é independente do erro da ação Sair.
const { highlightEnabled, changeHighlight } = useMenuPreferences();
const [preferenceError, setPreferenceError] = useState("");

// Na etapa 7, changeHighlight poderá lançar erro de gravação.
function handleHighlightChange(enabled: boolean) {
  setPreferenceError("");
  try {
    changeHighlight(enabled);
  } catch {
    setPreferenceError("Não foi possível salvar a preferência. Tente novamente.");
  }
}
```

**Entrada:** novo booleano do Switch. **Efeito:** pede a atualização ao contexto. **Saída:** nenhuma; eventual falha vira mensagem. Não faça `setState` diretamente no menu.

### 6.2 Adicionar o controle sem perder a saída

Dentro do `ScrollView` atual, antes do erro/botão de saída, insira:

```tsx
{/* Uma coluna preserva espaço para fonte ampliada e rótulo completo. */}
<View style={{ gap: tokens.space.sm, marginBottom: tokens.space.lg }}>
  <Text variant="headlineSmall" accessibilityRole="header">Configurações</Text>
  <Text variant="bodyLarge">Destacar a tela atual no menu</Text>
  <Text variant="bodyLarge">
    {highlightEnabled ? "Ativado" : "Desativado"}
  </Text>
  <Switch
    value={highlightEnabled}
    onValueChange={handleHighlightChange}
    accessibilityLabel="Destacar a tela atual no menu"
    style={{ alignSelf: "flex-start", minWidth: tokens.size.touch, minHeight: tokens.size.touch }}
  />
  {preferenceError !== "" && (
    <Text accessibilityRole="alert">{preferenceError}</Text>
  )}
</View>
```

Troque a `View` externa da tela por `SafeAreaView` com `edges={["top", "left", "right"]}`, mantendo o estilo `flex: 1` e o fundo. Troque também o fechamento correspondente. O menu já cuida da área inferior; essa tela não tem cabeçalho nativo.

**Verificação:** desligar em Configurações tira o destaque do próprio botão Configurações imediatamente. Navegar para Talhões mantém tudo sem destaque. Religar passa a destacar o destino atual. Sair continua funcionando. Nesta etapa, a preferência ainda não sobrevive ao reinício.

O contrato `value`/`onValueChange` do Switch foi conferido no código instalado do Paper 5.15.3 (`node_modules/react-native-paper/src/components/Switch/Switch.tsx`). Estado acessível e estado visual devem continuar coerentes. [Acessibilidade no React Native](https://reactnative.dev/docs/accessibility).

## Etapa 7 — Persistir a preferência e tratar falhas

Só avance após o fluxo em memória funcionar. MMKV já está instalado; use a build Android com seus módulos nativos. Não instalar nem atualizar dependências nesta atividade.

### 7.1 Criar `src/repositories/menuPreferencesRepository.ts`

Estude uma função por vez: `getStorage` cria/reutiliza a instância; `getHighlight` lê e valida; `saveHighlight` grava. Nenhuma delas deve renderizar interface ou navegar.

```ts
import { createMMKV } from "react-native-mmkv";

// Instância separada para não misturar preferência com seleção de perfil.
let storage: ReturnType<typeof createMMKV> | null = null;
const HIGHLIGHT_KEY = "menu.highlightEnabled.v1";

// Criação tardia permite tratar falha nativa na operação que precisar do disco.
function getStorage() {
  if (storage === null) {
    storage = createMMKV({ id: "cultiva-e-preferences" });
  }
  return storage;
}

// Ausência usa o padrão ligado; false salvo deve continuar false.
function getHighlight(): boolean {
  const currentStorage = getStorage();
  if (!currentStorage.contains(HIGHLIGHT_KEY)) return true;

  const value = currentStorage.getBoolean(HIGHLIGHT_KEY);
  if (typeof value !== "boolean") {
    throw new Error("Preferência de menu inválida");
  }
  return value;
}

// Grava apenas essa preferência e não toca no e-mail selecionado.
function saveHighlight(enabled: boolean): void {
  getStorage().set(HIGHLIGHT_KEY, enabled);
}

// A interface do repositório esconde os detalhes do MMKV.
export const menuPreferencesRepository = { getHighlight, saveHighlight };
```

Por que não `valor || true`? Porque um `false` legítimo seria transformado em `true`. Por que não salvar no render? Renderizar pode ocorrer várias vezes; gravação pertence a uma operação explícita. A API instalada fornece `createMMKV`, `contains`, `getBoolean` e `set`. [Repositório oficial do MMKV](https://github.com/margelo/react-native-mmkv).

### 7.2 Evoluir o contexto, sem criar um segundo provedor

Em `MenuPreferencesContext.tsx`, adicione os imports de `menuPreferencesRepository`, `Text` e `AppButton`:

```tsx
// Persistência e apresentação de recuperação permanecem separadas do menu.
import { menuPreferencesRepository } from "../repositories/menuPreferencesRepository";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/AppButton";
import { theme, tokens } from "../theme/theme";
```

Antes de `MenuPreferencesProvider`, adicione o tipo e a função abaixo:

```tsx
// Uma leitura com falha não é interpretada como preferência desligada.
type PreferencesState =
  | { status: "ready"; highlightEnabled: boolean }
  | { status: "error" };

// Apenas lê; não apaga nem sobrescreve uma preferência inválida.
function readPreferences(): PreferencesState {
  try {
    return {
      status: "ready",
      highlightEnabled: menuPreferencesRepository.getHighlight(),
    };
  } catch {
    return { status: "error" };
  }
}
```

Substitua **somente `MenuPreferencesProvider`** pela versão abaixo. Mantenha o tipo `MenuPreferencesValue`, `MenuPreferencesContext` e `useMenuPreferences` da etapa 4.

```tsx
// Restauração síncrona acontece antes de disponibilizar os consumidores.
export function MenuPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(readPreferences);

  // Repete a leitura sem apagar o valor salvo.
  function restorePreferences() {
    setPreferences(readPreferences());
  }

  // Publica em memória somente depois que a gravação termina com sucesso.
  function changeHighlight(enabled: boolean) {
    menuPreferencesRepository.saveHighlight(enabled);
    setPreferences({ status: "ready", highlightEnabled: enabled });
  }

  if (preferences.status === "error") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView contentContainerStyle={{ padding: tokens.space.lg, gap: tokens.space.md }}>
          <Text accessibilityRole="alert">
            Não foi possível carregar a preferência do menu.
          </Text>
          <AppButton title="Tentar novamente" onPress={restorePreferences} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <MenuPreferencesContext.Provider
      value={{ highlightEnabled: preferences.highlightEnabled, changeHighlight }}
    >
      {children}
    </MenuPreferencesContext.Provider>
  );
}
```

**Decisão para avaliar:** essa versão simples interrompe o acesso enquanto a leitura falha. É previsível para aprender restauração, mas uma preferência visual não precisa necessariamente bloquear todo o aplicativo. Uma evolução possível é “Continuar temporariamente com o padrão”, identificando modo temporário e sem sobrescrever o disco. Isso exige mais um estado e uma decisão explícita; não esconda a falha com `catch { return true; }`.

Se o dado tiver tipo inválido, repetir a leitura não o conserta. Uma futura ação de redefinição deve explicar e substituir **somente** essa chave após decisão do usuário, jamais limpar todo o MMKV. Nesta etapa, registre o bloqueio caso ocorra.

**Verificação:** desligar, fechar completamente e reabrir mantém desligado; ligar e repetir mantém ligado. Sair e selecionar outro perfil mantém a preferência do dispositivo. Em falha de escrita, o Switch permanece no valor anterior e exibe erro. Em falha de leitura, há mensagem e nova tentativa, sem exclusão de dados.

## Etapa 8 — Abrir as criações e retornar

### 8.1 Corrigir nomes sem renomear arquivos

Renomeie as funções exportadas e ajuste seus comentários:

| Arquivo | Nome da função |
| --- | --- |
| `plots.tsx` | `Plots` |
| `settings.tsx` | `Settings` |
| `createPlan.tsx` | `CreatePlan` |
| `createPlot.tsx` | `CreatePlot` |

O comentário de cada criação deve explicar que é tela provisória de criação. Não precisa implementar o formulário de talhão/plano para estudar navegação.

### 8.2 Evento `handleCreatePlot`

Em `plots.tsx`, adicione imports de `router` de `expo-router` e `AppButton` de `../components/AppButton`. Dentro de `Plots`, antes do retorno:

```tsx
// Abre a criação a partir da lista; os campos serão estudados em outro módulo.
function handleCreatePlot() {
  router.navigate("/createPlot");
}
```

Na área de conteúdo, abaixo do aviso provisório:

```tsx
{/* A ação contextual abre uma rota que não é opção do menu. */}
<AppButton title="Criar talhão" onPress={handleCreatePlot} />
```

### 8.3 Evento `handleCreatePlan`

Repita em `plans.tsx`, com os mesmos imports:

```tsx
// A lista de planos é o ponto de entrada para a criação.
function handleCreatePlan() {
  router.navigate("/createPlan");
}
```

```tsx
{/* A criação pertence ao fluxo da lista, sem acrescentar um sexto item ao menu. */}
<AppButton title="Criar plano" onPress={handleCreatePlan} />
```

### 8.4 Evento de retorno com destino seguro

Ao entrar pela lista, o cabeçalho do Stack oferece Voltar. Em abertura direta, pode não haver histórico. Para oferecer saída também nesse caso, use um botão no conteúdo provisório de cada criação; não implemente ainda salvamento fictício.

Em `createPlot.tsx`, importe `router` e `AppButton` e coloque dentro de `CreatePlot`:

```tsx
// Volta ao histórico existente ou oferece um destino quando ele não existe.
function handleBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/plots");
  }
}
```

```tsx
{/* Permite sair inclusive quando a criação foi aberta diretamente. */}
<AppButton title="Voltar aos talhões" onPress={handleBack} />
```

Em `createPlan.tsx`, use a mesma lógica com `router.replace("/plans")` e rótulo “Voltar aos planos”. `replace` no fallback evita deixar uma criação sem histórico imediatamente atrás da lista. Caso o histórico possa vir de outra seção, prefira o rótulo genérico “Voltar” para não prometer um destino diferente de `router.back()`.

### 8.5 Áreas seguras

Nas criações, há cabeçalho nativo e não há menu: use `edges={["bottom", "left", "right"]}` na `SafeAreaView` de conteúdo. Em Talhões, o cabeçalho já protege o topo e o menu protege o rodapé; use somente `left` e `right`. Nas telas principais sem cabeçalho, mantenha `top`, `left` e `right`. Não duplique padding superior do cabeçalho nem deixe a parte inferior das criações sob a barra Android.

Quando os formulários existirem, rolagem e teclado precisarão de teste específico; esses dois cadastros permanecem fora deste plano. Não declarar implementação dos módulos 4 e 5 por ter criado seus caminhos de navegação.

## Etapa 9 — Verificar antes de concluir

Execute os scripts existentes na raiz, sem instalação automática:

```powershell
# Verifica regras e imports; não instala bibliotecas novas.
npm run lint

# Verifica tipos do projeto; registre também falhas anteriores a esta tarefa.
npm run typecheck
```

Esses comandos verificam os arquivos de código, **não compilam os exemplos dentro deste Markdown**. Depois de copiar cada bloco, execute novamente e confira o diff para não sobrescrever outras alterações.

### Matriz manual no Android

| Caso | Resultado esperado |
| --- | --- |
| Abrir sem perfil | Acesso sem menu |
| Restaurar perfil com falha | Mensagem existente preservada, sem menu |
| Selecionar perfil | Talhões com uma instância de menu |
| Abrir os cinco destinos | Rótulo e PNG corretos; só o atual destacado quando habilitado |
| Tocar novamente no atual | Não adicionar outra entrada intencional de histórico |
| Usar Voltar do Android | Seleção acompanha a rota exibida |
| Desligar em Configurações | Nenhum botão com destaque, inclusive após navegar |
| Religar | Somente o destino atual destacado |
| Fechar/reabrir após etapa 7 | Preferência restaurada, inclusive `false` |
| Sair | Acesso sem menu; preferência do dispositivo preservada |
| Criar talhão e criar plano | Abre pela lista; menu oculto; título e retorno presentes |
| Abrir criações sem perfil por URL | Redirecionamento para acesso; ausência no menu não é a proteção |
| Abrir criação diretamente com perfil | Há uma forma de voltar mesmo sem histórico |
| Tela estreita, paisagem e fonte ampliada | Rótulos sem corte, botões alcançáveis e conteúdo ainda utilizável |
| TalkBack ligado | Nome do botão e seleção anunciados; imagem sem anúncio duplicado |
| Sem conexão | PNGs locais e preferência não dependem de rede |
| Falha de persistência em ambiente de teste | Erro explícito; nada apagado; valor anterior preservado na escrita |

Teste falhas somente em ambiente/perfil de teste. Não altere ou apague arquivos de dados reais para forçar um erro. Se não houver mecanismo seguro de simulação, registre essa verificação como pendente.

### Critério de conclusão

As etapas só terminam quando o código copiado foi integrado, a matriz aplicável foi conferida e as limitações ficaram registradas. Um documento pronto não significa menu pronto. Não afirmar validação de iOS, TalkBack ou aparelho sem executar esses testes.

## Registro desta preparação — 30/10/2026

- Atividade: elaborar o plano solicitado a partir de `CONTEXT.md`, `GUIA.md`, `GUIA-VISUAL.md` e dos arquivos atuais.
- Aprendizado central: rota ativa é derivada da navegação; habilitação do destaque é preferência compartilhada; ambas chegam ao menu como props.
- Código do aplicativo: preservado; nenhuma dependência instalada. `createPlan.tsx` e `createPlot.tsx` já eram arquivos novos do responsável.
- Lint executado: sem erros, com sete avisos de import de `Menu` não utilizado nas telas listadas na etapa 5.
- Typecheck executado: falha preexistente TS7016 em `eslint.config.js:3`, por declaração ausente para `eslint-config-expo/flat`. Não corrigida nesta entrega documental; não desabilitar `strict` para ocultá-la.
- Bloqueios/limites: PNGs específicos ainda ausentes; exemplos não aplicados nem executados no aplicativo; validação visual, teclado e TalkBack pendentes. O aviso de tipos deve ser tratado em atividade própria antes de declarar a base totalmente aprovada.
- Próximo exercício: etapa 0, explicar as duas props e confirmar as escolhas de escopo; depois fornecer os cinco PNGs da etapa 1.

### Modelo para registrar cada sessão

| Data | Etapa/função | O que implementei | O que entendi | Verificações e resultado | Bloqueio | Próximo exercício |
| --- | --- | --- | --- | --- | --- | --- |
| A preencher | A preencher | A preencher | A preencher | A preencher | A preencher | A preencher |

## Referências técnicas

Consultadas em 30/10/2026; conferir novamente se a versão do projeto mudar.

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/): versão compatível com o manifesto atual.
- [Índice oficial Expo](https://docs.expo.dev/llms.txt): ponto de partida para documentação atualizada.
- [Layouts do Expo Router](https://docs.expo.dev/router/basics/layout/): função de layouts e navegadores.
- [API do Router no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/router/): hooks e métodos de navegação.
- [Navegação](https://docs.expo.dev/router/basics/navigation/): diferenças entre navegar, empilhar, substituir e voltar.
- [Rotas protegidas](https://docs.expo.dev/router/advanced/protected/): grupos e redirecionamento.
- [Imagens do React Native](https://reactnative.dev/docs/images): PNGs estáticos e variantes de densidade.
- [Acessibilidade do React Native](https://reactnative.dev/docs/accessibility): rótulos e estados acessíveis.
- [MMKV](https://github.com/margelo/react-native-mmkv): armazenamento local; assinaturas também conferidas na dependência instalada.

O plano usa decisões próprias de organização e experiência; as referências explicam as APIs, não aprovam automaticamente o desenho da interface.
