/*
  Etapa 05 — Livro de Visitas: formulário com envio assíncrono + módulos ES.

  O que mudou da Etapa 04:
  - As mensagens iniciais são buscadas de dados/mensagens.json via fetch
    (antes estavam num array hardcoded dentro deste arquivo).
  - O envio do formulário agora faz um POST real para um serviço simulado
    (JSONPlaceholder), usando fetch + async/await — demonstra operação
    de envio assíncrono com tratamento de sucesso e erro.
  - Indicador "Carregando..." enquanto busca as mensagens iniciais.
  - Loading no botão "Enviando..." enquanto o POST está em andamento.
  - Tratamento de erro de rede (mensagem de erro se o fetch falhar).
  - Código separado em módulos (import de api.js e ui.js).

  Conceitos demonstrados:
  - ES Modules (import)
  - Fetch API (GET para consulta + POST para envio)
  - async/await + try/catch/finally
  - Loading states (indicador de carregamento)
  - Tratamento de sucesso e erro de comunicação
  - Validação de formulário com preventDefault

  IMPORTANTE: carregado com type="module" no HTML — não precisa de
  DOMContentLoaded (módulos ES já esperam o DOM estar pronto).
*/

// ---------------------------------------------------------------
// Importações dos outros módulos.
// ---------------------------------------------------------------
import { buscarMensagens, enviarMensagem } from "./api.js";
import { criarItemDeMensagem, criarCarregando, mostrarErroDeRede } from "./ui.js";

// ---------------------------------------------------------------
// Pega os elementos da página.
// ---------------------------------------------------------------
const formulario = document.getElementById("form-livro-visitas");
const campoNome = document.getElementById("nome");
const campoMensagem = document.getElementById("mensagem");
const erroNome = document.getElementById("erro-nome");
const erroMensagem = document.getElementById("erro-mensagem");
const lista = document.getElementById("lista-mensagens");
const botaoEnviar = formulario.querySelector("button[type='submit']");

// Array que guarda as mensagens (as que vieram do JSON + as novas).
let mensagens = [];

// ---------------------------------------------------------------
// renderizarMensagens — Redesenha toda a lista na tela
//
// Limpa a <ul> e recria todos os itens a partir do array.
// É chamada depois de carregar as mensagens iniciais e também
// depois de adicionar uma mensagem nova.
// ---------------------------------------------------------------
function renderizarMensagens() {
  lista.innerHTML = "";
  mensagens.forEach((item) => {
    // criarItemDeMensagem vem do ui.js — cria o <li> com textContent.
    lista.appendChild(criarItemDeMensagem(item));
  });
}

// ---------------------------------------------------------------
// validarCampos — Mesma validação da Etapa 04
//
// Verifica se nome e mensagem foram preenchidos corretamente.
// Retorna um objeto com os erros encontrados (vazio = tudo ok).
// ---------------------------------------------------------------
function validarCampos(nome, mensagem) {
  const erros = {};

  if (nome.trim() === "") {
    erros.nome = "Digite seu nome.";
  }

  if (mensagem.trim() === "") {
    erros.mensagem = "Escreva uma mensagem.";
  } else if (mensagem.trim().length < 5) {
    erros.mensagem = "A mensagem precisa ter pelo menos 5 caracteres.";
  }

  return erros;
}

// ---------------------------------------------------------------
// mostrarErros — Exibe ou limpa as mensagens de erro dos campos
// ---------------------------------------------------------------
function mostrarErros(erros) {
  erroNome.textContent = erros.nome || "";
  erroMensagem.textContent = erros.mensagem || "";
}

