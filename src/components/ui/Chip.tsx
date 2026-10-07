import type { ReactNode } from 'react'

interface ChipProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
        selected
          ? 'border-gold bg-gold text-on-gold'
          : 'border-line bg-surface text-fg hover:border-gold-text'
      }`}
    >
      {children}
    </button>
  )
}
