// =============================================
// LEADHUNTER AI — BACKEND
// Node.js + Express + SQLite (preparado para PostgreSQL)
// =============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const Stripe = require('stripe');
const OpenAI = require('openai');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { processImportFile } = require('./utils/importer');
const { triggerGoogleMapsSearch } = require('./utils/scraper');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração Multer (uploads)
const upload = multer({ dest: 'uploads/' });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// =============================================
// SETUP DO BANCO
// =============================================
function setupDB() {
  // Tabela users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      plan VARCHAR(20) DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela leads
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(150),
      phone VARCHAR(30),
      city VARCHAR(100),
      niche VARCHAR(80),
      status VARCHAR(30) DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela messages
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
      direction VARCHAR(10) DEFAULT 'out',
      message TEXT,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const userColumns = db.pragma('table_info(users)');
  const userColumnNames = userColumns.map(c => c.name);

  if (!userColumnNames.includes('is_admin')) {
    db.run('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0');
    console.log('✨ Coluna is_admin adicionada à tabela users');
  }

  // Tabela automation_settings
  db.run(`
    CREATE TABLE IF NOT EXISTS automation_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      niche VARCHAR(80) DEFAULT 'Barbearia',
      city VARCHAR(100) DEFAULT 'São Paulo',
      style VARCHAR(50) DEFAULT 'Direto ao ponto',
      send_hours VARCHAR(50) DEFAULT '8h-18h',
      auto_search BOOLEAN DEFAULT 0,
      auto_send BOOLEAN DEFAULT 0,
      auto_reply BOOLEAN DEFAULT 0,
      whatsapp_instance VARCHAR(100),
      whatsapp_token VARCHAR(255),
      openai_key VARCHAR(255),
      apify_key VARCHAR(255),
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela subscriptions
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      stripe_customer_id VARCHAR(100),
      stripe_subscription_id VARCHAR(100),
      status VARCHAR(30) DEFAULT 'inactive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Banco de dados SQLite configurado');

  // Migração: Adicionar colunas se não existirem
  try {
    const columns = db.pragma('table_info(automation_settings)');
    const columnNames = columns.map(c => c.name);
    
    if (!columnNames.includes('whatsapp_instance')) {
      db.run('ALTER TABLE automation_settings ADD COLUMN whatsapp_instance VARCHAR(100)');
      console.log('✨ Coluna whatsapp_instance adicionada');
    }
    if (!columnNames.includes('whatsapp_token')) {
      db.run('ALTER TABLE automation_settings ADD COLUMN whatsapp_token VARCHAR(255)');
      console.log('✨ Coluna whatsapp_token adicionada');
    }
    if (!columnNames.includes('openai_key')) {
      db.run('ALTER TABLE automation_settings ADD COLUMN openai_key VARCHAR(255)');
      console.log('✨ Coluna openai_key adicionada');
    }
    if (!columnNames.includes('apify_key')) {
      db.run('ALTER TABLE automation_settings ADD COLUMN apify_key VARCHAR(255)');
      console.log('✨ Coluna apify_key adicionada');
    }
  } catch (err) {
    console.error('Erro na migração do banco:', err);
  }
}

// =============================================
// MIDDLEWARES
// =============================================
app.use(cors());
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// =============================================
// MIDDLEWARE: AUTH
// =============================================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador' });
  }
  next();
}

// =============================================
// ROTAS: AUTH
// =============================================
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Dados incompletos' });

  try {
    const hash = await bcrypt.hash(password, 12);
    
    const isAdmin = email === process.env.ADMIN_EMAIL ? 1 : 0;
    
    const result = db.run(
      'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [name, email, hash, isAdmin]
    );
    
    const user = db.get('SELECT id, name, email, plan, is_admin FROM users WHERE id = ?', [result.lastInsertRowid]);

    // Criar settings padrão
    db.run(
      'INSERT OR IGNORE INTO automation_settings (user_id) VALUES (?)',
      [user.id]
    );

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: !!user.is_admin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { ...user, is_admin: !!user.is_admin } });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) 
      return res.status(400).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: !!user.is_admin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, is_admin: !!user.is_admin } 
    });
  } catch {
    res.status(500).json({ error: 'Erro no login' });
  }
});

app.get('/auth/me', authMiddleware, (req, res) => {
  const user = db.get('SELECT id, name, email, plan, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// =============================================
// HELPERS
// =============================================
async function getUserOpenAI(userId) {
  const settings = db.get('SELECT openai_key FROM automation_settings WHERE user_id = ?', [userId]);
  const key = settings?.openai_key || process.env.OPENAI_KEY;
  if (!key) throw new Error('OpenAI não configurada');
  return new OpenAI({ apiKey: key });
}

// =============================================
// ROTAS: LEADS
// =============================================
app.get('/leads', authMiddleware, (req, res) => {
  const { status, city, niche, page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM leads WHERE user_id = ?';
  const params = [req.user.id];
  
  if (status) { query += ` AND status = ?`; params.push(status); }
  if (city)   { query += ` AND city LIKE ?`; params.push(`%${city}%`); }
  if (niche)  { query += ` AND niche LIKE ?`; params.push(`%${niche}%`); }
  
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const leads = db.all(query, params);
  res.json(leads);
});

app.post('/leads', authMiddleware, (req, res) => {
  const { name, phone, city, niche } = req.body;
  const result = db.run(
    'INSERT INTO leads (user_id, name, phone, city, niche) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, name, phone, city, niche]
  );
  const lead = db.get('SELECT * FROM leads WHERE id = ?', [result.lastInsertRowid]);
  res.json(lead);
});

app.patch('/leads/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'sent', 'warm', 'hot', 'closed', 'rejected'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Status inválido' });
  
  const result = db.run(
    'UPDATE leads SET status=? WHERE id=? AND user_id=?',
    [status, req.params.id, req.user.id]
  );
  
  if (result.changes === 0) return res.status(404).json({ error: 'Lead não encontrado' });
  
  const lead = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
  res.json(lead);
});

app.get('/leads/stats', authMiddleware, (req, res) => {
  const stats = db.get(`
    SELECT
      COUNT(*) AS total,
      COUNT(CASE WHEN status='hot' THEN 1 END) AS hot,
      COUNT(CASE WHEN status IN ('sent', 'warm') THEN 1 END) AS sent,
      COUNT(CASE WHEN created_at > datetime('now', '-24 hours') THEN 1 END) AS today
    FROM leads
    WHERE user_id=?
  `, [req.user.id]);
  
  res.json(stats);
});

// =============================================
// ROTAS: MESSAGES
// =============================================
app.get('/messages/:lead_id', authMiddleware, (req, res) => {
  const messages = db.all(`
    SELECT m.* FROM messages m
    JOIN leads l ON m.lead_id = l.id
    WHERE m.lead_id=? AND l.user_id=?
    ORDER BY m.created_at ASC
  `, [req.params.lead_id, req.user.id]);
  
  res.json(messages);
});

app.post('/messages/generate', authMiddleware, async (req, res) => {
  const { leadName, niche, city, style } = req.body;

  const styleMap = {
    'Direto ao ponto': 'direto, objetivo e amigável',
    'Consultivo': 'consultivo, empático e educacional',
    'Premium / Exclusivo': 'sofisticado, exclusivo e de alto valor'
  };

  try {
    const userOpenai = await getUserOpenAI(req.user.id);
    const completion = await userOpenai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Crie uma mensagem de prospecção via WhatsApp para:
          - Negócio: ${leadName}
          - Nicho: ${niche}
          - Cidade: ${city}
          - Estilo: ${styleMap[style] || 'amigável'}

          A mensagem deve:
          - Ter no máximo 3 parágrafos curtos
          - Ser natural e não parecer spam
          - Mencionar o negócio e a cidade
          - Terminar com uma pergunta de abertura
          - Não usar emojis excessivos

          Responda APENAS com a mensagem, sem aspas ou explicações.`
      }],
      max_tokens: 300,
    });

    const message = completion.choices[0].message.content;
    res.json({ message });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar mensagem com IA' });
  }
});

