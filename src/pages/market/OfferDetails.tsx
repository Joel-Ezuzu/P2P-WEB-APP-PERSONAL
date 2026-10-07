import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { CopyField } from '../../components/CopyField'
import { PageHeader } from '../../components/PageHeader'
import { PinPad } from '../../components/PinPad'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { useMarket } from '../../context/MarketContext'
import { useToast } from '../../context/ToastContext'
import { useWallet } from '../../context/WalletContext'
import { useSettings } from '../../context/SettingsContext'
import type { Order, PaymentMethod } from '../../data/types'
import { formatAsset, ngn, roundTo } from '../../lib/format'

type Stage = 'form' | 'confirm' | 'done'

export default function OfferDetails() {
  const { offerId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const { offers, closeOffer, placeOrder } = useMarket()
  const { balanceOf, credit, debit, record } = useWallet()
  const { pin: savedPin } = useSettings()

  const offer = offers.find((o) => o.id === offerId)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [error, setError] = useState('')
  const [stage, setStage] = useState<Stage>('form')
  const [pinError, setPinError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  if (!offer) {
    return (
      <>
        <PageHeader title="Offer" />
        <Card>
          <p className="font-display text-lg font-bold">This offer is gone</p>
          <p className="mt-1.5 text-muted">It may have been closed or fully traded.</p>
          <Button to="/marketplace" variant="secondary" className="mt-5">
            Back to the market
          </Button>
        </Card>
      </>
    )
  }

  const mine = user?.nickname === offer.nickname
  const buying = offer.side === 'sell'
  const chosen = method ?? offer.methods[0]
  const value = parseFloat(amount) || 0
  const usdt = buying ? roundTo('USDT', value / offer.rate) : value
  const naira = buying ? value : roundTo('NGN', value * offer.rate)

  function onAmount(text: string) {
    if (!/^\d*\.?\d{0,2}$/.test(text)) return
    setAmount(text)
    setError('')
  }

  function fillMax() {
    if (!offer) return
    if (buying) {
      const cap = Math.min(offer.maxNgn, offer.available * offer.rate, balanceOf('NGN'))
      setAmount(String(Math.floor(cap)))
    } else {
      const cap = Math.min(offer.available, offer.maxNgn / offer.rate, balanceOf('USDT'))
      setAmount(String(Math.floor(cap * 100) / 100))
    }
    setError('')
  }

  function onReview(e: FormEvent) {
    e.preventDefault()
    if (!offer) return
    if (naira < offer.minNgn || naira > offer.maxNgn) {
      setError(`This offer takes ${ngn(offer.minNgn)} to ${ngn(offer.maxNgn)} per trade.`)
    } else if (usdt > offer.available) {
      setError(`Only ${offer.available.toLocaleString()} USDT is left on this offer.`)
    } else if (buying && naira > balanceOf('NGN')) {
      setError(`You have ${ngn(balanceOf('NGN'))}. Deposit more naira first.`)
    } else if (!buying && usdt > balanceOf('USDT')) {
      setError(`You have ${formatAsset('USDT', balanceOf('USDT'))}. Deposit more USDT first.`)
    } else {
      setPinError('')
      setStage('confirm')
    }
  }

  function onPin(pin: string) {
    if (!offer) return
    if (pin !== savedPin) {
      setPinError('That PIN is wrong. Try again.')
      return
    }
    const paid = buying ? debit('NGN', naira) : debit('USDT', usdt)
    if (!paid) {
      toast.show('Your balance changed. Check the amount and try again.', 'error')
      setStage('form')
      return
    }
    if (buying) credit('USDT', usdt)
    else credit('NGN', naira)

    const placed = placeOrder({
      offerId: offer.id,
      counterparty: offer.nickname,
      side: buying ? 'buy' : 'sell',
      usdt,
      ngn: naira,
      rate: offer.rate,
      method: chosen,
    })
    record({
      title: buying ? `Bought ${formatAsset('USDT', usdt)} from ${offer.nickname}` : `Sold ${formatAsset('USDT', usdt)} to ${offer.nickname}`,
      detail: 'Order completed',
      amount: buying ? `+${formatAsset('USDT', usdt)}` : `+${ngn(naira)}`,
      direction: 'in',
      orderId: placed.id,
    })
    setOrder(placed)
    setStage('done')
  }

  if (stage === 'done' && order) {
    return (
      <>
        <PageHeader title="Order complete" back={false} />
        <div className="pt-2 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
            <Check className="size-10" strokeWidth={3} aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
            {order.side === 'buy' ? 'You bought' : 'You sold'}
          </h2>
          <p className="num mt-2 font-display text-4xl font-extrabold tracking-tight">{formatAsset('USDT', order.usdt)}</p>
          <p className="mt-1 text-muted">
            {order.side === 'buy' ? 'from' : 'to'} <span className="font-semibold text-fg">{order.counterparty}</span> for{' '}
            <span className="num">{ngn(order.ngn)}</span>
          </p>
        </div>
        <div className="mt-8">
          <CopyField label="Reference" value={order.reference} />
        </div>
        <div className="mt-8 grid gap-3">
          <Button to="/wallet" size="lg" full>
            See my wallet
          </Button>
          <Button to="/marketplace" variant="secondary" size="lg" full>
            Back to the market
          </Button>
        </div>
      </>
    )
  }

  if (stage === 'confirm') {
    const rows: [string, string][] = [
      [buying ? 'You pay' : 'You sell', buying ? ngn(naira) : formatAsset('USDT', usdt)],
      ['You receive', buying ? formatAsset('USDT', usdt) : ngn(naira)],
      ['Rate', `${ngn(offer.rate)} per USDT`],
      ['Trading with', offer.nickname],
      ['Payment method', chosen],
      ['Fee', 'Free'],
    ]
    return (
      <>
        <PageHeader title="Confirm order" onBack={() => setStage('form')} />
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
      <PageHeader title={mine ? 'Your offer' : buying ? 'Buy USDT' : 'Sell USDT'} />

      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={offer.nickname} className="size-12" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2">
              <span className="truncate font-display text-lg font-bold">{offer.nickname}</span>
              <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-xs font-medium text-gold-text">{offer.badge}</span>
            </p>
            <p className="num text-sm text-muted">
              {offer.completion}% completed · {offer.trades.toLocaleString()} trades
            </p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt className="text-sm text-muted">Rate</dt>
            <dd className="num font-display text-lg font-bold whitespace-nowrap">{ngn(offer.rate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Available</dt>
            <dd className="num font-display text-lg font-bold whitespace-nowrap">{offer.available.toLocaleString()} USDT</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-muted">Limit per trade</dt>
            <dd className="num font-semibold">
              {ngn(offer.minNgn)} to {ngn(offer.maxNgn)}
            </dd>
          </div>
        </dl>
        {offer.terms && (
          <p className="mt-5 border-t border-line pt-4 text-sm">
            <span className="text-muted">Trader's note: </span>
            {offer.terms}
          </p>
        )}
      </Card>

      {mine ? (
        <Card className="mt-5">
          <p className="font-display text-lg font-bold">This is your offer</p>
          <p className="mt-1 text-muted">Other traders can see it in the market. Close it any time.</p>
          <Button
            variant="danger"
            full
            className="mt-4"
            onClick={() => {
              closeOffer(offer.id)
              toast.show('Your offer is closed')
              navigate('/marketplace', { replace: true })
            }}
          >
            Close offer
          </Button>
        </Card>
      ) : (
        <form onSubmit={onReview} noValidate className="mt-5 space-y-4">
          <Input
            label={buying ? 'You pay (NGN)' : 'You sell (USDT)'}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => onAmount(e.target.value)}
            error={error}
            hint={
              value > 0
                ? buying
                  ? `You receive about ${formatAsset('USDT', usdt)}`
                  : `You receive about ${ngn(naira)}`
                : `Your balance: ${buying ? ngn(balanceOf('NGN')) : formatAsset('USDT', balanceOf('USDT'))}`
            }
            trailing={
              <button type="button" onClick={fillMax} className="rounded-lg px-2 py-1 text-sm font-semibold text-gold-text hover:bg-surface-2">
                Max
              </button>
            }
          />
          <div>
            <p className="mb-1.5 text-sm font-medium">Payment method</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Payment method">
              {offer.methods.map((m) => (
                <Chip key={m} selected={chosen === m} onClick={() => setMethod(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <Button type="submit" size="lg" full>
            {buying ? 'Buy USDT' : 'Sell USDT'}
          </Button>
          <p className="text-center text-sm text-muted">
            Demo trade: it completes at once and no real money moves.{' '}
            <Link to="/marketplace" className="font-semibold text-gold-text hover:underline">
              Browse more offers
            </Link>
          </p>
        </form>
      )}
    </>
  )
}
