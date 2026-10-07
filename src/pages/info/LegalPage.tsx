import { PageHeader } from '../../components/PageHeader'

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader title={title} />
      <p className="text-sm text-muted">Last updated {updated}</p>
      <p className="mt-3">{intro}</p>
      <div className="mt-6 space-y-6">
        {sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`s${i}`}>
            <h2 id={`s${i}`} className="font-display text-lg font-bold tracking-tight">
              {i + 1}. {s.heading}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-2 text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
