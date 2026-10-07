import type { ReactNode } from 'react'
import { Snowflake } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { PageHeader } from './PageHeader'
import { Button } from './ui/Button'

/** Shows the page only while the account is active. */
export function FrozenGate({ children }: { children: ReactNode }) {
  const { frozen } = useSettings()
  if (!frozen) return <>{children}</>

  return (
    <>
      <PageHeader title="Account frozen" />
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <Snowflake className="mx-auto size-10 text-gold-text" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-bold">Your account is frozen</h2>
        <p className="mt-2 text-muted">
          You can't trade, send, swap or withdraw money until you unfreeze it. Your balances are safe.
        </p>
        <div className="mt-6 grid gap-3">
          <Button to="/unfreeze" size="lg" full>
            Unfreeze account
          </Button>
          <Button to="/" variant="ghost" full>
            Back to home
          </Button>
        </div>
      </div>
    </>
  )
}
