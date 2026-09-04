# Etapa 03 — Interface Responsiva com CSS

## Objetivo desta etapa

Transformar a estrutura HTML da Etapa 02 em uma interface visualmente organizada e responsiva, usando Flexbox, CSS Grid, media queries e uma paleta de cores própria — sem alterar a lógica da aplicação (que continua estática, como na Etapa 02).

## Interfaces apresentadas

As mesmas 3 páginas implementadas na Etapa 02, agora com o CSS responsivo aplicado:

| Interface | Arquivo |
|---|---|
| Home | `src/index.html` |
| Detalhe do Projeto | `src/projeto.html` |
| Livro de Visitas | `src/livro-de-visitas.html` |

## Localização do CSS

Todo o CSS está em um único arquivo compartilhado pelas três páginas: [`src/css/style.css`](../src/css/style.css), organizado em blocos comentados (variáveis, reset/base, breakpoints, layout, cabeçalho/navegação, grade de projetos, cards, formulário, mensagens e rodapé).

## Breakpoints utilizados

Dois breakpoints, definidos por `max-width`:

- **768px** (tablet): reduz o padding lateral do `body`. Como o conteúdo já é centralizado num `main` de `max-width: 720px`, o cabeçalho e a grade de projetos continuam em linha nesse tamanho — ainda há espaço horizontal suficiente para as 3 colunas.
- **480px** (smartphone): além de reduzir mais o padding do `body`, empilha o cabeçalho/menu (`.site-header` e `.site-header nav ul` passam para `flex-direction: column`), o que também empilha a grade de projetos em uma única coluna via CSS Grid (ver seção abaixo).

## Principais decisões de responsividade

- **Flexbox** no cabeçalho (`.site-header`), no menu (`.site-header nav ul`), nos campos do formulário do livro de visitas (`.campo`) e nas mensagens (`.mensagens header`) — todos casos de itens organizados em linha ou coluna, o uso clássico de Flexbox.
- **CSS Grid** na grade de projetos da Home (`.projetos-grid`), usando `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`. Essa técnica faz a grade se ajustar sozinha ao espaço disponível — os cards quebram de coluna automaticamente conforme o tamanho da tela, sem precisar de uma media query específica pra isso (o valor `200px` foi escolhido depois de testar: com `240px`, só cabiam 2 colunas dentro da largura máxima de `720px` do `main`).
- **Cards de projeto extras**: a Home tinha só 1 card de projeto de exemplo na Etapa 02. Foram adicionados mais 2 cards de exemplo (`exemplo2` e `exemplo3`, mesmo conteúdo placeholder) só para o CSS Grid ter o que "quebrar" entre colunas nas capturas de tela — sem eles não daria pra ver a grade se ajustando. Nas próximas etapas, os cards passam a vir de dados reais cadastrados no painel administrativo.
- **Paleta de cores em variáveis CSS**: definidas no `:root` — `--verde-fundo` (fundo verde bem escuro), `--creme-letra` (texto), `--dourado-destaque` (títulos e botão "Ver detalhes") e `--roxo-destaque` (links). A paleta é inspirada em um site pessoal já existente da autora, adaptada para um fundo mais escuro visando legibilidade.
- **Especificidade de CSS**: `.botao-link` e `.site-header nav a` são seletores de classe, com mais especificidade que o seletor de elemento `a` usado na regra global de cor dos links — por isso precisaram de uma cor definida explicitamente (em vez de herdar a regra `a { color: ... }`), senão continuariam com a cor antiga.
- **`box-sizing: border-box`** global, para bordas e padding não estourarem a largura dos elementos em telas estreitas.
- **`img { max-width: 100%; height: auto; }`** — regra aplicada às imagens de figura na página de detalhe do projeto, para nenhuma imagem ultrapassar a largura da tela no celular (a imagem de exemplo é um SVG inline, mas a regra vale para quando entrarem capturas de tela reais).

## Evidências

Capturas de tela em `docs/evidencias/etapa-03/`, nos três viewports pedidos (emuladas via Chromium), com as três interfaces em cada um. São capturas de página inteira (não só a área visível sem rolar), para deixar visível o comportamento responsivo da página inteira em cada tamanho de tela.

- **Desktop (1440×900):** `desktop-tela-01.png` (Home), `desktop-tela-02.png` (Detalhe do Projeto), `desktop-tela-03.png` (Livro de Visitas)
- **Tablet (768×1024):** `tablet-tela-01.png` (Home), `tablet-tela-02.png` (Detalhe do Projeto), `tablet-tela-03.png` (Livro de Visitas)
- **Smartphone (390×844):** `smartphone-tela-01.png` (Home), `smartphone-tela-02.png` (Detalhe do Projeto), `smartphone-tela-03.png` (Livro de Visitas)
