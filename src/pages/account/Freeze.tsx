import { useState } from 'react'
import { Snowflake } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { PinPad } from '../../components/PinPad'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Select'
import { useSettings } from '../../context/SettingsContext'
import { useToast } from '../../context/ToastContext'

type Stage = 'form' | 'pin' | 'done'

const reasons = ['I lost my phone', 'Someone else may have access', 'I am taking a break', 'Something else']

const effects = [
  'You cannot trade, post offers, swap or send money.',
  'You cannot withdraw to a bank or wallet.',
  'You can still log in and see your balances and history.',
  'You can unfreeze it any time with an email code and your PIN.',
]

export default function Freeze() {
  const { frozen, pin, update, addNotice } = useSettings()
  const toast = useToast()
  const [stage, setStage] = useState<Stage>('form')
  const [reason, setReason] = useState('')
  const [pinError, setPinError] = useState('')

  function onPin(entered: string) {
    if (entered !== pin) {
      setPinError('That PIN is wrong. Try again.')
      return
    }
    update({ frozen: true })
    addNotice({ title: 'Account frozen', body: 'Trading, transfers and withdrawals are paused.', kind: 'security' })
    toast.show('Your account is frozen')
    setStage('done')
  }

  if (stage === 'done') {
    return (
      <>
        <PageHeader title="Freeze account" back={false} />
        <div className="pt-6 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
            <Snowflake className="size-10" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Account frozen</h2>
          <p className="mx-auto mt-2 max-w-xs text-muted">Your money is safe and nothing can leave your account.</p>
          <div className="mt-8 grid gap-3">
            <Button to="/" size="lg" full>
              Go to home
            </Button>
            <Button to="/unfreeze" variant="secondary" size="lg" full>
              Unfreeze account
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (frozen) {
    return (
      <>
        <PageHeader title="Freeze account" />
        <Card>
          <p className="font-display text-lg font-bold">Your account is already frozen</p>
          <p className="mt-1.5 text-muted">Unfreeze it when you are ready to trade again.</p>
          <Button to="/unfreeze" className="mt-5">
            Unfreeze account
          </Button>
        </Card>
      </>
    )
  }

  if (stage === 'pin') {
    return (
      <>
        <PageHeader title="Confirm freeze" onBack={() => setStage('form')} />
        <p className="mb-6 text-center font-display text-lg font-bold">Enter your transaction PIN</p>
        <PinPad onComplete={onPin} error={pinError} />
        <p className="mt-4 text-center text-sm text-muted">Demo PIN: {pin}</p>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Freeze account" />
      <Card>
        <p className="font-display text-lg font-bold">What happens when you freeze</p>
        <ul className="mt-3 space-y-2.5">
          {effects.map((e) => (
            <li key={e} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
              {e}
            </li>
          ))}
        </ul>
      </Card>
      <div className="mt-5 space-y-5">
        <Select
          label="Why are you freezing it? (optional)"
          placeholder="Choose a reason"
          options={reasons}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button variant="danger" size="lg" full onClick={() => setStage('pin')}>
          Continue to freeze
        </Button>
        <Button to="/security" variant="ghost" full>
          Cancel
        </Button>
      </div>
    </>
  )
}
