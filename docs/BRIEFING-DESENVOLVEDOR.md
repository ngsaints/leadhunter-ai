# 📋 BRIEFING PARA DESENVOLVEDOR — LeadHunter AI

## Quem sou eu e o que preciso

Tenho um SaaS chamado **LeadHunter AI** — uma plataforma de geração automática de leads e prospecção via WhatsApp para negócios locais (barbearias, dentistas, academias etc.).

**O front-end está 100% pronto.** Preciso de um desenvolvedor para conectar os serviços externos (banco de dados, OpenAI, WhatsApp e pagamentos) e fazer o deploy. Não é necessário criar nada do zero — apenas integrar e publicar.

---

## O que já está pronto (você NÃO precisa fazer)

✅ Landing page completa com todas as seções  
✅ Dashboard com 6 abas funcionais (Overview, Leads, Automação, Planos, Configurações)  
✅ Sistema de login e cadastro com validação  
✅ Feed de atividade em tempo real  
✅ Tabela de leads com filtro, busca e alteração de status  
✅ Modal para adicionar leads manualmente  
✅ Configurações de automação com pré-visualização de mensagem  
✅ Toggles de modo automático  
✅ Sistema de toasts (notificações visuais)  
✅ Página de planos Free vs Pro  
✅ Todos os botões com feedback visual  
✅ Design responsivo (mobile + desktop)  
✅ Backend Node.js com todas as rotas da API escritas  
✅ Lógica de negócio completa (limite de plano, autenticação JWT, geração de mensagens com IA)  

**Arquivos entregues:**
- `leadhunter-ai-v2.html` — Frontend completo (landing page + dashboard)
- `leadhunter-backend.js` — Backend Node.js + Express com toda a API

---

## O que você precisa fazer

### 1. Banco de dados — Supabase (≈ 30 min)
- Criar conta em supabase.com
- Criar projeto novo
- O backend já tem o código para criar as tabelas automaticamente na primeira execução
- Copiar a **Connection String** do Supabase e colocar no `.env` como `DATABASE_URL`

Tabelas que serão criadas automaticamente:
- `users` — usuários e planos
- `leads` — leads gerados
- `messages` — histórico de mensagens
- `automation_settings` — configurações de automação por usuário
- `subscriptions` — assinaturas Stripe

---

### 2. OpenAI — IA que gera as mensagens (≈ 15 min)
- Criar conta em platform.openai.com
- Gerar uma API Key (começa com `sk-`)
- Adicionar créditos (mínimo $5 para começar)
- Colocar no `.env` como `OPENAI_KEY`

O backend já usa `gpt-4o-mini` (mais barato, ~R$0,01 por mensagem).

Funcionalidades que usam a IA:
- `POST /messages/generate` — cria mensagem personalizada para cada lead
- `POST /messages/reply` — IA responde automaticamente quando lead responde

---

### 3. WhatsApp — Z-API (≈ 30 min)
- Criar conta em zapi.io (tem plano gratuito para testes)
- Criar uma **Nova Instância**
- Escanear QR Code com o número de WhatsApp que vai enviar as mensagens
- Copiar o **ID da instância** → `ZAPI_INSTANCE` no `.env`
- Copiar o **Token** → `ZAPI_TOKEN` no `.env`
- Configurar o webhook de recebimento:
  - URL: `https://[URL-DO-BACKEND]/whatsapp/webhook`

O backend já tem:
- `POST /whatsapp/send` — envia mensagem via Z-API
- `POST /whatsapp/webhook` — recebe respostas dos leads

---

### 4. Stripe — Pagamentos (≈ 30 min)
- Criar conta em stripe.com
- Ir em **Developers → API Keys** → copiar Secret Key → `STRIPE_KEY`
- Criar produto: "LeadHunter AI Pro" — R$97/mês (assinatura recorrente)
- Configurar webhook:
  - URL: `https://[URL-DO-BACKEND]/webhook/stripe`
  - Eventos: `checkout.session.completed` e `customer.subscription.deleted`
  - Copiar **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

O backend já tem:
- `POST /payments/checkout` — cria sessão de pagamento
- `POST /payments/portal` — portal de gestão de assinatura
- Webhook que atualiza automaticamente o plano do usuário para "pro" após pagamento

---

### 5. Deploy do backend — Railway (≈ 30 min)
- Criar conta em railway.app
- Criar novo projeto → Deploy from GitHub (subir o `server.js` + `package.json`)
- Adicionar todas as variáveis de ambiente (DATABASE_URL, JWT_SECRET, OPENAI_KEY, STRIPE_KEY, STRIPE_WEBHOOK_SECRET, ZAPI_INSTANCE, ZAPI_TOKEN)
- Railway vai gerar uma URL pública automaticamente (ex: `leadhunter.up.railway.app`)
- Usar essa URL nos webhooks do Stripe e da Z-API

---

### 6. Deploy do frontend — Netlify (≈ 10 min)
- Criar conta em netlify.com
- Arrastar o arquivo `leadhunter-ai-v2.html` para o Netlify
- Netlify gera uma URL pública (pode conectar domínio próprio depois)
- **Atualizar a variável `API_URL`** no início do arquivo HTML para apontar para a URL do Railway

```javascript
// Linha a atualizar no HTML (topo do script):
const API_URL = 'https://leadhunter.up.railway.app';
```

---

