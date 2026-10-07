import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { TriangleAlert } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AssetPicker } from '../components/AssetPicker'
import { CopyField } from '../components/CopyField'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useToast } from '../context/ToastContext'
import { useWallet } from '../context/WalletContext'
import { bankDeposit, decimals, depositAddress } from '../data/mock'
import type { AssetSymbol } from '../data/types'
import { formatAsset } from '../lib/format'

const symbols: AssetSymbol[] = ['NGN', 'USDT', 'BTC']

export default function Deposit() {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('asset')
  const symbol: AssetSymbol = symbols.find((s) => s === fromUrl) ?? 'USDT'
  const toast = useToast()
  const { credit, record } = useWallet()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function choose(next: AssetSymbol) {
    setParams({ asset: next }, { replace: true })
    setAmount('')
    setError('')
  }

  function onAmount(value: string) {
    const pattern = new RegExp(`^\\d*\\.?\\d{0,${decimals[symbol]}}$`)
    if (!pattern.test(value)) return
    setAmount(value)
    setError('')
  }

  function addDemoFunds() {
    const value = parseFloat(amount)
    if (!value || value <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    credit(symbol, value)
    record({
      title: `Deposited ${formatAsset(symbol, value)}`,
      detail: 'Wallet deposit',
      amount: `+${formatAsset(symbol, value)}`,
      direction: 'in',
    })
    toast.show(`${formatAsset(symbol, value)} added to your wallet`)
    setAmount('')
  }

  return (
    <>
      <PageHeader title="Deposit" />
      <AssetPicker value={symbol} onChange={choose} />

      <Card className="mt-5">
        {symbol === 'NGN' ? (
          <div className="space-y-3">
            <p className="font-display text-lg font-bold">Pay by bank transfer</p>
            <p className="text-muted">Send naira from your bank app to the account below. Your wallet is credited after the transfer arrives.</p>
            <CopyField label="Account number" value={bankDeposit.accountNumber} />
            <CopyField label="Account name" value={bankDeposit.accountName} />
            <CopyField label="Bank" value={bankDeposit.bank} />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-display text-lg font-bold">
              Deposit {symbol} on {depositAddress[symbol].network}
            </p>
            <div className="mx-auto w-fit rounded-2xl bg-white p-3">
              <QRCodeSVG value={depositAddress[symbol].address} size={168} bgColor="#ffffff" fgColor="#000000" title={`${symbol} deposit address`} />
            </div>
            <CopyField label="Deposit address" value={depositAddress[symbol].address} />
            <p className="flex gap-2 text-sm text-muted">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold-text" aria-hidden="true" />
              Only send {symbol} on the {depositAddress[symbol].network} network to this address. Anything else can be lost.
            </p>
          </div>
        )}
      </Card>

      <Card className="mt-5">
        <p className="font-display text-lg font-bold">Try it in the demo</p>
        <p className="mt-1 mb-4 text-muted">No real money moves here. Add demo funds to see your balance and activity update.</p>
        <Input
          label={`Amount in ${symbol}`}
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          error={error}
        />
        <Button full className="mt-4" onClick={addDemoFunds}>
          Add demo funds
        </Button>
      </Card>
    </>
  )
}
