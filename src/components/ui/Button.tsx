import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  variant?: Variant
  size?: Size
  full?: boolean
  icon?: ReactNode
  /** Renders a link instead of a button. */
  to?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-gold text-on-gold hover:brightness-105 active:brightness-95',
  secondary: 'border border-line bg-surface-2 text-fg hover:border-gold-text',
  ghost: 'text-fg hover:bg-surface-2',
  danger: 'border border-bad text-bad hover:bg-bad/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-14 px-6 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  icon,
  to,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], sizes[size], full ? 'w-full' : '', className].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  )
}
