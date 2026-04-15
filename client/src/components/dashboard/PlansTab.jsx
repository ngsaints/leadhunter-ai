import { useState } from 'react'
import { payments } from '../../services/api'

export default function PlansTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')
    try {
      const { url } = await payments.checkout()
      window.location.href = url
    } catch (err) {
      setError('Erro ao criar sessão de pagamento. Verifique se a chave Stripe está configurada.')
    } finally {
      setLoading(false)
    }
  }

  const handleManage = async () => {
    try {
      const { url } = await payments.portal()
      window.location.href = url
    } catch (err) {
      setError('Erro ao abrir portal de gestão')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold">Planos</h1>
      </div>

      {/* SAAS EXPLAIN */}
      <div className="bg-gradient-to-br from-primary-light to-primary-light/30 border border-primary/20 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-heading text-lg font-extrabold mb-4 flex items-center gap-2">
          💡 O que é o LeadHunter AI?
        </h3>
        <p className="text-sm text-muted-light leading-relaxed mb-4">
          O LeadHunter AI é uma ferramenta SaaS que automatiza a prospecção de clientes via WhatsApp para negócios locais.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">💰</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">Você vende</strong> o serviço para empreendedores que querem captar clientes automaticamente.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">📊</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">Plano Free:</strong> 20 leads/mês — perfeito para testar.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">🚀</span>
            <p className="text-sm text-muted-light leading-relaxed">
              <strong className="text-white">Plano Pro (R$97/mês):</strong> Leads ilimitados + IA 24h/7.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 py-2 px-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* PLANOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
        <div className="bg-dark-100 border border-white/10 rounded-xl p-6">
          <div className="font-heading text-xl font-extrabold">Free</div>
          <div className="font-heading text-4xl font-extrabold leading-none mt-5 mb-1">R$0</div>
          <div className="text-xs text-muted mb-6">/mês</div>
          <ul className="space-y-3 mb-7">
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> 20 leads/mês
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> IA para mensagens
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> Envio WhatsApp
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> Dashboard completo
            </li>
          </ul>
          <button className="btn-outline w-full py-2.5 text-sm" disabled>
            Plano atual
          </button>
        </div>

        <div className="bg-dark-100 border-2 border-primary rounded-xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-dark py-1 px-4 rounded-full text-xs font-bold whitespace-nowrap">MAIS POPULAR</div>
          <div className="font-heading text-xl font-extrabold">Pro</div>
          <div className="font-heading text-4xl font-extrabold leading-none mt-5 mb-1">R$97</div>
          <div className="text-xs text-muted mb-6">/mês</div>
          <ul className="space-y-3 mb-7">
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> Leads ilimitados
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> IA 24h/7
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> Auto-resposta
            </li>
            <li className="text-xs flex items-center gap-2 text-muted-light">
              <span className="text-primary font-bold">✓</span> Suporte prioritário
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? 'Redirecionando...' : 'Assinar Pro'}
          </button>
          <button
            onClick={handleManage}
            className="btn-outline w-full py-2.5 text-sm mt-3"
          >
            Gerenciar assinatura
          </button>
        </div>
      </div>

      {/* GARANTIA */}
      <div className="text-center bg-primary-light border border-primary/20 rounded-xl p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="text-4xl mb-4">🛡️</div>
        <h3 className="font-heading text-xl font-bold mb-2">7 dias de garantia</h3>
        <p className="text-sm text-muted-light leading-relaxed">
          Se não funcionar para você, devolvemos 100% do seu dinheiro. Sem perguntas.
        </p>
      </div>
    </div>
  )
}
