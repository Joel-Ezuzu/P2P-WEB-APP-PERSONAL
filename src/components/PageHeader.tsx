import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

interface PageHeaderProps {
  title: string
  back?: boolean
  right?: ReactNode
  /** Replaces the default "go to the previous page" behaviour. */
  onBack?: () => void
}

export function PageHeader({ title, back = true, right, onBack }: PageHeaderProps) {
  const navigate = useNavigate()
  usePageTitle(title)

  return (
    <header className="mb-6 flex h-11 items-center gap-3">
      {back && (
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Go back"
          className="grid size-10 place-items-center rounded-xl border border-line bg-surface transition-colors hover:border-gold-text"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
      )}
      <h1 className="flex-1 truncate font-display text-xl font-bold tracking-tight">{title}</h1>
      {right}
    </header>
  )
}
