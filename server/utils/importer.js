const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const db = require('../db');

/**
 * Processa um arquivo CSV ou Excel e insere os leads no banco de dados.
 */
async function processImportFile(filePath, userId) {
  const ext = filePath.split('.').pop().toLowerCase();
  const leads = [];

  if (ext === 'csv') {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Normalização de campos comuns
          leads.push({
            name: row.name || row.Nome || row.nome,
            phone: row.phone || row.Telefone || row.telefone || row.whatsapp,
            city: row.city || row.Cidade || row.cidade,
            niche: row.niche || row.Nicho || row.nicho
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });
  } else if (ext === 'xlsx' || ext === 'xls') {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    data.forEach(row => {
      leads.push({
        name: row.name || row.Nome || row.nome,
        phone: row.phone || row.Telefone || row.telefone || row.whatsapp,
        city: row.city || row.Cidade || row.cidade,
        niche: row.niche || row.Nicho || row.nicho
      });
    });
  }

  // Inserção assíncrona
  let count = 0;
  for (const lead of leads) {
    if (lead.phone) {
      try {
        await db.run(
          'INSERT INTO leads (user_id, name, phone, city, niche) VALUES (?, ?, ?, ?, ?)',
          [userId, lead.name || 'Sem nome', lead.phone, lead.city || '', lead.niche || '']
        );
        count++;
      } catch (err) {
        console.error('Erro ao inserir lead:', err);
      }
    }
  }

  return count;
}

module.exports = { processImportFile };
