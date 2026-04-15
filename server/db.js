const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Configuração do caminho do banco
const dbPath = path.join(__dirname, process.env.DATABASE_URL?.replace('sqlite:', '') || 'leadhunter.db');
const db = new Database(dbPath);

// ATIVAR MODO WAL (Write-Ahead Logging) para alta performance
db.pragma('journal_mode = WAL');

/**
 * Esse arquivo centraliza as operações de banco de dados para facilitar
 * uma futura migração para PostgreSQL.
 * 
 * Para migrar:
 * 1. Instale o driver: npm install pg
 * 2. Substitua este arquivo por uma implementação usando 'pg'
 * 3. As queries foram escritas de forma a serem 99% compatíveis.
 */

module.exports = {
  // Executa uma query que não retorna dados (INSERT, UPDATE, DELETE)
  run: (sql, params = []) => {
    return db.prepare(sql).run(...params);
  },

  // Executa SQL puro
  exec: (sql) => {
    return db.exec(sql);
  },

  // Busca um único registro
  get: (sql, params = []) => {
    return db.prepare(sql).get(...params);
  },

  // Busca vários registros
  all: (sql, params = []) => {
    return db.prepare(sql).all(...params);
  },

  // Helper para pragma (específico SQLite)
  pragma: (sql) => {
    return db.pragma ? db.pragma(sql) : [];
  },

  // Helper para transações (opcional mas recomendado)
  transaction: (fn) => {
    return db.transaction(fn);
  },
  
  // Exportamos o objeto original apenas se necessário, 
  // mas o ideal é usar os helpers acima.
  raw: db
};
