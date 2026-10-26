# Módulo 3.5 — Navegar e restaurar o perfil local

Material de estudo criado em **26/10/2026**, com base no código atual e no [GUIA.md](GUIA.md). A etapa continua em andamento: este documento orienta o estudo, sem implementar suas pendências.

## 1. O problema que vamos resolver

O produtor informa um e-mail, toca em “Continuar” e espera entrar na área de talhões. Ao fechar e reabrir o aplicativo, espera encontrar sua seleção restaurada.

Para isso, duas informações precisam ficar coerentes:

- **Seleção em memória:** o valor que o React usa para apresentar a interface agora.
- **Seleção persistida:** o valor guardado no dispositivo para uma próxima abertura.

No código atual, o contexto já possui operações para atualizar as duas partes, mas as telas ainda acessam o repositório diretamente. Por isso, a navegação pode continuar vendo o valor antigo mesmo depois da gravação.

**Entradas:** e-mail normalizado e validado no acesso; seleção salva ao iniciar o app; solicitação de saída.

**Resultado esperado:** contexto atualizado após gravação bem-sucedida, rotas coerentes com a seleção e restauração com tratamento de falhas.

Selecionar um e-mail localmente não comprova identidade. Este fluxo não tem senha, autenticação remota ou sincronização.

## 2. Onde estudar no projeto

| Arquivo | O que observar |
| --- | --- |
| [PerfilContext.tsx](src/context/PerfilContext.tsx) | Contexto, estado, provedor e hook de perfil. |
| [_layout.tsx](src/app/_layout.tsx) | Composição dos provedores e decisão sobre as rotas. |
| [index.tsx](src/app/index.tsx) | E-mail digitado, validação e ação de continuar. |
| [plots.tsx](src/app/plots.tsx) | Tela temporária de talhões e ação de sair. |
| [perfilRepository.ts](src/repositories/perfilRepository.ts) | Leitura, gravação e remoção no MMKV. |
| [theme.ts](src/theme/theme.ts) | Configuração visual fornecida ao Paper. |

Leia os arquivos nessa ordem. Os trechos abaixo são recortes comentados para estudo, não uma implementação completa para substituir os arquivos.

## 3. Estado, propriedades e Context

**Estado** é uma informação mantida pelo React entre renderizações. No provedor, `email` é o valor atual e `setEmail` solicita sua atualização. Renderizar significa executar o componente para calcular o que deve aparecer na interface.

**Propriedades**, ou props, são entradas recebidas por um componente. Seria possível passar o perfil de componente em componente, mas intermediários precisariam repassar um dado que talvez nem utilizassem.

