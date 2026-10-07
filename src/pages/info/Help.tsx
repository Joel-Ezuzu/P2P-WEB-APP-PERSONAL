import { useState } from 'react'
import { ChevronDown, Search, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Input } from '../../components/ui/Input'
import { EXCHANGE_FEE, EXCHANGE_MIN_USD, RATE_BAND, transferMin, withdrawFee, withdrawMin } from '../../data/mock'
import { formatAsset } from '../../lib/format'

const topics = ['Getting started', 'Trading', 'Wallet', 'Security'] as const
type Topic = (typeof topics)[number]

interface Faq {
  topic: Topic
  q: string
  a: string
}

const faqs: Faq[] = [
  {
    topic: 'Getting started',
    q: 'What is Pexora?',
    a: 'Pexora is a peer-to-peer exchange. You trade naira and USDT directly with other people, instead of through a company that sets the price. This version is a demo, so no real money moves.',
  },
  {
    topic: 'Getting started',
    q: 'Why should I verify my identity?',
    a: 'Verification confirms you are a real person and keeps trading safer for everyone. You need your name, date of birth, address, an ID (NIN, driver\'s licence, voter\'s card or passport) and a selfie. Start it from your profile.',
  },
  {
    topic: 'Trading',
    q: 'How do I buy USDT?',
    a: 'Open Market and stay on Buy USDT. Pick an offer, enter how much naira you want to spend, choose a payment method and confirm with your PIN. The cheapest rates are at the top.',
  },
  {
    topic: 'Trading',
    q: 'How do I sell USDT?',
    a: 'Open Market and switch to Sell USDT. Pick a buyer, enter how much USDT you want to sell and confirm with your PIN. The highest rates are at the top.',
  },
  {
    topic: 'Trading',
    q: 'Can I post my own offer?',
    a: `Yes. Tap the + button in Market. Set a rate within ${RATE_BAND * 100}% of the market rate, how much USDT you are offering, the smallest and largest trade, and the payment methods you accept. You can close it any time.`,
  },
  {
    topic: 'Trading',
    q: 'What does it cost to trade?',
    a: `Trading on the market and sending money to another Pexora user are free. Swapping between assets costs ${EXCHANGE_FEE * 100}%, and the smallest swap is worth $${EXCHANGE_MIN_USD}.`,
  },
  {
    topic: 'Wallet',
    q: 'How do I add money?',
    a: 'Go to Wallet and tap Deposit. For naira, pay by bank transfer to the account shown. For USDT or Bitcoin, send to your deposit address on the right network. In this demo you can also add demo funds.',
  },
  {
    topic: 'Wallet',
    q: 'What are the withdrawal fees and limits?',
    a: `Naira: fee ${formatAsset('NGN', withdrawFee.NGN)}, minimum ${formatAsset('NGN', withdrawMin.NGN)}. USDT: fee ${formatAsset('USDT', withdrawFee.USDT)}, minimum ${formatAsset('USDT', withdrawMin.USDT)}. Bitcoin: fee ${formatAsset('BTC', withdrawFee.BTC)}, minimum ${formatAsset('BTC', withdrawMin.BTC)}.`,
  },
  {
    topic: 'Wallet',
    q: 'How do I send money to another person?',
    a: `Tap Transfer, find them by nickname, enter the amount and confirm with your PIN. It is instant and free. The smallest transfers are ${formatAsset('NGN', transferMin.NGN)}, ${formatAsset('USDT', transferMin.USDT)} or ${formatAsset('BTC', transferMin.BTC)}.`,
  },
  {
    topic: 'Wallet',
    q: 'Where can I see my past transactions?',
    a: 'Open Orders for your trades and all your activity. For a file you can keep, go to Statements and download a PDF or a spreadsheet for any period.',
  },
  {
    topic: 'Security',
    q: 'How do I change my PIN?',
    a: 'Go to Profile, then Settings, then Security, and tap Change transaction PIN. You enter your current PIN, then choose a new one twice. PINs that are easy to guess, like 1111 or 1234, are not allowed.',
  },
  {
    topic: 'Security',
    q: 'What does freezing my account do?',
    a: 'A frozen account cannot trade, post offers, swap, send or withdraw. You can still log in and see your balances. Unfreeze it any time with an email code and your PIN.',
  },
]

export default function Help() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<Topic | 'All'>('All')

  const text = query.trim().toLowerCase()
  const shown = faqs.filter(
    (f) => (topic === 'All' || f.topic === topic) && (!text || `${f.q} ${f.a}`.toLowerCase().includes(text)),
  )

  return (
    <>
      <PageHeader title="Help center" />
      <Input
        label="Search for an answer"
        placeholder="For example: fees, PIN, deposit"
        leading={<Search className="size-5" aria-hidden="true" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Topic">
        <Chip selected={topic === 'All'} onClick={() => setTopic('All')}>
          All
        </Chip>
        {topics.map((t) => (
          <Chip key={t} selected={topic === t} onClick={() => setTopic(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <SearchX className="mx-auto size-8 text-muted" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">No answers found</p>
          <p className="mt-1 text-muted">Try different words, or ask us directly.</p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
          {shown.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{f.q}</span>
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-4 pb-4 text-muted">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 rounded-2xl border border-line bg-surface p-5 text-center">
        <p className="font-display text-lg font-bold">Still need help?</p>
        <p className="mt-1 text-muted">Tell us what happened and we will look into it.</p>
        <Link
          to="/support"
          className="mt-4 inline-flex h-11 items-center rounded-xl bg-gold px-5 font-semibold text-on-gold"
        >
          Contact support
        </Link>
      </div>
    </>
  )
}
