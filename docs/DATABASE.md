# Documentação do Banco de Dados — LeadHunter AI

O sistema utiliza **SQLite** via o driver `sqlite3` (em modo assíncrono) para garantir compatibilidade máxima em ambientes como o Railway.

## Estrutura de Abstração

Para facilitar a manutenção e futuras migrações, a lógica de banco de dados foi abstraída no arquivo `server/db.js`. 

### Helpers Disponíveis (Asíncronos):

- `await db.run(sql, params)`: Executa comandos de escrita (INSERT, UPDATE, DELETE). Retorna estatísticas da operação.
- `await db.get(sql, params)`: Busca um único registro.
- `await db.all(sql, params)`: Busca vários registros.
- `db.exec(sql)`: Executa comandos SQL puros (scripts de criação, etc).

## Performance (WAL Mode)

O banco está configurado para operar no modo **WAL (Write-Ahead Logging)**. Isso permite:

1.  **Leituras e Escritas Simultâneas**: Leitores não bloqueiam escritores e vice-versa.
2.  **Velocidade**: Operações de escrita são significativamente mais rápidas.
3.  **Persistência**: Menor risco de corrupção de dados em quedas de energia.

A ativação é feita automaticamente na inicialização via:
```javascript
db.pragma('journal_mode = WAL');
```

## Tabelas Atuais

- `users`: Armazena dados de autenticação e plano.
- `leads`: Gerencia os contatos prospectados.
- `messages`: Histórico de conversas via WhatsApp.
- `automation_settings`: Configurações de nicho, cidade e chaves de API (OpenAI/Z-API).
- `subscriptions`: Gerenciamento de pagamentos Stripe.

---

Para saber como migrar para PostgreSQL, veja o [Guia de Migração](./MIGRATION_GUIDE.md).
