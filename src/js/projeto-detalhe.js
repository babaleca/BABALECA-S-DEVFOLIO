/*
  Etapa 05 — Detalhe do Projeto (projeto.html): seções retráteis (acordeão).

  Este arquivo foi convertido para módulo ES (carregado com type="module"
  no HTML). A lógica do acordeão permanece a mesma da Etapa 04 — não
  precisa de comunicação assíncrona porque o comportamento é puramente
  de interface (abrir/fechar seções na tela).

  O que mudou:
  - A função de inicialização agora é exportada (export function),
    permitindo que outros módulos a reutilizem se necessário.
  - O wrapper DOMContentLoaded foi removido — com type="module",
    o script já espera o DOM estar pronto antes de executar.

  Conceitos demonstrados:
  - ES Modules (export)
  - Acessibilidade (aria-expanded, aria-controls)
*/

// ---------------------------------------------------------------
// inicializarAcordeao — Configura o comportamento de abrir/fechar
//
// Exportada pra poder ser reutilizada em outras páginas que também
// tenham seções tipo acordeão (ex: uma futura página de FAQ).
// ---------------------------------------------------------------
export function inicializarAcordeao() {
  // Pega todos os botões de acordeão da página.
  const botoes = document.querySelectorAll(".acordeao-toggle");

  // Adiciona o mesmo comportamento de clique em cada botão.
  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      // aria-controls aponta pro id do bloco que este botão controla.
      const idDoConteudo = botao.getAttribute("aria-controls");
      const conteudo = document.getElementById(idDoConteudo);

      // aria-expanded guarda o estado atual como texto ("true"/"false").
      const estaExpandido = botao.getAttribute("aria-expanded") === "true";

      // Inverte: se estava aberto (true), esconde; se fechado, mostra.
      conteudo.hidden = estaExpandido;

      // Atualiza o atributo e o texto do botão pro novo estado.
      botao.setAttribute("aria-expanded", String(!estaExpandido));
      botao.textContent = estaExpandido ? "Mostrar" : "Ocultar";
    });
  });
}

// ---------------------------------------------------------------
// Inicializa automaticamente ao carregar o módulo.
// (Com type="module", o DOM já está pronto neste ponto.)
// ---------------------------------------------------------------
inicializarAcordeao();
