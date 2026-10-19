# cultiva-e — Guia visual

Atualizado em: 13/10/2026. Nome canônico: `GUIA-VISUAL.MD`.

## 1. Finalidade e aplicação

Este guia estabelece a base visual inicial solicitada para o cultiva-e. Aplicá-lo em novas telas e componentes e ajustá-lo quando houver feedback do responsável. As regras de produto estão em [CONTEXT.md](CONTEXT.md), o modo de trabalho em [AGENTS.md](AGENTS.md)

A biblioteca de interface adotada é **React Native Paper**. Seus componentes devem seguir a paleta, tipografia, medidas e estados deste guia; a escolha não amplia o escopo funcional. A identidade foi definida para esta primeira versão, sem presumir aprovação de logotipo ou reutilização de imagens dos produtos com nomes anteriores.

## 2. Direção visual

- Personalidade: simples, acolhedora, organizada e confiável.
- Referências: cultivo, cuidado com a terra e continuidade do trabalho no campo.
- Base: verdes escuros, fundos claros e conteúdo com boa separação visual.
- Prioridade: o produtor deve identificar a próxima ação e o estado de seus registros rapidamente.
- Nome exibido: **cultiva-e**, sempre com hífen e letras minúsculas.
- Logo aprovada para o login em 16/10/2026: `assets/images/logo_plus_name.png`, centralizada acima de “Seu cultivo, organizado”, com proporção original preservada e largura adaptável à tela, limitada a 320 unidades lógicas. Nas demais telas, manter o nome em texto; não improvisar símbolos diferentes.
- Evitar fotos decorativas atrás de formulários, gradientes intensos, excesso de sombras e ícones sem rótulo.
- Tema inicial claro. Tema escuro não integra esta entrega; não gerar uma paleta escura automaticamente.

## 3. Cores e tokens semânticos

Os tokens abaixo representam funções. Manter os nomes centralizados e mapear para o tema do React Native Paper; não repetir hexadecimais nas telas.

| Token                               | Cor                   | Uso                                                   |
| ----------------------------------- | --------------------- | ----------------------------------------------------- |
| `color.primary`                     | `#166534`             | Ação principal, links e item de navegação selecionado |
| `color.primaryPressed`              | `#14532D`             | Ação principal pressionada                            |
| `color.onPrimary`                   | `#FFFFFF`             | Texto e ícones sobre verde principal                  |
| `color.background`                  | `#F7FAF7`             | Fundo geral                                           |
| `color.surface`                     | `#FFFFFF`             | Cards, campos e superfícies                           |
| `color.surfaceMuted`                | `#EEF2EF`             | Áreas secundárias e fundo neutro                      |
| `color.text`                        | `#17251C`             | Títulos e texto principal                             |
| `color.textSecondary`               | `#526158`             | Texto auxiliar, metadados e placeholders              |
| `color.border`                      | `#D4DED6`             | Divisórias decorativas e cards                        |
| `color.controlBorder`               | `#6B7C70`             | Contorno de campos e controles identificáveis         |
| `color.success` / `color.successBg` | `#166534` / `#DCFCE7` | Conclusão e sincronização confirmada                  |
| `color.warning` / `color.warningBg` | `#92400E` / `#FEF3C7` | Atenção, atraso e pendências                          |
| `color.error` / `color.errorBg`     | `#B91C1C` / `#FEE2E2` | Falha, rejeição e ação destrutiva                     |
| `color.info` / `color.infoBg`       | `#1E40AF` / `#DBEAFE` | Informação e operação em andamento                    |

Combinações verificadas por cálculo de contraste:

| Primeiro plano / fundo           | Contraste aproximado |
| -------------------------------- | -------------------- |
| Branco / verde principal         | 7,13:1               |
| Texto principal / fundo geral    | 15,16:1              |
| Texto secundário / branco        | 6,54:1               |
| Sucesso / fundo de sucesso       | 6,49:1               |
| Atenção / fundo de atenção       | 6,37:1               |
| Erro / fundo de erro             | 5,30:1               |
| Informação / fundo de informação | 7,15:1               |

