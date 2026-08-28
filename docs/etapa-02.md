# Etapa 02 — Protótipo Estrutural com HTML Semântico

## Objetivo desta etapa

Transformar a proposta da Etapa 01 (`docs/proposta.md`) em uma primeira interface Web usando HTML semântico, sem implementar lógica de aplicação — conforme o próprio enunciado da etapa pede.

## Páginas criadas

Foram implementadas as 3 interfaces combinadas como essenciais para este momento (das 7 previstas na proposta, as demais entram nas próximas etapas):

| Página | Arquivo | Representa |
|---|---|---|
| Home | `src/index.html` | Página inicial: apresentação do autor e destaque de projetos |
| Detalhe do Projeto | `src/projeto.html` | Página de detalhes de um projeto (conteúdo de exemplo/placeholder) |
| Livro de Visitas | `src/livro-de-visitas.html` | Formulário para novo comentário + listagem de mensagens |

Um arquivo de estilo compartilhado (`src/css/style.css`) é usado pelas três páginas.

## Funcionalidades implementadas

Nenhuma lógica funcional foi implementada nesta etapa — isso é esperado e está de acordo com o enunciado ("Nesta etapa ainda não é necessário implementar toda a lógica da aplicação" / não é obrigatório banco de dados, API, autenticação ou JavaScript). O que existe hoje:

- Navegação estática entre as três páginas via `<a>` (links relativos entre arquivos `.html`).
- Formulário do livro de visitas com campos e `<button type="submit">`, mas sem envio real (`action="#"`) — o comentário explica isso no próprio HTML.
- Conteúdo de exemplo/placeholder (nome do autor, projeto e mensagens do livro de visitas), a ser substituído por dados reais quando o back-end existir.

Isso corresponde exatamente à camada 1 do plano de construção em camadas descrito em `docs/proposta.md` (versão funcional simples antes das animações do fichário digital).

## Decisões relacionadas à estrutura HTML

- **`<header>` + `<nav>` repetidos em cada página**: como ainda não há um servidor/template engine, o cabeçalho de navegação é duplicado manualmente nas três páginas. Cada link ativo é marcado com `aria-current="page"`, o que também ajuda a acessibilidade.
- **`<main>` único por página**: concentra o conteúdo principal, com `<section>`/`<article>` para os blocos de conteúdo (ex.: bloco de apresentação, card de projeto, formulário, lista de mensagens).
- **`<article>` para conteúdo autocontido**: usado no card de projeto na Home, na página de detalhe do projeto e em cada mensagem do livro de visitas — todos são itens que fariam sentido isolados (ex.: se fossem sindicados via RSS).
- **`<figure>` + `<figcaption>`** na página de detalhe do projeto, para a futura captura de tela do projeto (por ora uma imagem de placeholder gerada em SVG, para não depender de um arquivo de imagem externo).
- **`<form>` com `<label for>` associado a cada `<input>`/`<textarea>`**, conforme exigido pelos critérios da etapa.
- **`<time datetime="">`** para as datas (data de cadastro do projeto, data das mensagens do livro de visitas), já preparando o terreno para quando esses dados vierem do banco.
- **`<footer>`** com links de redes sociais, presente em todas as páginas.

## Estrutura de arquivos

```
devfolio/
├── README.md
├── docs/
│   ├── proposta.md
│   ├── etapa-02.md
│   └── evidencias/
│       └── etapa-02/
│           ├── index.png
│           ├── projeto.png
│           └── livro-de-visitas.png
└── src/
    ├── index.html
    ├── projeto.html
    ├── livro-de-visitas.html
    └── css/
        └── style.css
```

## Como executar/visualizar

Como ainda não há servidor, basta abrir `src/index.html` diretamente no navegador, ou servir a pasta `src/` com qualquer servidor estático (ex. `python3 -m http.server`, dentro da pasta `src`).

## Evidências de funcionamento

Capturas de tela das três páginas renderizadas, em `docs/evidencias/etapa-02/`.
