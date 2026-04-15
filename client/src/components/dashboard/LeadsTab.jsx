import { useState, useEffect } from 'react'
import { leads as leadsApi } from '../../services/api'

export default function LeadsTab() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', phone: '', city: '', niche: '' })
  const [filter, setFilter] = useState({ status: '', city: '', niche: '' })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [filter])

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const data = await leadsApi.list(filter)
      setLeads(data || [])
    } catch (err) {
      console.error('Erro ao carregar leads:', err)
      showToast('Erro ao carregar leads', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLead = async (e) => {
    e.preventDefault()
    try {
      await leadsApi.create(newLead)
      setShowModal(false)
      setNewLead({ name: '', phone: '', city: '', niche: '' })
      showToast('Lead criado com sucesso!', 'success')
      fetchLeads()
    } catch (err) {
      console.error('Erro ao criar lead:', err)
      showToast('Erro ao criar lead', 'error')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await leadsApi.updateStatus(id, status)
      showToast('Status atualizado!', 'success')
      fetchLeads()
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const statusColors = {
    new: 'bg-white/10 text-muted-light',
    sent: 'bg-blue-400/20 text-blue-400',
    warm: 'bg-amber-400/20 text-amber-400',
    hot: 'bg-primary-light text-primary',
    closed: 'bg-rose-400/20 text-rose-400',
    rejected: 'bg-white/8 text-muted',
  }

  const statusLabels = {
    new: 'Novo',
    sent: 'Enviado',
    warm: 'Morno',
    hot: 'Quente 🔥',
    closed: 'Fechado',
    rejected: 'Rejeitado',
  }

  if (loading) {
    return <div className="text-center py-10 text-muted">Carregando leads...</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-extrabold">Leads</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-sm px-4 py-2"
        >
          + Novo Lead
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-dark-100 border border-white/8 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Status</label>
            <select
              className="w-full bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs outline-none focus:border-primary"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="new">Novo</option>
              <option value="sent">Enviado</option>
              <option value="warm">Morno</option>
              <option value="hot">Quente</option>
              <option value="closed">Fechado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Cidade</label>
            <input
              type="text"
              className="w-full bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs outline-none focus:border-primary"
              placeholder="Ex: Joinville"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Nicho</label>
            <input
              type="text"
              className="w-full bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs outline-none focus:border-primary"
              placeholder="Ex: Barbearia"
              value={filter.niche}
              onChange={(e) => setFilter({ ...filter, niche: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* TABLE - Desktop */}
      <div className="hidden sm:block bg-dark-100 border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Nome</th>
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Telefone</th>
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Cidade</th>
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Nicho</th>
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Status</th>
                <th className="text-xs uppercase tracking-wide text-muted py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 px-4 text-sm text-muted text-center">
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-sm">{lead.phone}</td>
                    <td className="py-3 px-4 text-sm">{lead.city}</td>
                    <td className="py-3 px-4 text-sm">{lead.niche}</td>
                    <td className="py-3 px-4">
                      <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-white/8 text-muted'}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="bg-dark-200 border border-white/10 text-white py-1.5 px-2 rounded-lg text-xs outline-none"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        <option value="new">Novo</option>
                        <option value="sent">Enviado</option>
                        <option value="warm">Morno</option>
                        <option value="hot">Quente</option>
                        <option value="closed">Fechado</option>
                        <option value="rejected">Rejeitado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CARDS - Mobile */}
      <div className="sm:hidden space-y-3">
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">Nenhum lead encontrado</div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="bg-dark-100 border border-white/8 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium">{lead.name}</h3>
                  <p className="text-xs text-muted mt-1">{lead.phone}</p>
                </div>
                <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-white/8 text-muted'}`}>
                  {statusLabels[lead.status] || lead.status}
                </span>
              </div>
              <div className="text-xs text-muted-light mt-2">
                {lead.city} • {lead.niche}
              </div>
              <select
                className="w-full mt-3 bg-dark-200 border border-white/10 text-white py-2 px-3 rounded-lg text-xs outline-none"
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
              >
                <option value="new">Novo</option>
                <option value="sent">Enviado</option>
                <option value="warm">Morno</option>
                <option value="hot">Quente</option>
                <option value="closed">Fechado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-dark-100 border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-extrabold">Novo Lead</h2>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-white text-xl">
                ×
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Nome</label>
                <input
                  type="text"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Telefone</label>
                <input
                  type="text"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="(48) 99999-9999"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Cidade</label>
                <input
                  type="text"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                  value={newLead.city}
                  onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Nicho</label>
                <input
                  type="text"
                  className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                  value={newLead.niche}
                  onChange={(e) => setNewLead({ ...newLead, niche: e.target.value })}
                  placeholder="Ex: Barbearia"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 text-sm">
                Adicionar Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-[9999] animate-slide-in">
          <div className={`border rounded-xl py-3 px-4 text-sm flex items-center gap-2.5 shadow-xl backdrop-blur-sm min-w-[280px] max-w-[360px] ${
            toast.type === 'success' ? 'border-primary/40 bg-primary/10' :
            toast.type === 'error' ? 'border-red-500/40 bg-red-500/10' :
            'border-blue-400/40 bg-blue-400/10'
          }`}>
            <span className="text-lg flex-shrink-0">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