Usar como referência mínima 4,5:1 para texto comum. Os valores acima valem para as combinações exatas e opacas; transparências, imagens e cores modificadas exigem nova verificação. A borda clara decorativa não deve ser o único indicador de um controle: usar `controlBorder` em campos. Não usar `controlBorder` para texto pequeno sobre branco.

## 4. Tipografia

Fonte inicial: fonte padrão do sistema no Android, sem dependência de download. Uma fonte personalizada poderá ser incorporada ao aplicativo posteriormente, preservando a escala e o suporte aos acentos do português.

Valores em unidades lógicas do React Native; respeitar a escala de fonte do dispositivo. A referência de composição é uma tela de 390 × 844 unidades, sem tamanho fixo de tela ou posicionamento absoluto global.

| Papel                                 | Tamanho / entrelinha | Peso                       |
| ------------------------------------- | -------------------- | -------------------------- |
| Título de tela                        | 24 / 32              | 700                        |
| Título de seção                       | 20 / 28              | 600                        |
| Título de card                        | 18 / 26              | 600                        |
| Corpo, campo e botão                  | 16 / 24              | 400 no corpo; 600 no botão |
| Rótulo e informação auxiliar          | 14 / 20              | 400 ou 500                 |
| Texto excepcional de baixa prioridade | 12 / 18              | 400                        |

Não colocar datas essenciais, custos ou ações principais em 12. Não desativar ampliação de fonte para corrigir um layout. Expandir cards e permitir quebra de texto. Truncar somente conteúdo secundário com acesso ao texto completo.

## 5. Espaçamento e forma

| Token          | Valor lógico | Aplicação                                   |
| -------------- | ------------ | ------------------------------------------- |
| `space.xs`     | 4            | Ajustes pequenos entre ícone e texto        |
| `space.sm`     | 8            | Elementos relacionados                      |
| `space.md`     | 16           | Margens laterais, padding de cards e campos |
| `space.lg`     | 24           | Separação de seções                         |
| `space.xl`     | 32           | Separação entre blocos de destaque          |
| `radius.input` | 12           | Campos e botões                             |
| `radius.card`  | 16           | Cards e painéis                             |
| `radius.badge` | 999          | Indicadores curtos                          |

- Botão principal: altura mínima 52; campos: mínima 56; área de toque de ações: mínima 48 × 48.
- Esses tamanhos são mínimos: ampliar para fontes maiores ou textos em mais de uma linha.
- Separação entre cards: 12 ou 16; usar o mesmo valor em uma lista.
- Bordas discretas de 1; foco visível com contorno de 2 e verde principal.
- Preferir cards com borda leve; sombras apenas quando a elevação ajudar a entender a hierarquia.
- Respeitar áreas seguras, barra de navegação do Android e teclado. Botões fixos não podem cobrir o conteúdo.
- Em telas estreitas, manter uma coluna; evitar tabelas densas e rolagem horizontal para tarefas principais.

## 6. Componentes

### Cabeçalho e navegação

- Telas de lista: título à esquerda e ação de adicionar à direita, quando aplicável.
- Telas de criação e de edição autorizada: voltar, título e uma ação principal de salvar ao final do formulário. Lançamentos têm criação e consulta, sem tela ou ação de edição após salvar.
- Ícones visuais de 24 dentro de alvos de toque de 48; adicionar descrição acessível.
- Não duplicar uma mesma ação principal no cabeçalho e em um botão flutuante sem necessidade.
- A entrega local usa as cinco áreas de navegação descritas na seção 11, mantendo os rótulos legíveis em telas estreitas e com fonte ampliada.

### Botões

- Primário: fundo verde, texto branco e verbo claro, como “Salvar talhão”.
- Secundário: fundo branco, contorno verde e texto verde, como “Ver histórico”.
- Terciário: texto verde para ação de menor destaque, mantendo a área de toque.
- Destrutivo: vermelho, rótulo explícito e confirmação quando houver perda relevante.
- Durante processamento: indicador e rótulo correspondente. Impedir envio duplicado sem bloquear a tela indefinidamente.
- Se uma ação estiver indisponível por regra, explicar o motivo. Não reduzir toda a tela à baixa opacidade.

