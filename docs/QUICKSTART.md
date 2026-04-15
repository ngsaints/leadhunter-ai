# 🏁 LeadHunter AI - Início Rápido

Siga estes passos para rodar o projeto localmente em ambiente de desenvolvimento.

## 1. Pré-requisitos
- Node.js instalado (v16+)
- NPM ou Yarn

## 2. Configuração do Backend
1. Vá até a pasta `server/`.
2. Instale as dependências: `npm install`.
3. Copie o arquivo `.env.example` para `.env` e preencha as chaves (OpenAI, Stripe, Z-API).
4. Inicie o servidor: `npm run dev`.
   - O banco `leadhunter.db` será criado automaticamente com o modo WAL ativo.

## 3. Configuração do Frontend
1. Vá até a pasta `client/`.
2. Instale as dependências: `npm install`.
3. Certifique-se de que a `VITE_API_URL` no `.env` aponta para `http://localhost:3001`.
4. Inicie a aplicação: `npm run dev`.

## 4. Acessar
- Abra no navegador: `http://localhost:3000`.
- Use a interface para criar uma nova conta ou faça login se já possuir uma.

## 📁 Links Úteis
- [Documentação do Banco de Dados](./DATABASE.md)
- [Guia de Deploy](./DEPLOY.md)
- [Status do Projeto](./STATUS-PROJETO.md)
