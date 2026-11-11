# cultiva-eV2 — instruções de trabalho

Aplicativo de gestão agrícola para produtores, desenvolvido com Expo, React Native e TypeScript, com prioridade para Android e uso local.

## Antes de trabalhar

- Leia [CONTEXT.md](CONTEXT.md) para decisões de produto, regras de negócio e pendências. Requisito aprovado não significa funcionalidade implementada.
- Para atividades da trilha, consulte [GUIA.md](GUIA.md), o código atual e o progresso confirmado pelo responsável. Registros datados descrevem o momento em que foram escritos.
- Para interface, consulte [GUIA-VISUAL.md](GUIA-VISUAL.md) e o tema existente. Preserve o visual aprovado.
- Verifique arquivos e alterações em andamento antes de modificá-los. Preserve o trabalho do responsável.

## Colaboração e aprendizagem

- Por padrão, o responsável escreve o código: explique o conceito, proponha uma pequena atividade e revise o resultado. Quando ele solicitar uma implementação direta, implemente-a.
- Em atividades de aprendizagem, explique entradas, resultado e verificações; apresente exemplos e comentários explicativos no código para apoiar o entendimento.
- Trabalhe uma etapa de cada vez e registre no guia atividade, aprendizado, verificações, bloqueios e próximo passo quando estiver atualizando a trilha. Não declare um módulo concluído sem conferir seus critérios e o progresso confirmado.
- Peça autorização antes de instalar bibliotecas. Uma solicitação para avaliar dependências não autoriza a instalação.

## Implementação

- Mantenha separadas interface, regras de negócio e persistência. As rotas ficam em `src/app/`; componentes, domínio e repositórios ficam fora dessa pasta.
- Desenvolva o fluxo local antes de backend, autenticação definitiva e sincronização. A seleção local de perfil por e-mail não comprova identidade nem substitui autorização no servidor.
- Preserve os dados locais e suas chaves; mudanças de formato precisam de migração e tratamento de erro explícitos. Use dados de teste separados dos perfis reais.
- Para alterações em APIs Expo ou React Native, confira a versão no `package.json` e consulte a documentação correspondente. Módulos nativos exigem nova compilação do aplicativo para serem incorporados.
- Configure alterações nativas por `app.json` e plugins; trate diretórios gerados pelo Prebuild como artefatos gerados. Preserve a identidade Android existente salvo solicitação explícita.
- Interface em português, acessível, com suporte a teclado, áreas seguras e fontes ampliadas. Considere os estados de carregamento, vazio, erro e salvamento aplicáveis.

## Verificação

- Para mudanças de código, execute `npm run lint` e `npm run typecheck`, além dos testes relevantes. Informe falhas preexistentes, verificações não executadas e limitações de teste em aparelho.
- Para mudanças somente documentais, confira referências, consistência e diff; não apresente uma inspeção documental como validação do aplicativo.
