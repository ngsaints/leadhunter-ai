const { ApifyClient } = require('apify-client');
const db = require('../db');

/**
 * Inicia a busca de leads no Google Maps usando Apify.
 * Este processo é assíncrono e deve ser monitorado via Webhook.
 */
async function triggerGoogleMapsSearch(userId) {
  const settings = await db.get('SELECT * FROM automation_settings WHERE user_id = ?', [userId]);
  
  const token = settings?.apify_key || process.env.APIFY_TOKEN;
  if (!token) throw new Error('Apify API Token não configurado');

  const client = new ApifyClient({ token });

  const query = `${settings.niche} em ${settings.city}`;
  
  // Usando o Actor 'compass/google-maps-scraper' (um dos mais populares)
  // Nota: O ID do actor pode variar, mas este é o padrão.
  const run = await client.actor('compass/google-maps-scraper').call({
    searchQueries: [query],
    maxRows: 20, // Limite para evitar gastos excessivos
    language: 'pt',
    // Adicionar webhook para quando terminar (opcional, aqui faremos polling em prod)
  });

  return run;
}

module.exports = { triggerGoogleMapsSearch };
