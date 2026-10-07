import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { initialOffers, initialOrders } from '../data/mock'
import type { Offer, Order } from '../data/types'
import { roundTo } from '../lib/format'

const STORAGE_KEY = 'pexora-market-v2'

interface MarketState {
  offers: Offer[]
  orders: Order[]
}

type NewOffer = Omit<Offer, 'id' | 'badge' | 'completion' | 'trades'>
type NewOrder = Omit<Order, 'id' | 'reference' | 'createdAt'>

interface MarketValue extends MarketState {
  addOffer: (offer: NewOffer) => string
  closeOffer: (id: string) => void
  /** Keeps your offers yours after you change your nickname. */
  renameOwner: (from: string, to: string) => void
  /** Records a finished trade and takes the traded amount off the offer. */
  placeOrder: (order: NewOrder) => Order
}

const MarketContext = createContext<MarketValue | null>(null)

function readSaved(): MarketState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'offers' in parsed &&
        'orders' in parsed &&
        Array.isArray(parsed.offers) &&
        Array.isArray(parsed.orders)
      ) {
        return { offers: parsed.offers as Offer[], orders: parsed.orders as Order[] }
      }
    }
  } catch {
    // Fall back to the starting demo data.
  }
  return { offers: initialOffers, orders: initialOrders }
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketState>(readSaved)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage errors.
    }
  }, [state])

  const addOffer = useCallback((offer: NewOffer) => {
    const id = `own-${Date.now()}`
    const full: Offer = { ...offer, id, badge: 'New', completion: 100, trades: 0 }
    setState((s) => ({ ...s, offers: [full, ...s.offers] }))
    return id
  }, [])

  const closeOffer = useCallback((id: string) => {
    setState((s) => ({ ...s, offers: s.offers.filter((o) => o.id !== id) }))
  }, [])

  const renameOwner = useCallback((from: string, to: string) => {
    setState((s) => ({ ...s, offers: s.offers.map((o) => (o.nickname === from ? { ...o, nickname: to } : o)) }))
  }, [])

  const placeOrder = useCallback((order: NewOrder) => {
    const stamp = Date.now()
    const full: Order = {
      ...order,
      id: `ord-${stamp}`,
      reference: 'PX-' + stamp.toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
      createdAt: new Date(stamp).toISOString(),
    }
    setState((s) => ({
      orders: [full, ...s.orders],
      offers: s.offers.map((o) =>
        o.id === order.offerId ? { ...o, available: roundTo('USDT', o.available - order.usdt) } : o,
      ),
    }))
    return full
  }, [])

  const value = useMemo(
    () => ({ ...state, addOffer, closeOffer, renameOwner, placeOrder }),
    [state, addOffer, closeOffer, renameOwner, placeOrder],
  )
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

// Hooks live beside their providers on purpose, so each context is one small file.
// oxlint-disable-next-line react/only-export-components
export function useMarket(): MarketValue {
  const ctx = useContext(MarketContext)
  if (!ctx) throw new Error('useMarket must be used inside MarketProvider')
  return ctx
}
