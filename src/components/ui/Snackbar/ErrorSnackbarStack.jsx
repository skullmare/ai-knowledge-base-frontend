import { useState, useCallback, useRef, useEffect } from 'react'
import { STORE_REGISTRY, useStoreError } from './useErrorWatcher'
import Close from '@assets/icons/close-16.svg'
import DropdownIcon from '@assets/icons/dropdown-16.svg';
import './ErrorSnackbarStack.css'

const AUTO_DISMISS_MS = 5000
const MAX_VISIBLE = 5

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ErrorToast({ toast, onDismiss }) {
  const [expanded, setExpanded] = useState(false)
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
  }, [toast.id, onDismiss])

  // Start timer on mount
  useEffect(() => {
    startTimer()
    return () => clearTimeout(timerRef.current)
  }, [])

  // Pause timer when expanded, resume when collapsed
  useEffect(() => {
    if (expanded) {
      clearTimeout(timerRef.current)
    } else {
      startTimer()
    }
  }, [expanded])

  const handleToggle = () => setExpanded((v) => !v)
  const handleDismiss = (e) => {
    e.stopPropagation()
    onDismiss(toast.id)
  }

  return (
    <div className="snackbar-toast" onClick={handleToggle}>

      {/* Header row */}
      <div className="snackbar-header">
        <span className="snackbar-dot" />

        <div className="snackbar-meta">
          <span className="snackbar-label">{toast.label}</span>
          {!expanded && (
            <span className="snackbar-short-message">{toast.message}</span>
          )}
        </div>

        {/* Chevron */}
        <span className={`snackbar-chevron${expanded ? ' is-expanded' : ''}`}>
          <DropdownIcon></DropdownIcon>
        </span>

        {/* Close button */}
        <button
          className="snackbar-close"
          onClick={handleDismiss}
          aria-label="Закрыть"
        >
          <Close></Close>
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="snackbar-body">
          <p className="snackbar-full-message">{toast.message}</p>
          <span className="snackbar-hint">
            Нажмите ещё раз чтобы свернуть
          </span>
        </div>
      )}

      {/* Auto-dismiss progress bar (only when collapsed) */}
      {!expanded && (
        <div className="snackbar-progress">
          <div
            className="snackbar-progress-bar"
            style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Store Watcher (renders nothing, just watches one store) ──────────────────

function StoreWatcher({ storeEntry, onError }) {
  useStoreError(storeEntry, onError)
  return null
}

// ─── Main Stack Component ─────────────────────────────────────────────────────

export default function ErrorSnackbarStack() {
  const [toasts, setToasts] = useState([])

  const handleError = useCallback(({ storeKey, label, message, clearError }) => {
    setToasts((prev) => {
      // Deduplicate: same store already in queue → remove old, add fresh
      const filtered = prev.filter((t) => t.storeKey !== storeKey)

      const newToast = {
        id: `${storeKey}-${Date.now()}`,
        storeKey,
        label,
        message,
        clearError,
      }

      // Keep only last MAX_VISIBLE
      return [...filtered, newToast].slice(-MAX_VISIBLE)
    })
  }, [])

  const handleDismiss = useCallback((id) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id)
      if (toast) toast.clearError()
      return prev.filter((t) => t.id !== id)
    })
  }, [])

  return (
    <>
      {/* Silent store watchers — one per store to satisfy Rules of Hooks */}
      {STORE_REGISTRY.map((entry) => (
        <StoreWatcher key={entry.key} storeEntry={entry} onError={handleError} />
      ))}

      {/* Toast stack — bottom-right */}
      {toasts.length > 0 && (
        <div
          className="snackbar-stack"
          aria-live="polite"
          aria-label="Уведомления об ошибках"
        >
          {toasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              toast={toast}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </>
  )
}