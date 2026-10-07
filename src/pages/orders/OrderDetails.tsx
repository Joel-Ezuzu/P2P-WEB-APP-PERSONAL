import { Check } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { CopyField } from '../../components/CopyField'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useMarket } from '../../context/MarketContext'
import { useWallet } from '../../context/WalletContext'
import { formatAsset, formatDateTime, ngn } from '../../lib/format'

function Receipt({ rows }: { rows: [string, string][] }) {
  return (
    <Card className="mt-6">
      <dl className="space-y-3">
        {rows.map(([label, text]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-muted">{label}</dt>
            <dd className="num text-right font-semibold break-words">{text}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

function Header({ heading, big, sub }: { heading: string; big: string; sub?: string }) {
  return (
    <div className="pt-2 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold text-on-gold">
        <Check className="size-8" strokeWidth={3} aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-ok">{heading}</p>
      <p className="num mt-1 font-display text-3xl font-extrabold tracking-tight">{big}</p>
      {sub && <p className="mt-1 text-muted">{sub}</p>}
    </div>
  )
}

export default function OrderDetails() {
  const { orderId } = useParams()
  const { orders } = useMarket()
  const { activity } = useWallet()

  const order = orders.find((o) => o.id === orderId)
  const item = activity.find((a) => a.id === orderId)

  if (order) {
    const bought = order.side === 'buy'
    return (
      <>
        <PageHeader title="Order details" />
        <Header
          heading="Completed"
          big={`${bought ? 'Bought' : 'Sold'} ${formatAsset('USDT', order.usdt)}`}
          sub={`${bought ? 'from' : 'to'} ${order.counterparty}`}
        />
        <Receipt
          rows={[
            [bought ? 'You paid' : 'You received', ngn(order.ngn)],
            [bought ? 'You received' : 'You sold', formatAsset('USDT', order.usdt)],
            ['Rate', `${ngn(order.rate)} per USDT`],
            ['Payment method', order.method],
            ['Fee', 'Free'],
            ['Date', formatDateTime(order.createdAt)],
          ]}
        />
        <div className="mt-3">
          <CopyField label="Reference" value={order.reference} />
        </div>
        <div className="mt-8 grid gap-3">
          <Button to={`/marketplace?tab=${bought ? 'buy' : 'sell'}`} size="lg" full>
            Trade again
          </Button>
          <Button to={`/support?order=${order.reference}`} variant="ghost" full>
            Report a problem with this order
          </Button>
        </div>
      </>
    )
  }

  if (item) {
    return (
      <>
        <PageHeader title="Activity details" />
        <Header heading="Completed" big={item.amount} sub={item.title} />
        <Receipt
          rows={[
            ['Type', item.direction === 'in' ? 'Money in' : 'Money out'],
            ['Details', item.detail],
            ['Date', formatDateTime(item.at)],
            ['Status', 'Completed'],
          ]}
        />
        <div className="mt-3">
          <CopyField label="Reference" value={item.id.toUpperCase()} />
        </div>
        <Button to="/orders" variant="secondary" size="lg" full className="mt-8">
          Back to orders
        </Button>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Order details" />
      <Card>
        <p className="font-display text-lg font-bold">We can't find that order</p>
        <p className="mt-1.5 text-muted">The link may be old, or the order is not on this device.</p>
        <Button to="/orders" variant="secondary" className="mt-5">
          See all orders
        </Button>
      </Card>
    </>
  )
}
