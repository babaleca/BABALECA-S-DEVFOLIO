/*
  Etapa 05 — Módulo de interface (ui.js)

  Funções reutilizáveis para criar elementos visuais na tela:
  indicadores de carregamento, mensagens de erro de rede,
  cards de projeto e itens de mensagem.

  Este módulo é importado por projetos.js e livro-de-visitas.js,
  evitando duplicação de código (antes, cada script criava seus
  próprios elementos do zero).

  Conceitos demonstrados:
  - ES Modules (export)
  - Separação de responsabilidades (UI separada da lógica de rede)
  - Reutilização de código entre páginas diferentes
  - Acessibilidade (aria-live, role="alert")
  - Segurança (textContent em vez de innerHTML contra XSS)
*/

// ---------------------------------------------------------------
// criarCarregando — Indicador de loading
//
// Cria um elemento <p> com uma mensagem de "Carregando..." que
// aparece enquanto o fetch está buscando os dados. O atributo
// aria-live="polite" faz leitores de tela anunciarem quando o
// texto aparece ou muda, sem interromper o que estavam lendo.
//
// @param {string} texto — mensagem mostrada (ex: "Carregando projetos...")
// @returns {HTMLElement} — elemento <p> pronto pra inserir na página
// ---------------------------------------------------------------
export function criarCarregando(texto) {
  const elemento = document.createElement("p");
  elemento.className = "carregando";
  // aria-live="polite" = leitores de tela anunciam mudanças neste
  // elemento quando conveniente (sem interromper leitura atual).
  elemento.setAttribute("aria-live", "polite");
  elemento.textContent = texto;
  return elemento;
}

// ---------------------------------------------------------------
// mostrarErroDeRede — Mensagem de erro com "Tentar novamente"
//
// Cria um bloco de erro dentro de um container, mostrando o que
// deu errado e um botão pra tentar de novo. O role="alert" faz
// leitores de tela anunciarem o erro imediatamente.
//
// @param {HTMLElement} container — onde inserir a mensagem de erro
// @param {string} mensagem — texto do erro
// @param {Function} aoTentarNovamente — função chamada ao clicar no botão
// @returns {HTMLElement} — o elemento de erro criado
// ---------------------------------------------------------------
export function mostrarErroDeRede(container, mensagem, aoTentarNovamente) {
  const div = document.createElement("div");
  div.className = "erro-rede";
  // role="alert" = leitor de tela anuncia este conteúdo imediatamente.
  div.setAttribute("role", "alert");

  const texto = document.createElement("p");
  texto.textContent = mensagem;
  div.appendChild(texto);

  // Se foi passada uma função de "tentar novamente", cria o botão.
  if (aoTentarNovamente) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Tentar novamente";
    botao.addEventListener("click", () => {
      // Remove a mensagem de erro e chama a função de novo.
      div.remove();
      aoTentarNovamente();
    });
    div.appendChild(botao);
  }

  container.appendChild(div);
  return div;
}

// ---------------------------------------------------------------
// criarCardProjeto — Monta um card de projeto no DOM
//
// Recebe um objeto com os dados do projeto (vindo do JSON) e cria
// toda a estrutura HTML do card — o mesmo formato que antes estava
// escrito direto no index.html, mas agora montado dinamicamente.
//
// Usa textContent (não innerHTML) pra segurança contra XSS.
//
// @param {{ nome: string, descricao: string, tecnologias: string[], link: string }} projeto
// @returns {HTMLElement} — elemento <article> com classe "projeto-card"
// ---------------------------------------------------------------
export function criarCardProjeto(projeto) {
  // Cria o <article> principal do card.
  const article = document.createElement("article");
  article.className = "projeto-card";
  // data-tecnologias guarda as tecnologias em texto puro minúsculo,
  // usado pela busca/filtro pra comparar com o que foi digitado.
  article.dataset.tecnologias = projeto.tecnologias.join(" ").toLowerCase();

  // Título com link — <h3><a href="...">Nome</a></h3>
  const h3 = document.createElement("h3");
  const linkTitulo = document.createElement("a");
  linkTitulo.href = projeto.link;
  linkTitulo.textContent = projeto.nome;  // textContent = seguro
  // Se o projeto é externo (ex: repo do GitHub), abre em nova aba.
  if (projeto.externo) {
    linkTitulo.target = "_blank";
    linkTitulo.rel = "noopener noreferrer";
  }
  h3.appendChild(linkTitulo);

  // Descrição — <p>texto</p>
  const descricao = document.createElement("p");
  descricao.textContent = projeto.descricao;  // textContent = seguro

  // Lista de tecnologias — <p>Tecnologias: <span>X</span>, <span>Y</span></p>
  const tecnologias = document.createElement("p");
  tecnologias.className = "projeto-card__tecnologias";
  tecnologias.textContent = "Tecnologias: ";
  projeto.tecnologias.forEach((tech, indice) => {
    const span = document.createElement("span");
    span.textContent = tech;
    tecnologias.appendChild(span);
    // Coloca vírgula entre as tecnologias, mas não depois da última.
    if (indice < projeto.tecnologias.length - 1) {
      tecnologias.appendChild(document.createTextNode(", "));
    }
  });

  // Botão "Ver detalhes" (ou "Ver no GitHub" se for externo).
  const botaoLink = document.createElement("a");
  botaoLink.className = "botao-link";
  botaoLink.href = projeto.link;
  botaoLink.textContent = projeto.externo ? "Ver no GitHub" : "Ver detalhes";
  // Links externos abrem em nova aba por segurança.
  if (projeto.externo) {
    botaoLink.target = "_blank";
    botaoLink.rel = "noopener noreferrer";
  }

  // Monta tudo dentro do article, na ordem certa.
  article.append(h3, descricao, tecnologias, botaoLink);
  return article;
}

// ---------------------------------------------------------------
// formatarData — Converte data ISO pra formato brasileiro
//
// Transforma "2026-08-20" em "20/08/2026".
//
// @param {string} dataISO — data no formato "AAAA-MM-DD"
// @returns {string} — data no formato "DD/MM/AAAA"
// ---------------------------------------------------------------
export function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ---------------------------------------------------------------
// criarItemDeMensagem — Monta um item de mensagem do livro de visitas
//
// Recebe um objeto com nome, mensagem e data, e cria a estrutura
// HTML do item — o mesmo formato que antes era criado dentro do
// livro-de-visitas.js, agora reutilizável por qualquer módulo.
//
// Usa textContent (não innerHTML) para segurança contra XSS —
// se alguém digitar <script> no campo, aparece como texto puro.
//
// @param {{ nome: string, mensagem: string, data: string }} item
// @returns {HTMLElement} — elemento <li>
// ---------------------------------------------------------------
export function criarItemDeMensagem(item) {
  const li = document.createElement("li");
  const article = document.createElement("article");

  // Cabeçalho com nome e data.
  const header = document.createElement("header");
  const nomeElemento = document.createElement("strong");
  nomeElemento.textContent = item.nome;          // textContent = seguro
  const tempoElemento = document.createElement("time");
  tempoElemento.dateTime = item.data;
  tempoElemento.textContent = formatarData(item.data);
  header.append(nomeElemento, tempoElemento);

  // Texto da mensagem.
  const paragrafo = document.createElement("p");
  paragrafo.textContent = item.mensagem;          // textContent = seguro

  article.append(header, paragrafo);
  li.append(article);
  return li;
}
