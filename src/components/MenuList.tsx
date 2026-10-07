import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface MenuItem {
  to: string
  label: string
  icon: LucideIcon
  value?: string
}

export function MenuList({ title, items }: { title?: string; items: MenuItem[] }) {
  return (
    <section className="mt-6" aria-label={title}>
      {title && <h2 className="mb-2 font-display text-base font-bold">{title}</h2>}
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map(({ to, label, icon: Icon, value }) => (
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
