import { AssetIcon } from '../../components/AssetIcon'
import { decimals } from '../../data/mock'
import type { AssetSymbol } from '../../data/types'
import { formatAsset } from '../../lib/format'

const symbols: AssetSymbol[] = ['NGN', 'USDT', 'BTC']

/** Long numbers get a smaller size so they never get cut off. */
const sizeFor = (text: string): string =>
  text.length > 11 ? 'text-xl' : text.length > 8 ? 'text-2xl' : 'text-3xl'

interface SwapCardProps {
  label: string
  symbol: AssetSymbol
  onSymbol: (symbol: AssetSymbol) => void
  balance: number
  /** Leave out for the read-only "you receive" card. */
  amount?: string
  onAmount?: (text: string) => void
  onMax?: () => void
  /** Shown in the read-only card. */
  result?: string
}

export function SwapCard({ label, symbol, onSymbol, balance, amount, onAmount, onMax, result }: SwapCardProps) {
  const editable = onAmount !== undefined

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted">{label}</span>
        <span className="num text-muted">
          Balance {formatAsset(symbol, balance)}
          {editable && onMax && (
            <button type="button" onClick={onMax} className="ml-2 font-semibold text-gold-text hover:underline">
              Max
            </button>
          )}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {editable ? (
          <input
            aria-label={`${label} amount`}
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              const pattern = new RegExp(`^\\d*\\.?\\d{0,${decimals[symbol]}}$`)
              if (pattern.test(e.target.value)) onAmount(e.target.value)
            }}
            className={`num min-w-0 flex-1 bg-transparent font-display font-bold outline-none placeholder:text-muted ${sizeFor(amount ?? '')}`}
          />
        ) : (
          <output aria-live="polite" className={`num min-w-0 flex-1 truncate font-display font-bold ${sizeFor(result ?? '')}`}>
            {result || <span className="text-muted">0</span>}
          </output>
        )}
        <label className="relative flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface-2 py-1.5 pr-3 pl-1.5">
          <AssetIcon symbol={symbol} className="size-8 text-base" />
          <select
            aria-label={`${label} asset`}
            value={symbol}
            onChange={(e) => onSymbol(e.target.value as AssetSymbol)}
            className="cursor-pointer appearance-none bg-transparent pr-1 font-semibold outline-none"
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