app.post('/messages/reply', authMiddleware, async (req, res) => {
  const { conversation, leadName, niche } = req.body;

  try {
    const userOpenai = await getUserOpenAI(req.user.id);
    const completion = await userOpenai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente de vendas para uma empresa de marketing digital.
            Você está conversando com ${leadName}, um(a) ${niche}.
            Responda de forma natural, amigável e focada em agendar uma reunião ou ligação.
            Seja breve (máximo 2 parágrafos).`
        },
        ...conversation.map(m => ({ role: m.direction === 'out' ? 'assistant' : 'user', content: m.message }))
      ],
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar resposta com IA' });
  }
});

// =============================================
// ROTAS: AUTOMAÇÃO
// =============================================
app.get('/automation', authMiddleware, (req, res) => {
  const settings = db.get(
    'SELECT * FROM automation_settings WHERE user_id=?',
    [req.user.id]
  );
  
  res.json(settings || {});
});

app.put('/automation', authMiddleware, (req, res) => {
  const { 
    niche, city, style, send_hours, auto_search, auto_send, auto_reply,
    whatsapp_instance, whatsapp_token, openai_key, apify_key
  } = req.body;
  
  db.run(`
    INSERT INTO automation_settings (
      user_id, niche, city, style, send_hours, auto_search, auto_send, auto_reply, 
      whatsapp_instance, whatsapp_token, openai_key, apify_key, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      niche=excluded.niche, city=excluded.city, style=excluded.style, 
      send_hours=excluded.send_hours, auto_search=excluded.auto_search, 
      auto_send=excluded.auto_send, auto_reply=excluded.auto_reply, 
      whatsapp_instance=excluded.whatsapp_instance,
      whatsapp_token=excluded.whatsapp_token,
      openai_key=excluded.openai_key,
      apify_key=excluded.apify_key,
      updated_at=CURRENT_TIMESTAMP
  `, [
    req.user.id, niche, city, style, send_hours, 
    auto_search ? 1 : 0, auto_send ? 1 : 0, auto_reply ? 1 : 0,
    whatsapp_instance, whatsapp_token, openai_key, apify_key
  ]);
  
  const settings = db.get('SELECT * FROM automation_settings WHERE user_id = ?', [req.user.id]);
  res.json(settings);
});

app.post('/automation/search', authMiddleware, async (req, res) => {
  try {
    const run = await triggerGoogleMapsSearch(req.user.id);
    res.json({ success: true, runId: run.id, status: run.status });
  } catch (err) {
    console.error('Erro no Scraper Apify:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/leads/import', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  try {
    const count = await processImportFile(req.file.path, req.user.id);
    // Remover arquivo temporário
    fs.unlinkSync(req.file.path);
    res.json({ success: true, count });
  } catch (err) {
    console.error('Erro na importação:', err);
    res.status(500).json({ error: 'Erro ao processar arquivo' });
  }
});

// =============================================
// ROTAS: WHATSAPP (Z-API)
// =============================================
app.post('/whatsapp/send', authMiddleware, async (req, res) => {
  const { phone, message } = req.body;

  // Verifica plano
  const user = db.get('SELECT plan FROM users WHERE id = ?', [req.user.id]);
  if (user.plan === 'free') {
    const count = db.get(`
      SELECT COUNT(*) as count FROM messages m
      JOIN leads l ON m.lead_id=l.id
      WHERE l.user_id=? AND m.created_at > datetime('now', 'start of month')
    `, [req.user.id]);
    
    if (count.count >= 20)
      return res.status(403).json({ error: 'Limite do plano Free atingido. Faça upgrade para Pro.' });
  }

  try {
    // Busca configurações do usuário (instância/token)
    const settings = db.get('SELECT whatsapp_instance, whatsapp_token FROM automation_settings WHERE user_id = ?', [req.user.id]);
    const instance = settings?.whatsapp_instance || process.env.ZAPI_INSTANCE;
    const token = settings?.whatsapp_token || process.env.ZAPI_TOKEN;

    if (!instance || !token) {
      return res.status(400).json({ error: 'WhatsApp não configurado. Vá em Configurações.' });
    }

    // Integração Z-API
    const zapiRes = await fetch(
      `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), message })
      }
    );
    const data = await zapiRes.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem WhatsApp' });
  }
});

