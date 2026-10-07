import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { StepProgress } from '../../components/StepProgress'
import { useToast } from '../../context/ToastContext'
import { useWallet } from '../../context/WalletContext'
import { contacts } from '../../data/mock'
import { formatAsset } from '../../lib/format'
import { AmountStep } from './AmountStep'
import { ConfirmStep } from './ConfirmStep'
import { RecipientStep } from './RecipientStep'
import { SuccessStep } from './SuccessStep'
import type { Receipt, TransferDraft } from './types'

type Step = 'recipient' | 'amount' | 'confirm' | 'done'

const emptyDraft: TransferDraft = { recipient: '', symbol: 'USDT', amount: '', note: '' }

function makeReference(): string {
  return 'PX-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()
}

export default function Transfer() {
  const navigate = useNavigate()
  const toast = useToast()
  const { debit, record } = useWallet()
  const [params] = useSearchParams()

  const preset = contacts.find((c) => c.nickname.toLowerCase() === (params.get('to') ?? '').toLowerCase())
  const [draft, setDraft] = useState<TransferDraft>({ ...emptyDraft, recipient: preset?.nickname ?? '' })
  const [step, setStep] = useState<Step>(preset ? 'amount' : 'recipient')
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const patch = (change: Partial<TransferDraft>) => setDraft((d) => ({ ...d, ...change }))

  function onConfirmed() {
    const value = parseFloat(draft.amount) || 0
    if (!debit(draft.symbol, value)) {
      toast.show('Your balance changed. Check the amount and try again.', 'error')
      setStep('amount')
      return
    }
    record({
      title: `Sent ${formatAsset(draft.symbol, value)} to ${draft.recipient}`,
      detail: draft.note || 'Transfer',
      amount: `-${formatAsset(draft.symbol, value)}`,
      direction: 'out',
    })
    setReceipt({
      ...draft,
      reference: makeReference(),
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    })
    setStep('done')
  }

  function restart() {
    setDraft(emptyDraft)
    setReceipt(null)
    setStep('recipient')
  }

  if (step === 'done' && receipt) {
    return (
      <>
        <PageHeader title="Transfer" back={false} />
        <SuccessStep receipt={receipt} onAgain={restart} />
      </>
    )
  }

  const back: Record<Exclude<Step, 'done'>, () => void> = {
    recipient: () => navigate(-1),
    amount: () => setStep('recipient'),
    confirm: () => setStep('amount'),
  }
  const current = step === 'done' ? 'recipient' : step

  return (
    <>
      <PageHeader title="Transfer" onBack={back[current]} />
      <StepProgress step={current === 'recipient' ? 1 : current === 'amount' ? 2 : 3} total={3} />

      {current === 'recipient' && (
        <RecipientStep
          onSelect={(nickname) => {
            patch({ recipient: nickname })
            setStep('amount')
          }}
        />
      )}
      {current === 'amount' && (
        <AmountStep
          draft={draft}
          onChange={patch}
          onChangeRecipient={() => setStep('recipient')}
          onContinue={() => setStep('confirm')}
        />
      )}
      {current === 'confirm' && (
        <ConfirmStep draft={draft} onConfirmed={onConfirmed} onEdit={() => setStep('amount')} />
      )}
    </>
  )
}
