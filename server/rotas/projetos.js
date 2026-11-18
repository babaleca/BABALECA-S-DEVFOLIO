/*
  rotas/projetos.js

  Todas as rotas do recurso Projeto, organizadas num Router do
  Express — assim app.js só precisa montar esse router numa URL
  base (/api/projetos) em vez de ter todas as rotas da API
  misturadas num arquivo só.

  5 operações, como pede a Etapa 06:
    GET    /api/projetos       → listar (com filtro opcional)
    GET    /api/projetos/:id   → consultar um específico
    POST   /api/projetos       → criar
    PATCH  /api/projetos/:id   → alterar
    DELETE /api/projetos/:id   → excluir
*/

const express = require("express");
const projetosDB = require("../dados/projetos");

const router = express.Router();

// ---------------------------------------------------------------
// Validação dos dados de um projeto. Usada tanto no POST (todos os
// campos obrigatórios) quanto no PATCH (só valida o que foi
// enviado, já que é atualização parcial).
//
// Devolve uma string com o erro, ou null se estiver tudo certo —
// assim quem chama só precisa checar "if (erro)".
// ---------------------------------------------------------------
function validarProjeto(dados, { exigirTudo }) {
  const temNome = dados.nome !== undefined;
  const temDescricao = dados.descricao !== undefined;
  const temTecnologias = dados.tecnologias !== undefined;

  if (exigirTudo && !(temNome && temDescricao && temTecnologias)) {
    return "Campos obrigatórios: nome, descricao, tecnologias.";
  }

  if (temNome && (typeof dados.nome !== "string" || dados.nome.trim() === "")) {
    return "O campo nome precisa ser um texto não vazio.";
  }

  if (
    temDescricao &&
    (typeof dados.descricao !== "string" || dados.descricao.trim() === "")
  ) {
    return "O campo descricao precisa ser um texto não vazio.";
  }

  if (
    temTecnologias &&
    (!Array.isArray(dados.tecnologias) || dados.tecnologias.length === 0)
  ) {
    return "O campo tecnologias precisa ser uma lista com pelo menos um item.";
  }

  if (dados.link !== undefined && typeof dados.link !== "string") {
    return "O campo link precisa ser um texto.";
  }

  return null;
}

// GET /api/projetos — lista todos, ou filtra por ?tecnologia=
router.get("/", (req, res) => {
  const resultado = projetosDB.listar(req.query.tecnologia);
  res.status(200).json(resultado);
});

// GET /api/projetos/:id — um projeto específico
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const projeto = projetosDB.buscarPorId(id);
  if (!projeto) {
    return res.status(404).json({ erro: `Projeto ${id} não encontrado.` });
  }

  res.status(200).json(projeto);
});

// POST /api/projetos — cria um projeto novo
router.post("/", (req, res) => {
  const erro = validarProjeto(req.body, { exigirTudo: true });
  if (erro) {
    return res.status(400).json({ erro });
  }

  const novoProjeto = projetosDB.criar(req.body);
  res.status(201).json(novoProjeto);
});

// PATCH /api/projetos/:id — altera um projeto existente
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const erro = validarProjeto(req.body, { exigirTudo: false });
  if (erro) {
    return res.status(400).json({ erro });
  }

  const projetoAtualizado = projetosDB.atualizar(id, req.body);
  if (!projetoAtualizado) {
    return res.status(404).json({ erro: `Projeto ${id} não encontrado.` });
  }

  res.status(200).json(projetoAtualizado);
});

// DELETE /api/projetos/:id — remove um projeto
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id precisa ser um número." });
  }

  const removeu = projetosDB.remover(id);
  if (!removeu) {
    return res.status(404).json({ erro: `Projeto ${id} não encontrado.` });
  }

  // 204 = sucesso, sem corpo de resposta (não tem o que devolver,
  // o recurso não existe mais).
  res.status(204).send();
});

module.exports = router;
