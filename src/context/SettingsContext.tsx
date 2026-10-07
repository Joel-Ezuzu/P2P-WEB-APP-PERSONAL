import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEMO_PIN, initialNotices } from '../data/mock'
import type { Notice } from '../data/types'

const STORAGE_KEY = 'pexora-settings-v1'

export interface Settings {
  /** Demo only: a real app would never keep a PIN in the browser. */
  pin: string
  twoStep: boolean
  /** A frozen account cannot trade, send or withdraw. */
  frozen: boolean
  displayCurrency: 'USD' | 'NGN'
  hideBalance: boolean
  notify: { trades: boolean; transfers: boolean; promos: boolean }
  inbox: Notice[]
}

interface SettingsValue extends Settings {
  update: (patch: Partial<Settings>) => void
  setNotice: (id: string, read: boolean) => void
  markAllRead: () => void
  addNotice: (notice: Pick<Notice, 'title' | 'body' | 'kind'>) => void
  unread: number
}

const defaults: Settings = {
  pin: DEMO_PIN,
  twoStep: false,
  frozen: false,
  displayCurrency: 'USD',
  hideBalance: false,
  notify: { trades: true, transfers: true, promos: false },
  inbox: initialNotices,
}

const SettingsContext = createContext<SettingsValue | null>(null)

function readSaved(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>
      return { ...defaults, ...parsed, notify: { ...defaults.notify, ...parsed.notify } }
    }
  } catch {
    // Use the defaults.
  }
  return defaults
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(readSaved)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Ignore storage errors.
    }
  }, [settings])

  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), [])

  const setNotice = useCallback((id: string, read: boolean) => {
    setSettings((s) => ({ ...s, inbox: s.inbox.map((n) => (n.id === id ? { ...n, read } : n)) }))
  }, [])

  const markAllRead = useCallback(() => {
    setSettings((s) => ({ ...s, inbox: s.inbox.map((n) => ({ ...n, read: true })) }))
  }, [])

  const addNotice = useCallback((notice: Pick<Notice, 'title' | 'body' | 'kind'>) => {
    const full: Notice = { ...notice, id: `n-${Date.now()}`, at: new Date().toISOString(), read: false }
    setSettings((s) => ({ ...s, inbox: [full, ...s.inbox].slice(0, 30) }))
  }, [])

  const unread = settings.inbox.filter((n) => !n.read).length

  const value = useMemo(
    () => ({ ...settings, update, setNotice, markAllRead, addNotice, unread }),
    [settings, update, setNotice, markAllRead, addNotice, unread],
  )
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// Hooks live beside their providers on purpose, so each context is one small file.
// oxlint-disable-next-line react/only-export-components
export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
