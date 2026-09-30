# Etapa 04 — Interatividade com JavaScript

## Objetivo desta etapa

Adicionar comportamento dinâmico às três páginas do projeto usando JavaScript puro (sem frameworks), sem alterar a estrutura HTML nem o CSS além do estritamente necessário para os novos elementos interativos.

## Funcionalidades interativas implementadas

### 1. Busca/filtro de projetos (Home)

**Onde:** `src/index.html` + `src/js/projetos.js`

**Como funciona:** um campo de busca (`#busca-projetos`) foi adicionado acima da grade de projetos. A cada letra digitada (evento `input`), o script lê o texto buscado, compara com o nome e as tecnologias de cada card (guardadas no atributo `data-tecnologias` de cada `<article class="projeto-card">`) e esconde (`hidden`) os cards que não combinam. Se nenhum card sobrar visível, aparece a mensagem `#projetos-sem-resultado`.

**Conceitos usados:** manipulação do DOM (`querySelectorAll`, `hidden`), tratamento de eventos (`input`), funções (`normalizar`, `filtrarProjetos`), arrays (`Array.from` + `.forEach`), alteração dinâmica da interface.

**Validação/situação inválida tratada:** busca sem nenhum resultado — mostra mensagem explícita em vez de deixar a tela "vazia" sem explicação.

### 2. Formulário do Livro de Visitas (validação + envio dinâmico no cliente)

**Onde:** `src/livro-de-visitas.html` + `src/js/livro-de-visitas.js`

**Como funciona:** o formulário deixa de ser só estrutura (Etapa 02) e passa a validar os campos ao ser enviado (`submit`). Se "Nome" estiver vazio, ou "Mensagem" estiver vazia ou tiver menos de 5 caracteres, o envio é bloqueado (`event.preventDefault()`) e uma mensagem de erro aparece abaixo do campo correspondente. Se estiver tudo certo, a nova mensagem é adicionada a um array em memória (`mensagens`) e a lista inteira é redesenhada na tela a partir desse array — sem recarregar a página. Ainda não existe back-end, então as mensagens não são salvas de verdade: se a página for recarregada, voltam a ser só as duas de exemplo (isso é esperado nesta etapa e está documentado no próprio código).

**Conceitos usados:** validação de formulário, manipulação do DOM (`createElement`, `append`, `textContent`), tratamento de eventos (`submit`), funções (`validarCampos`, `renderizarMensagens`, `criarItemDeMensagem`, `formatarData`), arrays e métodos de iteração (`.forEach`), alteração dinâmica da interface, tratamento de situações inválidas.

**Validações implementadas:** nome obrigatório (não pode ficar só com espaços); mensagem obrigatória com no mínimo 5 caracteres. As mensagens de erro usam `role="alert"` para acessibilidade.

**Nota de segurança:** o texto digitado é inserido na página com `.textContent` (não `.innerHTML`), então mesmo que alguém digite algo parecido com uma tag HTML, isso aparece como texto puro em vez de virar HTML de verdade.

### 3. Seções retráteis (acordeão) na página de detalhe do projeto

**Onde:** `src/projeto.html` + `src/js/projeto-detalhe.js`

**Como funciona:** as três seções da página ("Sobre o projeto", "Tecnologias utilizadas" e "Links") ganharam um botão `Mostrar`/`Ocultar` (classe `.acordeao-toggle`) que abre e fecha o bloco de conteúdo correspondente ao ser clicado, usando o atributo `hidden`. O estado (aberto/fechado) é guardado no próprio HTML via `aria-expanded`, o que também ajuda leitores de tela a entenderem o estado atual do botão. A seção "Links" começa fechada por padrão, as outras duas começam abertas.

**Conceitos usados:** manipulação do DOM, tratamento de eventos (`click`), funções, alteração dinâmica da interface.

## Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
|---|---|---|---|
| Manipulação do DOM | Filtro de projetos / Livro de visitas / Acordeão | `js/projetos.js`, `js/livro-de-visitas.js`, `js/projeto-detalhe.js` | `home-02-filtro-css.png`, `livro-02-mensagem-enviada.png`, `projeto-02-apos-alternar.png` |
| Tratamento de eventos | Evento `input` no filtro, `submit` no formulário, `click` no acordeão | `js/projetos.js`, `js/livro-de-visitas.js`, `js/projeto-detalhe.js` | mesmas evidências acima |
| Validação de formulários | Campos obrigatórios e tamanho mínimo da mensagem no Livro de Visitas | `livro-de-visitas.html`, `js/livro-de-visitas.js` | `livro-01-erros-validacao.png` |
| Alteração dinâmica da interface | Cards somem/aparecem ao filtrar; nova mensagem aparece na lista; seções abrem/fecham | `js/projetos.js`, `js/livro-de-visitas.js`, `js/projeto-detalhe.js` | `home-02-filtro-css.png`, `livro-02-mensagem-enviada.png`, `projeto-02-apos-alternar.png` |
| Uso de funções | `filtrarProjetos`, `normalizar`, `validarCampos`, `renderizarMensagens`, `criarItemDeMensagem`, `formatarData` | `js/projetos.js`, `js/livro-de-visitas.js` | código-fonte (comentado) |
| Uso de arrays | Lista de cards (`Array.from`) no filtro; array `mensagens` no Livro de Visitas | `js/projetos.js`, `js/livro-de-visitas.js` | código-fonte (comentado) |
| Métodos de iteração | `.forEach()` para percorrer cards e mensagens | `js/projetos.js`, `js/livro-de-visitas.js`, `js/projeto-detalhe.js` | código-fonte (comentado) |
| Tratamento de situações inválidas | Busca sem resultado; campos vazios/mensagem curta no formulário | `js/projetos.js`, `js/livro-de-visitas.js` | `home-03-sem-resultado.png`, `livro-01-erros-validacao.png` |

## Evidências de funcionamento

Capturas de tela em `docs/evidencias/etapa-04/`:

- `home-01-todos.png` — Home com todos os projetos visíveis (estado inicial).
- `home-02-filtro-css.png` — após buscar "css": só o card com essa tecnologia continua visível.
- `home-03-sem-resultado.png` — após buscar "python": nenhum card combina, mensagem de "nenhum projeto encontrado" aparece.
- `livro-01-erros-validacao.png` — tentativa de envio com os campos vazios: mensagens de erro aparecem, nada é adicionado à lista.
- `livro-02-mensagem-enviada.png` — após preencher corretamente e enviar: nova mensagem aparece no topo da lista, formulário limpo.
- `projeto-01-estado-inicial.png` — página de detalhe no estado inicial (Sobre e Tecnologias abertos, Links fechado).
- `projeto-02-apos-alternar.png` — após clicar nos botões: Links aberto, Sobre fechado.

## Instruções de execução e teste

Como ainda não há back-end, o projeto continua rodando como página estática:

```bash
cd src
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Para testar cada funcionalidade manualmente:

1. **Filtro de projetos:** na Home, digite no campo "Buscar por nome ou tecnologia" (ex.: `css`, `node`, `exemplo2`, ou algo que não exista como `python`) e veja os cards aparecerem/sumirem em tempo real.
2. **Livro de Visitas:** vá em "Livro de Visitas", clique em "Enviar mensagem" com os campos vazios (deve mostrar erro embaixo de cada campo); depois preencha "Nome" e uma "Mensagem" com 5+ caracteres e envie — a mensagem aparece no topo da lista, sem a página recarregar.
3. **Acordeão do projeto:** em "Projeto (exemplo)", clique nos botões "Mostrar"/"Ocultar" acima de cada seção e observe o conteúdo abrir e fechar.
