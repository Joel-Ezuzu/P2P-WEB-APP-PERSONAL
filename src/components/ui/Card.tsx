import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'plain' | 'gold'
}

export function Card({ tone = 'plain', className = '', ...rest }: CardProps) {
  const look =
    tone === 'gold'
      ? 'bg-gold text-on-gold'
      : 'border border-line bg-surface'
  return <div className={`rounded-2xl p-5 ${look} ${className}`} {...rest} />
}
