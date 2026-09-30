/*
  Etapa 04 — Livro de Visitas (livro-de-visitas.html): formulário funcional
  no lado do cliente.

  Ideia geral: ainda não existe back-end/banco de dados, então "enviar" uma
  mensagem aqui significa: validar o que foi digitado, e se estiver tudo
  certo, adicionar a mensagem na lista da tela na hora (guardada só na
  memória do navegador — some se a página for recarregada. O envio de
  verdade, salvando no banco, é para uma etapa futura).
*/

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-livro-visitas");
  if (!formulario) return;

  const campoNome = document.getElementById("nome");
  const campoMensagem = document.getElementById("mensagem");
  const erroNome = document.getElementById("erro-nome");
  const erroMensagem = document.getElementById("erro-mensagem");
  const lista = document.getElementById("lista-mensagens");

  // Array com as mensagens que já existiam no HTML da Etapa 02/03 (o mesmo
  // conteúdo, só que agora guardado como dados em vez de HTML fixo). A
  // partir daqui, quem desenha a lista na tela é a função renderizarMensagens,
  // olhando pra esse array.
  let mensagens = [
    {
      nome: "Visitante Exemplo",
      mensagem: "Adorei o portfólio, muito criativo!",
      data: "2026-08-20",
    },
    {
      nome: "Outro Visitante",
      mensagem: "Mal posso esperar pra ver o fichário digital pronto.",
      data: "2026-08-18",
    },
  ];

  // Transforma uma data "2026-08-20" (formato do atributo datetime do <time>)
  // em "20/08/2026" (formato mais natural de leitura em português).
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // Recebe um objeto { nome, mensagem, data } e monta os elementos HTML
  // correspondentes (o mesmo formato que já existia no HTML original),
  // devolvendo o <li> pronto pra ser inserido na lista.
  //
  // Reparar que aqui é usado .textContent (não .innerHTML) pra colocar o
  // nome e a mensagem digitados pela pessoa. Isso é proposital: .textContent
  // trata o conteúdo sempre como texto puro, então mesmo que alguém digite
  // algo parecido com uma tag HTML no formulário, isso não vira HTML de
  // verdade na página — só aparece como texto mesmo. É uma validação de
  // segurança básica, além da validação de campos obrigatórios.
  function criarItemDeMensagem(item) {
    const li = document.createElement("li");
    const article = document.createElement("article");

    const header = document.createElement("header");
    const nomeElemento = document.createElement("strong");
    nomeElemento.textContent = item.nome;
    const tempoElemento = document.createElement("time");
    tempoElemento.dateTime = item.data;
    tempoElemento.textContent = formatarData(item.data);
    header.append(nomeElemento, tempoElemento);

    const paragrafo = document.createElement("p");
    paragrafo.textContent = item.mensagem;

    article.append(header, paragrafo);
    li.append(article);
    return li;
  }

  // Apaga a lista inteira e desenha de novo, percorrendo o array
  // "mensagens" do início ao fim com .forEach. É assim que uma mudança no
  // array (uma mensagem nova) vira uma mudança visível na tela.
  function renderizarMensagens() {
    lista.innerHTML = "";
    mensagens.forEach((item) => {
      lista.append(criarItemDeMensagem(item));
    });
  }

  // Confere se o nome e a mensagem digitados são válidos. Devolve um objeto
  // com as mensagens de erro encontradas (uma chave por campo). Se o objeto
  // devolvido estiver vazio, quer dizer que passou na validação.
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

  // Mostra (ou limpa) as mensagens de erro embaixo de cada campo.
  function mostrarErros(erros) {
    erroNome.textContent = erros.nome || "";
    erroMensagem.textContent = erros.mensagem || "";
  }

  // Desenha a lista original assim que a página carrega, a partir do array
  // "mensagens" (antes disso, o <ul id="lista-mensagens"> começa vazio no HTML).
  renderizarMensagens();

  formulario.addEventListener("submit", (evento) => {
    // Impede o comportamento padrão do navegador (recarregar/navegar a
    // página ao enviar o formulário) — sem isso, o JavaScript abaixo nunca
    // chegaria a rodar.
    evento.preventDefault();

    const nomeDigitado = campoNome.value;
    const mensagemDigitada = campoMensagem.value;

    const erros = validarCampos(nomeDigitado, mensagemDigitada);
    mostrarErros(erros);

    // Se o objeto de erros tiver alguma chave, existe pelo menos um campo
    // inválido — nesse caso, para por aqui e não adiciona a mensagem.
    if (Object.keys(erros).length > 0) {
      return;
    }

    // Cria a nova mensagem e coloca no início do array (por isso o spread
    // "...mensagens" depois: mantém as mensagens antigas, só adicionando a
    // nova na frente). new Date().toISOString().slice(0, 10) pega a data de
    // hoje no formato "AAAA-MM-DD".
    const novaMensagem = {
      nome: nomeDigitado.trim(),
      mensagem: mensagemDigitada.trim(),
      data: new Date().toISOString().slice(0, 10),
    };
    mensagens = [novaMensagem, ...mensagens];

    renderizarMensagens();

    // Limpa o formulário e devolve o foco pro campo de nome, pra facilitar
    // se a pessoa quiser deixar outra mensagem em seguida.
    formulario.reset();
    campoNome.focus();
  });
});
