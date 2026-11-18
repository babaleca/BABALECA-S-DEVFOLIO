/*
  dados/mensagens.js

  "Banco de dados" em memória do recurso Mensagem (livro de
  visitas), pra Etapa 06. Mesma lógica de dados/projetos.js —
  ver os comentários lá pra entender por que é um array em
  memória e não um banco de verdade ainda.

  Os 2 registros iniciais são as mesmas 2 mensagens de exemplo que
  já existiam em src/dados/mensagens.json (Etapa 05). O campo
  "fixada" é novo aqui: pensando no painel administrativo que vem
  numa etapa futura, dá pra fixar uma mensagem no topo do livro de
  visitas (ex: um elogio que a autora queira destacar) sem precisar
  de uma rota nova — é só um PATCH mudando esse campo pra true.
*/

let mensagens = [
  {
    id: 1,
    nome: "Visitante Exemplo",
    mensagem: "Adorei o portfólio, muito criativo!",
    data: "2026-08-20",
    fixada: false,
  },
  {
    id: 2,
    nome: "Outro Visitante",
    mensagem: "Mal posso esperar pra ver o fichário digital pronto.",
    data: "2026-08-18",
    fixada: false,
  },
];

let proximoId = 3;

// ---------------------------------------------------------------
// listar — devolve todas as mensagens, com as fixadas primeiro
// (pensando já em como o painel/livro de visitas vai exibir isso).
// ---------------------------------------------------------------
function listar() {
  // slice() copia o array antes de ordenar, pra não embaralhar a
  // ordem de inserção guardada internamente.
  return mensagens.slice().sort((a, b) => {
    if (a.fixada === b.fixada) return 0;
    return a.fixada ? -1 : 1;
  });
}

function buscarPorId(id) {
  return mensagens.find((mensagem) => mensagem.id === id);
}

// ---------------------------------------------------------------
// criar — adiciona uma nova mensagem. A data é sempre gerada aqui
// no servidor (data de hoje), nunca confiando no que o cliente
// mandar — evita mensagem com data falsa/inválida.
// ---------------------------------------------------------------
function criar(dados) {
  const novaMensagem = {
    id: proximoId,
    nome: dados.nome,
    mensagem: dados.mensagem,
    data: new Date().toISOString().slice(0, 10), // formato AAAA-MM-DD
    fixada: false,
  };

  proximoId = proximoId + 1;
  mensagens.push(novaMensagem);
  return novaMensagem;
}

// ---------------------------------------------------------------
// atualizar — atualização parcial (tipo PATCH). Usado tanto pra
// corrigir o texto de uma mensagem quanto pra fixar/desfixar
// (dados = { fixada: true }).
// ---------------------------------------------------------------
function atualizar(id, dados) {
  const mensagem = buscarPorId(id);
  if (!mensagem) {
    return undefined;
  }

  Object.assign(mensagem, dados);
  return mensagem;
}

function remover(id) {
  const tamanhoAntes = mensagens.length;
  mensagens = mensagens.filter((mensagem) => mensagem.id !== id);
  return mensagens.length < tamanhoAntes;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
