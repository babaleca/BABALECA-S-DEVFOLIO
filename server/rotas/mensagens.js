/*
  rotas/mensagens.js

  Rotas do recurso Mensagem (livro de visitas). Mesma estrutura de
  rotas/projetos.js — ver os comentários lá pra entender o padrão
  geral (validação, status codes).

    GET    /api/mensagens       → listar (fixadas primeiro)
    GET    /api/mensagens/:id   → consultar uma específica
    POST   /api/mensagens       → criar
    PATCH  /api/mensagens/:id   → alterar (ex: fixar/desfixar)
    DELETE /api/mensagens/:id   → excluir
*/

const express = require("express");
const mensagensDB = require("../dados/mensagens");

const router = express.Router();

function validarMensagem(dados, { exigirTudo }) {
  const temNome = dados.nome !== undefined;
  const temMensagem = dados.mensagem !== undefined;

  if (exigirTudo && !(temNome && temMensagem)) {
    return "Campos obrigatórios: nome, mensagem.";
  }

  if (temNome && (typeof dados.nome !== "string" || dados.nome.trim() === "")) {
    return "O campo nome precisa ser um texto não vazio.";
  }

  if (
    temMensagem &&
    (typeof dados.mensagem !== "string" || dados.mensagem.trim() === "")
  ) {
    return "O campo mensagem precisa ser um texto não vazio.";
  }

  if (dados.fixada !== undefined && typeof dados.fixada !== "boolean") {
    return "O campo fixada precisa ser true ou false.";
  }

  // "data" é sempre gerada pelo servidor (ver dados/mensagens.js) —
  // se vier no corpo da requisição, é simplesmente ignorada, nunca
  // validada nem usada. Evita que um visitante mande uma data falsa.

  return null;
}

router.get("/", (req, res) => {
  res.status(200).json(mensagensDB.listar());
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const mensagem = mensagensDB.buscarPorId(id);
  if (!mensagem) {
    return res.status(404).json({ erro: `Mensagem ${id} não encontrada.` });
  }

  res.status(200).json(mensagem);
});

router.post("/", (req, res) => {
  const erro = validarMensagem(req.body, { exigirTudo: true });
  if (erro) {
    return res.status(400).json({ erro });
  }

  const novaMensagem = mensagensDB.criar(req.body);
  res.status(201).json(novaMensagem);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const erro = validarMensagem(req.body, { exigirTudo: false });
  if (erro) {
    return res.status(400).json({ erro });
  }

  const mensagemAtualizada = mensagensDB.atualizar(id, req.body);
  if (!mensagemAtualizada) {
    return res.status(404).json({ erro: `Mensagem ${id} não encontrada.` });
  }

  res.status(200).json(mensagemAtualizada);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const removeu = mensagensDB.remover(id);
  if (!removeu) {
    return res.status(404).json({ erro: `Mensagem ${id} não encontrada.` });
  }

  res.status(204).send();
});

module.exports = router;