**Context** permite disponibilizar uma informação aos descendentes sem esse repasse em cada nível. O objeto criado por `createContext` identifica qual contexto será fornecido e lido; ele não é um banco de dados nem persiste informações. [Referência: createContext](https://react.dev/reference/react/createContext).

```tsx
// Recorte de PerfilContext.tsx: cria o contexto fora dos componentes.
// O tipo permite um objeto de perfil ou null quando não houver provedor.
const PerfilContext = createContext<PerfilContextType | null>(null);
```

Aqui, `PerfilContextType` descreve o objeto compartilhado: `email`, `selectProfile` e `clearProfile`. TypeScript verifica esse contrato durante o desenvolvimento; não grava nem valida dados no dispositivo por conta própria.

Há dois usos diferentes de `null`:

| Situação | Significado |
| --- | --- |
| O contexto inteiro vale `null` | Não foi encontrado um provedor correspondente acima do consumidor. |
| O contexto contém um objeto com `email: null` | Existe provedor, mas não há perfil selecionado. |

Uma seleção vazia é uma situação normal. A ausência do provedor, neste projeto, é um erro de montagem da aplicação.

## 4. O que é um Provider?

Provider significa **provedor**: fornece um valor aos componentes abaixo dele na árvore React.

No projeto, diferencie estes dois nomes:

- `PerfilContext.Provider`: mecanismo do React que disponibiliza o objeto recebido em `value`.
- `ProfileProvider`: componente criado no projeto que mantém o estado, define operações e usa esse mecanismo.

```tsx
// Recorte do retorno de ProfileProvider: publica os dados e as operações.
// children representa os componentes colocados dentro de ProfileProvider.
return (
  <PerfilContext.Provider value={{ email, selectProfile, clearProfile }}>
    {children}
  </PerfilContext.Provider>
);
```

`value` é o que os consumidores recebem. `children` é uma prop com o conteúdo envolvido pelo componente. No layout atual, esse conteúdo é `Navigation`.

O estado pertence a cada instância de `ProfileProvider`. Criar um provedor separado em cada tela produziria estados separados. O provedor comum acima da navegação permite que as telas compartilhem a mesma seleção.

Na versão React 19, também existe a forma `<PerfilContext value={...}>`. O código atual utiliza `.Provider`; não é necessário mudar essa sintaxe para aprender a etapa. [Referência: provedor de contexto](https://react.dev/reference/react/createContext).

## 5. O que é PaperProvider?

`PaperProvider` é um componente fornecido pela biblioteca **React Native Paper**. Ele disponibiliza o tema e configurações para os componentes da biblioteca. A implementação instalada também inclui suporte a portais, utilizados para apresentar conteúdo sobre outras partes da interface.

No projeto, recebe o objeto `theme` de `src/theme/theme.ts`. O perfil tem outra responsabilidade:

| Componente | Origem | Responsabilidade neste projeto |
| --- | --- | --- |
| `PaperProvider` | React Native Paper | Disponibilizar configuração visual aos componentes Paper. |
| `ProfileProvider` | Código do cultiva-eV2 | Compartilhar a seleção local e suas operações. |

Um não substitui o outro. O `PaperProvider` não salva e-mail, e o `ProfileProvider` não define cores.

O tema do Paper também não aplica automaticamente estilos a todo `View`, `Text` ou `TextInput` nativo. A tela de acesso ainda usa componentes nativos e estilos próprios. O cabeçalho da navegação também não deve ser considerado tematizado apenas por estar dentro do Paper.

Esta explicação foi conferida na implementação instalada: `node_modules/react-native-paper/src/core/PaperProvider.tsx`. Esse arquivo serve como referência de leitura, não deve ser editado para configurar o aplicativo.

## 6. Por que os provedores ficam no layout?

A composição atual de `src/app/_layout.tsx` é:

```text
Layout
└── PaperProvider — configuração visual
    └── ProfileProvider — estado e operações do perfil
        └── Navigation — lê o perfil e declara as rotas
            └── Tela disponível: index ou plots
```

Assim, `Navigation` está abaixo de `ProfileProvider` e consegue consumir seu valor. Importar `useProfile` não basta: o componente que o chama precisa estar dentro da árvore atendida pelo provedor.

A leitura procura o provedor correspondente mais próximo **acima** do consumidor. Colocar um provedor no JSX retornado pelo próprio componente não atende uma leitura feita nesse mesmo componente. Essa é a razão para `Layout` montar os provedores e outro componente, `Navigation`, consumir o perfil. [Referência: useContext](https://react.dev/reference/react/useContext).

## 7. Diferença entre useContext e useProfile

**`useContext` é um hook do React. `useProfile` é um hook personalizado deste projeto que usa `useContext` internamente.** Hook é uma função usada para acessar recursos do React ou organizar lógica que depende desses recursos.

| Pergunta | `useContext` | `useProfile` |
| --- | --- | --- |
| De onde vem? | De `react`. | De `src/context/PerfilContext.tsx`. |
| Recebe argumento? | Recebe o contexto a consultar. | Não recebe argumentos na implementação atual. |
| O que lê? | O contexto informado. | Especificamente `PerfilContext`. |
| Sem provedor? | Retorna o valor padrão do contexto, aqui `null`. | Lança um erro explicativo ao encontrar esse `null`. |
| Persiste dados? | Não. | A leitura não persiste; o objeto retornado contém operações que acessam o repositório. |

```tsx
// Implementação atual, comentada para mostrar cada responsabilidade.
export function useProfile() {
  // Usa o hook do React para ler o contexto de perfil.
  const contexto = useContext(PerfilContext);

  // Denuncia ausência do provedor, não ausência de e-mail selecionado.
  if (!contexto) {
    throw new Error("useProfile precisa de ProfileProvider");
  }

  // Entrega o objeto compartilhado, agora reconhecido como não nulo.
  return contexto;
}
```

O nome `useProfile` foi escolhido pelo projeto. Ele centraliza a leitura e a verificação, evitando repetir essa lógica em cada tela. Chamar o hook em duas telas não cria dois perfis: ambas leem o provedor que as atende.

```tsx
// Recorte para o corpo de um componente, antes de condições e retornos.
// A desestruturação extrai propriedades do objeto retornado pelo hook.
const { email, selectProfile } = useProfile();
```

Chame os hooks no nível superior de componentes ou de outros hooks, não dentro de condições, laços ou manipuladores de clique. A função `selectProfile` obtida pelo hook pode ser chamada no manipulador do botão.

Quando o valor fornecido pelo contexto muda, React atualiza seus consumidores. Isso não significa que `useContext` fica consultando o MMKV: ele acompanha o valor fornecido pelo React. [Referência: leitura e atualização de contexto](https://react.dev/reference/react/useContext).

## 8. Como memória, disco e navegação se conectam

Hoje, o acesso segue este caminho:

```text
Access → perfilRepository.save → MMKV
Access → solicita navegação
Navigation → ainda lê o email antigo do contexto
```

O fluxo a consolidar na etapa é:

```text
Access → valida e normaliza → selectProfile
selectProfile → grava pelo repositório → atualiza o estado React
Navigation → recebe o novo email → recalcula as rotas disponíveis
```

`selectProfile` já chama primeiro `save` e depois `setEmail`. Na operação síncrona atual, se a gravação lançar um erro, a atualização seguinte não será executada. A tela precisa apresentar a falha e preservar o texto digitado.

No layout, `!email` habilita a rota de acesso e `!!email` habilita a área interna. Esses operadores convertem a presença de uma string não vazia em uma decisão booleana; não validam o formato do e-mail.

Com `Stack.Protected`, uma rota indisponível não pode ser acessada normalmente pelo fluxo cliente. O Router redireciona para uma rota disponível quando necessário. Por isso, a decisão de disponibilidade deve permanecer no layout, baseada no estado coerente do perfil, evitando decisões concorrentes nas telas. Isso não fornece autorização em servidor. [Referência: rotas protegidas](https://docs.expo.dev/router/advanced/protected/).

## 9. Restaurar é diferente de selecionar

Selecionar começa com o formulário. Restaurar começa com uma leitura do armazenamento quando o provedor é montado.

O código atual utiliza uma função inicializadora em `useState`, que consulta `perfilRepository.get()`. Essa função fornece o estado inicial; não é uma assinatura para acompanhar futuras alterações no disco. Em desenvolvimento, o React pode executar inicializadores mais de uma vez para verificar pureza, portanto eles não devem ser usados para gravar ou apagar dados.

Ao encerrar o processo do app, o estado em memória é perdido. A seleção persistida permite reconstruí-lo na próxima abertura. O Context, sozinho, não realiza essa persistência.

O contrato pretendido no guia é:

| Resultado da restauração | Como interpretar |
| --- | --- |
| Leitura bem-sucedida com e-mail | Restaurar o perfil e disponibilizar a área interna. |
| Leitura bem-sucedida sem seleção | Representar ausência como `null` e mostrar acesso. |
| Leitura ou inicialização falhou | Mostrar estado de erro e permitir tentar novamente. |

Não transformar qualquer erro em `null`: isso faria uma falha parecer ausência normal de seleção. Enquanto a restauração estiver pendente ou em erro, não decidir as rotas apenas por `!email`.

Há uma sutileza no repositório atual: `createMMKV` é executado no carregamento do módulo, fora das funções de leitura. Um `try/catch` apenas em volta de `get()` no componente não cobre uma falha ocorrida antes, durante o import. O exercício de recuperação precisa considerar também onde a instância é criada, sem apagar dados automaticamente.

## 10. Situação observada em 26/10/2026

- `ProfileProvider`, `useProfile`, `PaperProvider` e as rotas protegidas já existem.
- As telas ainda gravam e removem a seleção diretamente pelo repositório.
- O acesso possui uma leitura adicional em `useEffect`; a restauração deve ser centralizada.
- O contexto ainda não apresenta recuperação de erro de leitura.
- Durante a elaboração deste material, uma edição externa unificou o contexto e o retorno do repositório em `string | null`. O repositório agora usa `?? null` para converter ausência em `null`. Esse ponto já aparece ajustado na inspeção final; falhas de leitura ainda precisam de tratamento separado.
- A referência a `REVISAO-PERFIL.md` no guia aponta para um arquivo ausente nesta inspeção. As pendências necessárias estão descritas no próprio `GUIA.md` e neste material.

Nenhum desses arquivos de implementação foi alterado nesta atividade documental.

## 11. Roteiro de estudo — uma atividade por vez

### A. Explicar antes de alterar

Localize `createContext`, `useState`, `value`, `children` e `useProfile`. Escreva uma frase sobre cada um. Depois explique por que o `PaperProvider` não resolve a seleção do perfil.

**Resultado:** conseguir percorrer a árvore do layout e apontar quem fornece e quem consome cada informação.

### B. Unificar ausência de perfil

O código observado ao final desta atividade já usa `string | null`. Revise o retorno do repositório e o tipo do estado para compreender o ajuste. Explique como `?? null` converte uma ausência retornada pelo armazenamento após uma leitura bem-sucedida, sem capturar exceções. Mantenha falhas separadas e não use coerções para esconder problemas.

**Verificação:** sem seleção, o valor deve ser `null`; com seleção, uma string; erro não deve ser interpretado como seleção vazia.

### C. Integrar o acesso ao contexto

Obtenha `selectProfile` com `useProfile` no topo de `Access`. No manipulador, preserve normalização, validação e tratamento de erro. Faça a seleção passar pela operação compartilhada e mantenha a decisão de navegação no layout.

**Verificação:** após salvar, a área interna deve abrir sem reiniciar o aplicativo. Se salvar falhar, não deve haver confirmação de sucesso.

### D. Centralizar restauração e recuperação

Remova a responsabilidade duplicada de restauração da tela quando o contexto assumir o fluxo completo. Considere falha de inicialização e leitura, mensagem compreensível e ação “Tentar novamente”. Não apague a seleção em resposta automática a uma falha.

**Verificação:** encerrar e reabrir deve restaurar a seleção; falha de leitura deve ter recuperação explícita. Use simulação controlada de falha em ambiente de teste, sem danificar dados reais.

### E. Integrar a saída

Faça a ação usar `clearProfile` e tratar falhas. A remoção bem-sucedida deve atualizar o estado e disponibilizar o acesso. A verificação completa da preservação de registros e separação entre perfis permanece na etapa 3.6.

**Verificação:** sair não deve exigir reinício para atualizar a interface. Falha de remoção não deve ser apresentada como saída bem-sucedida.

## 12. Perguntas para revisar o aprendizado

1. Quem mantém o estado: `createContext`, `useProfile` ou `ProfileProvider`?
2. Por que salvar no MMKV não atualiza automaticamente `Navigation`?
3. Qual a diferença entre contexto `null` e `email: null`?
4. Por que `useProfile` pode chamar `useContext`, mas não substitui o provedor?
5. O que acontece se cada tela tiver seu próprio `ProfileProvider`?
6. Por que a falha de leitura precisa de um estado diferente da ausência de perfil?
7. O que sobrevive ao encerramento do processo: estado React ou seleção persistida?
8. Por que uma rota protegida por e-mail local não comprova identidade?

**Respostas esperadas:** o provedor mantém o estado com `useState`; gravação em disco e atualização React são operações distintas; o contexto nulo indica falta de provedor, enquanto o e-mail nulo indica ausência de seleção; o hook facilita o consumo; provedores separados mantêm estados separados; erro exige recuperação; a seleção persistida pode ser restaurada; o e-mail informado não é uma credencial verificada.

## 13. Verificação e registro

Antes de concluir a etapa, conferir acesso válido e inválido, duplo toque, falha de gravação, reinício, ausência de seleção, falha de restauração e nova tentativa. Executar `npm run lint` e `npm run typecheck`. Checks estáticos não comprovam o comportamento no aparelho.

**Atividade de 26/10/2026:** criação deste material de estudo. Aprendizado proposto: separar fornecimento de dados, consumo, persistência e apresentação visual. A implementação da etapa 3.5 permanece pendente nos pontos descritos acima.

**Verificações desta entrega:** `npm run lint` e `npm run typecheck` passaram. Não houve teste em aparelho. Não há bloqueio para a leitura do material; a integração das telas e a recuperação de falhas continuam como trabalho de implementação, sem declarar a etapa concluída.

**Próximo exercício:** realizar a atividade A e explicar o percurso de um toque em “Continuar”, desde o formulário até a atualização das rotas; depois avançar para B.

**Referências:** [createContext](https://react.dev/reference/react/createContext), [useContext](https://react.dev/reference/react/useContext), [useState](https://react.dev/reference/react/useState), [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) e [rotas protegidas](https://docs.expo.dev/router/advanced/protected/). O manifesto atual declara Expo `~58.0.16`; o [índice oficial Expo](https://docs.expo.dev/llms.txt) foi consultado para conferir a documentação aplicável.
