import { useState, useEffect } from 'react'
import { admin as adminApi } from '../../services/api'

export default function AdminTab() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers()
      ])
      setStats(statsData)
      setUsers(usersData)
    } catch (err) {
      console.error('Erro ao buscar dados admin:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePlan = async (userId, plan) => {
    try {
      await adminApi.updateUserPlan(userId, plan)
      fetchData() // Recarregar
    } catch (err) {
      alert('Erro ao atualizar plano')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return
    try {
      await adminApi.deleteUser(userId)
      fetchData()
    } catch (err) {
      alert('Erro ao deletar usuário')
    }
  }

  if (loading) return <div className="p-8 text-center text-muted">Carregando painel de controle...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-heading text-2xl font-extrabold text-amber-500">Painel Administrativo</h1>
        <button onClick={fetchData} className="text-secondary text-sm hover:underline">Atualizar Dados</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Usuários Totais', value: stats?.totalUsers, color: 'text-blue-400' },
          { label: 'Assinaturas Ativas', value: stats?.activeSubs, color: 'text-green-400' },
          { label: 'Leads Capturados', value: stats?.totalLeads, color: 'text-purple-400' },
          { label: 'Receita Estimada', value: `R$ ${stats?.totalRevenue}`, color: 'text-amber-400' },
        ].map((item, i) => (
          <div key={i} className="bg-dark-100 border border-white/8 rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-dark-100 border border-white/8 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="font-heading font-bold text-lg">Gerenciar Usuários</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-xs text-muted uppercase">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Leads</th>
                <th className="px-6 py-4">Cadastro</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                    {u.is_admin ? <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 rounded mt-1 inline-block">ADMIN</span> : null}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.plan}
                      onChange={(e) => handleUpdatePlan(u.id, e.target.value)}
                      className="bg-dark-200 border border-white/10 text-xs rounded px-2 py-1 outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-muted">{u.leads_count}</td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
