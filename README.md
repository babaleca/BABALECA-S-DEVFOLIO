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

Nesta etapa o projeto ainda é só HTML/CSS estático, sem servidor. Para visualizar:

```bash
# opção 1: abrir direto no navegador
src/index.html

# opção 2: servir a pasta src/ com qualquer servidor estático, por exemplo:
cd src
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

As instruções para rodar o back-end (Node/Express) serão adicionadas quando ele for implementado, em uma etapa futura.

## Funcionalidades implementadas

- Estrutura HTML semântica de 3 páginas: Home, Detalhe do Projeto e Livro de Visitas (ver `docs/etapa-02.md` para detalhes e decisões).
- Navegação estática entre as páginas.
- Formulário do livro de visitas (campos com `label` associado), ainda sem envio real.
- Layout responsivo com Flexbox (cabeçalho, menu, formulário, mensagens) e CSS Grid (grade de projetos), com 2 breakpoints (768px e 480px) adaptando o layout para tablet e smartphone.
- Paleta de cores própria (fundo escuro, títulos em dourado, links em roxo) definida em variáveis CSS (ver `docs/etapa-03.md` para todas as decisões de responsividade e estilo).

Ainda não implementado: painel administrativo, autenticação, persistência de dados, integração com a API do GitHub, tela de boas-vindas com cursor animado e o tema visual de fichário digital — todos previstos na proposta (`docs/proposta.md`) para etapas futuras.

## Limitações conhecidas

- Não há back-end, banco de dados nem lógica de aplicação ainda — o formulário do livro de visitas não envia de fato, e o conteúdo das páginas é estático/placeholder.
- Faltam as demais 4 telas previstas na proposta (Boas-vindas, Sobre mim, Painel Admin, e a divisória "Projetos" do fichário); serão adicionadas nas próximas etapas.
- Os 3 cards de projeto na Home são todos de exemplo/placeholder, usados para demonstrar a grade responsiva — os projetos reais virão do painel administrativo numa etapa futura.
- Escopo, telas e tecnologias descritos aqui podem evoluir nas próximas etapas, mantendo a coerência da solução.
- O fichário digital (animações, efeito de virar página, cursor com partículas, música) é um objetivo visualmente ambicioso; o plano é construí-lo em camadas ao longo do semestre — esta etapa entrega a segunda camada (base funcional + responsividade e paleta de cores), ainda sem as animações.
