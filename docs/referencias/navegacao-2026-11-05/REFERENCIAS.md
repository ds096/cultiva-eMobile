# Referências de navegação — cultiva-e

Data: 05/11/2026. Estudo visual para decisão; nenhuma opção aprovada ou implementada. GUIA.md não foi editado nesta atividade.

## Imagens

- [01 — Menu inferior: alternativas A e B](01-menu-inferior.png)
- [02 — Menu lateral: alternativas C e D](02-menu-lateral.png)

Referências para futura inclusão em GUIA.md, somente depois da escolha:

- `docs/referencias/navegacao-2026-11-05/01-menu-inferior.png`
- `docs/referencias/navegacao-2026-11-05/02-menu-lateral.png`

## Comparação

| Alternativa | Organização | Vantagem | Custo |
| --- | --- | --- | --- |
| A | Inferior com sete destinos, incluindo criação | Acesso direto aos cadastros | Duas linhas ocupam mais altura e misturam áreas com ações |
| B | Inferior com cinco áreas | Troca visível em um toque e mais espaço para conteúdo | Criar exige entrar na área correspondente |
| C | Lateral com sete destinos | Rótulos completos e atalhos para criar | Precisa abrir o painel; lista mais longa |
| D | Lateral com cinco áreas | Menu enxuto e conteúdo livre quando fechado | Áreas ficam escondidas até abrir o painel |

“Todas as telas” significa as sete telas internas atuais: Talhões, Calendário, Insumos, Planos, Configurações, Criar talhão e Criar plano. Acesso não é destino do menu. Telas futuras de detalhes, lançamento, histórico e fotos dependem de contexto e não foram inventadas como destinos globais. “Ajustes” na imagem B é uma proposta de rótulo curto para Configurações, não uma sexta área.

## Sugestão para avaliação

Preferir B: cinco áreas principais no rodapé; Adicionar talhão dentro de Talhões e Criar plano dentro de Planos. O menu representa onde o produtor está; os botões representam o que ele quer fazer nessa área. Os cadastros continuam acessíveis, apenas deixam de ser itens globais.

Nas telas de criação, propor cabeçalho com Voltar e título, formulário e ação Salvar; ocultar o rodapé durante esse fluxo é uma decisão adicional a avaliar. Voltar deve preservar ou tratar explicitamente um rascunho, conforme contrato a definir. O menu inferior fica fixo nas áreas principais, sem cobrir conteúdo ou a área segura do Android.

Esta recomendação é uma avaliação de design, não um resultado de teste com produtores. A orientação oficial do Android prevê de três a cinco destinos de mesmo nível na barra de navegação; o menu lateral permite mais destinos, mas exige alcançar o cabeçalho em telas compactas. Referência: [Android — Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns), consultada em 05/11/2026.

## Limites e próximo exercício

Imagens conceituais geradas com a ferramenta integrada de geração de imagens (image_gen), não capturas do aplicativo. Os desenhos do estado vazio são ilustrações de estudo, não uma logo aprovada. Texto, ícones, medidas e comportamento precisam ser ajustados na implementação; a imagem não valida TalkBack, fonte ampliada ou alvos de toque. No estudo lateral, o fundo deveria permanecer imóvel sob o painel; não copiar qualquer aparente estreitamento do conteúdo gerado.

Aprendizado: separar destinos principais de ações de criação. Próximo exercício: escolher A, B, C ou D e percorrer Talhões → Adicionar talhão → Voltar e Planos → Criar plano → Voltar. Só após a escolha criar o módulo de implementação no GUIA.md. Nenhuma dependência instalada, código do app alterado ou dado de perfil gravado.

## Prompts utilizados

Verificações desta atividade: arquivos PNG salvos no projeto e inspecionados visualmente; hash de GUIA.md idêntico antes e depois. Lint terminou sem erros e com seis avisos existentes. Typecheck permanece bloqueado pelo TS7016 em eslint.config.js:3. Esses comandos verificam o projeto, não validam a usabilidade das imagens.

