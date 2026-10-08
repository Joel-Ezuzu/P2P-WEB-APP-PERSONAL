import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDownUp, Check, RefreshCw } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { PinPad } from '../../components/PinPad'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useToast } from '../../context/ToastContext'
import { useWallet } from '../../context/WalletContext'
import { useSettings } from '../../context/SettingsContext'
import { EXCHANGE_FEE, EXCHANGE_MIN_USD } from '../../data/mock'
import type { AssetSymbol } from '../../data/types'
import { useLiveRates } from '../../hooks/useLiveRates'
import { amountText, formatAsset, roundTo } from '../../lib/format'
import { SwapCard } from './SwapCard'

interface Quote {
  from: AssetSymbol
  to: AssetSymbol
  sent: number
  received: number
  fee: number
  rateLabel: string
}

type Stage = 'form' | 'confirm' | 'done'

// Which asset is shown as "1 X =" when we describe a rate.
const worth: Record<AssetSymbol, number> = { BTC: 3, USDT: 2, NGN: 1 }

export default function Exchange() {
  const toast = useToast()
  const { balanceOf, credit, debit, record } = useWallet()
  const { rates, secondsLeft } = useLiveRates()
  const { pin: savedPin } = useSettings()

  const [from, setFrom] = useState<AssetSymbol>('USDT')
  const [to, setTo] = useState<AssetSymbol>('NGN')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [stage, setStage] = useState<Stage>('form')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [pinError, setPinError] = useState('')

  const value = parseFloat(amount) || 0
  const gross = (value * rates[from]) / rates[to]
  const received = roundTo(to, gross * (1 - EXCHANGE_FEE))
  const fee = roundTo(to, gross * EXCHANGE_FEE)

  const [big, small] = worth[from] > worth[to] ? [from, to] : [to, from]
  const rateLabel = `1 ${big} = ${formatAsset(small, rates[big] / rates[small])}`

  function pickFrom(next: AssetSymbol) {
    if (next === to) setTo(from)
    setFrom(next)
    setAmount('')
    setError('')
  }

  function pickTo(next: AssetSymbol) {
    if (next === from) setFrom(to)
    setTo(next)
    setAmount('')
    setError('')
  }

  function flip() {
    setFrom(to)
    setTo(from)
    setAmount('')
    setError('')
  }

  function onReview(e: FormEvent) {
    e.preventDefault()
    if (value <= 0) setError('Enter the amount you want to swap.')
    else if (value * rates[from] < EXCHANGE_MIN_USD) setError('The smallest swap is worth $1.')
    else if (value > balanceOf(from)) setError(`You have ${formatAsset(from, balanceOf(from))}.`)
    else if (received <= 0) setError('That amount is too small to swap.')
    else {
      // Lock in the numbers the person agreed to, even if the rate moves.
      setQuote({ from, to, sent: value, received, fee, rateLabel })
      setPinError('')
      setStage('confirm')
    }
  }

  function onPin(pin: string) {
    if (!quote) return
    if (pin !== savedPin) {
      setPinError('That PIN is wrong. Try again.')
      return
    }
    if (!debit(quote.from, quote.sent)) {
      toast.show('Your balance changed. Check the amount and try again.', 'error')
      setStage('form')
      return
    }
    credit(quote.to, quote.received)
    record({
      title: `Swapped ${formatAsset(quote.from, quote.sent)} to ${quote.to}`,
      detail: 'Exchange',
      amount: `+${formatAsset(quote.to, quote.received)}`,
      direction: 'in',
    })
    setStage('done')
  }

  function again() {
    setAmount('')
    setQuote(null)
    setStage('form')
  }

  if (stage === 'done' && quote) {
    return (
      <>
        <PageHeader title="Exchange" back={false} />
        <div className="pt-2 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
            <Check className="size-10" strokeWidth={3} aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Swap complete</h2>
          <p className="num mt-2 font-display text-4xl font-extrabold tracking-tight">{formatAsset(quote.to, quote.received)}</p>
          <p className="mt-1 text-muted">
            from <span className="num font-semibold text-fg">{formatAsset(quote.from, quote.sent)}</span>
          </p>
        </div>
        <div className="mt-8 grid gap-3">
          <Button to="/wallet" size="lg" full>
            See my wallet
          </Button>
          <Button variant="secondary" size="lg" full onClick={again}>
            Swap again
          </Button>
        </div>
      </>
    )
  }

  if (stage === 'confirm' && quote) {
    const rows: [string, string][] = [
      ['You swap', formatAsset(quote.from, quote.sent)],
      ['Rate', quote.rateLabel],
      [`Fee (${EXCHANGE_FEE * 100}%)`, formatAsset(quote.to, quote.fee)],
      ['You receive', formatAsset(quote.to, quote.received)],
    ]
    return (
      <>
        <PageHeader title="Confirm swap" onBack={() => setStage('form')} />
        <Card>
          <dl className="space-y-3">
            {rows.map(([label, text]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted">{label}</dt>
                <dd className="num text-right font-semibold">{text}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <p className="mt-8 mb-4 text-center font-display text-lg font-bold">Enter your transaction PIN</p>
        <PinPad onComplete={onPin} error={pinError} />
        <p className="mt-4 text-center text-sm text-muted">Demo PIN: {savedPin}</p>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Exchange" back={false} />
      <form onSubmit={onReview} noValidate>
        <SwapCard
          label="You pay"
          symbol={from}
          onSymbol={pickFrom}
          balance={balanceOf(from)}
          amount={amount}
          onAmount={(t) => {
            setAmount(t)
            setError('')
          }}
          onMax={() => {
            setAmount(balanceOf(from) > 0 ? amountText(from, balanceOf(from)) : '')
            setError('')
          }}
        />

        <div className="relative z-10 -my-3 flex justify-center">
          <button
            type="button"
            onClick={flip}
            aria-label="Swap the two assets"
            className="grid size-11 place-items-center rounded-full border-4 border-bg bg-gold text-on-gold transition-transform hover:rotate-180"
          >
            <ArrowDownUp className="size-5" aria-hidden="true" />
          </button>
        </div>

        <SwapCard
          label="You receive"
          symbol={to}
          onSymbol={pickTo}
          balance={balanceOf(to)}
          result={value > 0 ? formatAsset(to, received).replace(/ [A-Z]+$/, '') : ''}
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-bad">
            {error}
          </p>
        )}

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Rate</dt>
            <dd className="num font-semibold">{rateLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Fee ({EXCHANGE_FEE * 100}%)</dt>
            <dd className="num font-semibold">{value > 0 ? formatAsset(to, fee) : 'None yet'}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Rate refreshes in</dt>
            <dd className="num flex items-center gap-1.5 font-semibold">
              <RefreshCw className="size-3.5 text-gold-text" aria-hidden="true" />
              {secondsLeft}s
            </dd>
          </div>
        </dl>

        <Button type="submit" size="lg" full className="mt-6">
          Review swap
        </Button>
        <p className="mt-3 text-center text-sm text-muted">Demo rates. No real money moves.</p>
      </form>
    </>
  )
}
