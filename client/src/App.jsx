import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { useToast, ToastContainer } from './components/ToastContainer'

// Auth Context
const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api'
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        logout()
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (token, user) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    addToast('Login realizado com sucesso!', 'success')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    addToast('Você saiu da sua conta', 'info')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AuthContext.Provider>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }
  
  if (!token) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
