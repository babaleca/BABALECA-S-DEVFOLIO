# Etapa 06 — API REST da Aplicação

## O que foi feito

Implementação do servidor da aplicação: uma **API REST** em Node.js +
Express, separada do front-end estático (`src/`), que expõe dois
recursos principais do domínio do DevFolio — **Projetos** e
**Mensagens** (livro de visitas) — cada um com as 5 operações
equivalentes a CRUD.

## Requisitos atendidos

| Requisito | Como foi atendido |
|---|---|
| Pelo menos um recurso principal | Dois recursos: `/api/projetos` e `/api/mensagens` |
| GET para consulta | `GET /api/projetos`, `GET /api/mensagens` (com filtro opcional por tecnologia nos projetos) |
| GET para consulta individual | `GET /api/projetos/:id`, `GET /api/mensagens/:id` |
| POST para criação | `POST /api/projetos`, `POST /api/mensagens` |
| PUT ou PATCH para alteração | `PATCH /api/projetos/:id`, `PATCH /api/mensagens/:id` (atualização parcial) |
| DELETE para exclusão | `DELETE /api/projetos/:id`, `DELETE /api/mensagens/:id` |
| Utilizar HTTP adequadamente | Métodos e status code corretos (ver tabela de endpoints abaixo) |
| Utilizar JSON | Corpo de requisição e resposta sempre em JSON (`express.json()`) |
| Códigos HTTP coerentes | 200, 201, 204, 400, 404, 500 (ver abaixo) |
| Validar entradas | Campos obrigatórios e tipos checados antes de criar/alterar (`rotas/projetos.js`, `rotas/mensagens.js`) |
| Informar erros de maneira consistente | Toda resposta de erro no formato `{ "erro": "..." }` |
| Organizar as rotas | Um `express.Router()` por recurso, em `rotas/`, montados em `app.js` |
| Permitir testes com Postman/Insomnia/curl | `insomnia-etapa-06.json` (coleção pronta pra importar) + exemplos de curl abaixo |

## Estrutura de arquivos

```
server/
├── app.js                   ← monta os middlewares e as rotas, sobe o servidor
├── package.json
├── rotas/
│   ├── projetos.js          ← rotas + validação do recurso Projeto
│   └── mensagens.js         ← rotas + validação do recurso Mensagem
├── dados/
│   ├── projetos.js          ← "banco" em memória de Projetos (seed = dados da Etapa 05)
│   └── mensagens.js         ← "banco" em memória de Mensagens (seed = dados da Etapa 05)
├── insomnia-etapa-06.json   ← coleção de requisições pronta (Insomnia/Postman)
└── README.md                ← como rodar e testar
```

## Endpoints

### Projetos

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/projetos` | Lista todos. Aceita `?tecnologia=` pra filtrar | 200 | — |
| GET | `/api/projetos/:id` | Consulta um específico | 200 | 404 se não existir |
| POST | `/api/projetos` | Cria um novo (`nome`, `descricao`, `tecnologias` obrigatórios; `link` opcional) | 201 | 400 se faltar campo obrigatório ou tipo errado |
| PATCH | `/api/projetos/:id` | Altera os campos enviados | 200 | 400 se tipo errado, 404 se não existir |
| DELETE | `/api/projetos/:id` | Remove | 204 | 404 se não existir |

### Mensagens

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/mensagens` | Lista todas (fixadas primeiro) | 200 | — |
| GET | `/api/mensagens/:id` | Consulta uma específica | 200 | 404 se não existir |
| POST | `/api/mensagens` | Cria uma nova (`nome`, `mensagem` obrigatórios; `data` é sempre gerada pelo servidor) | 201 | 400 se faltar campo obrigatório |
| PATCH | `/api/mensagens/:id` | Altera os campos enviados (ex: `{ "fixada": true }` pra fixar) | 200 | 400 se tipo errado, 404 se não existir |
| DELETE | `/api/mensagens/:id` | Remove | 204 | 404 se não existir |

