/*
  Etapa 04 — Detalhe do Projeto (projeto.html): seções retráteis (acordeão).

  Ideia geral: cada seção da página ("Sobre o projeto", "Tecnologias
  utilizadas", "Links") ganha um botão "Mostrar/Ocultar" que abre e fecha
  aquela seção, sem sair da página. É uma prévia bem simples da ideia do
  "fichário digital" da proposta (divisórias que abrem e fecham).
*/

document.addEventListener("DOMContentLoaded", () => {
  // Pega todos os botões de abrir/fechar de uma vez (pode ter mais de um
  // na página — um por seção).
  const botoesDeAcordeao = document.querySelectorAll(".acordeao-toggle");

  // .forEach adiciona o mesmo comportamento de clique em cada botão
  // encontrado, um por um.
  botoesDeAcordeao.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Cada botão tem um atributo aria-controls apontando para o id do
      // bloco de conteúdo que ele controla (ligação usada também por
      // leitores de tela, para acessibilidade).
      const idDoConteudo = botao.getAttribute("aria-controls");
      const conteudo = document.getElementById(idDoConteudo);

      // aria-expanded guarda o estado atual ("true" = aberto, "false" =
      // fechado) como texto no próprio HTML, então dá pra ler esse estado
      // sempre que precisar, sem precisar de nenhuma variável separada.
      const estaExpandido = botao.getAttribute("aria-expanded") === "true";

      // Inverte o estado: se estava aberto, esconde o conteúdo (hidden =
      // true); se estava fechado, mostra (hidden = false).
      conteudo.hidden = estaExpandido;

      // Atualiza o atributo aria-expanded e o texto do botão para
      // refletirem o novo estado.
      botao.setAttribute("aria-expanded", String(!estaExpandido));
      botao.textContent = estaExpandido ? "Mostrar" : "Ocultar";
    });
  });
});
