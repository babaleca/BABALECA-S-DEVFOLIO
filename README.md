# DevFolio

Portfólio e vitrine de projetos com painel administrativo, livro de visitas e integração com a API do GitHub.

> Projeto desenvolvido para a disciplina **Tecnologia de Construção de Software I**, de forma incremental ao longo do semestre.

## Descrição da aplicação

O DevFolio é uma aplicação web que funciona como um currículo técnico interativo. Em vez de uma página estática que precisa ser editada manualmente a cada novo projeto, o autor cadastra e mantém seus projetos através de um painel administrativo, enquanto o site público exibe essa vitrine de forma visual, com dados sempre atualizados (inclusive informações puxadas diretamente do GitHub). Visitantes também podem interagir deixando mensagens em um livro de visitas.

Mais detalhes da especificação em [`docs/proposta.md`](docs/proposta.md).

## Problema que a aplicação resolve

Manter um portfólio de projetos atualizado costuma exigir editar código toda vez que algo muda. O DevFolio resolve isso separando o conteúdo (projetos, tecnologias, comentários) da apresentação, permitindo atualizações rápidas via painel administrativo e integração automática com o GitHub.

## Tecnologias utilizadas

- **Cliente:** HTML5, CSS3, JavaScript (Vanilla), biblioteca leve de animação (AOS)
- **Servidor:** Node.js + Express.js
- **Persistência:** SQLite (via Sequelize ou Prisma)
- **Integração externa:** API pública do GitHub

## Instruções para execução

A implementação do código ainda não foi iniciada nesta etapa — esta entrega corresponde apenas à proposta e especificação inicial do projeto (Etapa 01). As instruções de instalação e execução serão adicionadas a partir da Etapa 02, quando o desenvolvimento tiver início.

## Funcionalidades implementadas

Nenhuma até o momento. Esta etapa entrega somente a especificação funcional do projeto (ver `docs/proposta.md`).

## Limitações conhecidas

- Ainda não há código-fonte implementado.
- Escopo, telas e tecnologias descritos aqui podem evoluir nas próximas etapas, mantendo a coerência da solução.