### 7. Ajuste final no frontend (≈ 1 hora)
- Conectar os botões de Login/Cadastro à API real (`POST /auth/login` e `POST /auth/register`)
- Conectar o botão "Assinar Pro" ao endpoint do Stripe (`POST /payments/checkout`)
- Conectar "Salvar configurações" de automação à API (`PUT /automation`)
- Conectar "Salvar WhatsApp/OpenAI" nas configs à API real
- Remover a aba **"🚀 Guia Setup"** do dashboard (é apenas para orientação interna, o cliente final não deve ver)
- Remover o banner de demo `"Demo: demo@leadhunter.ai / demo123"` da tela de login

---

## Arquivo .env completo a configurar

```env
PORT=3001
DATABASE_URL=postgresql://postgres:[SENHA]@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=[string aleatória longa, ex: meuSaasLeadHunter2025SuperSeguro]
OPENAI_KEY=sk-proj-...
STRIPE_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ZAPI_INSTANCE=[id da instância Z-API]
ZAPI_TOKEN=[token Z-API]
```

---

## package.json (dependências do backend)

```json
{
  "name": "leadhunter-ai-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "openai": "^4.20.0",
    "pg": "^8.11.3",
    "stripe": "^14.5.0"
  }
}
```

---

## Todas as rotas da API (já implementadas no backend)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Criar conta |
| POST | /auth/login | Login → retorna JWT |
| GET | /auth/me | Dados do usuário autenticado |
| GET | /leads | Listar leads do usuário |
| POST | /leads | Criar lead manualmente |
| PATCH | /leads/:id/status | Atualizar status do lead |
| GET | /leads/stats | KPIs do dashboard |
| GET | /messages/:lead_id | Histórico de mensagens |
| POST | /messages/generate | Gerar mensagem com IA |
| POST | /messages/reply | Gerar resposta automática com IA |
| GET | /automation | Buscar configurações do usuário |
| PUT | /automation | Salvar configurações |
| POST | /whatsapp/send | Enviar mensagem WhatsApp |
| POST | /whatsapp/webhook | Receber resposta do WhatsApp |
| POST | /payments/checkout | Criar sessão Stripe |
| POST | /payments/portal | Portal de assinatura |
| POST | /webhook/stripe | Webhook de eventos Stripe |

---

## O que o sistema faz (contexto do negócio)

O LeadHunter AI é uma ferramenta vendida como SaaS para empreendedores que querem prospectar clientes automaticamente via WhatsApp:

1. O usuário configura nicho (ex: Barbearia) e cidade (ex: Joinville)
2. O sistema encontra empresas locais e cria uma lista de leads
3. A IA (OpenAI) escreve uma mensagem personalizada para cada lead
4. A Z-API envia as mensagens pelo WhatsApp do usuário
5. Quando o lead responde, a IA qualifica e responde automaticamente
6. O usuário só é notificado quando há um lead "quente" pronto para fechar
7. O plano Free tem limite de 20 leads/mês; o Pro (R$97/mês) é ilimitado

---

## Estimativa de tempo total

| Tarefa | Tempo estimado |
|--------|---------------|
| Setup Supabase + banco | 30 min |
| Setup OpenAI | 15 min |
| Setup Z-API + WhatsApp | 30 min |
| Setup Stripe + produto | 30 min |
| Deploy backend (Railway) | 30 min |
| Deploy frontend (Netlify) | 15 min |
| Conectar API no frontend | 1–2 horas |
| Remover aba Guia Setup + ajustes finais | 30 min |
| **TOTAL** | **~4–5 horas** |

---

## Recursos e custos mensais (pós-configuração)

| Serviço | Custo |
|---------|-------|
| Supabase | Grátis (até 500MB) |
| Railway (backend) | ~$5/mês |
| OpenAI (estimativa 1.000 mensagens) | ~R$10/mês |
| Z-API | R$50–150/mês (depende do plano) |
| Stripe | 2,9% + R$0,30 por transação |
| Netlify (frontend) | Grátis |
| **Total fixo** | **~R$60–200/mês** |

Com apenas 1 cliente pagando R$97/mês, o custo já é coberto.

---

## Onde encontrar freelancers para essa tarefa

**Plataformas nacionais:**
- **99Freelas** (99freelas.com.br) — freelancers brasileiros, filtre por "Node.js" ou "integração de APIs"
- **Workana** (workana.com) — bom para projetos pequenos, tem muitos devs brasileiros

**Plataformas internacionais:**
- **Upwork** (upwork.com) — maior plataforma do mundo, filtrar por "Node.js API integration"
- **Fiverr** (fiverr.com) — mais barato, bom para tarefas pontuais

**O que escrever no anúncio:**
> Preciso de desenvolvedor Node.js para configurar serviços externos em um SaaS já desenvolvido (frontend e backend prontos). Tarefas: configurar Supabase (PostgreSQL), OpenAI API, Z-API (WhatsApp), Stripe e fazer deploy no Railway + Netlify. Estimativa: 4-5 horas. Envio todos os arquivos e credenciais.

**Quanto pagar:** R$150–400 (tarefa simples para dev experiente)

---

## Contato / Dúvidas

Todos os arquivos do projeto serão enviados junto com este briefing:
- `leadhunter-ai-v2.html` — Frontend completo
- `leadhunter-backend.js` — Backend completo
- Este documento de briefing

Qualquer dúvida pode perguntar — o código está bem comentado e organizado.
