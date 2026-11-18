/*
  dados/projetos.js

  "Banco de dados" em memória do recurso Projeto, pra Etapa 06.

  Por que em memória (um array, não SQLite ainda): o enunciado desta
  etapa pede a API REST em si (rotas, métodos HTTP, validação,
  status code) — persistência de verdade (banco de dados) é um
  requisito de uma etapa futura, já prevista na proposta original
  (docs/proposta.md fala em SQLite + Sequelize/Prisma). Guardar os
  dados aqui, num array do Node, deixa a API funcionando de ponta a
  ponta sem adiantar aquele trabalho. Única consequência prática:
  os dados voltam ao estado inicial sempre que o servidor reinicia
  (não sobrevivem a um "node app.js" novo) — comportamento normal
  pra essa fase do projeto.

  Os 3 registros iniciais são os mesmos 3 projetos de exemplo que já
  existiam em src/dados/projetos.json (Etapa 05) — assim a API já
  nasce com dados reais do projeto, não inventados do zero.
*/

// Array que guarda os projetos. "let" (não "const") porque o array
// inteiro é reatribuído em alguns pontos (ex: remover).
let projetos = [
  {
    id: 1,
    nome: "Nome do Projeto (exemplo1)",
    descricao:
      "Descrição curta do projeto de exemplo — nesta etapa o conteúdo ainda é estático, nas próximas etapas os projetos reais serão cadastrados pelo painel administrativo.",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    link: "projeto.html",
  },
  {
    id: 2,
    nome: "Nome do Projeto (exemplo2)",
    descricao:
      "Descrição curta do projeto de exemplo — nesta etapa o conteúdo ainda é estático, nas próximas etapas os projetos reais serão cadastrados pelo painel administrativo.",
    tecnologias: ["Node.js", "Express"],
    link: "projeto.html",
  },
  {
    id: 3,
    nome: "Nome do Projeto (exemplo3)",
    descricao:
      "Descrição curta do projeto de exemplo — nesta etapa o conteúdo ainda é estático, nas próximas etapas os projetos reais serão cadastrados pelo painel administrativo.",
    tecnologias: ["SQLite", "API GitHub"],
    link: "projeto.html",
  },
];

// Controla o próximo id a usar em criações novas. Começa depois do
// maior id já existente nos dados iniciais.
let proximoId = 4;

// ---------------------------------------------------------------
// listar — devolve todos os projetos.
//
// Aceita um filtro opcional por tecnologia (ex: ?tecnologia=css),
// usado pela rota GET /api/projetos?tecnologia=... — a mesma ideia
// de "busca e filtro de projetos" que já existe no front-end
// (Etapa 04), só que agora resolvida no servidor.
// ---------------------------------------------------------------
function listar(filtroTecnologia) {
  if (!filtroTecnologia) {
    return projetos;
  }

  const alvo = filtroTecnologia.toLowerCase();
  return projetos.filter((projeto) =>
    projeto.tecnologias.some((tecnologia) =>
      tecnologia.toLowerCase().includes(alvo)
    )
  );
}

// ---------------------------------------------------------------
// buscarPorId — devolve um projeto específico, ou undefined se o
// id não existir (a rota decide o que fazer com undefined: 404).
// ---------------------------------------------------------------
function buscarPorId(id) {
  return projetos.find((projeto) => projeto.id === id);
}

// ---------------------------------------------------------------
// criar — adiciona um novo projeto ao array, gerando o id.
// Recebe só os campos de dados (sem id — quem decide o id é aqui).
// ---------------------------------------------------------------
function criar(dados) {
  const novoProjeto = {
    id: proximoId,
    nome: dados.nome,
    descricao: dados.descricao,
    tecnologias: dados.tecnologias,
    link: dados.link || "projeto.html",
  };

  proximoId = proximoId + 1;
  projetos.push(novoProjeto);
  return novoProjeto;
}

// ---------------------------------------------------------------
// atualizar — altera os campos informados de um projeto existente
// (atualização parcial, tipo PATCH: só mexe no que vier em "dados").
// Devolve o projeto atualizado, ou undefined se o id não existir.
// ---------------------------------------------------------------
function atualizar(id, dados) {
  const projeto = buscarPorId(id);
  if (!projeto) {
    return undefined;
  }

  // Object.assign copia só as chaves que vieram em "dados" por cima
  // do projeto existente — os campos não enviados permanecem iguais.
  Object.assign(projeto, dados);
  return projeto;
}

// ---------------------------------------------------------------
// remover — apaga um projeto pelo id.
// Devolve true se removeu, false se o id não existia.
// ---------------------------------------------------------------
function remover(id) {
  const tamanhoAntes = projetos.length;
  projetos = projetos.filter((projeto) => projeto.id !== id);
  return projetos.length < tamanhoAntes;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
