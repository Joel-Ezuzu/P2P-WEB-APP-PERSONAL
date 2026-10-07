import { useState } from 'react'
import type { FormEvent } from 'react'
import { AtSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { useMarket } from '../../context/MarketContext'
import { useToast } from '../../context/ToastContext'
import { contacts, initialOffers } from '../../data/mock'
import { isNickname } from '../../lib/validation'

const reserved = ['admin', 'support', 'pexora', 'help']
const taken = new Set([...contacts.map((c) => c.nickname), ...initialOffers.map((o) => o.nickname), ...reserved].map((n) => n.toLowerCase()))

export default function UpdateNickname() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, updateUser } = useAuth()
  const { renameOwner } = useMarket()
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!user) return null

  const text = value.trim()
  let problem = ''
  if (text && !isNickname(text)) problem = 'Use 3 to 20 letters, numbers or underscores.'
  else if (text.toLowerCase() === user.nickname.toLowerCase()) problem = 'That is already your nickname.'
  else if (text && taken.has(text.toLowerCase())) problem = 'Someone already has that nickname.'
  else if (submitted && !text) problem = 'Enter the nickname you want.'

  const available = text !== '' && problem === ''

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!available || !user) return
    renameOwner(user.nickname, text)
    updateUser({ nickname: text })
    toast.show('Your nickname is updated')
    navigate('/profile', { replace: true })
  }

  return (
    <>
      <PageHeader title="Update nickname" />
      <p className="text-muted">
        Your nickname is <span className="font-semibold text-fg">{user.nickname}</span>. Other traders see this name on your offers
        and trades.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Input
          label="New nickname"
          autoComplete="off"
          autoCapitalize="none"
          maxLength={20}
          placeholder="tobi_a"
          leading={<AtSign className="size-5" aria-hidden="true" />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={problem || undefined}
          hint={available ? undefined : '3 to 20 letters, numbers or underscores.'}
        />
        {available && (
          <p role="status" className="-mt-2 text-sm font-medium text-ok">
            {text} is available.
          </p>
        )}
        <Button type="submit" size="lg" full disabled={!available}>
          Save nickname
        </Button>
      </form>
    </>
  )
}
