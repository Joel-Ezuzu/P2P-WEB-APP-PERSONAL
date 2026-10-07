import { useState } from 'react'
import type { FormEvent } from 'react'
import { FilePicker } from '../../components/FilePicker'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import type { KycDraft } from './types'

interface SelfieStepProps {
  draft: KycDraft
  onChange: (patch: Partial<KycDraft>) => void
  onSubmit: () => void
}

export function SelfieStep({ draft, onChange, onSubmit }: SelfieStepProps) {
  const [agreed, setAgreed] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [agreeError, setAgreeError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    setPhotoError(draft.selfie ? '' : 'Add a selfie so we can match it to your ID.')
    setAgreeError(agreed ? '' : 'Please confirm the details are correct.')
    if (draft.selfie && agreed) onSubmit()
  }

  const rows: [string, string][] = [
    ['Name', draft.fullName.trim()],
    ['Date of birth', draft.dob],
    ['ID', `${draft.idType}, ${draft.idNumber}`],
  ]

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Take a selfie</h2>
      <p className="mt-1.5 text-muted">Face the camera in good light, with no hat or sunglasses.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <FilePicker
          label="Your selfie"
          hint="Your face should be clear and centred."
          selfie
          file={draft.selfie}
          onFile={(f) => {
            onChange({ selfie: f })
            setPhotoError('')
          }}
          error={photoError}
        />
        <Card>
          <dl className="space-y-2.5">
            {rows.map(([label, text]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted">{label}</dt>
                <dd className="num text-right font-semibold break-words">{text}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked)
                setAgreeError('')
              }}
              className="mt-0.5 size-5 shrink-0 accent-gold"
            />
            <span>I confirm these details are mine and they are correct.</span>
          </label>
          {agreeError && <p className="mt-1.5 text-sm text-bad">{agreeError}</p>}
        </div>
        <Button type="submit" size="lg" full>
          Submit for verification
        </Button>
        <p className="text-center text-sm text-muted">Demo app: your photos stay in your browser and are never uploaded.</p>
      </form>
    </>
  )
}
