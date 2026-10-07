import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { initialActivity, initialAssets, usdPrice } from '../data/mock'
import type { Activity, Asset, AssetSymbol } from '../data/types'
import { roundTo } from '../lib/format'

const STORAGE_KEY = 'pexora-wallet-v2'

interface WalletState {
  assets: Asset[]
  activity: Activity[]
}

interface WalletValue extends WalletState {
  totalUsd: number
  balanceOf: (symbol: AssetSymbol) => number
  credit: (symbol: AssetSymbol, amount: number) => void
  /** Returns false, and changes nothing, if the balance is too low. */
  debit: (symbol: AssetSymbol, amount: number) => boolean
  record: (item: Omit<Activity, 'id' | 'at'>) => void
}

const WalletContext = createContext<WalletValue | null>(null)

function readSaved(): WalletState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'assets' in parsed &&
        'activity' in parsed &&
        Array.isArray(parsed.assets) &&
        Array.isArray(parsed.activity)
      ) {
        return { assets: parsed.assets as Asset[], activity: parsed.activity as Activity[] }
      }
    }
  } catch {
    // Fall back to the starting demo data.
  }
  return { assets: initialAssets, activity: initialActivity }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(readSaved)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage errors.
    }
  }, [state])

  const balanceOf = useCallback(
    (symbol: AssetSymbol) => state.assets.find((a) => a.symbol === symbol)?.balance ?? 0,
    [state.assets],
  )

  const credit = useCallback((symbol: AssetSymbol, amount: number) => {
    setState((s) => ({
      ...s,
      assets: s.assets.map((a) =>
        a.symbol === symbol ? { ...a, balance: roundTo(symbol, a.balance + amount) } : a,
      ),
    }))
  }, [])

  const debit = useCallback(
    (symbol: AssetSymbol, amount: number) => {
      if (amount > balanceOf(symbol)) return false
      setState((s) => ({
        ...s,
        assets: s.assets.map((a) =>
          a.symbol === symbol ? { ...a, balance: roundTo(symbol, a.balance - amount) } : a,
        ),
      }))
      return true
    },
    [balanceOf],
  )

  const record = useCallback((item: Omit<Activity, 'id' | 'at'>) => {
    setState((s) => ({
      ...s,
      activity: [{ ...item, id: `a-${Date.now()}`, at: new Date().toISOString() }, ...s.activity].slice(0, 30),
    }))
  }, [])

  const totalUsd = useMemo(
    () => state.assets.reduce((sum, a) => sum + a.balance * usdPrice[a.symbol], 0),
    [state.assets],
  )

  const value = useMemo<WalletValue>(
    () => ({ ...state, totalUsd, balanceOf, credit, debit, record }),
    [state, totalUsd, balanceOf, credit, debit, record],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Hooks live beside their providers on purpose, so each context is one small file.
// oxlint-disable-next-line react/only-export-components
export function useWallet(): WalletValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}
