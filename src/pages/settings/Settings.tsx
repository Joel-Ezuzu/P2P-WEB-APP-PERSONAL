import { useState } from 'react'
import { Bell, FileText, Info, Lock, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { MenuList } from '../../components/MenuList'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'

const KEYS = ['pexora-wallet-v2', 'pexora-market-v2', 'pexora-settings-v1']

export default function Settings() {
  const [sure, setSure] = useState(false)

  function reset() {
    if (!sure) {
      setSure(true)
      return
    }
    try {
      KEYS.forEach((k) => localStorage.removeItem(k))
    } catch {
      // Nothing to clear if storage is blocked.
    }
    window.location.assign('/')
  }

  return (
    <>
      <PageHeader title="Settings" />
      <MenuList
        items={[
          { to: '/security', label: 'Security', icon: Lock },
          { to: '/notifications', label: 'Notifications', icon: Bell },
          { to: '/preferences', label: 'Preferences', icon: SlidersHorizontal },
        ]}
      />
      <MenuList
        title="About"
        items={[
          { to: '/about', label: 'About Pexora', icon: Info },
          { to: '/terms', label: 'Terms of service', icon: FileText },
          { to: '/privacy', label: 'Privacy policy', icon: ShieldCheck },
        ]}
      />

      <section className="mt-8 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-bold">Demo data</h2>
        <p className="mt-1 text-muted">
          Balances, trades and settings are saved in this browser. Reset them to start the demo again. You stay logged in.
        </p>
        <Button
          variant={sure ? 'danger' : 'secondary'}
          full
          className="mt-4"
          icon={<RotateCcw className="size-[18px]" aria-hidden="true" />}
          onClick={reset}
          onBlur={() => setSure(false)}
        >
          {sure ? 'Tap again to reset everything' : 'Reset demo data'}
        </Button>
      </section>
    </>
  )
}
