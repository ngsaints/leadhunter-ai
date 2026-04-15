import { useState, useEffect } from 'react'
import { automation as automationApi, leads as leadsApi } from '../../services/api'

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    whatsapp_instance: '',
    whatsapp_token: '',
    openai_key: '',
    apify_key: '',
    // Mantemos os outros campos para não sobrescrevê-los
    niche: '',
    city: '',
    style: '',
    send_hours: '',
    auto_search: false,
    auto_send: false,
    auto_reply: false
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await automationApi.get()
      if (data && Object.keys(data).length > 0) {
        setSettings(data)
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await automationApi.save(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleImportLeads = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await leadsApi.import(formData);
      alert(`Sucesso! ${res.count} leads importados.`);
    } catch (err) {
      console.error('Erro ao importar leads:', err)
      alert('Erro ao importar arquivo: ' + err.message);
    } finally {
      setImporting(false)
      // Resetar input
      e.target.value = null;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-extrabold">Configurações</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
        >
          {saved ? '✓ Salvo!' : saving ? 'Salvando...' : '💾 Salvar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* WHATSAPP */}
          <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              WhatsApp (Z-API)
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Instance ID</label>
                <input
                  type="text"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary transition-all"
                  value={settings.whatsapp_instance}
                  onChange={(e) => setSettings({ ...settings, whatsapp_instance: e.target.value })}
                  placeholder="ID da instância Z-API"
                />
              </div>

              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Token</label>
                <input
                  type="password"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary transition-all"
                  value={settings.whatsapp_token}
                  onChange={(e) => setSettings({ ...settings, whatsapp_token: e.target.value })}
                  placeholder="Token Z-API"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted mt-4">
              Configure sua instância em <a href="https://zapi.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">zapi.io</a>
            </p>
          </div>

          {/* OPENAI */}
          <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              OpenAI (IA)
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">API Key</label>
              <input
                type="password"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary transition-all"
                value={settings.openai_key}
                onChange={(e) => setSettings({ ...settings, openai_key: e.target.value })}
                placeholder="sk-..."
              />
            </div>
            <p className="text-[10px] text-muted mt-4">
              Obtenha sua chave em <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">platform.openai.com</a>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* APIFY (GOOGLE MAPS SCRAPER) */}
          <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm border-l-4 border-l-amber-500">
            <div className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-4">
              Apify (Google Maps Scraper)
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Apify API Token</label>
              <input
                type="password"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-all"
                value={settings.apify_key}
                onChange={(e) => setSettings({ ...settings, apify_key: e.target.value })}
                placeholder="apify_api_..."
              />
            </div>
            <p className="text-[10px] text-muted mt-4">
              Obrigatório para a busca automática de leads. Obtenha em <a href="https://www.apify.com?fpr=wnuo25" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">apify.com</a>
            </p>
          </div>

          {/* IMPORTAÇÃO DE LEADS */}
          <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Importação de Leads (CSV / Excel)
            </div>

            <div className="relative group">
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleImportLeads}
                disabled={importing}
              />
              <label 
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                  {importing ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : '↑'}
                </div>
                <div className="text-sm font-medium">{importing ? 'Processando arquivo...' : 'Clique para subir ou arraste'}</div>
                <div className="text-[10px] text-muted mt-1">.csv, .xlsx ou .xls</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* WEBHOOKS */}
      <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 mt-6 shadow-xl backdrop-blur-sm">
        <div className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
          URLs Públicas (Webhooks)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wide mb-1.5">WhatsApp Webhook</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs font-mono outline-none"
                value={`${window.location.origin}/whatsapp/webhook`}
                readOnly
              />
              <button 
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/whatsapp/webhook`)}
                className="bg-dark-200 border border-white/10 hover:border-primary p-2 rounded-lg transition-colors"
              >
                📋
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wide mb-1.5">Stripe Webhook</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs font-mono outline-none"
                value={`${window.location.origin}/webhook/stripe`}
                readOnly
              />
              <button 
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/webhook/stripe`)}
                className="bg-dark-200 border border-white/10 hover:border-primary p-2 rounded-lg transition-colors"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
