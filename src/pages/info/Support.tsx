import { useState } from 'react'
import type { FormEvent } from 'react'
import { MailCheck } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { CopyField } from '../../components/CopyField'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { useAuth } from '../../context/AuthContext'
import { SUPPORT_EMAIL } from '../../data/mock'

const topics = ['A problem with a trade', 'Deposit or withdrawal', 'Account and security', 'Something else']

interface Errors {
  topic?: string
  message?: string
}

function makeTicket(): string {
  return 'SUP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Support() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const fromOrder = params.get('order') ?? ''

  const [topic, setTopic] = useState(fromOrder ? topics[0] : '')
  const [reference, setReference] = useState(fromOrder)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [ticket, setTicket] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found: Errors = {}
    if (!topic) found.topic = 'Choose what this is about.'
    if (message.trim().length < 20) found.message = 'Tell us a little more, at least 20 characters.'
    setErrors(found)
    if (Object.keys(found).length === 0) setTicket(makeTicket())
  }

  if (ticket) {
    return (
      <>
        <PageHeader title="Contact support" back={false} />
        <div className="pt-4 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-gold text-on-gold">
            <MailCheck className="size-10" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">We got your message</h2>
          <p className="mx-auto mt-2 max-w-xs text-muted">
            A reply would go to <span className="font-semibold text-fg">{user?.email}</span>. This is a demo, so nothing was actually sent.
          </p>
        </div>
        <div className="mt-6 text-left">
          <CopyField label="Request number" value={ticket} />
        </div>
        <div className="mt-8 grid gap-3">
          <Button to="/" size="lg" full>
            Back to home
          </Button>
          <Button to="/help" variant="secondary" size="lg" full>
            Read the help center
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Contact support" />
      <p className="text-muted">
        Check the answers in the help center first. If they do not help, send us a message. Or write to{' '}
        <span className="font-semibold text-fg">{SUPPORT_EMAIL}</span>.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Select
          label="What is it about?"
          placeholder="Choose a topic"
          options={topics}
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value)
            setErrors((x) => ({ ...x, topic: undefined }))
          }}
          error={errors.topic}
        />
        <Input
          label="Order reference (optional)"
          placeholder="PX-..."
          autoComplete="off"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          hint="You can find it on the order receipt."
        />
        <Textarea
          label="Your message"
          placeholder="What happened? Include amounts and times if you can."
          maxLength={500}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setErrors((x) => ({ ...x, message: undefined }))
          }}
          error={errors.message}
        />
        <Button type="submit" size="lg" full>
          Send message
        </Button>
      </form>
    </>
  )
}
