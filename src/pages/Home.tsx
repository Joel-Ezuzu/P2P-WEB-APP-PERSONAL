import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  Eye,
  EyeOff,
  FileText,
  ReceiptText,
  Send,
  Snowflake,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { ThemeToggle } from '../components/ThemeToggle'
import { Card } from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { useMarket } from '../context/MarketContext'
import { useSettings } from '../context/SettingsContext'
import { formatWhen, ngn, showTotal } from '../lib/format'
import { usePageTitle } from '../hooks/usePageTitle'

const quickActions = [
  { to: '/transfer', label: 'Transfer', icon: Send },
  { to: '/exchange', label: 'Exchange', icon: ArrowLeftRight },
  { to: '/orders', label: 'Orders', icon: ReceiptText },
  { to: '/statements', label: 'Statements', icon: FileText },
]

const iconButton =
  'grid size-10 place-items-center rounded-xl border border-line bg-surface transition-colors hover:border-gold-text'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  usePageTitle()
  const { user } = useAuth()
  const { assets, totalUsd, activity } = useWallet()
  const { offers } = useMarket()
  const settings = useSettings()
  const bestRates = offers
    .filter((o) => o.side === 'sell' && o.available > 0)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3)
  const [hidden, setHidden] = useState(settings.hideBalance)
  const nickname = user?.nickname ?? ''

  return (
    <>
      <header className="mb-6 flex items-center gap-3">
        <Link to="/profile" className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={nickname} />
          <span className="min-w-0">
            <span className="block text-sm text-muted">{greeting()}</span>
            <h1 className="block truncate font-display font-bold">{nickname}</h1>
            <span className="sr-only">Open your profile</span>
          </span>
        </Link>
        <ThemeToggle />
        <Link
          to="/notifications"
          aria-label={settings.unread > 0 ? `Notifications, ${settings.unread} unread` : 'Notifications'}
          className={`relative ${iconButton}`}
        >
          <Bell className="size-5" aria-hidden="true" />
          {settings.unread > 0 && (
            <span aria-hidden="true" className="absolute top-2 right-2.5 size-2.5 rounded-full border-2 border-surface bg-gold" />
          )}
        </Link>
      </header>

      {settings.frozen && (
        <Link
          to="/unfreeze"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-bad/50 bg-surface px-4 py-3 transition-colors hover:bg-surface-2"
        >
          <Snowflake className="size-5 shrink-0 text-bad" aria-hidden="true" />
          <span className="flex-1">
            <span className="block font-semibold">Your account is frozen</span>
            <span className="text-sm text-muted">Trading and withdrawals are paused.</span>
          </span>
          <span className="text-sm font-semibold text-gold-text">Unfreeze</span>
        </Link>
      )}

      <Card tone="gold" className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium opacity-80">Total balance</p>
          <button
            type="button"
            onClick={() => setHidden((h) => !h)}
            aria-pressed={hidden}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
            className="grid size-8 place-items-center rounded-lg hover:bg-black/10"
          >
            {hidden ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
          </button>
        </div>
        <p className="num mt-1 font-display text-4xl font-extrabold tracking-tight">
          {hidden ? '••••••' : showTotal(totalUsd, settings.displayCurrency)}
        </p>
        <p className="mt-1 text-sm opacity-80">Across {assets.length} wallets</p>
      </Card>

      <nav aria-label="Quick actions" className="mt-5 grid grid-cols-4 gap-2">
        {quickActions.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-1 py-3.5 text-[13px] font-medium transition-colors hover:border-gold-text"
          >
            <Icon className="size-6 text-gold-text" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <section className="mt-8" aria-labelledby="rates-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="rates-heading" className="font-display text-lg font-bold tracking-tight">
            Best rates to buy USDT
          </h2>
          <Link to="/marketplace" className="text-sm font-medium text-gold-text hover:underline">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {bestRates.map((offer) => (
            <li key={offer.id}>
              <Link
                to={`/marketplace/${offer.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <Avatar name={offer.nickname} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{offer.nickname}</span>
                  <span className="text-sm text-gold-text">{offer.badge}</span>
                </span>
                <span className="text-right">
                  <span className="num block font-semibold">{ngn(offer.rate)}</span>
                  <span className="num text-sm text-muted">{offer.available.toLocaleString()} USDT</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="activity-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="activity-heading" className="font-display text-lg font-bold tracking-tight">
            Recent activity
          </h2>
          <Link to="/orders" className="text-sm font-medium text-gold-text hover:underline">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {activity.map((item) => (
            <li key={item.id}>
              <Link
                to={`/orders/${item.orderId ?? item.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2">
                  {item.direction === 'in' ? (
                    <ArrowDownLeft className="size-5 text-ok" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="size-5 text-muted" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-snug font-semibold">{item.title}</span>
                  <span className="text-sm text-muted">{formatWhen(item.at)}</span>
                </span>
                <span className={`num font-semibold ${item.direction === 'in' ? 'text-ok' : ''}`}>{item.amount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
