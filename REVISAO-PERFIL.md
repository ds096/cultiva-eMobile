# Perfil local — problemas e alterações sugeridas

Data: 23/10/2026. Referência: etapa 3.5 do guia. Este documento propõe ajustes; não altera a implementação.

## 1. Nome da rota diferente do arquivo

**Problema:** `src/app/_layout.tsx` declara `talhoes`, mas a tela é `src/app/plots.tsx`. A configuração de proteção não aponta para a tela existente.

**Sugestão:** usar `plots` no nome da rota do layout e manter “Meus Talhões” como título em português. Conferir o acesso com e sem perfil selecionado.

## 2. Armazenamento e contexto ficam diferentes

**Problema:** as telas de acesso e talhões chamam o repositório diretamente. O e-mail salvo muda, mas o estado do contexto permanece antigo; a navegação consulta esse estado desatualizado.

**Sugestão:** usar `selectProfile` no acesso e `clearProfile` na saída, obtidos por `useProfile`. Essas operações já atualizam armazenamento e contexto. Centralizar a decisão de navegação no layout, evitando redirecionamentos concorrentes nas telas. Manter tratamento de erros nas ações.

## 3. Restauração sem tratamento de erro

**Problema:** contexto e tela de acesso leem o perfil sem tratar exceções. Uma falha de leitura pode interromper a abertura do aplicativo, sem orientação para o usuário.

**Sugestão:** centralizar a restauração no contexto, tratar a falha e oferecer “Tentar novamente”. Distinguir “nenhum perfil salvo” de “não foi possível ler o perfil”; não apagar dados nem liberar o fluxo como se a leitura tivesse funcionado. Remover a leitura duplicada da tela. A criação da instância MMKV também deve ficar dentro de um fluxo que permita tratar falhas de inicialização.

## 4. Tema importado, mas não aplicado

**Problema:** o layout importa `PaperProvider` e `theme`, mas não usa nenhum deles. Os componentes Paper não recebem o tema personalizado.

**Sugestão:** envolver os provedores e a navegação com `PaperProvider`, passando `theme` na propriedade de mesmo nome. Os componentes nativos da tela de acesso precisam usar os tokens explicitamente ou ser substituídos por componentes Paper; o provedor não altera suas cores fixas automaticamente.

## 5. Ausência de perfil com tipos incompatíveis

**Problema:** o contrato do contexto aceita `string | null`, enquanto o estado e o retorno declarado do repositório também aceitam `undefined`. Isso causa o erro atual de TypeScript.

**Sugestão:** adotar `null` como única representação de ausência no contrato do repositório e no estado. Na leitura bem-sucedida, converter um resultado ausente para `null`. Manter erros de leitura separados desse valor; falha não significa ausência de perfil.

## Ordem e verificação

Aplicar em pequenas atividades: contrato de ausência → restauração → integração das telas com o contexto → rota → tema. A saída completa continua pertencendo à etapa 3.6.

Conferir entrada, saída, reinício, ausência de perfil e falha de leitura, além de executar lint e typecheck. A seleção por e-mail continua sendo apenas local, sem autenticação remota.
