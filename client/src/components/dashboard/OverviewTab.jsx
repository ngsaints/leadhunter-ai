import { useState } from 'react'

export default function OverviewTab({ stats }) {
  const [automationOn, setAutomationOn] = useState(false)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="font-heading text-2xl font-extrabold">Overview</h1>
        <div className="flex items-center gap-2 bg-primary-light border border-primary/20 py-1.5 px-3 rounded-full text-xs text-primary">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-slow" />
          Modo automático
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KPI label="Total de Leads" value={stats.total || 0} delta="+12% esta semana" />
        <KPI label="Leads Quentes 🔥" value={stats.hot || 0} delta="Prontos para fechar" />
        <KPI label="Em Conversa" value={stats.sent || 0} delta="Aguardando resposta" />
        <KPI label="Hoje" value={stats.today || 0} delta="Novos leads" />
      </div>

      {/* ACTIVATE BUTTON */}
      <button
        className={`w-full py-4 rounded-xl text-lg font-extrabold transition-all flex items-center justify-center gap-2 font-heading mb-6 ${automationOn ? 'bg-primary text-dark hover:bg-primary-dark' : 'bg-primary-light text-primary border-2 border-primary/40 hover:bg-primary-light/80'}`}
        onClick={() => setAutomationOn(!automationOn)}
      >
        {automationOn ? '✅ Automação ATIVADA' : '🚀 ATIVAR Automação'}
      </button>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* FEED */}
        <div className="lg:col-span-2 bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6">
          <div className="text-xs font-medium text-muted uppercase tracking-wide mb-4 flex justify-between items-center">
            Feed de atividade
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-slow" />
          </div>
          <div className="space-y-3">
            <FeedItem icon="green" iconChar="✓" text="<strong>Barbearia Silva</strong> respondeu — lead quente!" time="2min" />
            <FeedItem icon="blue" iconChar="→" text="Mensagem enviada para <strong>Academia Fit</strong>" time="15min" />
            <FeedItem icon="amber" iconChar="★" text="15 novos leads encontrados em <strong>Joinville</strong>" time="1h" />
            <FeedItem icon="green" iconChar="✓" text="<strong>Dra. Ana Dentista</strong> agendou reunião" time="2h" />
            <FeedItem icon="blue" iconChar="→" text="Follow-up enviado para <strong>Pizzaria Napoli</strong>" time="3h" />
          </div>
        </div>

        {/* WHATSAPP PREVIEW */}
        <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-6">
          <div className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
            Preview WhatsApp
          </div>
          <div className="bg-dark-200 rounded-lg overflow-hidden">
            <div className="py-2.5 px-3 bg-primary-light flex items-center gap-2 border-b border-white/8">
              <span className="text-primary">📱</span>
              <span className="text-xs font-medium">Última conversa</span>
            </div>
            <div className="py-3 flex flex-col gap-2 min-h-[180px]">
              <div className="max-w-[85%] py-2 px-2.5 rounded-lg text-xs leading-relaxed self-end bg-primary/20 rounded-br-sm">
                Olá! Vi que você tem uma barbearia em Joinville e temos uma oportunidade incrível 🚀
              </div>
              <div className="max-w-[85%] py-2 px-2.5 rounded-lg text-xs leading-relaxed self-start bg-white/10 rounded-bl-sm">
                Oi! Me conta mais
              </div>
              <div className="max-w-[85%] py-2 px-2.5 rounded-lg text-xs leading-relaxed self-end bg-primary/20 rounded-br-sm">
                Ajudamos barbearias a captar clientes automaticamente via WhatsApp. Posso agendar uma demo?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT */}
      <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl py-3 px-4 flex items-center gap-2.5 cursor-pointer hover:bg-rose-500/15">
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse-slow flex-shrink-0" />
        <span className="text-xs text-rose-400 flex-1">3 leads quentes esperando resposta</span>
        <span className="text-lg text-rose-400">→</span>
      </div>
    </div>
  )
}

function KPI({ label, value, delta }) {
  return (
    <div className="bg-dark-100 border border-white/8 rounded-xl p-4 sm:p-5">
      <div className="text-xs text-muted uppercase tracking-wide mb-2">{label}</div>
      <div className="font-heading text-2xl sm:text-3xl font-extrabold leading-none">{value}</div>
      <div className="text-xs text-primary mt-2">{delta}</div>
    </div>
  )
}

function FeedItem({ icon, iconChar, text, time }) {
  const iconColors = {
    green: 'bg-primary-light text-primary',
    blue: 'bg-blue-400/20 text-blue-400',
    amber: 'bg-amber-400/20 text-amber-400',
  }

  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-white/8 last:border-none">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${iconColors[icon]}`}>
        {iconChar}
      </div>
      <div className="text-xs text-muted-light leading-tight flex-1" dangerouslySetInnerHTML={{ __html: text }} />
      <div className="text-xs text-muted whitespace-nowrap">{time}</div>
    </div>
  )
}
