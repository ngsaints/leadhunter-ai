# 🚀 Guia de Deploy no Railway (LeadHunter AI)

Este projeto foi configurado como um **Monolito**, o que simplifica o deploy para uma única URL.

## 1. Preparação no GitHub
Certifique-se de que o código mais recente foi enviado:
```bash
git add .
git commit -m "build: Configuração para deploy unificado no Railway"
git push origin main
```

## 2. No Painel do Railway
1.  **Novo Projeto:** Clique em `+ New Project` e selecione `Deploy from GitHub repo`.
2.  **Repositório:** Escolha `ngsaints/leadhunter-ai`.
3.  **Configurações:** O Railway detectará o `Procfile` e o `package.json` na raiz automaticamente.

## 3. Variáveis de Ambiente (CRÍTICO)
No Railway, vá na aba **Variables** e adicione TODAS as variáveis do seu arquivo `.env`:

*   `PORT` = `3001` (ou deixe o Railway definir automaticamente)
*   `DATABASE_URL` = `sqlite:./server/leadhunter.db`
*   `JWT_SECRET` = `(sua_chave_secreta)`
*   `OPENAI_KEY` = `(sua_chave_openai)`
*   `STRIPE_KEY` = `(sua_chave_stripe)`
*   `STRIPE_WEBHOOK_SECRET` = `(seu_segredo_webhook)`
*   `ZAPI_TOKEN` = `(seu_token_zapi)`
*   `ZAPI_INSTANCE` = `(sua_instancia_zapi)`
*   `APIFY_TOKEN` = `(seu_token_apify - opcional se usar chave por usuário)`
*   `ADMIN_EMAIL` = `(seu_email_admin)`

## 4. Persistência de Dados (Volume)
Como o projeto usa SQLite, você **precisa** adicionar um volume para o arquivo do banco não ser apagado:
1.  Vá em `Settings` -> `Volumes`.
2.  Adicione um Volume montado em `/app/server`.
3.  Isso garantirá que o arquivo `leadhunter.db` permaneça salvo mesmo após reinicializações.

## 5. Acesso
Após o build terminar, o Railway fornecerá um domínio (ex: `leadhunter-production.up.railway.app`). Esse único link abrirá o seu site e funcionará com a API integrada!
