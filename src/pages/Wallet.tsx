import { ArrowDownToLine, ArrowUpFromLine, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AssetIcon } from '../components/AssetIcon'
import { PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/Card'
import { useWallet } from '../context/WalletContext'
import { usdPrice } from '../data/mock'
import { useSettings } from '../context/SettingsContext'
import { formatAsset, showTotal, usd } from '../lib/format'

const actions: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/wallet/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { to: '/wallet/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { to: '/transfer', label: 'Transfer', icon: Send },
]

export default function Wallet() {
  const { assets, totalUsd } = useWallet()
  const { displayCurrency } = useSettings()

  return (
    <>
      <PageHeader title="Wallet" back={false} />

      <Card tone="gold" className="p-6">
        <p className="text-sm font-medium opacity-80">Total balance</p>
        <p className="num mt-1 font-display text-4xl font-extrabold tracking-tight">{showTotal(totalUsd, displayCurrency)}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {actions.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-black/10 px-2 py-3 text-sm font-semibold transition-colors hover:bg-black/15"
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </Card>

      <section className="mt-8" aria-labelledby="assets-heading">
        <h2 id="assets-heading" className="mb-3 font-display text-lg font-bold tracking-tight">
          Your assets
        </h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {assets.map((a) => (
            <li key={a.symbol} className="flex items-center gap-3 px-4 py-4">
              <AssetIcon symbol={a.symbol} className="size-11" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{a.name}</span>
                <span className="text-sm text-muted">{a.symbol}</span>
              </span>
              <span className="text-right">
                <span className="num block font-semibold">{formatAsset(a.symbol, a.balance)}</span>
                <span className="num text-sm text-muted">{usd(a.balance * usdPrice[a.symbol])}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
