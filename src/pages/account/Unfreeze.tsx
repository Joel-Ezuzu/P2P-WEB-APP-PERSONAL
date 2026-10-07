import { ShieldCheck, Snowflake } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useSettings } from '../../context/SettingsContext'

export default function Unfreeze() {
  const { frozen } = useSettings()

  if (!frozen) {
    return (
      <>
        <PageHeader title="Unfreeze account" />
        <Card>
          <ShieldCheck className="size-8 text-ok" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">Your account is active</p>
          <p className="mt-1.5 text-muted">Nothing is frozen, so there is nothing to unfreeze.</p>
          <Button to="/" variant="secondary" className="mt-5">
            Back to home
          </Button>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Unfreeze account" />
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-line bg-surface">
          <Snowflake className="size-8 text-gold-text" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">Your account is frozen</h2>
        <p className="mx-auto mt-2 max-w-xs text-muted">
          To start trading again, we need to check that it is really you. It takes two quick steps.
        </p>
      </div>
      <ol className="mt-8 space-y-3">
        <li className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-on-gold">1</span>
          Enter the code we email you.
        </li>
        <li className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-on-gold">2</span>
          Enter your transaction PIN.
        </li>
      </ol>
      <Button to="/verify-identity" size="lg" full className="mt-8">
        Verify it's me
      </Button>
    </>
  )
}
