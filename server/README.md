# DevFolio API — Etapa 06

API REST do DevFolio, feita em Node.js + Express. Expõe dois recursos
(Projetos e Mensagens), cada um com as 5 operações: listar, consultar,
criar, alterar e excluir.

Ver `docs/etapa-06.md`, na raiz do projeto, pra documentação completa
dos endpoints com exemplos de requisição/resposta.

## Como rodar

```
cd server
npm install
npm start
```

O servidor sobe em `http://localhost:3000`. `GET /` confirma que está
no ar e lista os recursos disponíveis.

## Como testar

- **Insomnia/Postman:** importar `insomnia-etapa-06.json` (Insomnia →
  Import → From File). Já vem com as 10 requisições organizadas por
  recurso, usando a variável `base_url`.
- **curl:** ver os exemplos prontos em `docs/etapa-06.md`.

## Por que os dados ficam em memória (não em banco de dados)

Essa etapa pede a API REST em si — rotas, métodos HTTP corretos,
validação, status code coerente. Persistência de verdade (SQLite,
já prevista em `docs/proposta.md`) é assunto de uma etapa futura.
Por isso os dados (`dados/projetos.js`, `dados/mensagens.js`) vivem
num array do Node: a API funciona de ponta a ponta, só que reinicia
os dados pro estado inicial sempre que o servidor reinicia.
