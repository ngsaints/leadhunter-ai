import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { leads as leadsApi } from '../services/api'
import OverviewTab from '../components/dashboard/OverviewTab'
import LeadsTab from '../components/dashboard/LeadsTab'
import AutomationTab from '../components/dashboard/AutomationTab'
import PlansTab from '../components/dashboard/PlansTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import AdminTab from '../components/dashboard/AdminTab'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({ total: 0, hot: 0, sent: 0, today: 0 })
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'leads', label: '👥 Leads' },
    { id: 'automation', label: '🤖 Automação' },
    { id: 'plans', label: '💎 Planos' },
    { id: 'settings', label: '⚙️ Config' },
  ]

  // Adicionar aba de Admin se for admin
  if (user?.is_admin) {
    tabs.push({ id: 'admin', label: '🛡️ Admin' })
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await leadsApi.stats()
      setStats(data)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* NAV */}
      <nav className="bg-dark-100 border-b border-white/8 px-4 sticky top-0 z-50">
        <div className="flex justify-between items-center h-14">
          <div className="font-heading text-lg font-extrabold">
            Lead<span className="text-primary">Hunter</span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`text-xs px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-primary-light text-primary' : 'text-muted hover:bg-white/5 hover:text-muted-light'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* User Area */}
          <div className="flex items-center gap-2">
            {user?.plan === 'free' && (
              <button onClick={() => setActiveTab('plans')} className="hidden sm:block bg-primary-light border border-primary/30 text-primary text-xs px-3 py-1.5 rounded-full">
                Upgrade →
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-dark">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-primary-light text-primary' : 'text-muted hover:bg-white/5'}`}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
              >
                {tab.label}
              </button>
            ))}
            {user?.plan === 'free' && (
              <button onClick={() => { setActiveTab('plans'); setMobileMenuOpen(false); }} className="block w-full text-left text-xs px-3 py-2 text-primary">
                💎 Upgrade para Pro
              </button>
            )}
            <button onClick={handleLogout} className="block w-full text-left text-xs px-3 py-2 text-muted hover:text-white">
              Sair da conta
            </button>
          </div>
        )}
      </nav>

      {/* User Info Bar (Mobile) */}
      <div className="md:hidden bg-dark-100 border-b border-white/8 px-4 py-2 flex justify-between items-center text-xs">
        <div>
          <span className="text-muted-light">{user?.name}</span>
          <span className="text-primary ml-2 capitalize">({user?.plan})</span>
        </div>
        <button onClick={handleLogout} className="text-muted hover:text-white">
          Sair
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-muted">Carregando...</div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'leads' && <LeadsTab />}
            {activeTab === 'automation' && <AutomationTab />}
            {activeTab === 'plans' && <PlansTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'admin' && <AdminTab />}
          </>
        )}
      </div>
    </div>
  )
}
