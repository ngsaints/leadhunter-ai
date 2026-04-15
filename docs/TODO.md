# 📝 TODO List & Guia de Desenvolvimento

**LEIA ESTE ARQUIVO PRIMEIRO** ao assumir o desenvolvimento deste projeto.

Este documento serve como a "bússola" para desenvolvedores humanos ou IAs que irão editar ou expandir o LeadHunter AI.

---

## 🎯 Status Atual: SaaS Escalonável (v1.2.0)

O sistema está com o fluxo principal de SaaS funcional: Registro -> Landing -> Dashboard -> Configuração de chaves -> Prospecção -> IA -> Mensagens.

### ✅ O que já foi implementado:
- [x] **Autenticação:** Baseada em JWT com persistência no frontend.
- [x] **Banco de Dados:** SQLite com modo WAL ativo e camada de abstração modular (`db.js`).
- [x] **SaaS Multi-Tenant:** Cada usuário pode usar suas próprias chaves Z-API e OpenAI.
- [x] **Landing Page:** Design premium e responsivo.
- [x] **Busca de Leads:** Integrado com **Apify** (Google Maps Scraper) configurável por usuário.
- [x] **Importação de Leads:** Suporte para arquivos **CSV e Excel** (.xlsx, .xls) direto no dashboard.
- [x] **Notificações:** Sistema global de Toast para feedback de ações.

---

## 🚀 Próximos Passos (Backlog)

### 1. Funcionalidades de Automação (Alta Prioridade)
- [ ] **Fila de Envio:** Implementar uma fila (BullMQ ou simples no banco) para que as mensagens não sejam bloqueadas pelo Z-API se enviadas em massa.
- [ ] **Fluxo de Resposta Inteligente:** Melhorar o webhook da Z-API para salvar mensagens recebidas e acionar a IA para responder automaticamente em nome do usuário.
- [ ] **Análise de Sentimento:** Marcar leads como "Quentes" automaticamente se a IA detectar interesse na resposta.

### 3. Melhorias Técnicas
- [ ] **Criptografia no Banco:** Criptografar as chaves de API (`whatsapp_token`, `openai_key`) antes de salvar no banco.
- [ ] **Logs Estruturados:** Implementar `winston` ou `pino` para logs de erros em produção.
- [ ] **Testes Automatizados:** Adicionar testes de integração para as rotas críticas de pagamento e mensagens.

---

## 🛠️ Guia de Edição para Desenvolvedores/IAs

### Regras de Ouro:
1.  **Mantenha a Abstração:** Todas as queries SQL **devem** ser feitas através do módulo `server/db.js` (ex: `db.run`, `db.get`). Nunca utilize o driver direto no `server.js`.
2.  **Mantenha o Design:** Use as classes utilitárias definidas no `index.css` e Tailwind. O design deve ser premium (gradientes, glassmorphism, sombras).
3.  **Fallback Primeiro:** Sempre verifique se o usuário tem chaves próprias de API. Se não, use `process.env`.
4.  **Consistência de Estado:** Ao atualizar configurações na aba Config, certifique-se de que a aba Automação reflita os novos dados (sincronização via API).

### Onde estão os arquivos chave?
- **Backend Core:** `server/server.js`
- **Consultas SQL:** `server/db.js`
- **Dashboard UI:** `client/src/components/dashboard/`
- **Auth & State:** `client/src/App.jsx` e `client/src/pages/Auth.jsx`

---

## 📈 Roadmap de Deploy
1.  **Variáveis:** Preencher `.env` no server e client.
2.  **Railway:** Host do backend (porta 3001).
3.  **Netlify:** Host do frontend (apontando `VITE_API_URL` para o Railway).
4.  **Stripe:** Configurar Webhook para apontar para `URL_DO_RAILWAY/webhook`.

---

*Última atualização: 14/04/2026*
*Responsável: Antigravity AI*
