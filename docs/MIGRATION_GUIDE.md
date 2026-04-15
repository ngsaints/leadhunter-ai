# Guia de Migração: SQLite para PostgreSQL

Este guia orienta como transicionar o LeadHunter AI de SQLite para PostgreSQL quando o sistema atingir um volume de tráfego que exija um banco de dados relacional distribuído.

## Passos para a Migração Técnica

### 1. Instalação do Driver
Instale o driver do PostgreSQL para Node.js:
```bash
npm install pg
```

### 2. Atualização do `server/db.js`
Substitua o conteúdo do arquivo `server/db.js` por uma implementação que utilize `pg`. Exemplo de estrutura:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para Railway/Supabase
});

module.exports = {
  run: async (sql, params = []) => {
    // Nota: Em PG os parâmetros usam $1, $2 ao invés de ?
    // Você pode precisar de uma função auxiliar para converter ou usar Knex.js
    const res = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
    return { lastInsertRowid: res.rows[0]?.id, changes: res.rowCount };
  },
  get: async (sql, params = []) => {
    const res = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
    return res.rows[0];
  },
  all: async (sql, params = []) => {
    const res = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
    return res.rows;
  },
  pragma: () => [], // Ignora comandos SQLite no PostgreSQL
  exec: (sql) => pool.query(sql)
};
```

### 3. Ajustes de Tipagem
Embora a maioria das queries seja compatível, alguns tipos de dados precisam de atenção:

| Recurso | SQLite | PostgreSQL |
|---------|--------|------------|
| ID Autoincrement | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| Booleanos | `INTEGER (0 ou 1)` | `BOOLEAN (true ou false)` |
| Timestamps | `DATETIME` | `TIMESTAMP` |

### 4. Transferência de Dados
Para migrar os dados existentes do `leadhunter.db` para o PostgreSQL, utilize ferramentas como:
- [pgloader](https://pgloader.io/): Ferramenta robusta para migração de arquivos SQL/DB.
- Exportar SQLite para JSON e importar via script Node.js.

## Propor de Recomendação: Knex.js
Se você planeja migrar em breve, recomendo refatorar o `db.js` para usar o **Knex.js**. Ele abstrai as diferenças sintáticas entre SQLite e PostgreSQL (como o uso de `?` vs `$1`), tornando a troca de banco apenas uma mudança de configuração.