### Imagem 01

Use case: ui-mockup. Create a polished high-fidelity Portuguese Android app navigation comparison board for cultiva-e. Landscape canvas, two equally sized tall phone UI mockups side by side, crisp readable Portuguese typography, flat front-facing screens, no perspective, no photography, no invented brand symbol. Background warm pale green. App palette primary #166534, background #F7FAF7, white surfaces, header #EEF2EF, text #17251C, secondary #526158, border #D4DED6. System sans font, generous spacing, rounded 12px controls 16px cards, thin line icons and textual labels. Both phones show same empty Talhões page: header small brand text "cultiva-e", title "Talhões", body heading "Meus talhões", empty state "Você ainda não possui talhões cadastrados.", green button "+ Adicionar talhão". No fictional records, no charts, no synced claims. Board footer "Estudo visual • 05/11/2026 • Não implementado". Render exact provided text, no gibberish. Board title "01 • Menu inferior fixo". Left phone label above "A • Todas as telas". Fixed bottom white navigation panel in TWO rows to retain legibility: first row Talhões, Calendário, Insumos, Planos; second row Configurações, Criar talhão, Criar plano. Every item has line icon above readable label. Talhões selected with pale green rounded indicator. This panel visibly consumes more height, do not squeeze seven into one row. Below left phone short caption "7 destinos • mais espaço ocupado". Right phone label "B • Apenas áreas principais". Fixed bottom navigation single row of FIVE equally spaced items: Talhões, Calendário, Insumos, Planos, Ajustes. Selected Talhões. Ajustes is short label for Configurações. Keep label legibility, may wrap Calendário. Below right phone caption "5 destinos • criação dentro de cada área". Small green outlined badge near B "Sugestão". Button Adicionar talhão appears in both mockups, right emphasizes it as creation entry. Bottom panels are above Android gesture safe area. Avoid other bottom action bars.

### Imagem 02

Use case: ui-mockup. Create a polished high-fidelity Portuguese Android app navigation comparison board for cultiva-e. Landscape canvas, two equally sized tall phone UI mockups side by side, crisp readable Portuguese typography, flat front-facing screens, no perspective, no photography, no invented brand symbol. Background warm pale green. App palette primary #166534, background #F7FAF7, white surfaces, header #EEF2EF, text #17251C, secondary #526158, border #D4DED6. System sans font, generous spacing, rounded 12px controls 16px cards, thin line icons and textual labels. Both phones show same empty Talhões page: header small brand text "cultiva-e", title "Talhões", body heading "Meus talhões", empty state "Você ainda não possui talhões cadastrados.", green button "+ Adicionar talhão". No fictional records, no charts, no synced claims. Board footer "Estudo visual • 05/11/2026 • Não implementado". Render exact provided text, no gibberish. Board title "02 • Menu lateral pelo cabeçalho". Left phone label above "C • Todas as telas". Right phone label above "D • Apenas áreas principais". Both show fixed header with hamburger icon plus visible word "Menu" and cultiva-e, and an OPEN side sheet sliding from left UNDER the header, covering 82% width, right 18% is dimmed Talhões page. No bottom navigation on either phone. Each white sheet has heading "Navegação" and close X, with a large gap separating heading from rows. Left drawer has seven line-icon rows: Talhões (selected green pill), Calendário, Insumos, Planos de manejo, Configurações, then divider and small heading "Criar", then Criar talhão, Criar plano. Right drawer has only five rows: Talhões (selected), Calendário, Insumos, Planos de manejo, Configurações. Right drawer below rows has a subtle explanatory box "Para criar, acesse Talhões ou Planos." Outside phones bottom left caption "7 destinos • atalhos de criação no menu"; bottom right caption "5 destinos • menu mais simples". Add small explanatory line beneath main board title: "Toque em Menu para abrir; escolha uma tela para navegar." Keep exact labels legible.
