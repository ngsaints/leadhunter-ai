import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../App'
import { auth } from '../services/api'

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await auth.login(loginForm)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await auth.register(registerForm)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark">
      <div className="bg-dark-100 border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md">
        {/* Logo */}
        <div className="font-heading text-2xl font-extrabold text-center mb-6">
          Lead<span className="text-primary">Hunter</span> AI
        </div>

        {/* Tabs */}
        <div className="flex bg-dark-200 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm rounded-md transition-all ${activeTab === 'login' ? 'bg-primary-light text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md transition-all ${activeTab === 'register' ? 'bg-primary-light text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('register')}
          >
            Cadastrar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 py-2 px-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Senha</label>
              <input
                type="password"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nome</label>
              <input
                type="text"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Senha</label>
              <input
                type="password"
                className="w-full bg-dark-200 border border-white/10 text-white py-2.5 px-3 rounded-lg text-sm outline-none focus:border-primary"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        {/* Switch Tab Link */}
        <div className="text-center text-sm text-muted mt-4">
          {activeTab === 'login' ? (
            <p>
              Não tem conta?{' '}
              <span className="text-primary cursor-pointer underline" onClick={() => setActiveTab('register')}>
                Cadastre-se grátis
              </span>
            </p>
          ) : (
            <p>
              Já tem conta?{' '}
              <span className="text-primary cursor-pointer underline" onClick={() => setActiveTab('login')}>
                Fazer login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
