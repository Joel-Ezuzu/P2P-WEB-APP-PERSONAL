import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CircleHelp,
  FileText,
  Info,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserPen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useMarket } from '../../context/MarketContext'
import { useToast } from '../../context/ToastContext'
import { ngnCompact } from '../../lib/format'

interface Row {
  to: string
  label: string
  icon: LucideIcon
  value?: string
}

function Group({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="mt-7" aria-label={title}>
      <h2 className="mb-2 font-display text-base font-bold">{title}</h2>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {rows.map(({ to, label, icon: Icon, value }) => (
          <li key={to}>
            <Link to={to} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2">
              <Icon className="size-5 shrink-0 text-gold-text" aria-hidden="true" />
              <span className="flex-1 font-medium">{label}</span>
              {value && <span className="text-sm text-muted">{value}</span>}
              <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const { orders } = useMarket()
  const toast = useToast()
  if (!user) return null

  const volume = orders.reduce((sum, o) => sum + o.ngn, 0)

  return (
    <>
      <PageHeader
        title="Profile"
        back={false}
        right={
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid size-10 place-items-center rounded-xl border border-line bg-surface transition-colors hover:border-gold-text"
          >
            <Settings className="size-5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="flex flex-col items-center text-center">
        <Avatar name={user.nickname} className="size-20 text-3xl" />
        <p className="mt-3 font-display text-2xl font-extrabold tracking-tight">{user.nickname}</p>
        <p className="text-muted">{user.email}</p>
        <p
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
            user.kycVerified ? 'border-gold-text text-gold-text' : 'border-line text-muted'
          }`}
        >
          {user.kycVerified ? (
            <>
              <BadgeCheck className="size-4" aria-hidden="true" />
              Identity verified
            </>
          ) : (
            'Identity not verified'
          )}
        </p>
      </div>

      {!user.kycVerified && (
        <div className="mt-6 rounded-2xl bg-gold p-5 text-on-gold">
          <p className="font-display text-lg font-bold">Verify your identity</p>
          <p className="mt-1 opacity-80">It takes about two minutes and shows other traders that you are real.</p>
          <Link
            to="/kyc"
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-on-gold px-5 font-semibold text-gold"
          >
            Start verification
          </Link>
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <dt className="text-sm text-muted">Trades</dt>
          <dd className="num mt-1 font-display text-2xl font-bold">{orders.length}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <dt className="text-sm text-muted">Total traded</dt>
          <dd className="num mt-1 font-display text-2xl font-bold">{ngnCompact(volume)}</dd>
        </div>
      </dl>

      <Group
        title="Account"
        rows={[
          { to: '/update-nickname', label: 'Nickname', icon: UserPen, value: user.nickname },
          { to: '/kyc', label: 'Identity verification', icon: ShieldCheck, value: user.kycVerified ? 'Verified' : 'Not done' },
          { to: '/statements', label: 'Statements', icon: FileText },
        ]}
      />
      <Group
        title="Settings"
        rows={[
          { to: '/security', label: 'Security', icon: Lock },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/preferences', label: 'Preferences', icon: SlidersHorizontal },
        ]}
      />
      <Group
        title="Support"
        rows={[
          { to: '/help', label: 'Help center', icon: CircleHelp },
          { to: '/about', label: 'About Pexora', icon: Info },
        ]}
      />

      <Button
        variant="danger"
        size="lg"
        full
        className="mt-8"
        icon={<LogOut className="size-5" aria-hidden="true" />}
        onClick={() => {
          signOut()
          toast.show('You are logged out')
        }}
      >
        Log out
      </Button>
    </>
  )
}
