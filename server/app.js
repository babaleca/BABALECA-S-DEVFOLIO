/*
  app.js — Etapa 06: API REST da Aplicação

  Servidor Express do DevFolio. Expõe dois recursos principais,
  cada um com as 5 operações (listar, consultar, criar, alterar,
  excluir): Projetos e Mensagens (livro de visitas).

  Conceitos demonstrados:
  - Servidor HTTP com Express
  - Organização de rotas em routers separados (rotas/)
  - Uso correto de métodos HTTP (GET, POST, PATCH, DELETE)
  - Códigos de status HTTP coerentes (200, 201, 204, 400, 404, 500)
  - JSON como formato de entrada e saída
  - Validação de entrada
  - Tratamento de erro consistente (sempre { erro: "..." })
*/

const express = require("express");
const cors = require("cors");

const rotasProjetos = require("./rotas/projetos");
const rotasMensagens = require("./rotas/mensagens");

const app = express();
const PORTA = process.env.PORT || 3000;

// ---------------------------------------------------------------
// Middlewares globais.
// ---------------------------------------------------------------

// Permite o front-end (rodando em outra porta, ex: Live Server em
// 127.0.0.1:5500) fazer requisições pra essa API sem ser barrado
// por CORS. Em produção isso restringiria a origem; aqui, como é
// um projeto de estudo rodando local, libera geral.
app.use(cors());

// Faz o Express entender corpo de requisição em JSON (req.body) —
// sem isso, POST e PATCH chegariam com req.body vazio.
app.use(express.json());

// ---------------------------------------------------------------
// Rotas da API, organizadas por recurso.
// ---------------------------------------------------------------
app.use("/api/projetos", rotasProjetos);
app.use("/api/mensagens", rotasMensagens);

// Rota de verificação rápida — só pra saber se o servidor tá de pé
// (útil pra testar com um simples GET /, sem precisar saber nenhum
// endpoint de verdade).
app.get("/", (req, res) => {
  res.status(200).json({
    nome: "DevFolio API",
    recursos: ["/api/projetos", "/api/mensagens"],
  });
});

// ---------------------------------------------------------------
// 404 — qualquer rota não cadastrada acima cai aqui. Fica depois de
// todas as rotas de verdade, porque o Express testa na ordem.
// ---------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// ---------------------------------------------------------------
// Tratamento de erro genérico — pega qualquer erro não tratado que
// aconteça dentro de uma rota (ex: JSON malformado no corpo da
// requisição) e devolve no mesmo formato consistente das outras
// respostas de erro, em vez de travar o servidor ou devolver um
// HTML de erro padrão do Express.
//
// Precisa dos 4 parâmetros (err, req, res, next) — é assim que o
// Express reconhece que essa função é um error handler.
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err.message);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORTA, () => {
  console.log(`DevFolio API rodando em http://localhost:${PORTA}`);
});
