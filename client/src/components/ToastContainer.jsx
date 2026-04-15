import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])

    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null

  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  const colorMap = {
    success: 'border-primary/40 bg-primary/10',
    error: 'border-red-500/40 bg-red-500/10',
    info: 'border-blue-400/40 bg-blue-400/10',
    warning: 'border-amber-400/40 bg-amber-400/10',
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-msg border rounded-xl py-3 px-4 text-sm flex items-center gap-2.5 pointer-events-auto min-w-[280px] max-w-[360px] shadow-xl backdrop-blur-sm ${colorMap[toast.type] || colorMap.info}`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <span className="text-lg flex-shrink-0">{iconMap[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
