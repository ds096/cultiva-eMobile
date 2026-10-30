# Guia de Componentes — React Native, Paper e Expo Router

Este documento apresenta os principais componentes utilizados no desenvolvimento do **cultiva-e**, explicando suas funções e quais problemas resolvem.

## Resumo: quando utilizar cada componente?

| Necessidade                            | Componente             |
| -------------------------------------- | ---------------------- |
| Agrupar e organizar elementos          | `View`                 |
| Criar conteúdo com rolagem             | `ScrollView`           |
| Exibir listas grandes                  | `FlatList`             |
| Proteger áreas reservadas pelo sistema | `SafeAreaView`         |
| Ajustar o layout ao teclado            | `KeyboardAvoidingView` |
| Exibir imagens                         | `Image`                |
| Exibir textos                          | `Text`                 |
| Receber informações digitadas          | `TextInput`            |
| Executar ações                         | `Button` / `AppButton` |
| Exibir menu personalizado              | `Menu`                 |
| Navegar entre telas com histórico      | `Stack`                |
| Configurar uma tela do Stack           | `Stack.Screen`         |
| Controlar acesso às rotas              | `Stack.Protected`      |
| Criar navegação por abas               | `Tabs`                 |

## Recomendação para o cultiva-e

Utilizar os componentes do **React Native** para estrutura e comportamento, os componentes do **React Native Paper** para padronização visual e os navegadores do **Expo Router** para gerenciar a navegação.

Essa separação facilita a manutenção do código, a reutilização de componentes e a organização das telas.

## 1. View

**Origem:** React Native

**O que é:** Componente utilizado para agrupar e organizar outros componentes. É semelhante à `div` do HTML.

**Qual situação resolve:** Organizar a estrutura da tela, definir espaçamentos, alinhamentos e posicionamento dos elementos.

**Props comuns:**

- `style`: define a aparência e o posicionamento.
- `accessible`: configura o agrupamento para acessibilidade.
- `onLayout`: executa uma função quando o layout é calculado.

**Exemplo de uso:** Agrupar os campos de um formulário.

## 2. ScrollView

**Origem:** React Native

**O que é:** Contêiner que permite rolagem vertical ou horizontal quando o conteúdo ultrapassa a área disponível.

**Qual situação resolve:** Exibir conteúdos maiores que a área visível da tela, como formulários extensos.

Pode utilizar uma altura fixa ou `flex: 1` para ocupar o espaço disponível.

**Props comuns:**

- `style`: define a área ocupada pelo componente.
- `contentContainerStyle`: estiliza o conteúdo interno.
- `horizontal`: habilita rolagem horizontal.
- `keyboardShouldPersistTaps`: controla os toques quando o teclado está aberto.

**Exemplo de uso:** Formulário de cadastro de talhão.

**Observação:** Renderiza todos os componentes filhos, mesmo os que estão fora da área visível.

## 3. FlatList

**Origem:** React Native

**O que é:** Componente otimizado para exibir listas com rolagem.

**Qual situação resolve:** Exibir grandes quantidades de registros sem renderizar todos simultaneamente.

**Props comuns:**

- `data`: lista de dados.
- `renderItem`: define como cada item será exibido.
- `keyExtractor`: identifica cada item.
- `ListEmptyComponent`: conteúdo exibido quando a lista está vazia.
- `onEndReached`: executa uma função ao se aproximar do final da lista.

**Exemplo de uso:** Lista de talhões, atividades e histórico de lançamentos.

**Diferença para ScrollView:** A `FlatList` utiliza virtualização para renderizar principalmente os elementos necessários à visualização, melhorando o desempenho de listas grandes.

## 4. SafeAreaView

**Origem:** react-native-safe-area-context

**O que é:** Componente que considera as áreas seguras do dispositivo.

**Qual situação resolve:** Evitar que elementos da interface sejam sobrepostos por regiões do sistema, como a barra de status e recortes da tela.

**Props comuns:**

- `style`: estilização.
- `edges`: define quais bordas recebem proteção.
- `mode`: define como os espaçamentos são aplicados.

**Exemplo de uso:** Proteger um cabeçalho personalizado no topo da tela.

**Observação:** Não resolve automaticamente a sobreposição do teclado. Pode ser o componente principal da tela, sem precisar de uma `View` externa.

## 5. KeyboardAvoidingView

**Origem:** React Native

**O que é:** Componente que ajusta o layout quando o teclado virtual aparece.

**Qual situação resolve:** Reduzir a possibilidade de o teclado cobrir campos e botões de formulários.

**Props comuns:**

- `behavior`: define como o layout será ajustado (`height`, `padding` ou `position`).
- `enabled`: ativa ou desativa o comportamento.
- `keyboardVerticalOffset`: define um deslocamento adicional.

**Exemplo de uso:** Tela de login com campo de e-mail.

## 6. Image

**Origem:** React Native

**O que é:** Componente utilizado para exibir imagens locais ou remotas.

**Qual situação resolve:** Apresentar logotipos, fotografias e imagens na interface.

