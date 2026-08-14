import React from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

export default function Toast({ toasts, onRemoveToast }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'success'}`}>
          {toast.type === 'info' ? (
            <Info size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button 
            onClick={() => onRemoveToast(toast.id)}
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
