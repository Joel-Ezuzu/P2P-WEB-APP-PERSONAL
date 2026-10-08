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
  const [query, setQuery] = useState('')
  const [amount, setAmount] = useState('')

  const wanted = parseFloat(amount) || 0
  const text = query.trim().toLowerCase()
  const list = offers
    .filter((o) => o.side === (tab === 'buy' ? 'sell' : 'buy') && o.available > 0)
    .filter((o) => text === '' || o.nickname.toLowerCase().includes(text))
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

      <div className="mt-4 grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-3">
        <Input
          label="Trader"
          type="search"
          autoComplete="off"
          autoCapitalize="none"
          placeholder="Search name"
          leading={<Search className="size-5" aria-hidden="true" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Input
          label="Amount (₦)"
          inputMode="numeric"
          placeholder="Any amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
        />
      </div>

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
          <p className="mt-1 text-muted">Try a different name, amount or payment method, or post your own offer.</p>
          <Link to="/create-offer" className="mt-4 inline-block font-semibold text-gold-text hover:underline">
            Create an offer
          </Link>
        </div>
      )}
    </>
  )
}
