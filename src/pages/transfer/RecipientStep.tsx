import { useState } from 'react'
import type { FormEvent } from 'react'
import { BadgeCheck, Search } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { contacts } from '../../data/mock'

interface RecipientStepProps {
  onSelect: (nickname: string) => void
}

export function RecipientStep({ onSelect }: RecipientStepProps) {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const text = query.trim().toLowerCase()
  const isSelf = text !== '' && text === user?.nickname.toLowerCase()
  const results = text ? contacts.filter((c) => c.nickname.toLowerCase().includes(text)) : contacts.slice(0, 4)

  function choose(nickname: string) {
    if (nickname.toLowerCase() === user?.nickname.toLowerCase()) {
      setError("You can't send money to yourself.")
      return
    }
    onSelect(nickname)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSelf) return setError("You can't send money to yourself.")
    const exact = contacts.find((c) => c.nickname.toLowerCase() === text)
    if (exact) return choose(exact.nickname)
    if (results.length === 1) return choose(results[0].nickname)
    setError(text ? 'Pick someone from the list, or type their full nickname.' : 'Type a nickname to find someone.')
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Who are you sending to?</h2>
      <p className="mt-1.5 text-muted">Transfers between Pexora users are instant and free.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6">
        <Input
          label="Recipient nickname"
          placeholder="Search by nickname"
          autoComplete="off"
          autoCapitalize="none"
          leading={<Search className="size-5" aria-hidden="true" />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setError('')
          }}
          error={error || (isSelf ? "You can't send money to yourself." : undefined)}
        />
      </form>

      <h3 className="mt-6 mb-2 font-display text-base font-bold">{text ? 'Results' : 'Recent'}</h3>
      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-muted">
          No one on Pexora has a nickname like "{query.trim()}". Check the spelling and try again.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {results.map((c) => (
            <li key={c.nickname}>
              <button
                type="button"
                onClick={() => choose(c.nickname)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
              >
                <Avatar name={c.nickname} />
                <span className="flex-1 truncate font-semibold">{c.nickname}</span>
                {c.verified && (
                  <span className="flex items-center gap-1 text-sm text-gold-text">
                    <BadgeCheck className="size-4" aria-hidden="true" />
                    Verified
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
