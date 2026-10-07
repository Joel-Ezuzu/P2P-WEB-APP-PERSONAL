import { useState } from 'react'
import type { FormEvent } from 'react'
import { FilePicker } from '../../components/FilePicker'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { Input } from '../../components/ui/Input'
import { idRules } from './types'
import type { IdType, KycDraft } from './types'

interface DocumentStepProps {
  draft: KycDraft
  onChange: (patch: Partial<KycDraft>) => void
  onContinue: () => void
}

const types = Object.keys(idRules) as IdType[]

export function DocumentStep({ draft, onChange, onContinue }: DocumentStepProps) {
  const [numberError, setNumberError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const rule = idRules[draft.idType]

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const badNumber = !rule.pattern.test(draft.idNumber.trim())
    setNumberError(badNumber ? `Check your ${draft.idType} number. ${rule.hint}` : '')
    setPhotoError(draft.idPhoto ? '' : 'Add a clear photo of your ID.')
    if (!badNumber && draft.idPhoto) onContinue()
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Your ID</h2>
      <p className="mt-1.5 text-muted">Choose one ID and take a clear photo of it.</p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <p className="mb-1.5 text-sm font-medium">ID type</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="ID type">
            {types.map((t) => (
              <Chip
                key={t}
                selected={draft.idType === t}
                onClick={() => {
                  onChange({ idType: t, idNumber: '' })
                  setNumberError('')
                }}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <Input
          label={`${draft.idType} number`}
          autoComplete="off"
          value={draft.idNumber}
          onChange={(e) => {
            onChange({ idNumber: e.target.value.replace(/\s/g, '') })
            setNumberError('')
          }}
          error={numberError}
          hint={rule.hint}
        />
        <FilePicker
          label="Photo of your ID"
          hint="The front, with all four corners in view."
          file={draft.idPhoto}
          onFile={(f) => {
            onChange({ idPhoto: f })
            setPhotoError('')
          }}
          error={photoError}
        />
        <Button type="submit" size="lg" full>
          Continue
        </Button>
      </form>
    </>
  )
}
