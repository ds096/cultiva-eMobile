# Módulo 3 — verificação e pendências

Data: 28/10/2026. Escopo: acesso por perfil local, conforme o módulo 3 do GUIA.md.

## Resultado

**O módulo 3 ainda não está completo.** Há implementação de seleção, persistência, restauração e saída, mas existe um erro de código que impede validar a tela de destino, requisitos de interface ausentes e verificações de comportamento pendentes. Por isso, o GUIA.md não foi marcado como concluído.

Esta atividade inspecionou o código e executou lint e typecheck. Não alterou a implementação, instalou bibliotecas nem executou o aplicativo em aparelho. As exclusões preexistentes de `REVISAO-MODULO-3.md` e `modulo3.5.md` foram preservadas.

## O que já existe no código

| Parte | Evidência atual | Limite da evidência |
| --- | --- | --- |
| Normalização e validação | `src/utilities/email.ts`: remove espaços externos, converte para minúsculas e verifica formato básico. | Não comprova existência do e-mail nem identidade. |
| Formulário | `src/app/index.tsx`: campo controlado, teclado de e-mail, mensagem de entrada inválida e tratamento de falha ao salvar, preservando o texto. | Faltam requisitos visuais e de acessibilidade descritos abaixo. |
| Integração | Acesso chama `selectProfile`; saída chama `clearProfile`, ambos por `useProfile`. | O problema antigo de telas alterarem diretamente o repositório foi resolvido no código. |
| Persistência | `src/repositories/perfilRepository.ts`: instância `cultiva-e-perfil`, chave `perfil.email`, retorno `string \| null` e criação sob demanda. | Funcionamento nativo e permanência após reinício não foram testados nesta revisão. |
| Restauração | `src/context/PerfilContext.tsx`: leitura centralizada, erro separado de ausência e nova tentativa; `_layout.tsx` apresenta mensagem e botão de recuperação. | É uma leitura síncrona; o estado `loading` previsto pelo layout não é produzido pelo contexto atual. |
| Navegação | `_layout.tsx` disponibiliza acesso ou talhões conforme o e-mail do contexto. | A tela `plots` contém o erro de importação abaixo. |
| Saída | A remoção apaga somente `perfil.email`; o contexto só limpa a seleção depois do sucesso. A tela captura a falha. | Ainda não há registros de negócio para comprovar preservação e isolamento entre perfis. |

As pendências históricas 2, 3 e 5 da etapa 3.5 no GUIA.md já têm implementação correspondente. Isso não basta para declarar todo o módulo concluído.

## 1. Corrigir a referência a useState — bloqueio imediato

**O que:** importar o hook `useState` de React em `src/app/plots.tsx`, usado na linha 11 sem importação.

**Por quê:** o typecheck falha com `TS2304: Cannot find name 'useState'`. Ao executar a tela, essa referência ausente impede seu funcionamento normal e compromete a verificação da entrada e saída.

**Como:** acrescentar a importação junto das demais, com comentário explicativo conforme o acordo do projeto. Manter o tratamento de erro da saída existente. Executar novamente lint e typecheck e abrir a tela no Android.

**Aceitação:** talhões abre após selecionar o perfil; a ação Sair pode ser acionada; nenhuma referência indefinida permanece.

## 2. Explicar o perfil local na tela de acesso

**O que:** adicionar uma explicação visível em `src/app/index.tsx` sobre seleção local, ausência de senha e falta de autenticação remota.

**Por quê:** é requisito explícito do módulo. Hoje a tela apenas solicita o e-mail, o que pode sugerir um acesso com identidade verificada.

**Como:** apresentar próximo ao campo uma mensagem como: “Este perfil fica salvo neste dispositivo. Não há senha nem verificação de identidade. Este acesso não autentica você em um servidor.” Manter a explicação legível e acessível, sem prometer sincronização ou proteção de dados por senha.

**Aceitação:** o produtor consegue compreender a limitação antes de continuar, inclusive com TalkBack e fonte ampliada.

## 3. Completar tema, teclado e acessibilidade do formulário

