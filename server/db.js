const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Configuração do caminho do banco
const dbPath = path.join(__dirname, process.env.DATABASE_URL?.replace('sqlite:', '') || 'leadhunter.db');
const db = new sqlite3.Database(dbPath);

// ATIVAR MODO WAL (Write-Ahead Logging)
db.run('PRAGMA journal_mode = WAL');

/**
 * Interface simplificada para manter compatibilidade com o código anterior.
 * Nota: sqlite3 é assíncrono nativamente, mas para comandos simples 
 * ele enfileira as operações, o que funciona bem para pedidos de baixo volume.
 */

module.exports = {
  // Executa uma query que não retorna dados (INSERT, UPDATE, DELETE)
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
      });
    });
  },

  // Executa SQL puro
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // Busca um único registro
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Busca vários registros
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Helper para pragma
  pragma: (sql) => {
    return new Promise((resolve, reject) => {
      db.all(`PRAGMA ${sql}`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Exportamos o objeto original
  raw: db
};
