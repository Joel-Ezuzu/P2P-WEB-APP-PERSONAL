import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { KycDraft } from './types'

interface DetailsStepProps {
  draft: KycDraft
  onChange: (patch: Partial<KycDraft>) => void
  onContinue: () => void
}

interface Errors {
  fullName?: string
  dob?: string
  address?: string
  city?: string
}

function ageOn(dob: string): number {
  const born = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - born.getFullYear()
  if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) age -= 1
  return age
}

export function DetailsStep({ draft, onChange, onContinue }: DetailsStepProps) {
  const [errors, setErrors] = useState<Errors>({})

  const edit = (key: keyof Errors, patch: Partial<KycDraft>) => {
    onChange(patch)
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!/^[A-Za-z][A-Za-z'.-]+(\s+[A-Za-z][A-Za-z'.-]+)+$/.test(draft.fullName.trim())) {
      next.fullName = 'Enter your first and last name, as they appear on your ID.'
    }
    if (!draft.dob || Number.isNaN(Date.parse(draft.dob))) next.dob = 'Enter your date of birth.'
    else if (ageOn(draft.dob) < 18) next.dob = 'You must be 18 or older to trade.'
    else if (ageOn(draft.dob) > 110) next.dob = 'Check the year of your date of birth.'
    if (draft.address.trim().length < 8) next.address = 'Enter your full home address.'
    if (draft.city.trim().length < 2) next.city = 'Enter your city.'
    setErrors(next)
    if (Object.keys(next).length === 0) onContinue()
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Your details</h2>
      <p className="mt-1.5 text-muted">Use the same details that are on your ID.</p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Tobi Adeyemi"
          value={draft.fullName}
          onChange={(e) => edit('fullName', { fullName: e.target.value })}
          error={errors.fullName}
        />
        <Input
          label="Date of birth"
          type="date"
          autoComplete="bday"
          value={draft.dob}
          onChange={(e) => edit('dob', { dob: e.target.value })}
          error={errors.dob}
        />
        <Input
          label="Home address"
          autoComplete="street-address"
          placeholder="12 Adeola Odeku Street"
          value={draft.address}
          onChange={(e) => edit('address', { address: e.target.value })}
          error={errors.address}
        />
        <Input
          label="City"
          autoComplete="address-level2"
          placeholder="Lagos"
          value={draft.city}
          onChange={(e) => edit('city', { city: e.target.value })}
          error={errors.city}
        />
        <Button type="submit" size="lg" full>
          Continue
        </Button>
      </form>
    </>
  )
}
