// API Service
const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const isFormData = options.body instanceof FormData;

  const config = {
    method: options.method || 'GET',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (options.body && typeof options.body === 'object' && !isFormData) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config)
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Erro na requisição' }))
      throw new Error(error.error || 'Erro na requisição')
    }

    if (res.status === 204) return null
    return await res.json()
  } catch (err) {
    console.error('Erro na requisição:', err)
    throw err
  }
}

// Auth
export const auth = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/auth/me'),
}

// Leads
export const leads = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/leads${query ? '?' + query : ''}`)
  },
  create: (data) => request('/leads', { method: 'POST', body: data }),
  updateStatus: (id, status) => request(`/leads/${id}/status`, { method: 'PATCH', body: { status } }),
  stats: () => request('/leads/stats'),
  import: (formData) => request('/leads/import', { method: 'POST', body: formData }),
}

// Messages
export const messages = {
  getByLead: (leadId) => request(`/messages/${leadId}`),
  generate: (data) => request('/messages/generate', { method: 'POST', body: data }),
  reply: (data) => request('/messages/reply', { method: 'POST', body: data }),
}

// Automation
export const automation = {
  get: () => request('/automation'),
  save: (data) => request('/automation', { method: 'PUT', body: data }),
  search: () => request('/automation/search', { method: 'POST' }),
}

// WhatsApp
export const whatsapp = {
  send: (data) => request('/whatsapp/send', { method: 'POST', body: data }),
}

// Payments
export const payments = {
  checkout: () => request('/payments/checkout', { method: 'POST' }),
  portal: () => request('/payments/portal', { method: 'POST' }),
}

// Admin
export const admin = {
  getStats: () => request('/admin/stats'),
  getUsers: () => request('/admin/users'),
  updateUserPlan: (id, plan) => request(`/admin/users/${id}/plan`, { method: 'PATCH', body: { plan } }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
}

export default { auth, leads, messages, automation, whatsapp, payments, admin }
