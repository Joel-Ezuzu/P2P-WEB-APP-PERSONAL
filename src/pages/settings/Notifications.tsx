import { BellOff, Megaphone, ReceiptText, Send, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { useSettings } from '../../context/SettingsContext'
import type { Notice } from '../../data/types'
import { formatWhen } from '../../lib/format'

const icons: Record<Notice['kind'], LucideIcon> = {
  trade: ReceiptText,
  transfer: Send,
  security: ShieldCheck,
  promo: Megaphone,
}

export default function Notifications() {
  const { inbox, unread, setNotice, markAllRead } = useSettings()

  return (
    <>
      <PageHeader
        title="Notifications"
        right={
          unread > 0 ? (
            <Button size="sm" variant="secondary" onClick={markAllRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {inbox.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <BellOff className="mx-auto size-8 text-muted" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">You are all caught up</p>
          <p className="mt-1 text-muted">New alerts about your trades and account show up here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {inbox.map((n) => {
            const Icon = icons[n.kind]
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setNotice(n.id, !n.read)}
                  aria-label={`${n.title}. ${n.body} ${n.read ? 'Read' : 'Unread'}. Tap to mark as ${n.read ? 'unread' : 'read'}.`}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2">
                    <Icon className="size-5 text-gold-text" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block ${n.read ? 'font-medium' : 'font-bold'}`}>{n.title}</span>
                    <span className="block text-sm text-muted">{n.body}</span>
                    <span className="mt-1 block text-xs text-muted">{formatWhen(n.at)}</span>
                  </span>
                  {!n.read && <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-gold" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        Choose which alerts you get in{' '}
        <Link to="/preferences" className="font-semibold text-gold-text hover:underline">
          Preferences
        </Link>
        .
      </p>
    </>
  )
}
