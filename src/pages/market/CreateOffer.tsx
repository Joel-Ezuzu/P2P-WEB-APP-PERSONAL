import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Input } from '../../components/ui/Input'
import { Segmented } from '../../components/ui/Segmented'
import { useAuth } from '../../context/AuthContext'
import { useMarket } from '../../context/MarketContext'
import { useToast } from '../../context/ToastContext'
import { useWallet } from '../../context/WalletContext'
import { MARKET_RATE, paymentMethods, RATE_BAND } from '../../data/mock'
import type { PaymentMethod } from '../../data/types'
import { formatAsset, ngn } from '../../lib/format'

interface Errors {
  rate?: string
  amount?: string
  min?: string
  max?: string
  methods?: string
}

const lowest = Math.ceil(MARKET_RATE * (1 - RATE_BAND))
const highest = Math.floor(MARKET_RATE * (1 + RATE_BAND))

export default function CreateOffer() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const { addOffer } = useMarket()
  const { balanceOf } = useWallet()

  const [side, setSide] = useState<'sell' | 'buy'>('sell')
  const [rate, setRate] = useState('')
  const [amount, setAmount] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [terms, setTerms] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const digits = (setter: (v: string) => void, key: keyof Errors) => (text: string) => {
    setter(text.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function toggle(method: PaymentMethod) {
    setMethods((list) => (list.includes(method) ? list.filter((m) => m !== method) : [...list, method]))
    setErrors((e) => ({ ...e, methods: undefined }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const r = parseFloat(rate) || 0
    const a = parseFloat(amount) || 0
    const lo = parseFloat(min) || 0
    const hi = parseFloat(max) || 0
    const next: Errors = {}

    if (r < lowest || r > highest) next.rate = `Set a rate between ${ngn(lowest)} and ${ngn(highest)}, close to the market rate.`
    if (a < 10) next.amount = 'Offer at least 10 USDT.'
    else if (side === 'sell' && a > balanceOf('USDT')) next.amount = `You have ${formatAsset('USDT', balanceOf('USDT'))} to sell.`
    if (lo < 1000) next.min = 'The smallest trade you can set is ₦1,000.'
    if (hi <= lo) next.max = 'The largest trade must be more than the smallest.'
    else if (r > 0 && a > 0 && hi > a * r) next.max = `That is more than your offer is worth (${ngn(a * r)}).`
    if (methods.length === 0) next.methods = 'Choose at least one way to pay.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    addOffer({
      nickname: user?.nickname ?? 'you',
      side,
      rate: r,
      available: a,
      minNgn: lo,
      maxNgn: hi,
      methods,
      terms: terms.trim(),
    })
    toast.show(side === 'sell' ? 'Your offer is live. Find it under Buy USDT.' : 'Your offer is live. Find it under Sell USDT.')
    navigate(`/marketplace?tab=${side === 'sell' ? 'buy' : 'sell'}`, { replace: true })
  }

  return (
    <>
      <PageHeader title="Create offer" />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Segmented
          label="What do you want to do?"
          value={side}
          onChange={setSide}
          options={[
            { value: 'sell', label: 'I want to sell USDT' },
            { value: 'buy', label: 'I want to buy USDT' },
          ]}
        />
        <Input
          label="Your rate (naira per USDT)"
          inputMode="decimal"
          placeholder={String(MARKET_RATE)}
          value={rate}
          onChange={(e) => digits(setRate, 'rate')(e.target.value)}
          error={errors.rate}
          hint={`Market rate is ${ngn(MARKET_RATE)}.`}
        />
        <Input
          label="Amount (USDT)"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => digits(setAmount, 'amount')(e.target.value)}
          error={errors.amount}
          hint={side === 'sell' ? `You have ${formatAsset('USDT', balanceOf('USDT'))}.` : undefined}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Smallest trade (₦)"
            inputMode="numeric"
            placeholder="5000"
            value={min}
            onChange={(e) => digits(setMin, 'min')(e.target.value)}
            error={errors.min}
          />
          <Input
            label="Largest trade (₦)"
            inputMode="numeric"
            placeholder="500000"
            value={max}
            onChange={(e) => digits(setMax, 'max')(e.target.value)}
            error={errors.max}
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium">Payment methods</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Payment methods">
            {paymentMethods.map((m) => (
              <Chip key={m} selected={methods.includes(m)} onClick={() => toggle(m)}>
                {m}
              </Chip>
            ))}
          </div>
          {errors.methods && <p className="mt-1.5 text-sm text-bad">{errors.methods}</p>}
        </div>
        <Input
          label="Note to traders (optional)"
          placeholder="For example: pay from your own account"
          maxLength={100}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
        <Button type="submit" size="lg" full>
          Post offer
        </Button>
      </form>
    </>
  )
}