O campo `fixada` em Mensagem já pensa numa etapa futura: o painel
administrativo vai poder fixar uma mensagem do livro de visitas no
topo (ex: um elogio que valha destacar) sem precisar de rota nova —
é só um `PATCH` nesse campo.

## Exemplos testados (curl)

Criar um projeto:

```
$ curl -X POST http://localhost:3000/api/projetos \
    -H "Content-Type: application/json" \
    -d '{"nome":"DevFolio API","descricao":"API REST do portfolio.","tecnologias":["Node.js","Express"]}'

HTTP 201 Created
{"id":4,"nome":"DevFolio API","descricao":"API REST do portfolio.","tecnologias":["Node.js","Express"],"link":"projeto.html"}
```

Erro de validação (faltando campo obrigatório):

```
$ curl -X POST http://localhost:3000/api/projetos -d '{"nome":"Sem descricao"}'

HTTP 400 Bad Request
{"erro":"Campos obrigatórios: nome, descricao, tecnologias."}
```

Fixar uma mensagem e depois remover um projeto:

```
$ curl -X PATCH http://localhost:3000/api/mensagens/1 -d '{"fixada":true}'
HTTP 200 OK
{"id":1,"nome":"Visitante Exemplo","mensagem":"Adorei o portfólio, muito criativo!","data":"2026-08-20","fixada":true}

$ curl -X DELETE http://localhost:3000/api/projetos/4
HTTP 204 No Content

$ curl http://localhost:3000/api/projetos/4
HTTP 404 Not Found
{"erro":"Projeto 4 não encontrado."}
```

Prints reais desses testes em `docs/evidencias/etapa-06/`.

## Decisões técnicas

1. **Dois recursos, não só um.** O mínimo exigido é um, mas fazer
   Projetos e Mensagens já deixa o livro de visitas pronto pra ganhar
   um painel de moderação (apagar/fixar mensagens) numa etapa futura,
   sem precisar voltar aqui.
2. **Dados em memória, não SQLite ainda.** Esta etapa pede a API em
   si; persistência real é um requisito separado, já previsto na
   proposta original. Guardar os dados num array do Node evita
   antecipar esse trabalho e mantém o foco no que a etapa pede.
3. **PATCH em vez de PUT.** O enunciado aceita qualquer um dos dois.
   PATCH foi escolhido porque a maioria das alterações reais (corrigir
   uma descrição, fixar uma mensagem) mexe só em 1-2 campos — com PUT
   seria preciso reenviar o objeto inteiro toda vez.
4. **CORS liberado.** O front-end estático (Live Server, porta 5500)
   e a API (porta 3000) rodam em origens diferentes; sem `cors()` o
   navegador bloquearia as requisições do site pra API.
5. **Validação manual, sem biblioteca externa (ex: Joi, Zod).** O
   volume de regras é pequeno o suficiente pra não justificar mais
   uma dependência — `validarProjeto`/`validarMensagem` já deixam
   claro o que cada campo exige.
6. **Erro sempre no mesmo formato** (`{ "erro": "..." }`), inclusive
   pra rota inexistente (404 genérico) e erro inesperado (500) — quem
   consome a API só precisa checar uma chave, nunca formatos
   diferentes dependendo do tipo de erro.

## Como testar

1. `cd server && npm install && npm start` — sobe em `http://localhost:3000`
2. Importar `server/insomnia-etapa-06.json` no Insomnia (ou Postman,
   que também lê esse formato) — 10 requisições já prontas, separadas
   por recurso
3. Ou usar os exemplos de curl acima diretamente no terminal
4. `GET /` confirma que o servidor está no ar
5. Testar um caso de erro (id inexistente, campo faltando) pra
   verificar os status 400/404

## Observação importante

O front-end (`src/`) continua consumindo os arquivos `dados/*.json`
estáticos por enquanto — trocar `api.js` pra consumir essa nova API
é trabalho de uma etapa futura (o enunciado da Etapa 06 pede só o
servidor em si, não a integração do cliente).
