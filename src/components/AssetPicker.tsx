import { useWallet } from '../context/WalletContext'
import type { AssetSymbol } from '../data/types'
import { formatAsset } from '../lib/format'
import { AssetIcon } from './AssetIcon'

interface AssetPickerProps {
  value: AssetSymbol
  onChange: (symbol: AssetSymbol) => void
  /** Shows each balance under the symbol. */
  showBalance?: boolean
}

export function AssetPicker({ value, onChange, showBalance = false }: AssetPickerProps) {
  const { assets } = useWallet()

  return (
    <div role="radiogroup" aria-label="Choose an asset" className="grid grid-cols-3 gap-2">
      {assets.map((a) => {
        const selected = a.symbol === value
        return (
          <button
            key={a.symbol}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(a.symbol)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors ${
              selected ? 'border-gold-text bg-surface-2' : 'border-line bg-surface hover:border-gold-text'
            }`}
          >
            <AssetIcon symbol={a.symbol} className="size-9" />
            {a.symbol}
            {showBalance && (
              <span className="num max-w-full truncate text-xs font-medium text-muted">
                {formatAsset(a.symbol, a.balance)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
