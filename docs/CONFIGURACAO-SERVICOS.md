# Guia de Configuração de Variáveis de Ambiente

## 🔧 Como Configurar os Serviços Externos

### 1️⃣ OpenAI (IA para gerar mensagens)
**Tempo estimado:** 15 minutos

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta ou faça login
3. Vá em **API Keys** no menu lateral
4. Clique em **Create new secret key**
5. Copie a chave (começa com `sk-proj-`)
6. Adicione créditos (mínimo $5 para começar)

**No `.env`:**
```env
OPENAI_KEY=sk-proj-sua-chave-aqui
```

**Custo estimado:** ~R$0,01 por mensagem gerada (GPT-4o-mini)

---

### 2️⃣ Z-API (WhatsApp)
**Tempo estimado:** 30 minutos

1. Acesse [zapi.io](https://zapi.io)
2. Crie uma conta (tem plano gratuito para testes)
3. Vá em **Instâncias** e clique em **Nova Instância**
4. Escaneie o QR Code com seu WhatsApp
5. Copie o **ID da instância** e o **Token**

**No `.env`:**
```env
ZAPI_INSTANCE=sua-instancia-aqui
ZAPI_TOKEN=seu-token-aqui
```

**Configurar Webhook na Z-API:**
- URL: `https://[URL-DO-SEU-BACKEND]/whatsapp/webhook`
- Exemplo: `https://leadhunter.up.railway.app/whatsapp/webhook`

**Custo estimado:** R$50-150/mês (depende do plano)

---

### 3️⃣ Stripe (Pagamentos)
**Tempo estimado:** 30 minutos

1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta ou faça login
3. Vá em **Developers → API Keys**
4. Copie a **Secret Key** (começa com `sk_test_` ou `sk_live_`)

**Criar produto:**
1. Vá em **Products** → **Add Product**
2. Nome: "LeadHunter AI Pro"
3. Preço: R$97,00/mês (assinatura recorrente)
4. Copie o **Price ID** (começa com `price_`)

**Criar Webhook:**
1. Vá em **Developers → Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://[URL-DO-SEU-BACKEND]/webhook/stripe`
4. Eventos para ouvir:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copie o **Signing Secret** (começa com `whsec_`)

**No `.env`:**
```env
STRIPE_KEY=sk_test_sua-chave-aqui
STRIPE_WEBHOOK_SECRET=whsec_seu-secret-aqui
```

**Custo estimado:** 2,9% + R$0,30 por transação

---

### 4️⃣ Banco de Dados (Supabase - Opcional para Produção)
**Tempo estimado:** 30 minutos

**Para desenvolvimento:** O SQLite já está configurado e funciona perfeitamente.

**Para produção (migrar para PostgreSQL):**

1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto novo
3. Vá em **Project Settings → Database**
4. Copie a **Connection String** (modo Pooler)
5. Substitua no `.env`:

```env
DATABASE_URL=postgresql://postgres:[SENHA]@db.[projeto].supabase.co:5432/postgres
```

**No `server.js`**, será necessário ajustar as queries:
- Trocar `?` por `$1, $2, $3...`
- Instalar driver PostgreSQL: `npm install pg`

**Custo estimado:** Grátis (até 500MB)

---

## 🔐 JWT_SECRET

Para desenvolvimento, já está configurado. Para produção, gere uma string aleatória longa:

```env
JWT_SECRET=minha-chave-secreta-muito-longa-e-aleatoria-2025
```

**Como gerar:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Checklist de Configuração

- [ ] OpenAI: API key configurada e créditos adicionados
- [ ] Z-API: Instância criada e WhatsApp conectado
- [ ] Z-API: Webhook configurado apontando para URL do backend
- [ ] Stripe: Secret key configurada
- [ ] Stripe: Produto criado (R$97/mês)
- [ ] Stripe: Webhook configurado com eventos corretos
- [ ] JWT_SECRET: String segura configurada
- [ ] Banco de dados: SQLite (dev) ou Supabase (prod) funcionando

---

## 🧪 Testes Locais

Para testar sem configurar todos os serviços:

1. **OpenAI:** Pode deixar a chave em branco - as rotas de IA vão retornar erro, mas o resto funciona
2. **Z-API:** Pode deixar em branco - as rotas de WhatsApp vão falhar, mas o resto funciona
3. **Stripe:** Pode deixar em branco - as rotas de pagamento vão falhar, mas o resto funciona

O sistema funciona normalmente para:
- ✅ Registro e login
- ✅ CRUD de leads
- ✅ Dashboard e estatísticas
- ✅ Configurações de automação
- ❌ Geração de mensagens com IA (precisa OpenAI)
- ❌ Envio de WhatsApp (precisa Z-API)
- ❌ Pagamentos (precisa Stripe)

---

## 🚀 Deploy em Produção

### Backend (Railway)
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Deploy from GitHub (subir pasta `server/`)
4. Adicionar todas as variáveis de ambiente
5. Railway vai gerar uma URL: `https://leadhunter.up.railway.app`

### Frontend (Netlify)
1. Acesse [netlify.com](https://netlify.com)
2. Deploy da pasta `client/`
3. Ou arrastar o build (`npm run build` → pasta `dist/`)
4. Atualizar `VITE_API_URL` para URL do Railway

### Variáveis de ambiente no frontend (`.env.production`):
```env
VITE_API_URL=https://leadhunter.up.railway.app/api
```

---

## 📞 Suporte

Qualquer dúvida:
- Documentação OpenAI: [platform.openai.com/docs](https://platform.openai.com/docs)
- Documentação Stripe: [stripe.com/docs](https://stripe.com/docs)
- Documentação Z-API: [zapi.io/docs](https://zapi.io/docs)
- Documentação Supabase: [supabase.com/docs](https://supabase.com/docs)
