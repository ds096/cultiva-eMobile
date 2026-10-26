# Revisão do módulo 3 — Perfil local

Data: 26/10/2026. Ênfase: etapa 3.5, navegação e restauração. Material baseado na inspeção atual, no [GUIA.md](GUIA.md) e no [modulo3.5.md](modulo3.5.md).

Este documento contém explicações e sugestões. O código do aplicativo não foi corrigido nesta entrega. A orientação de restauração por efeito dada anteriormente é revisada aqui devido ao diagnóstico real do lint.

## 1. O que o módulo ensina

| Etapa | Aprendizado |
| --- | --- |
| 3.1 — Esboçar | Planejar o que a tela precisa comunicar antes de programar. |
| 3.2 — Formulário | Relacionar o valor do campo ao estado e apresentar mensagens. |
| 3.3 — Validar | Normalizar a entrada e conferir seu formato. |
| 3.4 — Persistir | Guardar a seleção no dispositivo para outra abertura. |
| 3.5 — Navegar e restaurar | Compartilhar a seleção, decidir rotas e recuperar dados com tratamento de falhas. |
| 3.6 — Sair | Remover a seleção preservando registros; validar separação entre perfis. |

O produto nesta etapa seleciona um perfil por e-mail. Não comprova a identidade de quem digita, não autentica em servidor e não sincroniza dados.

## 2. Uma analogia: caderno e quadro de avisos

Imagine uma pequena oficina rural:

- O **MMKV** é o caderno guardado no armário: a anotação permanece quando todos vão embora.
- O **estado React** é o quadro de avisos usado durante o expediente.
- O **repositório** é o conjunto de procedimentos para consultar e alterar o caderno.
- O **ProfileProvider** mantém o quadro atualizado e oferece as operações de perfil.
- O **Context** é o mecanismo pelo qual outros componentes consultam essa informação compartilhada.
- A **Navigation** escolhe o caminho com base no que está no quadro.

Anotar no caderno não altera o quadro automaticamente. É por isso que a tela deve chamar `selectProfile`: essa operação grava no repositório e depois atualiza o estado React.

Ao reabrir a oficina, consultar o caderno e reconstruir o quadro é a restauração. O contexto não guarda dados permanentemente por conta própria.

## 3. Campo, normalização e validação

O `email` de `Access` é o texto em edição. O `email` do contexto é a seleção confirmada. São informações diferentes, mesmo quando têm nomes iguais.

Exemplo didático: a entrada `  PESSOA@EXAMPLE.COM  ` torna-se `pessoa@example.com` por `trim()` e `toLowerCase()`, conforme a regra local adotada. Esse exemplo não deve ser cadastrado em um perfil real.

O campo controlado usa `value` para mostrar o estado e `onChangeText` para solicitar sua alteração. Normalizar padroniza; validar confere o formato básico. Nenhuma dessas operações demonstra que o endereço existe ou pertence à pessoa.

`try` tenta uma operação; `catch` trata uma exceção; `finally` executa a finalização em ambos os casos. A mensagem de erro deve preservar o texto digitado para nova tentativa.

## 4. Context, Provider e PaperProvider

`createContext` cria o objeto que identifica o contexto. O provedor fornece um `value` aos descendentes. No projeto, `ProfileProvider` é o componente que mantém o estado e usa `PerfilContext.Provider` para compartilhá-lo.

`children` é o conteúdo colocado entre a abertura e o fechamento do componente. O layout coloca `Navigation` dentro de `ProfileProvider`.

O `PaperProvider` fornece tema e configurações aos componentes React Native Paper. Na analogia, ele define a apresentação do quadro, não o nome de quem está usando a oficina. Ele não seleciona nem persiste perfis. Também não aplica automaticamente o tema a todos os componentes nativos.

```text
PaperProvider — aparência dos componentes Paper
└── ProfileProvider — seleção compartilhada
    └── Navigation — lê a seleção e declara as rotas
        └── Access ou Plots
```

