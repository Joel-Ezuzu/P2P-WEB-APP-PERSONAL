import type { AssetSymbol } from '../data/types'

const glyph: Record<AssetSymbol, string> = { NGN: '₦', USDT: '₮', BTC: '₿' }

export function AssetIcon({ symbol, className = 'size-10' }: { symbol: AssetSymbol; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-line bg-surface-2 font-display text-lg font-bold text-gold-text ${className}`}
    >
      {glyph[symbol]}
    </span>
  )
}
