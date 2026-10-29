/*
  Etapa 05 — Módulo de comunicação assíncrona (api.js)

  Este módulo centraliza TODAS as chamadas de rede do projeto.
  Cada função usa fetch + async/await pra buscar ou enviar dados,
  e retorna uma Promise — quem chamar pode usar await pra esperar
  o resultado, e try/catch pra tratar erros.

  Conceitos demonstrados:
  - ES Modules (export)
  - Fetch API (GET e POST)
  - async/await
  - Promises
  - Tratamento de erros de comunicação (resposta não-ok)
*/

// ---------------------------------------------------------------
// URL do serviço simulado para envio de mensagens.
// JSONPlaceholder é uma API pública gratuita que aceita requisições
// POST e responde como se tivesse salvo os dados — perfeita pra
// simular um backend sem precisar montar servidor próprio.
// ---------------------------------------------------------------
const URL_SERVICO_MENSAGENS = "https://jsonplaceholder.typicode.com/posts";

// ---------------------------------------------------------------
// buscarProjetos — OPERAÇÃO DE CONSULTA (GET)
//
// Faz um fetch GET no arquivo dados/projetos.json pra obter a
// lista de projetos. Antes (Etapa 04), esses dados estavam
// escritos direto no HTML; agora vêm de uma fonte externa.
//
// async → marca a função como assíncrona (retorna Promise).
// await → pausa a execução até o fetch terminar, sem travar a página.
// Se a resposta não for ok (ex: arquivo não encontrado, erro 404),
// lança um Error que será capturado pelo try/catch de quem chamou.
//
// @returns {Promise<Array>} — array de objetos de projeto
// ---------------------------------------------------------------
export async function buscarProjetos() {
  // fetch() faz a requisição HTTP. O await espera ela terminar.
  const resposta = await fetch("dados/projetos.json");

  // resposta.ok é true se o status HTTP for 200-299 (sucesso).
  // Se não for (ex: 404, 500), algo deu errado — lança erro.
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar projetos: ${resposta.status}`);
  }

  // resposta.json() converte o corpo da resposta de texto JSON
  // pra um objeto/array JavaScript. Também retorna uma Promise,
  // por isso o await.
  return resposta.json();
}

// ---------------------------------------------------------------
// buscarMensagens — OPERAÇÃO DE CONSULTA (GET)
//
// Faz um fetch GET no arquivo dados/mensagens.json pra obter as
// mensagens iniciais do livro de visitas. Antes (Etapa 04), essas
// mensagens estavam num array hardcoded dentro do próprio JS.
//
// @returns {Promise<Array>} — array de objetos de mensagem
// ---------------------------------------------------------------
export async function buscarMensagens() {
  const resposta = await fetch("dados/mensagens.json");

  if (!resposta.ok) {
    throw new Error(`Erro ao buscar mensagens: ${resposta.status}`);
  }

  return resposta.json();
}

// ---------------------------------------------------------------
// enviarMensagem — OPERAÇÃO DE ENVIO (POST)
//
// Faz um fetch POST para o serviço simulado (JSONPlaceholder),
// enviando os dados da nova mensagem em formato JSON.
//
// Diferenças do GET:
// - method: "POST" (em vez do GET padrão)
// - headers: diz que o corpo é JSON
// - body: os dados convertidos pra texto JSON com JSON.stringify
//
// O servidor simulado responde com status 201 (Created) e devolve
// os dados enviados + um id gerado. Na prática, nada é salvo de
// verdade no servidor — é só simulação.
//
// @param {{ nome: string, mensagem: string }} dados — o que enviar
// @returns {Promise<Object>} — resposta do servidor com id gerado
// ---------------------------------------------------------------
export async function enviarMensagem(dados) {
  const resposta = await fetch(URL_SERVICO_MENSAGENS, {
    // Configurações da requisição:
    method: "POST",                          // tipo: envio de dados
    headers: {
      "Content-Type": "application/json",    // avisa o servidor que o corpo é JSON
    },
    body: JSON.stringify(dados),             // converte o objeto JS pra texto JSON
  });

  if (!resposta.ok) {
    throw new Error(`Erro ao enviar mensagem: ${resposta.status}`);
  }

  return resposta.json();
}

// ---------------------------------------------------------------
// buscarRepositoriosGitHub — CONSULTA A API PÚBLICA DO GITHUB (GET)
//
// Faz um fetch GET na API pública do GitHub pra obter os
// repositórios reais da conta "babaleca". Isso demonstra consumo
// de uma API pública de verdade, com dados reais — não simulados.
//
// A URL api.github.com/users/{usuario}/repos retorna um array JSON
// com os repositórios públicos daquela pessoa. Não precisa de
// autenticação pra repos públicos.
//
// O parâmetro ?sort=updated faz a API devolver os repos mais
// recentemente atualizados primeiro, e ?per_page=6 limita a 6
// resultados pra não poluir a tela.
//
// @returns {Promise<Array>} — array de objetos de repositório do GitHub
// ---------------------------------------------------------------
const GITHUB_USUARIO = "babaleca";
const URL_GITHUB = `https://api.github.com/users/${GITHUB_USUARIO}/repos`;

export async function buscarRepositoriosGitHub() {
  const resposta = await fetch(`${URL_GITHUB}?sort=updated&per_page=6`);

  if (!resposta.ok) {
    throw new Error(`Erro ao buscar repositórios do GitHub: ${resposta.status}`);
  }

  // A API do GitHub retorna muitos campos por repositório. A gente
  // transforma cada um num formato mais simples — o mesmo formato
  // dos projetos do JSON local — pra poder reutilizar o mesmo
  // criarCardProjeto() do ui.js.
  const repos = await resposta.json();

  return repos.map((repo) => ({
    id: repo.id,
    nome: repo.name,
    descricao: repo.description || "Sem descrição.",
    // repo.language é a linguagem principal detectada pelo GitHub.
    // Se não tiver, usa "GitHub" como fallback.
    tecnologias: repo.language ? [repo.language] : ["GitHub"],
    // Link pro repositório real no GitHub (abre em nova aba).
    link: repo.html_url,
    // Flag pra saber que veio do GitHub (usado no ui.js pra abrir em nova aba).
    externo: true,
  }));
}
