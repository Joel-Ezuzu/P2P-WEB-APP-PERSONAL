import type { Activity, Asset, AssetSymbol, Contact, Notice, Offer, Order, PaymentMethod, User } from './types'

// Demo data only. Nothing here is real.
export const demoUser: User = {
  nickname: 'tobi_a',
  email: 'tobi@example.com',
  kycVerified: true,
}

/** The email code for unfreezing in the demo. */
export const DEMO_CODE = '482913'

/** The starting transaction PIN for the demo. It can be changed under Security. */
export const DEMO_PIN = '1234'

export const initialAssets: Asset[] = [
  { symbol: 'NGN', name: 'Naira', balance: 2_000_000 },
  { symbol: 'USDT', name: 'Tether', balance: 1500 },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.42 },
]

/** Price of one unit in US dollars. */
export const usdPrice: Record<AssetSymbol, number> = {
  NGN: 1 / 1503.6,
  USDT: 1,
  BTC: 22905,
}

export const decimals: Record<AssetSymbol, number> = { NGN: 2, USDT: 2, BTC: 8 }
export const withdrawFee: Record<AssetSymbol, number> = { NGN: 50, USDT: 1, BTC: 0.0001 }
export const withdrawMin: Record<AssetSymbol, number> = { NGN: 1000, USDT: 10, BTC: 0.0005 }

export const transferMin: Record<AssetSymbol, number> = { NGN: 100, USDT: 1, BTC: 0.00001 }

export const contacts: Contact[] = [
  { nickname: 'kojo_m', verified: true },
  { nickname: 'ada_okafor', verified: true },
  { nickname: 'chidi_trades', verified: false },
  { nickname: 'AlexCrypto99', verified: true },
  { nickname: 'NairaWhiz', verified: true },
]

export const banks = ['Access Bank', 'GTBank', 'First Bank', 'Kuda', 'Moniepoint', 'OPay', 'UBA', 'Zenith Bank']

// Demo deposit details. Do not send real funds to these.
export const depositAddress: Record<'USDT' | 'BTC', { network: string; address: string }> = {
  USDT: { network: 'TRC20', address: 'TQn9Y2khDGZmVXe4LBp7RfKa5WsJc3HuNx' },
  BTC: { network: 'Bitcoin', address: 'bc1q8f3kd92mxw7vz4ptn6hs5ycu0ar2lg9je4qwx6' },
}

export const bankDeposit = {
  bank: 'Pexora Demo Bank',
  accountName: 'Pexora Escrow',
  accountNumber: '0123456789',
}

/** Share of the swapped amount kept as the exchange fee. */
export const EXCHANGE_FEE = 0.005
/** Smallest swap, in US dollars. */
export const EXCHANGE_MIN_USD = 1

export const MARKET_RATE = 1503.6
/** Offers must price within this share of the market rate. */
export const RATE_BAND = 0.05

export const paymentMethods: PaymentMethod[] = ['Bank transfer', 'OPay', 'Kuda', 'Moniepoint']

