import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Segmented } from '../../components/ui/Segmented'
import { useMarket } from '../../context/MarketContext'
import { useWallet } from '../../context/WalletContext'
import { formatAsset, formatWhen, ngn, ngnCompact } from '../../lib/format'

type View = 'trades' | 'activity'
type Filter = 'all' | 'in' | 'out'

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <ReceiptText className="mx-auto size-8 text-muted" aria-hidden="true" />
      <p className="mt-3 font-display text-lg font-bold">{title}</p>
      <p className="mt-1 text-muted">{text}</p>
    </div>
  )
}

export default function Orders() {
  const { orders } = useMarket()
  const { activity } = useWallet()
  const [view, setView] = useState<View>('trades')
  const [filter, setFilter] = useState<Filter>('all')

  const volume = orders.reduce((sum, o) => sum + o.ngn, 0)
  const shown = activity.filter((a) => filter === 'all' || a.direction === filter)

  return (
    <>
      <PageHeader title="Orders" />
      <Segmented<View>
        label="What to show"
        value={view}
        onChange={setView}
        options={[
          { value: 'trades', label: 'Trades' },
          { value: 'activity', label: 'All activity' },
        ]}
      />

      {view === 'trades' ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <dt className="text-sm text-muted">Completed trades</dt>
              <dd className="num mt-1 font-display text-2xl font-bold">{orders.length}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <dt className="text-sm text-muted">Total traded</dt>
              <dd className="num mt-1 truncate font-display text-2xl font-bold">{ngnCompact(volume)}</dd>
            </div>
          </dl>

          {orders.length === 0 ? (
            <Empty title="No trades yet" text="Buy or sell USDT in the market and your trades will show up here." />
          ) : (
            <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={`/orders/${o.id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2">
                      {o.side === 'buy' ? (
                        <ArrowDownLeft className="size-5 text-ok" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="size-5 text-muted" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {o.side === 'buy' ? 'Bought' : 'Sold'} {formatAsset('USDT', o.usdt)}
                      </span>
                      <span className="block truncate text-sm text-muted">
                        {o.side === 'buy' ? 'from' : 'to'} {o.counterparty}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="num block font-semibold">{ngn(o.ngn).replace('.00', '')}</span>
                      <span className="text-sm text-muted">{formatWhen(o.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="mt-5 flex gap-2" role="group" aria-label="Filter activity">
            <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </Chip>
            <Chip selected={filter === 'in'} onClick={() => setFilter('in')}>
              Money in
            </Chip>
            <Chip selected={filter === 'out'} onClick={() => setFilter('out')}>
              Money out
            </Chip>
          </div>

          {shown.length === 0 ? (
            <Empty title="Nothing here" text="No activity matches this filter." />
          ) : (
            <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
              {shown.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/orders/${a.orderId ?? a.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2">
                      {a.direction === 'in' ? (
                        <ArrowDownLeft className="size-5 text-ok" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="size-5 text-muted" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug font-semibold">{a.title}</span>
                      <span className="text-sm text-muted">{formatWhen(a.at)}</span>
                    </span>
                    <span className={`num font-semibold ${a.direction === 'in' ? 'text-ok' : ''}`}>{a.amount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