// Webhook Z-API (recebe mensagens)
app.post('/whatsapp/webhook', (req, res) => {
  const { phone, text, fromMe } = req.body;
  if (fromMe) return res.json({ ok: true });

  console.log(`📩 Nova mensagem de ${phone}: ${text}`);

  // Aqui você pode: encontrar o lead, salvar a mensagem, acionar a IA para responder
  // Implementação completa dependeria do seu fluxo de negócio

  res.json({ ok: true });
});

// =============================================
// ROTAS: PAGAMENTOS (STRIPE)
// =============================================
app.post('/payments/checkout', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'LeadHunter AI Pro', description: 'Leads ilimitados + IA 24h/7' },
          unit_amount: 9700, // R$97,00 em centavos
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?upgrade=success`,
      cancel_url: `${req.headers.origin}/dashboard?upgrade=cancelled`,
      metadata: { user_id: req.user.id }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
  }
});

app.post('/payments/portal', authMiddleware, async (req, res) => {
  const sub = db.get('SELECT stripe_customer_id FROM subscriptions WHERE user_id=?', [req.user.id]);
  if (!sub) return res.status(404).json({ error: 'Assinatura não encontrada' });

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${req.headers.origin}/dashboard`
  });
  res.json({ url: session.url });
});

// Webhook Stripe
app.post('/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook signature inválida');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.user_id;

    db.run('UPDATE users SET plan=? WHERE id=?', ['pro', userId]);
    db.run(`
      INSERT OR IGNORE INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status)
      VALUES (?, ?, ?, 'active')
    `, [userId, session.customer, session.subscription]);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    db.run('UPDATE subscriptions SET status=? WHERE stripe_subscription_id=?', ['cancelled', sub.id]);
    
    const result = db.get('SELECT user_id FROM subscriptions WHERE stripe_subscription_id=?', [sub.id]);
    if (result) {
      db.run('UPDATE users SET plan=? WHERE id=?', ['free', result.user_id]);
    }
  }

  res.json({ received: true });
});

