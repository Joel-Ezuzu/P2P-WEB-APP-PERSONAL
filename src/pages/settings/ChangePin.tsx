import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { PinPad } from '../../components/PinPad'
import { StepProgress } from '../../components/StepProgress'
import { useSettings } from '../../context/SettingsContext'
import { useToast } from '../../context/ToastContext'

type Stage = 'current' | 'new' | 'confirm'

const heading: Record<Stage, string> = {
  current: 'Enter your current PIN',
  new: 'Choose a new PIN',
  confirm: 'Enter the new PIN again',
}

function isWeak(pin: string): boolean {
  if (/^(\d)\1+$/.test(pin)) return true
  const digits = pin.split('').map(Number)
  const steps = digits.slice(1).map((d, i) => d - digits[i])
  return steps.every((s) => s === 1) || steps.every((s) => s === -1)
}

export default function ChangePin() {
  const { type } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { pin, update } = useSettings()
  const [stage, setStage] = useState<Stage>('current')
  const [candidate, setCandidate] = useState('')
  const [error, setError] = useState('')

  if (type !== 'transaction') return <Navigate to="/change-pin/transaction" replace />

  function onComplete(entered: string) {
    if (stage === 'current') {
      if (entered !== pin) return setError('That is not your current PIN. Try again.')
      setError('')
      setStage('new')
    } else if (stage === 'new') {
      if (entered === pin) return setError('Your new PIN must be different from the old one.')
      if (isWeak(entered)) return setError('That PIN is too easy to guess. Avoid repeats like 1111 or runs like 1234.')
      setCandidate(entered)
      setError('')
      setStage('confirm')
    } else {
      if (entered !== candidate) {
        setCandidate('')
        setStage('new')
        return setError('The PINs did not match. Choose your new PIN again.')
      }
      update({ pin: entered })
      toast.show('Your transaction PIN is changed')
      navigate('/security', { replace: true })
    }
  }

  const step = stage === 'current' ? 1 : stage === 'new' ? 2 : 3

  return (
    <>
      <PageHeader title="Change PIN" />
      <StepProgress step={step} total={3} />
      <h2 className="mb-6 text-center font-display text-xl font-bold">{heading[stage]}</h2>
      <PinPad key={stage} onComplete={onComplete} error={error} />
      {stage === 'current' && <p className="mt-4 text-center text-sm text-muted">Demo PIN: {pin}</p>}
    </>
  )
}
