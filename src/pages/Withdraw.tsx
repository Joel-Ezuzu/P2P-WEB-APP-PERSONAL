import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AssetPicker } from '../components/AssetPicker'
import { PageHeader } from '../components/PageHeader'
import { PinPad } from '../components/PinPad'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useToast } from '../context/ToastContext'
import { useWallet } from '../context/WalletContext'
import { useSettings } from '../context/SettingsContext'
import { banks, decimals, withdrawFee, withdrawMin } from '../data/mock'
import type { AssetSymbol } from '../data/types'
import { amountText, formatAsset, roundTo, shorten } from '../lib/format'

interface Errors {
  amount?: string
  bank?: string
  account?: string
  address?: string
}

const addressPattern: Record<'USDT' | 'BTC', RegExp> = {
  USDT: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  BTC: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/,
}

const network: Record<'USDT' | 'BTC', string> = { USDT: 'TRC20', BTC: 'Bitcoin' }

export default function Withdraw() {
  const navigate = useNavigate()
  const toast = useToast()
  const { balanceOf, debit, record } = useWallet()
  const { pin: savedPin } = useSettings()

  const [symbol, setSymbol] = useState<AssetSymbol>('NGN')
  const [amount, setAmount] = useState('')
  const [bank, setBank] = useState('')
  const [account, setAccount] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [reviewing, setReviewing] = useState(false)
  const [pinError, setPinError] = useState('')

  const balance = balanceOf(symbol)
  const fee = withdrawFee[symbol]
  const value = parseFloat(amount) || 0
  const total = roundTo(symbol, value + fee)
  const destination = symbol === 'NGN' ? `${bank}, ${account}` : address.trim()

  function choose(next: AssetSymbol) {
    setSymbol(next)
    setAmount('')
    setBank('')
    setAccount('')
    setAddress('')
    setErrors({})
  }

  function onAmount(text: string) {
    const pattern = new RegExp(`^\\d*\\.?\\d{0,${decimals[symbol]}}$`)
    if (!pattern.test(text)) return
    setAmount(text)
    setErrors((e) => ({ ...e, amount: undefined }))
  }

  function fillMax() {
    const max = Math.max(0, roundTo(symbol, balance - fee))
    setAmount(max > 0 ? amountText(symbol, max) : '')
    setErrors((e) => ({ ...e, amount: undefined }))
  }

  function onReview(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (value < withdrawMin[symbol]) {
      next.amount = `The minimum withdrawal is ${formatAsset(symbol, withdrawMin[symbol])}.`
    } else if (total > balance) {
      next.amount = `You have ${formatAsset(symbol, balance)}. The amount plus the ${formatAsset(symbol, fee)} fee is more than that.`
    }
    if (symbol === 'NGN') {
      if (!bank) next.bank = 'Choose the bank to pay into.'
      if (!/^\d{10}$/.test(account)) next.account = 'Account numbers have 10 digits.'
    } else if (!addressPattern[symbol].test(address.trim())) {
      next.address = `Enter a valid ${symbol} address on the ${network[symbol]} network.`
    }
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setPinError('')
      setReviewing(true)
    }
  }

  function onPin(pin: string) {
    if (pin !== savedPin) {
      setPinError('That PIN is wrong. Try again.')
      return
    }
    if (!debit(symbol, total)) {
      toast.show('Your balance changed. Check the amount and try again.', 'error')
      setReviewing(false)
      return
    }
    record({
      title: `Withdrew ${formatAsset(symbol, value)}`,
      detail: shorten(destination),
      amount: `-${formatAsset(symbol, value)}`,
      direction: 'out',
    })
    toast.show(`${formatAsset(symbol, value)} is on its way`)
    navigate('/wallet', { replace: true })
  }

  if (reviewing) {
    const rows: [string, string][] = [
      ['Amount', formatAsset(symbol, value)],
      ['Network fee', formatAsset(symbol, fee)],
      ['Total taken from wallet', formatAsset(symbol, total)],
      ['Sending to', symbol === 'NGN' ? `${bank}, ${account}` : shorten(destination)],
    ]
    return (
      <>
        <PageHeader title="Confirm withdrawal" back={false} />
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
        <Button variant="ghost" full className="mt-4" onClick={() => setReviewing(false)}>
          Edit details
        </Button>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Withdraw" />
      <AssetPicker value={symbol} onChange={choose} showBalance />

      <form onSubmit={onReview} noValidate className="mt-6 space-y-4">
        <Input
          label={`Amount in ${symbol}`}
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          error={errors.amount}
          hint={`Available: ${formatAsset(symbol, balance)}. Fee: ${formatAsset(symbol, fee)}.`}
          trailing={
            <button type="button" onClick={fillMax} className="rounded-lg px-2 py-1 text-sm font-semibold text-gold-text hover:bg-surface-2">
              Max
            </button>
          }
        />

        {symbol === 'NGN' ? (
          <>
            <Select
              label="Bank"
              placeholder="Choose a bank"
              options={banks}
              value={bank}
              onChange={(e) => {
                setBank(e.target.value)
                setErrors((x) => ({ ...x, bank: undefined }))
              }}
              error={errors.bank}
            />
            <Input
              label="Account number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 digits"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value.replace(/\D/g, ''))
                setErrors((x) => ({ ...x, account: undefined }))
              }}
              error={errors.account}
            />
          </>
        ) : (
          <Input
            label={`${symbol} address (${network[symbol]})`}
            autoComplete="off"
            spellCheck={false}
            placeholder={symbol === 'USDT' ? 'Starts with T' : 'Starts with bc1, 1 or 3'}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setErrors((x) => ({ ...x, address: undefined }))
            }}
            error={errors.address}
          />
        )}

        <Button type="submit" size="lg" full>
          Review withdrawal
        </Button>
      </form>
    </>
  )
}
