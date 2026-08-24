# DevFolio

Portfólio interativo em formato de fichário digital, com tela de entrada animada, painel administrativo, livro de visitas e integração com a API do GitHub.

> Projeto desenvolvido para a disciplina **Tecnologia de Construção de Software I**, de forma incremental ao longo do semestre.

## Descrição da aplicação

O DevFolio é uma aplicação web que funciona como um currículo técnico interativo. Em vez de uma página estática que precisa ser editada manualmente a cada novo projeto, o autor cadastra e mantém seus projetos através de um painel administrativo, enquanto o site público exibe essa vitrine de forma visual e autoral, com dados sempre atualizados (inclusive informações puxadas diretamente do GitHub).

A experiência começa numa tela de boas-vindas com uma animação de cursor criativa, e leva o visitante para um **fichário/journal digital interativo**, navegável por divisórias (Home, Sobre mim, Projetos, Livro de Visitas), com efeito de virar página e trilha sonora ambiente. Visitantes também podem interagir deixando mensagens em um livro de visitas.

É um portfólio **de uma única pessoa** (o autor): existe apenas uma conta de administrador, pré-configurada, sem cadastro público. Visitantes só têm acesso de leitura e ao livro de visitas — não criam nem gerenciam projetos.

Mais detalhes da especificação em [`docs/proposta.md`](docs/proposta.md).

## Problema que a aplicação resolve

Manter um portfólio de projetos atualizado costuma exigir editar código toda vez que algo muda, e a maioria dos portfólios de dev usa um layout genérico de "scroll infinito" que não se diferencia. O DevFolio resolve isso separando o conteúdo (projetos, tecnologias, comentários) da apresentação, permitindo atualizações rápidas via painel administrativo e integração automática com o GitHub, ao mesmo tempo em que entrega uma experiência visual autoral (o fichário digital) que ajuda o autor a se destacar.

## Tecnologias utilizadas

- **Cliente:** HTML5, CSS3 (transformações 3D via CSS para o efeito de virar página), JavaScript (Vanilla), Canvas 2D API (animação de partículas no cursor), `<audio>`/Web Audio (trilha sonora)
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
- O fichário digital (animações, efeito de virar página, cursor com partículas, música) é um objetivo visualmente ambicioso; o plano é construí-lo em camadas ao longo do semestre, começando por uma versão funcional simples.
