import { ArrowLeftRight, Search, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { Logo } from '../../components/Logo'
import { Card } from '../../components/ui/Card'
import { developer } from '../../data/mock'

const steps = [
  { icon: Search, title: 'Find an offer', text: 'Browse offers from other people and pick the rate you like.' },
  { icon: ArrowLeftRight, title: 'Trade directly', text: 'Buy or sell USDT with the person you chose, with no middleman setting the price.' },
  { icon: ShieldCheck, title: 'Stay protected', text: 'Verify your identity, use a PIN for every payment, and freeze your account if something feels wrong.' },
]

const stack = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router']

export default function About() {
  return (
    <>
      <PageHeader title="About Pexora" />
      <div className="flex flex-col items-center py-4 text-center">
        <Logo />
        <p className="mt-4 max-w-xs text-lg">A peer-to-peer exchange where people trade directly with each other.</p>
        <p className="num mt-2 text-sm text-muted">Version 1.0.0</p>
      </div>

      <section aria-labelledby="how">
        <h2 id="how" className="mb-3 font-display text-lg font-bold tracking-tight">
          How it works
        </h2>
        <ol className="space-y-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <Icon className="mt-0.5 size-6 shrink-0 text-gold-text" aria-hidden="true" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Card className="mt-8">
        <h2 className="font-display text-lg font-bold tracking-tight">A portfolio project</h2>
        <p className="mt-2 text-muted">
          Pexora is a demo built by {developer.name} to show frontend work. No real money moves, and everything you do stays in your
          own browser.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
          {stack.map((s) => (
            <li key={s} className="rounded-full border border-line px-3 py-1 text-sm font-medium">
              {s}
            </li>
          ))}
        </ul>
        <a
          href={developer.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-semibold text-gold-text hover:underline"
        >
          See more on GitHub
        </a>
      </Card>
    </>
  )
}