**Props comuns:**

- `source`: origem da imagem.
- `style`: tamanho e aparência.
- `resizeMode`: define como a imagem se ajusta ao espaço.
- `accessibilityLabel`: descrição para acessibilidade.

**Exemplo de uso:** Logotipo do cultiva-e na tela de login.

**Observação:** O Expo também disponibiliza a biblioteca `expo-image`, com recursos adicionais de carregamento e cache.

## 7. Text

**Origem:** React Native ou React Native Paper

**O que é:** Componente utilizado para exibir textos.

**Qual situação resolve:** Apresentar títulos, descrições, mensagens e informações ao usuário.

**Props comuns:**

- `style`: estilização.
- `numberOfLines`: limita a quantidade de linhas.
- `onPress`: permite interação.
- `variant`: define o padrão tipográfico, quando utilizado o componente do Paper.

**Exemplo de uso:** Título "Meus talhões".

**Recomendação:** Preferir o `Text` do React Native Paper para manter a tipografia consistente com o tema do aplicativo.

## 8. TextInput

**Origem:** React Native ou React Native Paper

**O que é:** Componente que permite ao usuário digitar informações.

**Qual situação resolve:** Criar campos de entrada de dados em formulários.

**Props comuns:**

- `value`: valor atual do campo.
- `onChangeText`: função executada quando o texto muda.
- `placeholder`: texto de orientação.
- `keyboardType`: tipo de teclado.
- `editable`: permite ou bloqueia edição.
- `onFocus`: executa ao receber foco.
- `onBlur`: executa ao perder foco.
- `multiline`: permite múltiplas linhas.

**Exemplo de uso:** Nome do talhão, e-mail, quantidade de mudas e observações.

**Observação:** O teclado numérico não garante que o valor seja válido. Seletores de datas e opções geralmente utilizam componentes específicos.

## 9. Button / AppButton

**Origem:** React Native Paper / componente personalizado

**O que é:** Componente que permite executar ações por meio de botões.

**Qual situação resolve:** Oferecer ações como salvar, continuar, cancelar ou excluir.

**Props comuns:**

- `onPress`: função executada ao pressionar.
- `disabled`: desabilita a interação.
- `loading`: apresenta indicador de carregamento, no Paper ou em implementações personalizadas.
- `mode`: define a aparência do botão no Paper.
- `title`: texto utilizado pelo `AppButton` personalizado do projeto.

**Exemplo de uso:** Botão "Salvar talhão".

## 10. Menu

**Origem:** Componente personalizado do cultiva-e

**O que é:** Componente responsável por apresentar opções de navegação.

**Qual situação resolve:** Permitir que o usuário navegue entre as principais funcionalidades do aplicativo.

**Exemplo de uso:** Menu inferior com Talhões, Calendário, Insumos, Planos e Configurações.

**Observação:** Quando o mesmo menu aparece em várias telas, é recomendável utilizar um layout compartilhado.

O React Native Paper também possui um componente `Menu`, mas sua finalidade principal é apresentar opções em um menu suspenso.

## 11. Stack

**Origem:** Expo Router

**O que é:** Navegador que organiza as telas em uma pilha de navegação.

**Qual situação resolve:** Permitir navegar entre telas, mantendo um histórico que possibilita retornar à tela anterior.

**Exemplo de uso:** Navegar da lista de talhões para o cadastro de um novo talhão.

## 12. Stack.Screen

**Origem:** Expo Router

**O que é:** Componente utilizado para configurar uma tela dentro do navegador `Stack`.

**Qual situação resolve:** Personalizar o cabeçalho, título e comportamento de navegação de cada tela.

**Props comuns:**

- `name`: identifica a rota.
- `options`: configura a apresentação da tela.
- `headerShown`: opção dentro de `options` que controla a exibição do cabeçalho.
- `title`: opção dentro de `options` que define o título.

**Exemplo de uso:** Exibir o título "Meus Talhões" no cabeçalho.

## 13. Stack.Protected

**Origem:** Expo Router

**O que é:** Componente que controla o acesso a determinadas rotas conforme uma condição.

**Qual situação resolve:** Impedir que usuários sem um perfil selecionado acessem telas protegidas.

**Props comuns:**

- `guard`: condição que determina se a rota pode ser acessada.
- `redirectTo`: destino configurado para redirecionamento, quando suportado pela versão utilizada.

**Exemplo de uso:** Permitir acesso aos talhões somente quando existe um e-mail de perfil salvo.

**Observação:** A proteção de rotas no aplicativo não substitui autenticação e autorização no backend.

## 14. Tabs

**Origem:** Expo Router

**O que é:** Navegador que organiza telas em abas.

**Qual situação resolve:** Criar uma navegação inferior compartilhada entre as principais seções do aplicativo.

**Exemplo de uso:** Navegação entre Talhões, Calendário, Insumos, Planos e Configurações.

**Observação:** É uma alternativa ao menu inferior personalizado. Pode ser combinado com `Stack` para telas secundárias.

---
