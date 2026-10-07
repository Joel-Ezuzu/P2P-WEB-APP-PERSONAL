import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { PinPad } from '../../components/PinPad'
import { StepProgress } from '../../components/StepProgress'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { useToast } from '../../context/ToastContext'
import { DEMO_CODE } from '../../data/mock'

type Stage = 'code' | 'pin' | 'done'

const WAIT = 30

export default function VerifyIdentity() {
  const { user } = useAuth()
  const { frozen, pin, update, addNotice } = useSettings()
  const toast = useToast()
  const [stage, setStage] = useState<Stage>('code')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [pinError, setPinError] = useState('')
  const [wait, setWait] = useState(WAIT)

  useEffect(() => {
    if (stage !== 'code' || wait <= 0) return
    const id = window.setTimeout(() => setWait((w) => w - 1), 1000)
    return () => window.clearTimeout(id)
  }, [stage, wait])

  if (!frozen && stage !== 'done') return <Navigate to="/unfreeze" replace />

  function onCode(e: FormEvent) {
    e.preventDefault()
    if (code !== DEMO_CODE) {
      setCodeError('That code is not right. Check your email and try again.')
      return
    }
    setStage('pin')
  }

  function onPin(entered: string) {
    if (entered !== pin) {
      setPinError('That PIN is wrong. Try again.')
      return
    }
    update({ frozen: false })
    addNotice({ title: 'Account unfrozen', body: 'You can trade, send and withdraw again.', kind: 'security' })
    toast.show('Your account is active again')
    setStage('done')
  }

  if (stage === 'done') {
    return (
      <>
        <PageHeader title="Verified" back={false} />
        <div className="pt-6 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
            <ShieldCheck className="size-10" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Account unfrozen</h2>
          <p className="mx-auto mt-2 max-w-xs text-muted">You can trade, send and withdraw again.</p>
          <Button to="/" size="lg" full className="mt-8">
            Go to home
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Verify it's you" onBack={stage === 'pin' ? () => setStage('code') : undefined} />
      <StepProgress step={stage === 'code' ? 1 : 2} total={2} />

      {stage === 'code' ? (
        <>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Check your email</h2>
          <p className="mt-1.5 text-muted">
            We sent a 6-digit code to <span className="font-semibold text-fg">{user?.email}</span>.
          </p>
          <form onSubmit={onCode} noValidate className="mt-6 space-y-4">
            <Input
              label="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''))
                setCodeError('')
              }}
              error={codeError}
              hint={`Demo code: ${DEMO_CODE}`}
            />
            <Button type="submit" size="lg" full disabled={code.length !== 6}>
              Continue
            </Button>
          </form>
          <p className="mt-5 text-center text-muted">
            {wait > 0 ? (
              <>Send the code again in {wait}s</>
            ) : (
              <button
                type="button"
                className="font-semibold text-gold-text hover:underline"
                onClick={() => {
                  setWait(WAIT)
                  toast.show('We sent you a new code')
                }}
              >
                Send the code again
              </button>
            )}
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-6 text-center font-display text-xl font-bold">Enter your transaction PIN</h2>
          <PinPad onComplete={onPin} error={pinError} />
          <p className="mt-4 text-center text-sm text-muted">Demo PIN: {pin}</p>
        </>
      )}
    </>
  )
}