// ---------------------------------------------------------------
// carregarMensagens — Busca as mensagens iniciais do JSON (async)
//
// OPERAÇÃO DE CONSULTA: faz fetch GET em dados/mensagens.json.
// Mostra "Carregando..." enquanto espera, e trata erro de rede.
// ---------------------------------------------------------------
async function carregarMensagens() {
  // 1. Mostra indicador de carregamento.
  const loading = criarCarregando("Carregando mensagens...");
  lista.appendChild(loading);

  try {
    // 2. Busca as mensagens do arquivo JSON (await pausa aqui).
    mensagens = await buscarMensagens();

    // 3. Remove o loading e renderiza a lista.
    loading.remove();
    renderizarMensagens();

  } catch (erro) {
    // Se falhou, mostra erro com "Tentar novamente".
    loading.remove();
    console.error("Falha ao carregar mensagens:", erro);
    mostrarErroDeRede(
      lista,
      "Não foi possível carregar as mensagens.",
      carregarMensagens
    );
  }
}

// ---------------------------------------------------------------
// handleEnvio — Trata o envio do formulário (async)
//
// OPERAÇÃO DE ENVIO: valida os campos, mostra loading no botão,
// faz fetch POST para o serviço simulado, e trata sucesso/erro.
//
// Fluxo:
// 1. preventDefault — impede o envio padrão (recarregar a página)
// 2. Valida os campos
// 3. Mostra "Enviando..." no botão e desabilita ele
// 4. Faz o POST assíncrono (await)
// 5. Sucesso → adiciona a mensagem na lista
//    Erro → mostra mensagem de erro
// 6. finally → restaura o botão (deu certo ou não)
// ---------------------------------------------------------------
async function handleEnvio(evento) {
  // Impede o comportamento padrão (recarregar a página).
  evento.preventDefault();

  const nomeDigitado = campoNome.value;
  const mensagemDigitada = campoMensagem.value;

  // Valida — se tiver erro, mostra e para aqui.
  const erros = validarCampos(nomeDigitado, mensagemDigitada);
  mostrarErros(erros);
  if (Object.keys(erros).length > 0) return;

  // --- LOADING STATE: muda o botão pra "Enviando..." ---
  const textoOriginal = botaoEnviar.textContent;
  botaoEnviar.textContent = "Enviando...";
  botaoEnviar.disabled = true;  // desabilita pra não clicar duas vezes

  try {
    // --- OPERAÇÃO DE ENVIO: POST assíncrono ---
    // enviarMensagem (de api.js) faz fetch POST pro JSONPlaceholder.
    // O await pausa aqui até o servidor responder.
    await enviarMensagem({
      nome: nomeDigitado.trim(),
      mensagem: mensagemDigitada.trim(),
    });

    // --- TRATAMENTO DE SUCESSO ---
    // O POST deu certo — adiciona a mensagem na lista local.
    // (O serviço simulado não salva de verdade, então guardamos
    // no array local pra mostrar na tela.)
    const novaMensagem = {
      nome: nomeDigitado.trim(),
      mensagem: mensagemDigitada.trim(),
      data: new Date().toISOString().slice(0, 10), // data de hoje
    };

    // Spread (...) cria um array novo com a mensagem na frente.
    // Imutabilidade: não modifica o array antigo, cria um novo.
    mensagens = [novaMensagem, ...mensagens];
    renderizarMensagens();

    // Limpa o formulário e foca no campo de nome.
    formulario.reset();
    campoNome.focus();

  } catch (erro) {
    // --- TRATAMENTO DE ERRO DE COMUNICAÇÃO ---
    // Se o POST falhou (sem internet, servidor fora, etc.):
    console.error("Falha ao enviar mensagem:", erro);
    mostrarErros({ mensagem: "Erro ao enviar. Tente novamente." });

  } finally {
    // --- RESTAURA O BOTÃO (sempre executa, deu certo ou não) ---
    // finally garante que o botão volta ao normal mesmo se deu erro.
    botaoEnviar.textContent = textoOriginal;
    botaoEnviar.disabled = false;
  }
}

// ---------------------------------------------------------------
// Inicialização: carrega mensagens e ativa o formulário.
// ---------------------------------------------------------------
carregarMensagens();
formulario.addEventListener("submit", handleEnvio);
