import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Offer } from '../data/types'
import { ngn } from '../lib/format'
import { Avatar } from './Avatar'

export function OfferCard({ offer }: { offer: Offer }) {
  const { user } = useAuth()
  const mine = user?.nickname === offer.nickname

  return (
    <Link
      to={`/marketplace/${offer.id}`}
      className="block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-gold-text"
    >
      <div className="flex items-start gap-3">
        <Avatar name={offer.nickname} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{offer.nickname}</p>
          <p className="num mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-xs font-medium text-gold-text">
              {mine ? 'Yours' : offer.badge}
            </span>
            {offer.completion}% · {offer.trades.toLocaleString()} trades
          </p>
        </div>
        <div className="text-right">
          <p className="num font-display text-lg font-bold">{ngn(offer.rate)}</p>
          <p className="text-xs text-muted">per USDT</p>
        </div>
      </div>
      <p className="num mt-3 text-sm text-muted">
        Available {offer.available.toLocaleString()} USDT · Limit {ngn(offer.minNgn).replace('.00', '')} to{' '}
        {ngn(offer.maxNgn).replace('.00', '')}
      </p>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {offer.methods.map((m) => (
          <li key={m} className="rounded-md border border-line px-2 py-0.5 text-xs font-medium">
            {m}
          </li>
        ))}
      </ul>
    </Link>
  )
}
