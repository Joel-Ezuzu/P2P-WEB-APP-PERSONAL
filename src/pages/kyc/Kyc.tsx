import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, LoaderCircle } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { StepProgress } from '../../components/StepProgress'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { DetailsStep } from './DetailsStep'
import { DocumentStep } from './DocumentStep'
import { SelfieStep } from './SelfieStep'
import type { KycDraft } from './types'

type Stage = 1 | 2 | 3 | 'checking' | 'done'

const emptyDraft: KycDraft = {
  fullName: '',
  dob: '',
  address: '',
  city: '',
  idType: 'NIN',
  idNumber: '',
  idPhoto: null,
  selfie: null,
}

function Verified({ title, text }: { title: string; text: string }) {
  return (
    <div className="pt-6 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
        <BadgeCheck className="size-10" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-muted">{text}</p>
      <div className="mt-8 grid gap-3">
        <Button to="/marketplace" size="lg" full>
          Go to the market
        </Button>
        <Button to="/profile" variant="secondary" size="lg" full>
          Back to profile
        </Button>
      </div>
    </div>
  )
}

export default function Kyc() {
  const { user, updateUser } = useAuth()
  const [stage, setStage] = useState<Stage>(1)
  const [draft, setDraft] = useState<KycDraft>(emptyDraft)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [stage])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const patch = (change: Partial<KycDraft>) => setDraft((d) => ({ ...d, ...change }))

  function submit() {
    setStage('checking')
    timer.current = window.setTimeout(() => {
      updateUser({ kycVerified: true })
      setStage('done')
    }, 2500)
  }

  if (stage === 'done') {
    return (
      <>
        <PageHeader title="Verification" back={false} />
        <Verified title="You are verified" text="Your identity is confirmed. You can trade with other people now." />
      </>
    )
  }

  if (user?.kycVerified && stage === 1) {
    return (
      <>
        <PageHeader title="Verification" />
        <Verified title="Already verified" text="Your identity is confirmed. There is nothing more to do here." />
      </>
    )
  }

  if (stage === 'checking') {
    return (
      <>
        <PageHeader title="Verification" back={false} />
        <div className="pt-16 text-center" role="status">
          <LoaderCircle className="mx-auto size-12 animate-spin text-gold-text" aria-hidden="true" />
          <h2 className="mt-6 font-display text-2xl font-extrabold tracking-tight">Checking your details</h2>
          <p className="mt-2 text-muted">This only takes a moment. Please stay on this page.</p>
        </div>
      </>
    )
  }

  const back: Record<1 | 2 | 3, (() => void) | undefined> = {
    1: undefined,
    2: () => setStage(1),
    3: () => setStage(2),
  }

  return (
    <>
      <PageHeader title="Verify identity" onBack={back[stage]} />
      <StepProgress step={stage} total={3} />
      {stage === 1 && <DetailsStep draft={draft} onChange={patch} onContinue={() => setStage(2)} />}
      {stage === 2 && <DocumentStep draft={draft} onChange={patch} onContinue={() => setStage(3)} />}
      {stage === 3 && <SelfieStep draft={draft} onChange={patch} onSubmit={submit} />}
    </>
  )
}