**O que:** adequar `src/app/index.tsx` ao tema existente e garantir que campo, mensagens e botão permaneçam alcançáveis. Conferir também `src/components/AppButton.tsx` e a tela de saída.

**Por quê:** a tela usa cores próprias (`#aaa`, `red`, `#2E7D32`), cantos de 8 e título de 28, em vez dos tokens aprovados. Não define os mínimos de campo e botão nem corpo de 16. O formulário fica em uma `View` centralizada, sem rolagem ou tratamento explícito do teclado. O campo não tem associação acessível explícita com seu rótulo; o `Pressable` não declara papel de botão e o erro não anuncia sua mudança.

**Como:** reutilizar `theme` e `tokens` de `src/theme/theme.ts` e os componentes existentes quando adequados. Aplicar campo mínimo de 56, botão mínimo de 52 e alvo de toque de 48, permitindo crescimento do texto. Preparar áreas seguras, rolagem e comportamento com teclado conforme a documentação do SDK instalado. Definir nome acessível do campo, papel/estado do botão e anúncio dos erros. Conferir quebra de rótulos no botão compartilhado. Usar o nome solicitado `cultiva-eV2`, sem inventar logo aprovada.

**Aceitação:** em Android estreito, com fonte ampliada e teclado aberto, é possível ler os avisos, digitar e continuar; TalkBack identifica campo, botão, erros e estado de processamento. A interface usa a paleta aprovada.

## 4. Tornar verificável a prevenção de repetição e o processamento

**O que:** revisar `handleContinue` e sua indicação de processamento em `src/app/index.tsx`.

**Por quê:** o código liga e desliga `carregando` no mesmo manipulador síncrono. Portanto, a presença de um indicador no JSX não comprova que ele seja exibido entre essas atualizações. O manipulador também não possui uma trava imediata contra reentrada; `disabled` depende de uma renderização. Gravar novamente a mesma chave não cria outro perfil, mas a prevenção de submissão repetida é requisito expresso.

**Como:** definir uma proteção imediata para a operação e uma liberação coerente com seu ciclo de execução, inclusive quando falhar, sem depender apenas do estado visual. Manter a persistência síncrona existente se ela atender ao fluxo; não adicionar espera artificial nem converter a operação em assíncrona apenas para exibir um indicador. Se for necessário um estado intermediário perceptível, organizar a sequência de renderização e execução e validar o resultado no aparelho. Comentar a escolha e testar toques rápidos, sucesso e erro.

**Aceitação:** toques repetidos não iniciam operações concorrentes ou transições repetidas; falha libera nova tentativa e preserva a entrada. O retorno visual é coerente com a duração real da operação.

## 5. Apresentar um estado vazio no destino

**O que:** completar a apresentação temporária de `src/app/plots.tsx` com uma mensagem de ausência de talhões.

**Por quê:** o módulo exige um destino inicial com estado vazio real. Hoje há somente título e Sair; não há orientação sobre a ausência de cadastros.

**Como:** exibir “Você ainda não possui talhões cadastrados.” Não inserir dados fictícios nem oferecer um botão de cadastro sem fluxo implementado. O cadastro e a persistência de talhões continuam no módulo 4.

**Aceitação:** o primeiro acesso apresenta uma área interna compreensível, vazia e com saída funcional.

## 6. Restaurar a verificação estrita de TypeScript — pré-requisito

**O que:** habilitar explicitamente `strict` no `tsconfig.json` e avaliar a restauração de `checkJs` para os arquivos JavaScript ainda abrangidos pelo projeto, conforme o acordo de preparação.

**Por quê:** o arquivo atual possui `compilerOptions` vazio. A configuração instalada `expo/tsconfig.base` habilita `allowJs`, mas não habilita `strict` ou `checkJs`. Assim, o comando atual não comprova a verificação estrita acordada, mesmo depois de corrigido o import.

**Como:** ajustar as opções locais, executar typecheck e corrigir os diagnósticos reais sem coerções para ocultar erros nem desativação das regras. JSON não admite comentários; explicar a mudança no registro da atividade. Não é necessária instalação para esse ajuste.