### Formulários

- Rótulo persistente acima do valor; placeholder é exemplo, não substitui o rótulo.
- Uma coluna, agrupando campos relacionados e distinguindo campos opcionais.
- Unidade visível em quantidades, como kg, L e ha, apenas quando suportada pelo contrato.
- Mensagem de erro abaixo do campo, com texto e sinal visual; preservar valores preenchidos.
- Teclado adequado para texto, e-mail e números. Aceitar a entrada decimal local conforme o contrato de conversão.
- Exibir datas em `dd/MM/aaaa` e valores em reais como `R$ 125,50`; no JSON, dinheiro e quantidades são strings decimais canônicas; normalização e escalas devem seguir o contrato comum, sem conversão para ponto flutuante no cálculo.
- Ao salvar sem conexão: “Salvo neste dispositivo. Aguardando sincronização.”

### Cards de talhão

- Nome em destaque, seguido dos dados disponíveis de identificação do talhão.
- Acesso claro ao planejamento e botão “Ver histórico”.
- Menu de mais opções com descrição “Mais opções do talhão”.
- Não mostrar propriedade, produção, lucro ou contagens que não existam no escopo ou nos dados.

### Cards de atividade e histórico

- Atividade: nome, período previsto e situação; custo somente quando houver informação aplicável.
- Histórico: atividade executada, data, custo registrado e acesso à consulta do lançamento, sem botão “Editar”. Não permitir alterar dados ou fotos de lançamento salvo, mesmo pendente de envio.
- Foto é conteúdo do produtor, não preenchimento obrigatório. Não inserir imagens fictícias em registros reais.
- Diferenciar zero informado de valor ausente: `R$ 0,00` versus “Não informado”.
- Não incluir situação “Iniciada”.

## 7. Situação da atividade e sincronização

São informações diferentes e não devem compartilhar um único indicador. Uma atividade pode estar concluída e ainda aguardar sincronização.

| Situação da atividade            | Aparência                        | Exemplo de rótulo |
| -------------------------------- | -------------------------------- | ----------------- |
| Em aberto                        | Neutro com ícone de calendário   | Em aberto         |
| Prazo ultrapassado sem conclusão | Atenção com ícone de relógio     | Atrasada          |
| Concluída                        | Sucesso com marca de confirmação | Concluída         |

| Estado dos dados                       | Aparência                                       | Mensagem sugerida                                                        |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| Salvo localmente, ainda não enviado    | Neutro com ícone de dispositivo                 | Salvo neste dispositivo                                                  |
| Na fila                                | Atenção com ícone de sincronização              | Aguardando sincronização                                                 |
| Em envio                               | Informação com progresso                        | Sincronizando                                                            |
| Aceito pelo servidor                   | Sucesso com confirmação                         | Sincronizado                                                             |
| Falha de conexão                       | Atenção com nova tentativa                      | Não foi possível sincronizar. Seus dados estão salvos neste dispositivo. |
| Rejeição de regra em cadastro editável | Erro com acesso à correção autorizada           | Revise este registro para sincronizar                                    |
| Rejeição de lançamento salvo           | Erro com motivo consultável, sem ação de editar | Lançamento não sincronizado. Consulte o motivo.                          |

Não apresentar uma rejeição do backend como simples falta de internet. O tratamento de um lançamento rejeitado ainda depende de regra de produto; não criar edição, cancelamento ou descarte implícitos. Se apenas uma foto estiver pendente, mostrar “Registro sincronizado; foto pendente”, sem afirmar que todo o conjunto foi enviado.

## 8. Estados vazios e mensagens

