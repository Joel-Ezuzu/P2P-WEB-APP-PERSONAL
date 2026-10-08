import { decimals, usdPrice } from '../data/mock'
import type { AssetSymbol } from '../data/types'

export const ngn = (amount: number): string =>
  '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const usd = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

/** Formats an amount the way people expect for each asset: ₦1,000.00, 1,500 USDT, 0.42 BTC. */
export function formatAsset(symbol: AssetSymbol, amount: number): string {
  if (symbol === 'NGN') return ngn(amount)
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: decimals[symbol] })} ${symbol}`
}

/** Rounds to the asset's precision so 0.1 + 0.2 style errors never show up. */
export const roundTo = (symbol: AssetSymbol, amount: number): number => Number(amount.toFixed(decimals[symbol]))

export const shorten = (value: string): string =>
  value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value

const monthDay = (d: Date): string => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const clock = (d: Date): string => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

/** "Just now", "12 min ago", "Today, 10:42", "Yesterday", or "2 Oct". */
export function formatWhen(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (date.toDateString() === now.toDateString()) return `Today, ${clock(date)}`
  const yesterday = new Date(now.getTime() - 86_400_000)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return monthDay(date)
}

/** "6 Oct 2026, 10:42" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return `${monthDay(date)} ${date.getFullYear()}, ${clock(date)}`
}

/** Short naira amounts for tight spaces, like ₦1.8M. */
export const ngnCompact = (amount: number): string =>
  '₦' + new Intl.NumberFormat('en-NG', { notation: 'compact', maximumFractionDigits: 1 }).format(amount)

/** Shows a dollar total in the currency the person prefers. */
export const showTotal = (usdAmount: number, currency: 'USD' | 'NGN'): string =>
  currency === 'USD' ? usd(usdAmount) : ngn(usdAmount / usdPrice.NGN)

/** A number as plain text for an input box, never in scientific form like 1e-7. */
export const amountText = (symbol: AssetSymbol, amount: number): string =>
  amount.toFixed(decimals[symbol]).replace(/\.?0+$/, '')
