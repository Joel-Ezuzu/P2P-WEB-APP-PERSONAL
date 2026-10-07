import { useState } from 'react'
import { Plus, Search, SearchX } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { OfferCard } from '../../components/OfferCard'
import { PageHeader } from '../../components/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Input } from '../../components/ui/Input'
import { Segmented } from '../../components/ui/Segmented'
import { useMarket } from '../../context/MarketContext'
import { MARKET_RATE, paymentMethods } from '../../data/mock'
import type { PaymentMethod } from '../../data/types'
import { ngn } from '../../lib/format'

type Tab = 'buy' | 'sell'

export default function Market() {
  const { offers } = useMarket()
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'sell' ? 'sell' : 'buy'
  const [method, setMethod] = useState<PaymentMethod | 'All'>('All')
  const [amount, setAmount] = useState('')

  const wanted = parseFloat(amount) || 0
  const list = offers
    .filter((o) => o.side === (tab === 'buy' ? 'sell' : 'buy') && o.available > 0)
    .filter((o) => method === 'All' || o.methods.includes(method))
    .filter((o) => wanted === 0 || (wanted >= o.minNgn && wanted <= o.maxNgn))
    .sort((a, b) => (tab === 'buy' ? a.rate - b.rate : b.rate - a.rate))

  return (
    <>
      <PageHeader
        title="Market"
        back={false}
        right={
          <Link
            to="/create-offer"
            aria-label="Create an offer"
            className="grid size-10 place-items-center rounded-xl bg-gold text-on-gold"
          >
            <Plus className="size-5" aria-hidden="true" />
          </Link>
        }
      />

      <Segmented<Tab>
        label="Buy or sell USDT"
        value={tab}
        onChange={(next) => setParams({ tab: next }, { replace: true })}
        options={[
          { value: 'buy', label: 'Buy USDT' },
          { value: 'sell', label: 'Sell USDT' },
        ]}
      />
      <p className="mt-3 text-sm text-muted">
        Market rate: <span className="num font-semibold text-fg">{ngn(MARKET_RATE)}</span> per USDT
      </p>

      <Input
        className="mt-4"
        label="Amount in naira (optional)"
        inputMode="numeric"
        placeholder="Show offers that fit this amount"
        leading={<Search className="size-5" aria-hidden="true" />}
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
      />

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Payment method">
        <Chip selected={method === 'All'} onClick={() => setMethod('All')}>
          All
        </Chip>
        {paymentMethods.map((m) => (
          <Chip key={m} selected={method === m} onClick={() => setMethod(m)}>
            {m}
          </Chip>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {list.map((o) => (
          <li key={o.id}>
            <OfferCard offer={o} />
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <SearchX className="mx-auto size-8 text-muted" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">No offers match</p>
          <p className="mt-1 text-muted">Try a different amount or payment method, or post your own offer.</p>
          <Link to="/create-offer" className="mt-4 inline-block font-semibold text-gold-text hover:underline">
            Create an offer
          </Link>
        </div>
      )}
    </>
  )
}