**Aceitação:** TypeScript estrito habilitado e verificação aprovada; qualquer impedimento remanescente documentado.

## 7. Validar restauração, saída e limites da separação local

**O que:** executar os cenários abaixo em uma compilação Android compatível com MMKV/Nitro. São pendências de validação, não comprovação de defeito em cada cenário.

**Por quê:** inspeção de código e lint não comprovam permanência do armazenamento, recuperação de falhas ou experiência no aparelho. Não há suíte de testes de perfil no código inspecionado.

**Como:** usar perfis exclusivos de teste. Para falhas de armazenamento, usar substituição controlada do repositório em um teste isolado, sem apagar nem corromper dados reais. Não instalar ferramentas sem autorização. Registrar resultado, aparelho/compilação e evidência de cada caso.

| Cenário | Resultado esperado |
| --- | --- |
| Entrada vazia e formato inválido | Erro compreensível; nenhuma seleção persistida. |
| E-mail com espaços externos e maiúsculas | Seleção normalizada, por exemplo `  TESTE@EXEMPLO.COM  ` → `teste@exemplo.com`. |
| Entrada válida e toques rápidos | Uma transição consistente para talhões, sem submissões sobrepostas. |
| Falha ao salvar | Mensagem de erro, texto preservado e possibilidade de tentar novamente. |
| Encerrar e reabrir o aplicativo | Perfil salvo restaurado e área interna aberta. Recarregar a interface não substitui esse teste. |
| Nenhuma seleção salva | Tela de acesso, sem mensagem falsa de falha. |
| Falha de criação/leitura do armazenamento | Mensagem de recuperação; nenhuma exclusão automática; Tentar novamente recupera após cessar a falha. |
| Saída bem-sucedida e reinício | Acesso exibido e seleção anterior não restaurada. |
| Falha ao remover seleção | Perfil continua ativo, erro visível e nova tentativa possível. |
| Alternância entre dois e-mails de teste | Contexto e seleção persistida correspondem ao perfil atual, sem resíduo da seleção anterior. |

**Limite importante:** só existe uma chave de seleção; ainda não há repositório de registros por perfil. A remoção restrita dessa chave está implementada, mas preservação de talhões e isolamento de registros reais não podem ser declarados testados. Documentar esse limite na etapa 3.6 e verificar o isolamento quando os primeiros dados forem implementados no módulo 4, vinculando-os ao perfil normalizado. Não construir antecipadamente todos os módulos para testar o acesso. Essa separação local nunca substitui autorização do backend.

## Verificações executadas nesta revisão

- `npm run lint`: aprovado, código de saída 0, sem diagnósticos exibidos.
- `npm run typecheck`: reprovado, código de saída 1; `src/app/plots.tsx(11,27): error TS2304: Cannot find name 'useState'`.
- Inspeção: rotas, contexto, repositório, utilitário de e-mail, botão, tema, configuração TypeScript e requisitos dos três guias.
- Não executados: compilação Android, testes em dispositivo, TalkBack, injeção de falhas e testes de reinício. Não há evidência nesta atividade para considerá-los aprovados.

## Ordem sugerida e registro de aprendizagem

Próximo exercício: corrigir apenas a importação de `useState`, executar as verificações e abrir/fechar o perfil no aparelho. Depois, tratar a configuração estrita, aviso local, formulário, processamento e estado vazio em pequenas atividades. Finalmente, executar a matriz de cenários e atualizar o GUIA.md com as evidências reais, corrigindo também suas descrições históricas que já não refletem o código.

Aprendizado desta revisão: a seleção persistida e o estado React agora estão integrados; isso resolve pendências antigas, mas existência de código não prova funcionamento completo. Uma aprovação do lint também não substitui a verificação de tipos ou o teste da jornada.

Bloqueios para declarar conclusão: erro de `useState`, requisitos de apresentação e interação ainda ausentes, configuração sem `strict` e validação funcional pendente. Nenhum módulo posterior foi declarado concluído.
