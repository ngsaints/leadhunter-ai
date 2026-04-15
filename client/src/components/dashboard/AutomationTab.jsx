import { useState, useEffect } from 'react'
import { automation as automationApi } from '../../services/api'

export default function AutomationTab() {
  const [settings, setSettings] = useState({
    niche: 'Barbearia',
    city: 'São Paulo',
    style: 'Direto ao ponto',
    send_hours: '8h-18h',
    auto_search: false,
    auto_send: false,
    auto_reply: false,
    whatsapp_instance: '',
    whatsapp_token: '',
    openai_key: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await automationApi.get()
      if (data && Object.keys(data).length > 0) {
        setSettings({
          niche: data.niche || 'Barbearia',
          city: data.city || 'São Paulo',
          style: data.style || 'Direto ao ponto',
          send_hours: data.send_hours || '8h-18h',
          auto_search: !!data.auto_search,
          auto_send: !!data.auto_send,
          auto_reply: !!data.auto_reply,
          whatsapp_instance: data.whatsapp_instance || '',
          whatsapp_token: data.whatsapp_token || '',
          openai_key: data.openai_key || '',
        })
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

  const handleSearchLeads = async () => {
    if (!settings.niche || !settings.city) {
      alert('Configure o nicho e a cidade antes de buscar.')
      return
    }
    
    setSearching(true)
    try {
      await automationApi.search()
      alert('Busca iniciada via Apify! Os leads aparecerão na aba Leads em breve.')
    } catch (err) {
      console.error('Erro ao buscar leads:', err)
      alert('Erro ao iniciar busca: ' + err.message)
    } finally {
      setSearching(false)
    }
  }

  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex justify-between items-center bg-white/5 border border-white/8 rounded-xl py-3.5 px-4 mb-2.5">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <button
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/20'}`}
        onClick={() => onChange(!checked)}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-extrabold">Automação</h1>
        <div className="flex gap-2">
           <button
            onClick={handleSearchLeads}
            disabled={searching}
            className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-lg shadow-amber-900/20"
          >
            {searching ? '🔍 Buscando...' : '🔍 Buscar Leads Agora'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            {saved ? '✓ Salvo!' : saving ? 'Salvando...' : '💾 Salvar'}
          </button>
        </div>
      </div>

      {/* EXPLICAÇÃO */}
      <div className="bg-gradient-to-br from-primary-light to-primary-light/30 border border-primary/20 rounded-xl p-4 sm:p-6 mb-5">
        <h3 className="font-heading text-lg font-extrabold mb-4 flex items-center gap-2">
          🤖 Como funciona a automação
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">1️⃣</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">Busca automática:</strong> O sistema utiliza o <a href="https://www.apify.com?fpr=wnuo25" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold underline">Apify</a> para encontrar empresas no Google Maps.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">2️⃣</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">IA escreve a mensagem:</strong> Cada lead recebe uma mensagem personalizada, baseada no seu estilo.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">3️⃣</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">Envio e resposta:</strong> A IA envia, aguarda a resposta e qualifica o lead automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIGURAÇÕES */}
      <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 mb-5">
        <div className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
          Configurações da IA
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Nicho alvo</label>
            <input
              type="text"
              className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
              value={settings.niche}
              onChange={(e) => setSettings({ ...settings, niche: e.target.value })}
              placeholder="Ex: Barbearia"
            />
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Cidade alvo</label>
            <input
              type="text"
              className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              placeholder="Ex: São Paulo"
            />
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Estilo da mensagem</label>
            <select
              className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
              value={settings.style}
              onChange={(e) => setSettings({ ...settings, style: e.target.value })}
            >
              <option value="Direto ao ponto">Direto ao ponto</option>
              <option value="Consultivo">Consultivo</option>
              <option value="Premium / Exclusivo">Premium / Exclusivo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Horário de envio</label>
            <input
              type="text"
              className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
              value={settings.send_hours}
              onChange={(e) => setSettings({ ...settings, send_hours: e.target.value })}
              placeholder="Ex: 8h-18h"
            />
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6 mb-5">
        <div className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
          Preview da mensagem
        </div>
        <div className="bg-dark-200 rounded-lg overflow-hidden">
          <div className="py-2.5 px-3 bg-primary-light flex items-center gap-2 border-b border-white/8">
            <span className="text-primary">📱</span>
            <span className="text-xs font-medium">Mensagem que será enviada</span>
          </div>
          <div className="py-3 flex flex-col gap-2 min-h-[80px]">
            <div className="max-w-[85%] py-2 px-2.5 rounded-lg text-xs leading-relaxed self-end bg-primary/20 rounded-br-sm">
              Olá, {settings.niche}! Vi que vocês estão em {settings.city} e temos uma oportunidade incrível para aumentar seus clientes 🚀
            </div>
          </div>
        </div>
      </div>

      {/* TOGGLES */}
      <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6">
        <div className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
          Ativar/desativar funcionalidades
        </div>

        <Toggle
          checked={settings.auto_search}
          onChange={(val) => setSettings({ ...settings, auto_search: val })}
          label="Busca automática de leads"
          description="O sistema utiliza Apify para encontrar leads automaticamente"
        />
        <Toggle
          checked={settings.auto_send}
          onChange={(val) => setSettings({ ...settings, auto_send: val })}
          label="Envio automático de mensagens"
          description="IA envia mensagens sem sua intervenção"
        />
        <Toggle
          checked={settings.auto_reply}
          onChange={(val) => setSettings({ ...settings, auto_reply: val })}
          label="Resposta automática"
          description="IA responde leads automaticamente"
        />
      </div>
    </div>
  )
}
