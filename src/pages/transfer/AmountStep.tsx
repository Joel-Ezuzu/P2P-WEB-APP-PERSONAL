import { useState } from 'react'
import type { FormEvent } from 'react'
import { Avatar } from '../../components/Avatar'
import { AssetPicker } from '../../components/AssetPicker'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useWallet } from '../../context/WalletContext'
import { decimals, transferMin } from '../../data/mock'
import type { AssetSymbol } from '../../data/types'
import { formatAsset } from '../../lib/format'
import type { TransferDraft } from './types'

interface AmountStepProps {
  draft: TransferDraft
  onChange: (patch: Partial<TransferDraft>) => void
  onChangeRecipient: () => void
  onContinue: () => void
}

export function AmountStep({ draft, onChange, onChangeRecipient, onContinue }: AmountStepProps) {
  const { balanceOf } = useWallet()
  const [error, setError] = useState('')
  const { symbol, amount, note, recipient } = draft
  const balance = balanceOf(symbol)

  function chooseAsset(next: AssetSymbol) {
    onChange({ symbol: next, amount: '' })
    setError('')
  }

  function onAmount(text: string) {
    const pattern = new RegExp(`^\\d*\\.?\\d{0,${decimals[symbol]}}$`)
    if (!pattern.test(text)) return
    onChange({ amount: text })
    setError('')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount) || 0
    if (value < transferMin[symbol]) {
      setError(`The smallest transfer is ${formatAsset(symbol, transferMin[symbol])}.`)
    } else if (value > balance) {
      setError(`You have ${formatAsset(symbol, balance)} available.`)
    } else {
      onContinue()
    }
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">How much?</h2>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
        <Avatar name={recipient} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted">Sending to</span>
          <span className="block truncate font-semibold">{recipient}</span>
        </span>
        <button type="button" onClick={onChangeRecipient} className="text-sm font-semibold text-gold-text hover:underline">
          Change
        </button>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
        <AssetPicker value={symbol} onChange={chooseAsset} showBalance />
        <Input
          label={`Amount in ${symbol}`}
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          error={error}
          hint={`Available: ${formatAsset(symbol, balance)}. Fee: none.`}
          trailing={
            <button
              type="button"
              onClick={() => {
                onChange({ amount: balance > 0 ? String(balance) : '' })
                setError('')
              }}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-gold-text hover:bg-surface-2"
            >
              Max
            </button>
          }
        />
        <Input
          label="Note (optional)"
          placeholder="What is it for?"
          maxLength={40}
          value={note}
          onChange={(e) => onChange({ note: e.target.value })}
        />
        <Button type="submit" size="lg" full>
          Continue
        </Button>
      </form>
    </>
  )
}