// =============================================
// ROTAS: ADMIN
// =============================================
app.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  const totalUsers = db.get('SELECT COUNT(*) as count FROM users')?.count || 0;
  const activeSubs = db.get('SELECT COUNT(*) as count FROM subscriptions WHERE status="active"')?.[0]?.count || 0;
  const totalLeads = db.get('SELECT COUNT(*) as count FROM leads')?.count || 0;
  const revenueEntries = db.all('SELECT plan FROM users WHERE plan != "free"');
  const fakeRevenue = revenueEntries.length * 97; // Simulação de faturamento bruto

  res.json({
    totalUsers,
    activeSubs,
    totalLeads,
    totalRevenue: fakeRevenue
  });
});

app.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  const users = db.all(`
    SELECT users.id, users.name, users.email, users.plan, users.is_admin, users.created_at,
    (SELECT COUNT(*) FROM leads WHERE user_id = users.id) as leads_count
    FROM users
    ORDER BY created_at DESC
  `);
  res.json(users);
});

app.patch('/admin/users/:id/plan', authMiddleware, adminMiddleware, async (req, res) => {
  const { plan } = req.body;
  const { id } = req.params;
  
  if (!['free', 'pro', 'enterprise'].includes(plan)) {
    return res.status(400).json({ error: 'Plano inválido' });
  }

  db.run('UPDATE users SET plan = ? WHERE id = ?', [plan, id]);
  res.json({ success: true });
});

app.delete('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Você não pode deletar a si mesmo' });
  }
  db.run('DELETE FROM users WHERE id = ?', [id]);
  res.json({ success: true });
});

// =============================================
// INICIALIZAÇÃO
// =============================================
const stripe = Stripe(process.env.STRIPE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

setupDB();

app.listen(PORT, () => console.log(`🚀 LeadHunter AI rodando na porta ${PORT}`));

module.exports = app;
