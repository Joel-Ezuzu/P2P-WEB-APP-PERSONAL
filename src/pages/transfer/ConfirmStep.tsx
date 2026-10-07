import { useState } from 'react'
import { PinPad } from '../../components/PinPad'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useSettings } from '../../context/SettingsContext'
import { formatAsset } from '../../lib/format'
import type { TransferDraft } from './types'

interface ConfirmStepProps {
  draft: TransferDraft
  onConfirmed: () => void
  onEdit: () => void
}

export function ConfirmStep({ draft, onConfirmed, onEdit }: ConfirmStepProps) {
  const { pin: savedPin } = useSettings()
  const [pinError, setPinError] = useState('')
  const value = parseFloat(draft.amount) || 0

  const rows: [string, string][] = [
    ['To', draft.recipient],
    ['Amount', formatAsset(draft.symbol, value)],
    ['Fee', 'Free'],
    ...(draft.note ? ([['Note', draft.note]] as [string, string][]) : []),
  ]

  function onPin(pin: string) {
    if (pin === savedPin) onConfirmed()
    else setPinError('That PIN is wrong. Try again.')
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Check and confirm</h2>
      <Card className="mt-4">
        <dl className="space-y-3">
          {rows.map(([label, text]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted">{label}</dt>
              <dd className="num text-right font-semibold break-words">{text}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <p className="mt-8 mb-4 text-center font-display text-lg font-bold">Enter your transaction PIN</p>
      <PinPad onComplete={onPin} error={pinError} />
      <p className="mt-4 text-center text-sm text-muted">Demo PIN: {savedPin}</p>
      <Button variant="ghost" full className="mt-4" onClick={onEdit}>
        Edit details
      </Button>
    </>
  )
}
