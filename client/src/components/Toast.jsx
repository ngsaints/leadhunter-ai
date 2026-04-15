export default function Toast({ message, type = 'info', show, onClose }) {
  if (!show) return null

  const bgColor = {
    success: 'border-green/40',
    error: 'border-pink-500/40',
    info: 'border-blue-400/30',
  }[type] || 'border-white/12'

  return (
    <div className="fixed bottom-7 right-7 z-[9999] pointer-events-none flex flex-col gap-2.5">
      <div className={`toast-msg bg-dark-100 border ${bgColor} rounded-3 py-3.5 px-5 text-sm flex items-center gap-2.5 pointer-events-auto min-w-[260px] max-w-[360px] opacity-0 translate-y-3 transition-all duration-350 show:opacity-100 show:translate-y-0`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-auto text-gray hover:text-white">
          ×
        </button>
      </div>
    </div>
  )
}
