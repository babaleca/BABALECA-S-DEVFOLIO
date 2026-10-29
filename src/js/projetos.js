/*
  Etapa 05 — Home (index.html): busca de projetos via fetch + módulos ES.

  O que mudou da Etapa 04:
  - Os projetos NÃO estão mais escritos direto no HTML — são buscados
    do arquivo dados/projetos.json usando fetch + async/await.
  - O código foi separado em módulos ES: as funções de rede ficam em
    api.js, as funções de interface ficam em ui.js, e este arquivo
    orquestra tudo (importa o que precisa de cada módulo).
  - Enquanto os dados carregam, aparece um indicador "Carregando...".
  - Se a busca falhar (ex: sem conexão, arquivo não encontrado),
    aparece uma mensagem de erro com botão "Tentar novamente".

  Conceitos demonstrados:
  - ES Modules (import)
  - Fetch API (GET) via função importada
  - async/await
  - Tratamento de loading (carregamento)
  - Tratamento de erro de comunicação (try/catch)
  - Construção dinâmica do DOM a partir de dados externos

  IMPORTANTE: este arquivo é carregado com type="module" no HTML,
  então NÃO precisa do wrapper DOMContentLoaded — módulos ES já
  esperam o DOM estar pronto antes de executar.
*/

// ---------------------------------------------------------------
// Importações dos outros módulos.
// import { funcao } from "./arquivo.js" — pega só o que precisa.
// ---------------------------------------------------------------
import { buscarProjetos, buscarRepositoriosGitHub } from "./api.js";
import { criarCardProjeto, criarCarregando, mostrarErroDeRede } from "./ui.js";

// ---------------------------------------------------------------
// Pega os elementos da página que vamos manipular.
// ---------------------------------------------------------------

// A grade onde os cards vão ser inseridos (começa vazia no HTML).
const grid = document.querySelector(".projetos-grid");

// O campo de busca por nome ou tecnologia.
const campoBusca = document.getElementById("busca-projetos");

// Mensagem de "nenhum projeto encontrado", escondida por padrão.
const mensagemSemResultado = document.getElementById("projetos-sem-resultado");

// Array que vai guardar os cards criados pelo JavaScript,
// pra poder filtrar depois na busca.
let cardsNaTela = [];

// ---------------------------------------------------------------
// normalizar — Remove acentos e maiúsculas pra busca funcionar
// sem distinção de caixa ou acento.
// (Mesma função da Etapa 04, mantida aqui porque é específica
// da lógica de busca desta página.)
// ---------------------------------------------------------------
function normalizar(texto) {
  return texto
    .toLowerCase()                   // tudo minúsculo
    .normalize("NFD")                // separa letra de acento
    .replace(/[̀-ͯ]/g, ""); // remove os acentos
}

// ---------------------------------------------------------------
// filtrarProjetos — Mostra/esconde cards de acordo com a busca
//
// Percorre todos os cards na tela, compara o texto digitado com
// o nome e as tecnologias de cada um, e esconde os que não combinam.
// Se nenhum combinar, mostra a mensagem de "nenhum resultado".
// (Mesma lógica da Etapa 04.)
// ---------------------------------------------------------------
function filtrarProjetos() {
  const termo = normalizar(campoBusca.value.trim());
  let algumVisivel = false;

  cardsNaTela.forEach((card) => {
    const nome = normalizar(card.querySelector("h3").textContent);
    const techs = normalizar(card.dataset.tecnologias || "");

    // Combina se: campo vazio (mostra tudo), ou termo aparece no nome ou tecnologias.
    const combina = termo === "" || nome.includes(termo) || techs.includes(termo);

    // hidden = true esconde, hidden = false mostra.
    card.hidden = !combina;
    if (combina) algumVisivel = true;
  });

  // Se nenhum card ficou visível, mostra aviso de "nenhum resultado".
  mensagemSemResultado.hidden = algumVisivel;
}

// ---------------------------------------------------------------
// carregarProjetos — Função principal (async)
//
// 1. Mostra indicador de carregamento
// 2. Busca os dados do JSON via fetch (chamada assíncrona)
// 3. Cria os cards a partir dos dados recebidos
// 4. Ativa o filtro de busca
//
// Se qualquer passo falhar, mostra erro com "Tentar novamente".
// ---------------------------------------------------------------
async function carregarProjetos() {
  // 1. Mostra "Carregando projetos..." na grade.
  const loading = criarCarregando("Carregando projetos...");
  grid.appendChild(loading);

  try {
    // 2. Busca os projetos locais E os repos do GitHub ao mesmo tempo.
    //    Promise.all executa as duas chamadas em paralelo — não espera
    //    uma terminar pra começar a outra. Isso deixa o carregamento
    //    mais rápido. Se qualquer uma falhar, o catch captura.
    const [projetos, repositorios] = await Promise.all([
      buscarProjetos(),              // GET em dados/projetos.json
      buscarRepositoriosGitHub(),    // GET na API do GitHub
    ]);

    // 3. Remove o loading (os dados já chegaram).
    loading.remove();

    // 4. Cria cards dos projetos locais (do JSON).
    projetos.forEach((projeto) => {
      const card = criarCardProjeto(projeto);
      grid.appendChild(card);
      cardsNaTela.push(card);
    });

    // 5. Se vieram repos do GitHub, adiciona um subtítulo e os cards.
    if (repositorios.length > 0) {
      const subtitulo = document.createElement("h3");
      subtitulo.textContent = "Repositórios do GitHub";
      subtitulo.className = "github-subtitulo";
      grid.parentElement.appendChild(subtitulo);

      // Cria uma segunda grade pros repos do GitHub.
      const gridGitHub = document.createElement("div");
      gridGitHub.className = "projetos-grid";
      grid.parentElement.appendChild(gridGitHub);

      repositorios.forEach((repo) => {
        const card = criarCardProjeto(repo);
        gridGitHub.appendChild(card);
        cardsNaTela.push(card);  // inclui na busca também
      });
    }

    // 6. Ativa a busca: cada letra digitada dispara filtrarProjetos.
    campoBusca.addEventListener("input", filtrarProjetos);

    // Roda uma vez pra garantir estado inicial correto.
    filtrarProjetos();

  } catch (erro) {
    // Se a busca falhou (rede, arquivo não encontrado, etc.):
    loading.remove();
    console.error("Falha ao carregar projetos:", erro);

    // Mostra mensagem de erro com botão "Tentar novamente"
    // que chama carregarProjetos de novo.
    mostrarErroDeRede(
      grid,
      "Não foi possível carregar os projetos. Verifique sua conexão.",
      carregarProjetos
    );
  }
}

// ---------------------------------------------------------------
// Inicia o carregamento assim que o módulo executa.
// (Com type="module", isso acontece depois do DOM estar pronto.)
// ---------------------------------------------------------------
carregarProjetos();
