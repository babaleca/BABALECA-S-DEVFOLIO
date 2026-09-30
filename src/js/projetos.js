/*
  Etapa 04 — Home (index.html): busca/filtro de projetos.

  Ideia geral: a pessoa digita no campo de busca e os cards de projeto que
  não combinam com o que foi digitado somem da tela na hora, sem recarregar
  a página. Se nenhum card combinar, aparece uma mensagem avisando.
*/

// Espera o HTML inteiro carregar antes de procurar os elementos na página.
// Isso evita erros de "elemento não encontrado" caso o <script> rode antes
// do resto do HTML existir.
document.addEventListener("DOMContentLoaded", () => {
  // Pega o campo de busca pelo id. Se essa página não tiver esse campo
  // (por segurança, caso o script seja incluído em outra página por engano),
  // a função para por aqui.
  const campoBusca = document.getElementById("busca-projetos");
  if (!campoBusca) return;

  // Pega a mensagem de "nenhum projeto encontrado", escondida por padrão no HTML.
  const mensagemSemResultado = document.getElementById("projetos-sem-resultado");

  // document.querySelectorAll devolve uma "NodeList" (parecida com array, mas sem
  // todos os métodos de array). Array.from converte pra um array de verdade,
  // pra podermos usar .forEach nele.
  const cards = Array.from(document.querySelectorAll(".projeto-card"));

  // Função auxiliar: deixa o texto em minúsculas e remove acentos, pra
  // comparação não ser sensível a maiúscula/minúscula nem a acento
  // (ex: buscar "javascript" ou "JavaScript" dá o mesmo resultado).
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD") // separa letras acentuadas em "letra + acento"
      .replace(/[̀-ͯ]/g, ""); // remove os acentos separados
  }

  // Função principal: lê o que está digitado no campo de busca e
  // mostra/esconde cada card de acordo.
  function filtrarProjetos() {
    const termoBuscado = normalizar(campoBusca.value.trim());

    // Guarda se pelo menos um card ficou visível, pra saber se mostra
    // a mensagem de "nenhum resultado" no final.
    let algumCardVisivel = false;

    // .forEach percorre o array de cards um por um.
    cards.forEach((card) => {
      // Pega o texto do nome do projeto (dentro do <h3>) e a lista de
      // tecnologias guardada no atributo data-tecnologias do card.
      const nomeDoProjeto = normalizar(card.querySelector("h3").textContent);
      const tecnologiasDoProjeto = normalizar(card.dataset.tecnologias || "");

      // O card combina com a busca se: o campo estiver vazio (mostra tudo),
      // ou se o termo buscado aparecer no nome, ou nas tecnologias.
      const combina =
        termoBuscado === "" ||
        nomeDoProjeto.includes(termoBuscado) ||
        tecnologiasDoProjeto.includes(termoBuscado);

      // O atributo HTML "hidden" esconde o elemento (equivalente a
      // display:none), sem precisar de nenhuma classe CSS nova.
      card.hidden = !combina;

      if (combina) algumCardVisivel = true;
    });

    // Se nenhum card sobrou visível, mostra a mensagem de "nenhum resultado".
    // Se pelo menos um sobrou, a mensagem fica escondida.
    mensagemSemResultado.hidden = algumCardVisivel;
  }

  // Sempre que a pessoa digita algo no campo (evento "input", que dispara
  // a cada letra digitada/apagada), a gente filtra de novo.
  campoBusca.addEventListener("input", filtrarProjetos);

  // Roda uma vez assim que a página carrega, pra garantir que a mensagem
  // de "sem resultado" comece escondida corretamente (caso o navegador
  // tenha mantido algum texto digitado de antes, ao recarregar a página).
  filtrarProjetos();
});
