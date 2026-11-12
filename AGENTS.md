# cultiva-eV2 — instruções de trabalho

Aplicativo de gestão agrícola para produtores, desenvolvido com Expo, React Native e TypeScript, com prioridade para Android e uso local.

## Antes de trabalhar

- Leia [CONTEXT.md](CONTEXT.md) para decisões de produto, regras de negócio e pendências. Requisito aprovado não significa funcionalidade implementada.
- Para atividades da trilha, consulte [GUIA.md](GUIA.md), o código atual e o progresso confirmado pelo responsável. Registros datados descrevem o momento em que foram escritos.
- Para interface, consulte [GUIA-VISUAL.md](GUIA-VISUAL.md) e o tema existente. Preserve o visual aprovado.
- Verifique arquivos e alterações em andamento antes de modificá-los. Preserve o trabalho do responsável.

## Colaboração e aprendizagem

- Em atividades de aprendizagem, explique entradas, resultado e verificações; apresente exemplos e comentários explicativos no código para apoiar o entendimento.
- Peça autorização antes de instalar bibliotecas. Uma solicitação para avaliar dependências não autoriza a instalação.
- Faça comentários explicativos nas implementações realizadas para auxiliar entendimento do código e manutenção

## Implementação

- Mantenha separadas interface, regras de negócio e persistência. As rotas ficam em `src/app/`; componentes, domínio e repositórios ficam fora dessa pasta.
- Desenvolva o fluxo local antes de backend, autenticação definitiva e sincronização. A seleção local de perfil por e-mail não comprova identidade nem substitui autorização no servidor.
- Preserve os dados locais e suas chaves; mudanças de formato precisam de migração e tratamento de erro explícitos. Use dados de teste separados dos perfis reais.
- Para alterações em APIs Expo ou React Native, confira a versão no `package.json` e consulte a documentação correspondente. Módulos nativos exigem nova compilação do aplicativo para serem incorporados.
- Configure alterações nativas por `app.json` e plugins; trate diretórios gerados pelo Prebuild como artefatos gerados. Preserve a identidade Android existente salvo solicitação explícita.
- Para ícones, use `import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";`.
- Interface em português, acessível, com suporte a teclado, áreas seguras e fontes ampliadas. Considere os estados de carregamento, vazio, erro e salvamento aplicáveis.
- Em todas as telas, mantenha todo o conteúdo e os controles, incluindo rodapés, Drawer e Snackbar, totalmente acima da barra de navegação Android de três botões. Use os insets de `react-native-safe-area-context`, respeitando também a navegação por gestos e evitando aplicar o mesmo inset duas vezes.

## Verificação

- Para mudanças de código, execute `npm run lint` e `npm run typecheck`, além dos testes relevantes. Informe falhas preexistentes, verificações não executadas e limitações de teste em aparelho.
- Para mudanças somente documentais, confira referências, consistência e diff; não apresente uma inspeção documental como validação do aplicativo.
