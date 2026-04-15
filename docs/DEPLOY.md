# 🚀 Guia Completo de Deploy - LeadHunter AI

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Railway (railway.app)
- Conta no Netlify (netlify.com)
- Todos os serviços configurados (OpenAI, Z-API, Stripe)
  - Veja `CONFIGURACAO-SERVICOS.md` para configuração

---

## 🖥️ 1. Deploy do Backend (Railway)

### Passo 1: Preparar o Repositório

1. **Criar repositório no GitHub:**
   - Acesse github.com e crie um novo repositório
   - Nome sugerido: `leadhunter-ai`
   - Deixe como **privado** (contém dados sensíveis)

2. **Subir o código:**
   ```bash
   cd "C:\Users\ngs-pc\OneDrive\Área de Trabalho\Opencode\Workana\Projeto 03 - Workana William"
   
   # Inicializar git (se ainda não tiver)
   git init
   
   # Criar .gitignore
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   echo "*.db" >> .gitignore
   echo "*.db-shm" >> .gitignore
   echo "*.db-wal" >> .gitignore
   
   # Adicionar apenas o server
   git add server/
   git add README.md
   git add CONFIGURACAO-SERVICOS.md
   
   # Commit inicial
   git commit -m "LeadHunter AI - Backend"
   
   # Adicionar remote e push
   git remote add origin https://github.com/SEU-USERNAME/leadhunter-ai.git
   git branch -M main
   git push -u origin main
   ```

### Passo 2: Deploy no Railway

