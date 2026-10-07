export interface User {
  nickname: string
  email: string
  kycVerified: boolean
}

export type AssetSymbol = 'NGN' | 'USDT' | 'BTC'

export interface Asset {
  symbol: AssetSymbol
  name: string
  balance: number
}

export type PaymentMethod = 'Bank transfer' | 'OPay' | 'Kuda' | 'Moniepoint'

export interface Offer {
  id: string
  nickname: string
  badge: 'Trusted' | 'Verified' | 'Fast pay' | 'Pro' | 'New'
  /** "sell" means this person is selling USDT, so you buy from them. */
  side: 'sell' | 'buy'
  /** Naira per 1 USDT */
  rate: number
  /** USDT still available to trade */
  available: number
  minNgn: number
  maxNgn: number
  methods: PaymentMethod[]
  /** Percent of trades completed */
  completion: number
  trades: number
  terms: string
}

export interface Order {
  id: string
  reference: string
  offerId: string
  counterparty: string
  /** What you did: bought or sold USDT. */
  side: 'buy' | 'sell'
  usdt: number
  ngn: number
  rate: number
  method: PaymentMethod
  createdAt: string
}

export interface Activity {
  id: string
  title: string
  detail: string
  amount: string
  direction: 'in' | 'out'
  /** When it happened, as an ISO date. */
  at: string
  /** Set when the activity came from a market trade. */
  orderId?: string
}

export interface Contact {
  nickname: string
  verified: boolean
}

export interface Notice {
  id: string
  title: string
  body: string
  kind: 'trade' | 'transfer' | 'security' | 'promo'
  at: string
  read: boolean
}
