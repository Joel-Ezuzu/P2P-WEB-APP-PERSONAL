import { PageHeader } from '../../components/PageHeader'
import { Segmented } from '../../components/ui/Segmented'
import { Toggle } from '../../components/ui/Toggle'
import { useSettings } from '../../context/SettingsContext'
import type { Settings } from '../../context/SettingsContext'
import { useTheme } from '../../context/ThemeContext'
import type { Theme } from '../../context/ThemeContext'

function ToggleRow({ title, text, checked, onChange }: { title: string; text: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <li className="flex items-center gap-4 px-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted">{text}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </li>
  )
}

export default function Preferences() {
  const { theme, setTheme } = useTheme()
  const { displayCurrency, hideBalance, notify, update } = useSettings()

  const setNotify = (key: keyof Settings['notify']) => (on: boolean) => update({ notify: { ...notify, [key]: on } })

  return (
    <>
      <PageHeader title="Preferences" />

      <section aria-labelledby="look">
        <h2 id="look" className="mb-2 font-display text-base font-bold">
          Appearance
        </h2>
        <Segmented<Theme>
          label="Colour mode"
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'dark', label: 'Black and gold' },
            { value: 'light', label: 'White and gold' },
          ]}
        />
      </section>

      <section className="mt-7" aria-labelledby="money">
        <h2 id="money" className="mb-2 font-display text-base font-bold">
          Show my total balance in
        </h2>
        <Segmented<Settings['displayCurrency']>
          label="Balance currency"
          value={displayCurrency}
          onChange={(v) => update({ displayCurrency: v })}
          options={[
            { value: 'USD', label: 'US dollars' },
            { value: 'NGN', label: 'Naira' },
          ]}
        />
        <ul className="mt-3 rounded-2xl border border-line bg-surface">
          <ToggleRow
            title="Hide balance when I open the app"
            text="Tap the eye on Home to show it."
            checked={hideBalance}
            onChange={(on) => update({ hideBalance: on })}
          />
        </ul>
      </section>

      <section className="mt-7" aria-labelledby="alerts">
        <h2 id="alerts" className="mb-2 font-display text-base font-bold">
          Alerts
        </h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          <ToggleRow title="Trade updates" text="When an order starts or finishes." checked={notify.trades} onChange={setNotify('trades')} />
          <ToggleRow title="Transfers" text="When money is sent or arrives." checked={notify.transfers} onChange={setNotify('transfers')} />
          <ToggleRow title="Tips and offers" text="Market news and product updates." checked={notify.promos} onChange={setNotify('promos')} />
        </ul>
        <p className="mt-3 text-sm text-muted">Security alerts are always on.</p>
      </section>
    </>
  )
}
