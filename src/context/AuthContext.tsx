import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../data/types'

const STORAGE_KEY = 'pexora-session'

interface AuthValue {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthValue | null>(null)

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'nickname' in parsed &&
      'email' in parsed &&
      typeof parsed.nickname === 'string' &&
      typeof parsed.email === 'string'
    ) {
      const kyc = 'kycVerified' in parsed && parsed.kycVerified === true
      return { nickname: parsed.nickname, email: parsed.email, kycVerified: kyc }
    }
  } catch {
    // Bad or blocked storage means signed out.
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession)

  const signIn = useCallback((next: User) => {
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // The session still works until the page is closed.
    }
  }, [])

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (!user) return
      const next = { ...user, ...patch }
      setUser(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage errors.
      }
    },
    [user],
  )

  const signOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors.
    }
  }, [])

  const value = useMemo(() => ({ user, signIn, signOut, updateUser }), [user, signIn, signOut, updateUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hooks live beside their providers on purpose, so each context is one small file.
// oxlint-disable-next-line react/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