Criar um `ProfileProvider` independente em cada tela produziria quadros separados: uma tela poderia observar um perfil diferente da outra. O principal problema seria a inconsistência, não apenas perda de desempenho.

## 5. useContext e useProfile

| Recurso | Responsabilidade |
| --- | --- |
| `useContext(PerfilContext)` | Hook do React que lê o provedor correspondente mais próximo acima do componente. |
| `useProfile()` | Hook do projeto que faz essa leitura e lança erro se faltar o provedor. |

O hook personalizado não cria um novo estado para cada chamada. Componentes atendidos pelo mesmo provedor leem a mesma seleção. Chame hooks no topo do componente; as funções retornadas podem ser chamadas nos eventos dos botões.

Há uma diferença decisiva entre:

- **Contexto inteiro `null`:** não foi encontrado o provedor esperado; erro de montagem neste projeto.
- **`email: null` após leitura bem-sucedida:** não há seleção; situação normal.
- **Falha de leitura:** não sabemos se há seleção; é necessário apresentar erro e permitir tentar novamente.

Referências: [createContext](https://react.dev/reference/react/createContext) e [useContext](https://react.dev/reference/react/useContext).

## 6. Três operações, três intenções

| Operação | Quando usar | Efeito |
| --- | --- | --- |
| `selectProfile(email)` | Continuar após validar o formulário | Grava a seleção e atualiza a memória. |
| `restoreProfile()` | Tentar recuperar novamente a seleção | Lê o disco e atualiza o resultado da restauração. |
| `clearProfile()` | Sair | Remove a seleção e atualiza a memória. |

**Por que Plots não precisa de selectProfile?** Porque essa tela já é acessada com um perfil selecionado. Sua ação atual é sair, então precisa de `clearProfile`. Se futuramente mostrar o e-mail, poderá ler `email` pelo mesmo hook.

A chamada `const { clearProfile } = useProfile()` extrai apenas a operação usada pela tela. Isso não cria outro perfil e não impede que o contexto possua outras operações.

## 7. Persistência e criação sob demanda

O repositório atual usa a instância `cultiva-e-perfil` e a chave `perfil.email`. Alterar esses identificadores faria o código procurar outro local; não os renomeie como simples ajuste visual.

`getStorage` cria a instância quando necessário e a reutiliza. `ReturnType<typeof createMMKV>` obtém o tipo retornado por essa função; `let storage` permite guardar a instância depois.

Se a chamada de criação lançar uma exceção, a atribuição não termina e a variável continua `null`. Uma próxima tentativa pode repetir a criação. Isso cobre exceções dessa chamada; não torna uma compilação sem o módulo nativo funcional.

`getString(PERFIL_KEY) ?? null` converte `undefined` ou `null` em `null`. Não captura exceções, não valida e-mail e não transforma string vazia em `null`.

## 8. Diagnóstico de PerfilContext.tsx

O comando `npm run lint` reproduziu em `src/context/PerfilContext.tsx:51`:

> Calling setState synchronously within an effect can trigger cascading renders

Regra: `react-hooks/set-state-in-effect`.

O percurso é `useEffect` → `restoreProfile` → setters de estado. Como a leitura atual é síncrona, o efeito dispara imediatamente uma atualização após a primeira renderização. `useCallback` estabiliza a referência da função, mas não torna seu corpo assíncrono nem impede essas atualizações.

Esse padrão veio da orientação anterior do agente. O erro não significa que você copiou o exercício incorretamente. A sugestão é adaptar o desenho à leitura síncrona: inicializar o estado com o resultado de uma leitura protegida, e deixar a nova tentativa no evento do botão.

Não é necessário usar temporizadores, adicionar `async` sem uma operação assíncrona real ou desabilitar o lint para esconder o diagnóstico. A regra está explicada na [documentação oficial do React](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect).

## 9. Sugestão completa para o contexto — ainda não aplicada

Para manter `email` e o resultado da leitura coerentes, o exemplo usa um único objeto de estado. O contrato público preserva `loading` para continuar compatível com o layout atual, mas este fluxo síncrono produz diretamente `ready` ou `error`; não promete um indicador intermediário visível. Se houver restauração assíncrona no futuro, seu ciclo deverá ser revisto.

Substituição proposta para `src/context/PerfilContext.tsx`:

```tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { perfilRepository } from "../repositories/perfilRepository";

// Preserva o contrato consumido pelo layout atual.
type RestorationStatus = "loading" | "ready" | "error";

// Uma leitura síncrona termina com sucesso ou com erro.
type ProfileState = {
  email: string | null;
  restorationStatus: "ready" | "error";
};

// Define os dados e as operações compartilhados com as telas.
type PerfilContextType = {
  email: string | null;
  restorationStatus: RestorationStatus;
  restoreProfile: () => void;
  selectProfile: (email: string) => void;
  clearProfile: () => void;
};

// O valor padrão denuncia a ausência do provedor.
const PerfilContext = createContext<PerfilContextType | null>(null);

// Consulta o armazenamento sem gravar nem apagar dados de perfil.
function readProfile(): ProfileState {
  try {
    return {
      email: perfilRepository.get(),
      restorationStatus: "ready",
    };
  } catch {
    // O status impede interpretar esse null como ausência confirmada.
    return { email: null, restorationStatus: "error" };
  }
}

// Mantém a seleção compartilhada e coordena suas operações locais.
export function ProfileProvider({ children }: { children: ReactNode }) {
  // Passa a função, sem chamá-la: React obtém o estado inicial na montagem.
  const [profile, setProfile] = useState<ProfileState>(readProfile);

  // O botão de nova tentativa repete a leitura protegida.
  function restoreProfile() {
    setProfile(readProfile());
  }

  // Só publica a nova seleção depois de conseguir persistir.
  function selectProfile(novoEmail: string) {
    perfilRepository.save(novoEmail);
    setProfile({ email: novoEmail, restorationStatus: "ready" });
  }

  // Só confirma a saída depois de remover a seleção persistida.
  function clearProfile() {
    perfilRepository.remove();
    setProfile({ email: null, restorationStatus: "ready" });
  }

  // Compartilha o estado e as ações com os componentes descendentes.
  return (
    <PerfilContext.Provider
      value={{ ...profile, restoreProfile, selectProfile, clearProfile }}
    >
      {children}
    </PerfilContext.Provider>
  );
}

// Centraliza a leitura e exige o provedor correspondente.
export function useProfile() {
  const contexto = useContext(PerfilContext);
  if (!contexto) {
    throw new Error("useProfile precisa de ProfileProvider");
  }
  return contexto;
}
```

`...profile` copia as propriedades do estado para o objeto compartilhado. Uma única atualização mantém e-mail e status juntos.

`useState(readProfile)` passa um inicializador; `useState(readProfile())` executaria a leitura a cada execução do componente antes de chamar o hook. React pode chamar inicializadores mais de uma vez em desenvolvimento com Strict Mode: a consulta deve ser tolerante a repetição e não gravar nem remover dados de negócio. Essa leitura local é uma fotografia inicial, não uma assinatura de mudanças externas. [Referência: useState](https://react.dev/reference/react/useState).

O `getStorage` já implementado permite que a criação sob demanda aconteça dentro do `try`. Ainda é necessário testar no development build Android. Essa proposta não configura suporte web ou renderização no servidor.

## 10. Como o layout decide o que mostrar

| Resultado | Interface |
| --- | --- |
| `error` | Mensagem e botão “Tentar novamente”. |
| `ready` e `email: null` | Acesso. |
| `ready` e e-mail não vazio | Talhões. |

Na analogia: “não existe anotação” é diferente de “a gaveta emperrou e não consegui consultar”. Não apague o caderno para resolver uma gaveta emperrada.

`!email` e `!!email` convertem o valor em decisões booleanas, não validam formato nem identidade. O layout atual só monta a navegação quando o status é `ready`, evitando interpretar a falha como saída. As rotas protegidas controlam navegação no cliente, não autorização no servidor. [Referência: Expo Router](https://docs.expo.dev/router/advanced/protected/).

## 11. Achados adicionais em plots.tsx

O typecheck encontrou `TS2304: Cannot find name 'useState'` na linha 11. Sugestão: adicionar ao início do arquivo:

```tsx
// Mantém a mensagem de falha da saída na tela.
import { useState } from "react";
```

O lint também avisou que `erro` não é utilizado. O estado recebe a mensagem, mas a tela ainda não a mostra. Antes do botão “Sair”, sugerir:

```tsx
{/* Apresenta a falha sem depender apenas de cor. */}
{erro !== "" && <Text accessibilityRole="alert">{erro}</Text>}
```

Não é necessário importar ou chamar `selectProfile` para corrigir esses problemas.

## 12. Exercícios curtos de revisão

1. Explique o que muda no caderno e no quadro ao selecionar um perfil.
2. Diga por que o e-mail digitado ainda não é uma seleção confirmada.
3. Diferencie contexto nulo, seleção ausente e falha de restauração.
4. Explique por que `useCallback` não corrigiu a chamada síncrona dentro do efeito.
5. Localize a operação que o botão “Tentar novamente” executa e diga por que ela não apaga dados.
6. Explique o que aconteceria se `setProfile` viesse antes de uma gravação que falha.
7. Diga quais dados devem permanecer após sair e quais ainda não existem nesta versão.

Respostas esperadas: persistência e memória são atualizadas em etapas; o formulário é um rascunho; ausência e erro têm significados distintos; referência estável não muda a execução do corpo; a nova tentativa só lê; atualizar antes de persistir poderia mostrar sucesso sem gravação; sair remove a seleção, sem apagar registros de trabalho — a preservação desses registros ainda precisa ser validada quando existirem.

## 13. Verificações e registro de aprendizagem

Na árvore inspecionada, o acesso já usa `selectProfile`, a saída chama `clearProfile`, o repositório tem criação sob demanda e o layout possui recuperação visual. Isso demonstra implementação escrita, não validação no aparelho.

Resultados desta inspeção:

- `npm run lint`: erro de atualização síncrona no efeito do contexto e aviso de `erro` não usado em `plots.tsx`.
- `npm run typecheck`: falha por import ausente de `useState` em `plots.tsx`.
- Testes no aparelho: não executados nesta entrega.

A proposta completa da seção 9 foi verificada em memória, sem substituir o arquivo do usuário: lint sem erros ou avisos; verificação de tipos sem diagnóstico no contexto proposto. O único diagnóstico restante nessa simulação foi o import ausente de `useState` em `plots.tsx`. Isso valida estaticamente a sugestão, não comprova a recuperação em aparelho nem corrige a árvore atual.

Depois de aplicar as sugestões, executar novamente os dois checks e testar: entrada inválida, entrada válida, reinício com seleção, abertura sem seleção, falha de leitura com recuperação, falha de gravação e falha de saída. Simulações de falha devem usar ambiente de teste, sem corromper ou excluir dados reais.

**Atividade:** revisão e diagnóstico documental em 26/10/2026. **Aprendizado:** escolher o ciclo de inicialização conforme a operação real, distinguir estado de persistência e erro de ausência. **Bloqueios atuais:** lint e typecheck descritos acima. **Próximo exercício:** revisar a proposta do contexto, aplicar uma mudança por vez e verificar; depois conferir restauração no aparelho. O módulo 3.5 não é declarado concluído; a validação completa da etapa 3.6 permanece pendente.