export const initialOffers: Offer[] = [
  { id: 'o1', nickname: 'KojoExchange', badge: 'Fast pay', side: 'sell', rate: 1512, available: 850, minNgn: 5000, maxNgn: 1_200_000, methods: ['Bank transfer', 'OPay'], completion: 99, trades: 1204, terms: 'I release USDT within 5 minutes of seeing your payment.' },
  { id: 'o2', nickname: 'AlexCrypto99', badge: 'Trusted', side: 'sell', rate: 1509.5, available: 5420, minNgn: 10_000, maxNgn: 8_000_000, methods: ['Bank transfer', 'Kuda'], completion: 98, trades: 856, terms: 'Pay from an account in your own name only.' },
  { id: 'o3', nickname: 'BitMaster_01', badge: 'Verified', side: 'sell', rate: 1507, available: 12_000, minNgn: 20_000, maxNgn: 15_000_000, methods: ['Bank transfer', 'Moniepoint'], completion: 96, trades: 412, terms: 'No third-party payments.' },
  { id: 'o4', nickname: 'NairaWhiz', badge: 'Pro', side: 'sell', rate: 1505, available: 25_000, minNgn: 50_000, maxNgn: 30_000_000, methods: ['Bank transfer'], completion: 100, trades: 3021, terms: 'Large orders welcome. Payment within 15 minutes, please.' },
  { id: 'b1', nickname: 'ChidiFX', badge: 'Verified', side: 'buy', rate: 1498, available: 3000, minNgn: 5000, maxNgn: 4_000_000, methods: ['Bank transfer', 'OPay'], completion: 97, trades: 320, terms: 'I pay as soon as you confirm the order.' },
  { id: 'b2', nickname: 'LagosTrader', badge: 'Trusted', side: 'buy', rate: 1495, available: 8000, minNgn: 10_000, maxNgn: 12_000_000, methods: ['Bank transfer', 'Kuda', 'Moniepoint'], completion: 98, trades: 774, terms: 'Fast and fair. Message me if you need anything.' },
  { id: 'b3', nickname: 'Funmi_P2P', badge: 'Fast pay', side: 'buy', rate: 1492, available: 1500, minNgn: 2000, maxNgn: 2_200_000, methods: ['OPay', 'Kuda'], completion: 99, trades: 1590, terms: 'Payment within 3 minutes.' },
  { id: 'b4', nickname: 'SteadyHands', badge: 'Pro', side: 'buy', rate: 1490, available: 20_000, minNgn: 30_000, maxNgn: 29_000_000, methods: ['Bank transfer'], completion: 100, trades: 2210, terms: 'Verified buyer. Large orders only.' },
]

const HOUR = 3_600_000
const DAY = 24 * HOUR
const ago = (ms: number): string => new Date(Date.now() - ms).toISOString()

export const initialActivity: Activity[] = [
  { id: 't1', title: 'Sold USDT to AlexCrypto99', detail: 'Paid to your bank account', amount: '+₦752,600.00', direction: 'in', at: ago(3 * HOUR) },
  { id: 't2', title: 'Sent USDT to kojo_m', detail: 'Transfer', amount: '-200 USDT', direction: 'out', at: ago(DAY + 2 * HOUR) },
  { id: 't3', title: 'Bought USDT from NairaWhiz', detail: 'Order completed', amount: '+500 USDT', direction: 'in', at: ago(4 * DAY), orderId: 't3' },
]

export const initialOrders: Order[] = [
  { id: 't1', reference: 'PX-8K2M4QZ', offerId: 'closed-1', counterparty: 'AlexCrypto99', side: 'sell', usdt: 500, ngn: 752_600, rate: 1505.2, method: 'Bank transfer', createdAt: ago(3 * HOUR) },
  { id: 't3', reference: 'PX-7D9WQ1R', offerId: 'closed-2', counterparty: 'NairaWhiz', side: 'buy', usdt: 500, ngn: 749_250, rate: 1498.5, method: 'Bank transfer', createdAt: ago(4 * DAY) },
  { id: 'ord-seed-3', reference: 'PX-3H6TB5N', offerId: 'closed-3', counterparty: 'KojoExchange', side: 'buy', usdt: 200, ngn: 302_200, rate: 1511, method: 'OPay', createdAt: ago(9 * DAY) },
]

export const initialNotices: Notice[] = [
  { id: 'n1', title: 'Order completed', body: 'You sold 500 USDT to AlexCrypto99.', kind: 'trade', at: ago(3 * HOUR), read: false },
  { id: 'n2', title: 'Transfer sent', body: 'You sent 200 USDT to kojo_m.', kind: 'transfer', at: ago(DAY + 2 * HOUR), read: false },
  { id: 'n3', title: 'New login', body: 'Your account was opened on a new device in Lagos.', kind: 'security', at: ago(2 * DAY), read: true },
  { id: 'n4', title: 'Rates are moving', body: 'USDT is trading above ₦1,500. Check the market for the best offers.', kind: 'promo', at: ago(5 * DAY), read: true },
]

export const developer = { name: 'Joel Ezuzu', github: 'https://github.com/Joel-Ezuzu' }
export const SUPPORT_EMAIL = 'support@pexora.example'
