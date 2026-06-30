import { useCallback, useRef, useEffect } from 'react'
import useSuccessStore from '@store/success'
import Close from '@assets/icons/close-16.svg'
import './SuccessSnackbarStack.css'

const AUTO_DISMISS_MS = 4000

function SuccessToast({ toast, onDismiss }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleDismiss = (e) => {
    e.stopPropagation()
    onDismiss(toast.id)
  }

  return (
    <div className="success-toast">
      <div className="success-header">
        <span className="success-dot" />

        <div className="success-meta">
          <span className="success-label">{toast.label}</span>
          <span className="success-message">{toast.message}</span>
        </div>

        <button
          className="success-close"
          onClick={handleDismiss}
          aria-label="Закрыть"
        >
          <Close />
        </button>
      </div>

      <div className="success-progress">
        <div
          className="success-progress-bar"
          style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
        />
      </div>
    </div>
  )
}

export default function SuccessSnackbarStack() {
  const toasts = useSuccessStore((state) => state.toasts)
  const dismiss = useSuccessStore((state) => state.dismiss)

  const handleDismiss = useCallback((id) => {
    dismiss(id)
  }, [dismiss])

  if (toasts.length === 0) return null

  return (
    <div
      className="success-stack"
      aria-live="polite"
      aria-label="Уведомления об успешных действиях"
    >
      {toasts.map((toast) => (
        <SuccessToast
          key={toast.id}
          toast={toast}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}
