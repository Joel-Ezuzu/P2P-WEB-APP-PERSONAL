import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'

type Tone = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: Tone
}

interface ToastValue {
  show: (message: string, tone?: Tone) => void
}

const ToastContext = createContext<ToastValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((message: string, tone: Tone = 'success') => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone })
    timer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]"
      >
        {toast && (
          <div
            key={toast.id}
            className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium shadow-lg"
          >
            {toast.tone === 'success' ? (
              <CircleCheck className="size-5 shrink-0 text-ok" aria-hidden="true" />
            ) : (
              <CircleAlert className="size-5 shrink-0 text-bad" aria-hidden="true" />
            )}
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

// Hooks live beside their providers on purpose, so each context is one small file.
// oxlint-disable-next-line react/only-export-components
export function useToast(): ToastValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
