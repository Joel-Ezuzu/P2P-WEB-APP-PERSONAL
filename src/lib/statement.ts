import { usdPrice } from '../data/mock'
import type { Activity, AssetSymbol } from '../data/types'
import { formatDateTime, usd } from './format'

export interface StatementRow {
  at: Date
  description: string
  details: string
  direction: 'in' | 'out'
  symbol: AssetSymbol
  /** Always positive. */
  value: number
  reference: string
}

export interface StatementMeta {
  nickname: string
  email: string
  /** Shown as text, for example "1 Oct 2026 to 6 Oct 2026". */
  periodLabel: string
  generated: Date
}

/** Turns "+₦752,600.00" or "-200 USDT" back into a symbol and a number. */
function parseAmount(text: string): { symbol: AssetSymbol; value: number } | null {
  const match = /^[+-]?(₦)?([\d,]+(?:\.\d+)?)(?: (USDT|BTC|NGN))?$/.exec(text.trim())
  if (!match) return null
  const symbol: AssetSymbol = match[1] ? 'NGN' : ((match[3] as AssetSymbol | undefined) ?? 'USDT')
  return { symbol, value: Number(match[2].replace(/,/g, '')) }
}

export function buildRows(activity: Activity[], from: Date, to: Date): StatementRow[] {
  const rows: StatementRow[] = []
  for (const a of activity) {
    const at = new Date(a.at)
    const parsed = parseAmount(a.amount)
    if (!parsed || at < from || at > to) continue
    rows.push({
      at,
      description: a.title,
      details: a.detail,
      direction: a.direction,
      ...parsed,
      reference: (a.orderId ?? a.id).toUpperCase(),
    })
  }
  return rows.sort((x, y) => y.at.getTime() - x.at.getTime())
}

export function totals(rows: StatementRow[]): { moneyIn: number; moneyOut: number } {
  let moneyIn = 0
  let moneyOut = 0
  for (const r of rows) {
    const dollars = r.value * usdPrice[r.symbol]
    if (r.direction === 'in') moneyIn += dollars
    else moneyOut += dollars
  }
  return { moneyIn, moneyOut }
}

const plain = (n: number, symbol: AssetSymbol): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: symbol === 'BTC' ? 0 : 2, maximumFractionDigits: symbol === 'BTC' ? 8 : 2 })

const quote = (value: string): string => `"${value.replace(/"/g, '""')}"`

export function toCsv(rows: StatementRow[], meta: StatementMeta): Blob {
  const lines = [
    ['Date', 'Description', 'Details', 'Direction', 'Amount', 'Currency', 'Reference'].join(','),
    ...rows.map((r) =>
      [
        quote(r.at.toISOString()),
        quote(r.description),
        quote(r.details),
        r.direction === 'in' ? 'Money in' : 'Money out',
        (r.direction === 'in' ? '' : '-') + r.value,
        r.symbol,
        r.reference,
      ].join(','),
    ),
    '',
    quote(`Pexora statement for ${meta.nickname}, ${meta.periodLabel}`),
  ]
  // The leading mark helps Excel read the file as UTF-8.
  return new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
}

export async function toPdf(rows: StatementRow[], meta: StatementMeta): Promise<Blob> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const left = 15
  const right = 195
  const { moneyIn, moneyOut } = totals(rows)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(150, 112, 10)
  doc.text('Pexora', left, 22)
  doc.setFontSize(13)
  doc.setTextColor(20, 18, 11)
  doc.text('Account statement', right, 22, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 85, 70)
  doc.text(`Account: ${meta.nickname} (${meta.email})`, left, 33)
  doc.text(`Period: ${meta.periodLabel}`, left, 39)
  doc.text(`Generated: ${formatDateTime(meta.generated.toISOString())}`, left, 45)

  doc.setDrawColor(210, 200, 170)
  doc.line(left, 50, right, 50)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(20, 18, 11)
  doc.text(`Transactions: ${rows.length}`, left, 58)
  doc.text(`Money in: ${usd(moneyIn)}`, 85, 58)
  doc.text(`Money out: ${usd(moneyOut)}`, right, 58, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120, 115, 100)
  doc.text('Totals are approximate US dollar values at demo rates.', left, 63)

  let y = 73
  const header = () => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(20, 18, 11)
    doc.text('Date', left, y)
    doc.text('Description', 48, y)
    doc.text('Amount', right, y, { align: 'right' })
    doc.line(left, y + 2, right, y + 2)
    y += 8
  }
  header()

  doc.setFontSize(9)
  for (const r of rows) {
    const lines = doc.splitTextToSize(`${r.description}\n${r.details}  |  Ref ${r.reference}`, 90) as string[]
    const height = lines.length * 4.4 + 3
    if (y + height > 275) {
      doc.addPage()
      y = 20
      header()
    }
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 18, 11)
    doc.text(formatDateTime(r.at.toISOString()), left, y)
    doc.text(lines, 48, y)
    // Standard PDF fonts have no naira sign, so the code is used instead.
    const amount = `${r.direction === 'in' ? '+' : '-'}${r.symbol} ${plain(r.value, r.symbol)}`
    doc.setFont('helvetica', 'bold')
    if (r.direction === 'in') doc.setTextColor(21, 128, 61)
    doc.text(amount, right, y, { align: 'right' })
    y += height
  }

  if (rows.length === 0) {
    doc.setFont('helvetica', 'normal')
    doc.text('No transactions in this period.', left, y)
  }

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 115, 100)
    doc.text('Demo statement from a portfolio project. It is not a real financial document.', left, 289)
    doc.text(`Page ${i} of ${pages}`, right, 289, { align: 'right' })
  }

  return doc.output('blob')
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
