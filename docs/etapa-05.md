# Etapa 05 — Modularização e Comunicação Assíncrona

## O que foi feito

Refatoração do JavaScript do projeto para usar **módulos ES** (`import`/`export`) e **comunicação assíncrona** com a **Fetch API** + `async`/`await`.

## Requisitos atendidos

| Requisito | Como foi atendido |
|---|---|
| Separar código em módulos (ES Modules) | 5 arquivos JS com import/export: `api.js`, `ui.js`, `projetos.js`, `livro-de-visitas.js`, `projeto-detalhe.js` |
| Evitar arquivo único com toda a lógica | Cada arquivo tem responsabilidade definida (rede, interface, orquestração) |
| Implementar chamadas assíncronas | fetch GET para carregar projetos e mensagens, fetch POST para enviar mensagem |
| Usar Fetch API | Todas as chamadas de rede usam `fetch()` nativo |
| Trabalhar com Promises e/ou async/await | Todas as funções de rede são `async` e usam `await` |
| Tratar loading (carregamento) | "Carregando projetos..." na Home, "Carregando mensagens..." no Livro, "Enviando..." no botão |
| Tratar erros de comunicação | try/catch em toda chamada, mensagem de erro com "Tentar novamente" |
| Usar dados externos ou serviço simulado | JSON locais (`dados/projetos.json`, `dados/mensagens.json`) + JSONPlaceholder (API pública para POST) + API do GitHub (API pública para GET de repositórios reais) |

## Operações demonstradas

- **Operação de consulta (GET):** busca de projetos em `dados/projetos.json`, mensagens em `dados/mensagens.json`, e repositórios reais da API pública do GitHub (`api.github.com`)
- **Operação de envio (POST):** envio de mensagem do livro de visitas para `https://jsonplaceholder.typicode.com/posts`
- **Tratamento de sucesso:** dados exibidos na tela, mensagem adicionada à lista
- **Tratamento de erro:** mensagem de erro com botão "Tentar novamente"
- **Tratamento de loading:** indicadores visuais enquanto as operações estão em andamento

## Estrutura de arquivos (módulos)

```
src/
├── dados/
│   ├── projetos.json          ← NOVO — dados dos projetos (fonte externa)
│   └── mensagens.json         ← NOVO — mensagens iniciais (fonte externa)
├── js/
│   ├── api.js                 ← NOVO — módulo de comunicação (fetch GET/POST)
│   ├── ui.js                  ← NOVO — módulo de interface (loading, erro, cards)
│   ├── projetos.js            ← REFATORADO — usa import de api.js e ui.js
│   ├── livro-de-visitas.js    ← REFATORADO — usa import de api.js e ui.js
│   └── projeto-detalhe.js     ← REFATORADO — convertido para módulo ES
├── css/
│   └── style.css              ← ATUALIZADO — estilos de loading e erro
├── index.html                 ← ATUALIZADO — type="module", grade dinâmica
├── livro-de-visitas.html      ← ATUALIZADO — type="module"
└── projeto.html               ← ATUALIZADO — type="module"
```

## Responsabilidade de cada módulo

- **api.js** — Centraliza TODAS as chamadas de rede. Exporta: `buscarProjetos()`, `buscarMensagens()`, `enviarMensagem()`, `buscarRepositoriosGitHub()`. Cada uma retorna uma Promise via async/await.
- **ui.js** — Funções reutilizáveis de interface. Exporta: `criarCarregando()`, `mostrarErroDeRede()`, `criarCardProjeto()`, `criarItemDeMensagem()`, `formatarData()`.
- **projetos.js** — Orquestra a Home: importa de api.js e ui.js, carrega projetos locais E repositórios do GitHub em paralelo com Promise.all, cria cards, ativa busca/filtro.
- **livro-de-visitas.js** — Orquestra o Livro de Visitas: importa de api.js e ui.js, carrega mensagens via fetch, envia via POST, valida formulário.
- **projeto-detalhe.js** — Acordeão da página de projeto. Exporta `inicializarAcordeao()` para reuso.

## Mudanças no HTML

- `<script defer src="...">` → `<script type="module" src="...">` nas 3 páginas
- Cards de projeto removidos do `index.html` (agora são criados pelo JS a partir do JSON)

## Mudanças no CSS

- `.carregando` — indicador de loading (texto centralizado, cor dourada, itálico)
- `.erro-rede` — mensagem de erro de rede (caixa com borda vermelha e botão)
- `.erro-campo` — cor vermelha para erros de validação do formulário
- `button[type="submit"]:disabled` — visual de botão desabilitado durante envio

## Decisões técnicas

1. **JSONPlaceholder** como serviço simulado: API pública gratuita que aceita POST sem precisar de backend próprio.
2. **JSON locais** para dados de projetos e mensagens: demonstra fetch GET sem depender de serviço externo para a consulta.
3. **type="module"** nos scripts: habilita import/export nativamente no navegador, sem bundler (Webpack, Vite, etc.).
4. **Sem DOMContentLoaded**: módulos ES já são `defer` por padrão — executam depois do DOM estar pronto.

## Como testar

1. Abrir o projeto com Live Server (necessário para módulos ES e fetch funcionar)
2. **Home:** verificar que os cards carregam automaticamente e a busca funciona
3. **Livro de Visitas:** verificar que as mensagens carregam, e que o envio mostra "Enviando..." e depois adiciona a mensagem
4. **Para testar erro:** desconectar da internet e recarregar — deve mostrar mensagem de erro com "Tentar novamente"
5. **Console (F12):** não deve ter erros

## Observação importante

O projeto PRECISA ser aberto via servidor local (Live Server ou similar). Abrir o arquivo HTML diretamente (file://) não funciona com `type="module"` e `fetch()` por restrições de segurança do navegador (CORS).