1. **Acessar Railway:**
   - Vá para [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Criar novo projeto:**
   - Clique em **New Project**
   - Selecione **Deploy from GitHub repo**
   - Escolha `leadhunter-ai`

3. **Configurar variáveis de ambiente:**
   - Clique no serviço → **Variables**
   - Adicione TODAS as variáveis:

   ```env
   PORT=3001
   DATABASE_URL=sqlite:/app/leadhunter.db
   JWT_SECRET=leadhunter_super_secret_key_2025_x9K2mP7nQ4vR8wT3
   OPENAI_KEY=sk-proj-sua-chave-real-aqui
   STRIPE_KEY=sk_test_sua-chave-real-aqui
   STRIPE_WEBHOOK_SECRET=whsec_seu-secret-real-aqui
   ZAPI_TOKEN=seu-token-real-aqui
   ZAPI_INSTANCE=sua-instancia-real-aqui
   NODE_ENV=production
   ```

4. **Aguardar deploy:**
   - Railway vai fazer build automaticamente
   - Quando aparecer **Deployed**, está pronto!

5. **Copiar URL:**
   - Clique em **Settings** → **Domains**
   - Copie a URL gerada (ex: `https://leadhunter-ai.up.railway.app`)
   - **IMPORTANTE:** Você vai precisar desta URL nos próximos passos

### Passo 3: Configurar Webhooks

1. **Z-API Webhook:**
   - Acesse sua instância em zapi.io
   - Vá em **Webhooks**
   - URL: `https://[SUA-URL-RAILWAY]/whatsapp/webhook`
   - Exemplo: `https://leadhunter-ai.up.railway.app/whatsapp/webhook`

2. **Stripe Webhook:**
   - Acesse Stripe Dashboard → **Developers** → **Webhooks**
   - Clique em **Add endpoint**
   - URL: `https://[SUA-URL-RAILWAY]/webhook/stripe`
   - Eventos:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
   - Copie o **Signing Secret** e atualize no Railway

---

## 🎨 2. Deploy do Frontend (Netlify)

### Opção A: Deploy via Netlify CLI (Recomendado)

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Fazer login:**
   ```bash
   netlify login
   ```

3. **Build do projeto:**
   ```bash
   cd client
   
   # Criar .env.production com a URL do Railway
   echo "VITE_API_URL=https://[SUA-URL-RAILWAY]/api" > .env.production
   
   # Fazer build
   npm run build
   ```

4. **Deploy:**
   ```bash
   cd dist
   netlify deploy --prod
   ```

5. **Configurar domínio (opcional):**
   - Acesse app.netlify.com
   - Vá em **Domain settings**
   - Adicione seu domínio próprio ou use o subdomínio netlify.app

### Opção B: Deploy via Drag & Drop (Simples)

1. **Fazer build:**
   ```bash
   cd client
   
   # Criar .env.production
   echo "VITE_API_URL=https://[SUA-URL-RAILWAY]/api" > .env.production
   
   npm run build
   ```

2. **Acessar Netlify:**
   - Vá para [netlify.com](https://netlify.com)
   - Faça login

3. **Arrastar pasta:**
   - Vá em **Sites** → **Add new site** → **Deploy manually**
   - Arraste a pasta `client/dist` para a área indicada
   - Aguarde o deploy

---

## 🔧 3. Configurações Pós-Deploy

### Atualizar URLs de Redirect

No backend (Railway), você precisa atualizar as URLs de redirect do Stripe:

1. **Acessar código no Railway:**
   - Vá em **Source** → abra `server.js`

2. **Atualizar URLs:**
   - Procure por `success_url` e `cancel_url` na rota `/payments/checkout`
   - Troque `${req.headers.origin}` pela URL do Netlify
   - Exemplo:
     ```javascript
     success_url: 'https://leadhunter.netlify.app/dashboard?upgrade=success',
     cancel_url: 'https://leadhunter.netlify.app/dashboard?upgrade=cancelled',
     ```

3. **Commit e push:**
   ```bash
   git add server/server.js
   git commit -m "Atualizar URLs de redirect para produção"
   git push origin main
   ```

### Testar Fluxo Completo

1. **Acessar frontend:**
   - Vá para `https://[SUA-URL-NETLIFY]`

2. **Criar conta de teste:**
   - Clique em "Começar grátis"
   - Preencha nome, email e senha
   - Clique em "Criar conta"

3. **Verificar dashboard:**
   - Faça login e acesse o dashboard
   - Verifique se todas as abas funcionam

4. **Testar criação de lead:**
   - Vá para aba "Leads"
   - Clique em "+ Novo Lead"
   - Preencha e salve

5. **Testar automação:**
   - Vá para aba "Automação"
   - Configure nicho e cidade
   - Salve configurações

6. **Testar pagamento (Stripe em modo teste):**
   - Vá para aba "Planos"
   - Clique em "Assinar Pro"
   - Use cartão de teste do Stripe:
     - Número: `4242 4242 4242 4242`
     - Data: qualquer data futura
     - CVC: `123`

---

## 🔒 4. Segurança e Boas Práticas

### Variáveis de Ambiente

**NUNCA commite:**
- ❌ `.env` com chaves reais
- ❌ Arquivos de banco de dados (`*.db`)
- ❌ Logs com dados sensíveis

**SEMPRE use:**
- ✅ `.env.example` com placeholders
- ✅ Variáveis de ambiente do Railway/Netlify
- ✅ HTTPS em todas as URLs

### JWT Secret

Gere uma chave única e segura:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Atualize no Railway:
- **Variables** → `JWT_SECRET` → cole a chave gerada

### Banco de Dados

**Para produção, migre para Supabase:**

1. Crie projeto em [supabase.com](https://supabase.com)
2. Copie connection string
3. Atualize no Railway:
   ```env
   DATABASE_URL=postgresql://postgres:[SENHA]@db.[projeto].supabase.co:5432/postgres
   ```
4. No `server.js`, ajuste queries:
   - Trocar `?` por `$1, $2, $3...`
   - Instalar: `npm install pg`

---

## 📊 5. Monitoramento

### Railway Logs

- Acesse seu projeto no Railway
- Clique em **Deployments** → **Logs**
- Veja logs em tempo real

### Netlify Logs

- Acesse app.netlify.com
- Vá em **Site overview** → **Logs**
- Veja builds e deploys

### Stripe Dashboard

- Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
- Veja transações, webhooks e erros

---

## 🐛 6. Troubleshooting

### Backend não inicia no Railway

**Problema:** Erro de build ou dependência
**Solução:**
```bash
# Verifique package.json
cat server/package.json

# Teste build local
cd server
npm install
npm start
```

### Frontend não conecta com backend

**Problema:** URL do API incorreta
**Solução:**
```bash
# Verifique .env.production
cat client/.env.production

# Deve ser:
VITE_API_URL=https://[SUA-URL-RAILWAY]/api
```

### Webhook do Stripe não funciona

**Problema:** URL incorreta ou assinatura inválida
**Solução:**
1. Verifique URL no Stripe Dashboard → Webhooks
2. Verifique `STRIPE_WEBHOOK_SECRET` no Railway
3. Teste com Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/webhook/stripe
   ```

### OpenAI retorna erro 401

**Problema:** API key inválida ou sem créditos
**Solução:**
1. Verifique `OPENAI_KEY` no Railway
2. Acesse platform.openai.com → Settings → Billing
3. Adicione créditos se necessário

---

## 📝 7. Checklist Final

### Antes de Ir para Produção

- [ ] OpenAI configurado e com créditos
- [ ] Z-API configurada e WhatsApp conectado
- [ ] Z-API webhook apontando para Railway
- [ ] Stripe configurado (modo live)
- [ ] Stripe webhook configurado
- [ ] JWT_SECRET gerado de forma segura
- [ ] Banco de dados: SQLite (dev) ou Supabase (prod)
- [ ] Frontend `.env.production` com URL correta
- [ ] URLs de redirect do Stripe atualizadas
- [ ] Teste de pagamento com cartão real (modo live)
- [ .gitignore ignorando `.env` e `*.db`
- [ ] README atualizado com instruções

### Após Ir para Produção

- [ ] Criar conta de teste no site
- [ ] Testar fluxo completo (registro → lead → automação)
- [ ] Testar pagamento com cartão real (valor mínimo)
- [ ] Verificar logs no Railway
- [ ] Verificar webhooks no Stripe
- [ ] Configurar domínio próprio (opcional)
- [ ] Configurar SSL (automático no Railway/Netlify)
- [ ] Documentar processo para equipe

---

## 💰 8. Custos Mensais Estimados

| Serviço | Plano | Custo |
|---------|-------|-------|
| Railway | Hobby | ~$5/mês (~R$25) |
| Netlify | Free | Grátis |
| Supabase | Free | Grátis (até 500MB) |
| OpenAI | Pay-as-you-go | ~R$10-50/mês |
| Z-API | Básico | R$50-150/mês |
| Stripe | Pay-per-use | 2,9% + R$0,30/transação |
| **TOTAL** | | **~R$85-225/mês** |

**Break-even:** Com 1 cliente pagando R$97/mês, você cobre os custos!

---

## 🎓 9. Recursos Úteis

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)
- **OpenAI Docs:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Z-API Docs:** [zapi.io/docs](https://zapi.io/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

## 📞 10. Suporte

Para dúvidas:
1. Consulte `CONFIGURACAO-SERVICOS.md` para configuração de serviços
2. Consulte `STATUS-PROJETO.md` para status atual do projeto
3. Consulte `README.md` para documentação geral
4. Verifique logs no Railway e Netlify
5. Teste localmente antes de deploy

---

**Última atualização:** 14 de Abril de 2026
**Versão:** 1.0.0
**Status:** ✅ Guia completo e testado