- Talhões: “Você ainda não possui talhões cadastrados.” Ação: “Adicionar talhão”.
- Planos: “Você ainda não criou um plano de manejo.” Ação: “Criar plano”.
- Histórico: “As atividades realizadas aparecerão aqui.”
- Sem conexão: “Você está sem internet. Continue registrando suas atividades neste dispositivo.” Exibir somente nos fluxos que realmente funcionam offline.
- Erro de formulário: explicar como corrigir, por exemplo “A data final deve ser igual ou posterior à data inicial”.
- Evitar códigos técnicos, “erro desconhecido” sem orientação e mensagens que culpem o produtor.
- Mensagens temporárias não podem ser a única forma de perceber uma pendência persistente.

## 9. Fotos, ícones e acessibilidade

- Uma única família de ícones, com espessura e tamanho consistentes; a biblioteca será escolhida na implementação.
- Não usar emojis como ícones de navegação ou status.
- Miniaturas de fotos em proporção 4:3, com visualização completa ao abrir. A miniatura não altera o arquivo original por si só.
- Permitir entender envio pendente e falha por texto e ícone. Remover ou trocar foto no formulário só antes de salvar o lançamento; depois, permitir consulta e reenvio técnico do mesmo arquivo.
- Adicionar rótulos, papel e estado acessíveis aos controles. Conferir ordem de leitura e navegação com TalkBack.
- Nunca comunicar erro, conclusão ou seleção somente pela cor.
- Verificar fontes ampliadas, nomes longos, teclado aberto, ausência de foto e uso sem conexão.
- Reduzir animações decorativas; não depender de movimento para entender uma ação.

## 10. Aplicação pela IA e validação

1. Ler este guia antes de criar ou modificar interfaces.
2. Mapear tokens aos componentes do React Native Paper, mantendo uma fonte única de valores no tema e nos componentes compartilhados.
3. Reutilizar componentes de botão, campo, card e indicador já existentes.
4. Conferir Android em tela estreita e com fonte ampliada quando houver dispositivo disponível.
5. Revisar estados vazios, erro, offline e sincronização, além da aparência normal.
6. Registrar qualquer desvio necessário e atualizar o guia quando a mudança for aprovada.

As razões de contraste foram calculadas para as cores deste documento. Isso não equivale a uma auditoria de acessibilidade do aplicativo, ainda não realizada nesta entrega.

Referência para contraste: [W3C — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), consultada em 05/10/2026. Medidas de toque, escala e layout acima são escolhas deste guia para o uso no campo.

## 11. Aplicação no React Native Paper

- Centralizar o tema da aplicação e os tokens deste documento. Não espalhar cores diretamente nas telas nem manter uma segunda paleta.
- Mapear semanticamente ação principal e conteúdo sobre ela, fundo, superfícies, texto, contornos e erro aos papéis equivalentes do tema adotado. Aplicar os tokens de sucesso, atenção e informação em componentes compartilhados.
- Preservar `#166534` como verde principal e as demais cores aprovadas. Estados de foco, pressionado, selecionado, desabilitado e elevação devem ser conferidos para que valores padrão da biblioteca não alterem a identidade ou prejudiquem o contraste.
- Adaptar tipografia, espaçamentos, alturas mínimas, cantos e acessibilidade aos valores deste guia. Não assumir que o componente padrão já satisfaz todas essas medidas.
- A entrega local usa a família Material Design Icons (`@react-native-vector-icons/material-design-icons`) integrada ao Paper e navegação inferior com Talhões, Calendário, Insumos, Planos de manejo e Configurações. Os rótulos preservam a escala da fonte e podem ocupar mais de uma linha; em tela estreita ou fonte ampliada, a navegação distribui as ações em duas linhas. Cabeçalhos usam `surfaceMuted`.
- Calendário mensal usa as mesmas cores e rótulos dos cards. Em tela estreita ou fonte ampliada, apresentar as datas com atividades como uma lista mensal para preservar alvos de toque de 48 e leitura completa.
- O botão compartilhado compõe `TouchableRipple`, `Text` e ícones Paper porque o botão padrão limita o rótulo a uma linha. Manter altura mínima 52 e quebra livre. A validação visual em Android/TalkBack continua pendente.
