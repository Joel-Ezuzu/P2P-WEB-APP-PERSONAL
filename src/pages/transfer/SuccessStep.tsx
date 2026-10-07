import { Check } from 'lucide-react'
import { CopyField } from '../../components/CopyField'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatAsset } from '../../lib/format'
import type { Receipt } from './types'

export function SuccessStep({ receipt, onAgain }: { receipt: Receipt; onAgain: () => void }) {
  const value = parseFloat(receipt.amount) || 0

  return (
    <div className="pt-4 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
        <Check className="size-10" strokeWidth={3} aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Money sent</h2>
      <p className="num mt-2 font-display text-4xl font-extrabold tracking-tight">{formatAsset(receipt.symbol, value)}</p>
      <p className="mt-1 text-muted">
        to <span className="font-semibold text-fg">{receipt.recipient}</span>
      </p>

      <Card className="mt-8 text-left">
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Date</dt>
            <dd className="font-semibold">{receipt.date}</dd>
          </div>
          {receipt.note && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Note</dt>
              <dd className="text-right font-semibold break-words">{receipt.note}</dd>
            </div>
          )}
        </dl>
      </Card>
      <div className="mt-3 text-left">
        <CopyField label="Reference" value={receipt.reference} />
      </div>

      <div className="mt-8 grid gap-3">
        <Button to="/" size="lg" full>
          Done
        </Button>
        <Button variant="secondary" size="lg" full onClick={onAgain}>
          Send another
        </Button>
      </div>
    </div>
  )
}
