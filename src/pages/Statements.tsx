import { useMemo, useState } from 'react'
import { Download, FileX } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Input } from '../components/ui/Input'
import { Segmented } from '../components/ui/Segmented'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useWallet } from '../context/WalletContext'
import { buildRows, saveBlob, toCsv, toPdf, totals } from '../lib/statement'
import type { StatementRow } from '../lib/statement'

type Period = '7' | '30' | '90' | 'all' | 'custom'
type Format = 'pdf' | 'csv'

const periods: { value: Period; label: string }[] = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Choose dates' },
]

const DAY = 86_400_000
const dollars = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
const isoDay = (d: Date): string => d.toISOString().slice(0, 10)
const label = (d: Date): string => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Statements() {
  const { user } = useAuth()
  const { activity } = useWallet()
  const toast = useToast()

  const [today] = useState(() => new Date())
  const [period, setPeriod] = useState<Period>('30')
  const [format, setFormat] = useState<Format>('pdf')
  const [fromDate, setFromDate] = useState(isoDay(new Date(today.getTime() - 30 * DAY)))
  const [toDate, setToDate] = useState(isoDay(today))
  const [busy, setBusy] = useState(false)

  const range = useMemo(() => {
    const end = today
    if (period === 'all') return { from: new Date(0), to: end, text: 'All time', error: '' }
    if (period === 'custom') {
      const from = new Date(`${fromDate}T00:00:00`)
      const to = new Date(`${toDate}T23:59:59`)
      let error = ''
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) error = 'Choose both dates.'
      else if (from > to) error = 'The start date must be before the end date.'
      else if (to > end) error = 'The end date cannot be in the future.'
      return { from, to, text: error ? '' : `${label(from)} to ${label(to)}`, error }
    }
    const from = new Date(end.getTime() - Number(period) * DAY)
    return { from, to: end, text: `${label(from)} to ${label(end)}`, error: '' }
  }, [period, fromDate, toDate, today])

  const rows: StatementRow[] = useMemo(
    () => (range.error ? [] : buildRows(activity, range.from, range.to)),
    [activity, range],
  )
  const { moneyIn, moneyOut } = totals(rows)

  async function download() {
    if (!user || rows.length === 0) return
    setBusy(true)
    try {
      const meta = { nickname: user.nickname, email: user.email, periodLabel: range.text, generated: new Date() }
      const blob = format === 'pdf' ? await toPdf(rows, meta) : toCsv(rows, meta)
      saveBlob(blob, `pexora-statement-${isoDay(new Date())}.${format}`)
      toast.show(`Your ${format.toUpperCase()} statement is downloaded`)
    } catch {
      toast.show('Could not make the statement. Please try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Statements" />
      <p className="text-muted">Download a record of the money that came in and went out of your account.</p>

      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Period">
        {periods.map((p) => (
          <Chip key={p.value} selected={period === p.value} onClick={() => setPeriod(p.value)}>
            {p.label}
          </Chip>
        ))}
      </div>

      {period === 'custom' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Input label="From" type="date" max={toDate} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input label="To" type="date" max={isoDay(today)} value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      )}
      {range.error && (
        <p role="alert" className="mt-3 text-sm text-bad">
          {range.error}
        </p>
      )}

      <section className="mt-6" aria-labelledby="summary">
        <h2 id="summary" className="mb-3 font-display text-lg font-bold tracking-tight">
          {range.text || 'Summary'}
        </h2>
        <dl className="grid grid-cols-3 gap-2">
          {[
            ['Transactions', String(rows.length)],
            ['Money in', dollars(moneyIn)],
            ['Money out', dollars(moneyOut)],
          ].map(([name, value]) => (
            <div key={name} className="min-w-0 rounded-2xl border border-line bg-surface p-3">
              <dt className="text-xs text-muted">{name}</dt>
              <dd className="num mt-1 truncate font-display text-lg font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-muted">Totals are approximate dollar values at demo rates.</p>
      </section>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <FileX className="mx-auto size-8 text-muted" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">No transactions here</p>
          <p className="mt-1 text-muted">Pick a longer period to find some.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {rows.slice(0, 5).map((r) => (
            <li key={r.reference + r.at.getTime()} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block leading-snug font-medium">{r.description}</span>
                <span className="text-sm text-muted">{label(r.at)}</span>
              </span>
              <span className={`num text-sm font-semibold ${r.direction === 'in' ? 'text-ok' : ''}`}>
                {r.direction === 'in' ? '+' : '-'}
                {r.symbol === 'NGN' ? '₦' : ''}
                {r.value.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                {r.symbol === 'NGN' ? '' : ` ${r.symbol}`}
              </span>
            </li>
          ))}
          {rows.length > 5 && <li className="px-4 py-3 text-center text-sm text-muted">and {rows.length - 5} more in the file</li>}
        </ul>
      )}

      <div className="mt-6 space-y-4">
        <Segmented<Format>
          label="File type"
          value={format}
          onChange={setFormat}
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'csv', label: 'CSV (spreadsheet)' },
          ]}
        />
        <Button
          size="lg"
          full
          disabled={rows.length === 0 || busy}
          icon={<Download className="size-5" aria-hidden="true" />}
          onClick={download}
        >
          {busy ? 'Making your file...' : `Download ${format.toUpperCase()}`}
        </Button>
      </div>
    </>
  )
}
