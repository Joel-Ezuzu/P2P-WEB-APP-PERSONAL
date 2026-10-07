import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../context/ToastContext'
import { passwordChecks } from '../../lib/validation'

interface Errors {
  current?: string
  next?: string
  confirm?: string
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const toast = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const checks = passwordChecks(next)
  const clear = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }))

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found: Errors = {}
    if (!current) found.current = 'Enter your current password.'
    if (!checks.every((c) => c.ok)) found.next = 'Your new password needs to meet all three rules below.'
    else if (next === current) found.next = 'Your new password must be different from the current one.'
    if (confirm !== next) found.confirm = 'The passwords do not match.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    toast.show('Your password is changed')
    navigate('/security', { replace: true })
  }

  return (
    <>
      <PageHeader title="Change password" />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value)
            clear('current')
          }}
          error={errors.current}
          hint="This is a demo, so any password works here."
        />
        <div>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => {
              setNext(e.target.value)
              clear('next')
              clear('confirm')
            }}
            error={errors.next}
          />
          <ul className="mt-2.5 space-y-1 text-sm">
            {checks.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 ${c.ok ? 'text-ok' : 'text-muted'}`}>
                {c.ok ? <Check className="size-4" aria-hidden="true" /> : <Circle className="size-4" aria-hidden="true" />}
                {c.label}
                <span className="sr-only">{c.ok ? ' (done)' : ' (not yet)'}</span>
              </li>
            ))}
          </ul>
        </div>
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value)
            clear('confirm')
          }}
          error={errors.confirm}
        />
        <Button type="submit" size="lg" full>
          Change password
        </Button>
      </form>
    </>
  )
}
