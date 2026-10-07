import { Ban, KeyRound, LogOut, Monitor, Smartphone } from 'lucide-react'
import { MenuList } from '../../components/MenuList'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Toggle } from '../../components/ui/Toggle'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { useToast } from '../../context/ToastContext'

export default function Security() {
  const { signOut } = useAuth()
  const { twoStep, update } = useSettings()
  const toast = useToast()

  return (
    <>
      <PageHeader title="Security" />

      <MenuList
        items={[
          { to: '/change-password', label: 'Change password', icon: KeyRound },
          { to: '/change-pin/transaction', label: 'Change transaction PIN', icon: Smartphone },
        ]}
      />

      <section className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Two-step verification</p>
          <p className="text-sm text-muted">Ask for a code from your email each time you log in.</p>
        </div>
        <Toggle
          checked={twoStep}
          label="Two-step verification"
          onChange={(on) => {
            update({ twoStep: on })
            toast.show(on ? 'Two-step verification is on' : 'Two-step verification is off')
          }}
        />
      </section>

      <section className="mt-6" aria-labelledby="devices">
        <h2 id="devices" className="mb-2 font-display text-base font-bold">
          Where you are logged in
        </h2>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
          <Monitor className="size-6 shrink-0 text-gold-text" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">This device</p>
            <p className="text-sm text-ok">Active now</p>
          </div>
        </div>
        <Button
          variant="secondary"
          full
          className="mt-3"
          icon={<LogOut className="size-[18px]" aria-hidden="true" />}
          onClick={() => {
            signOut()
            toast.show('You are logged out everywhere')
          }}
        >
          Log out of all devices
        </Button>
      </section>

      <section className="mt-8 rounded-2xl border border-bad/40 p-5">
        <h2 className="font-display text-lg font-bold">Freeze your account</h2>
        <p className="mt-1 text-muted">Think someone else has access? Freeze the account to stop all trades and withdrawals.</p>
        <Button to="/freeze" variant="danger" full className="mt-4" icon={<Ban className="size-[18px]" aria-hidden="true" />}>
          Freeze account
        </Button>
      </section>
    </>
  )
}
