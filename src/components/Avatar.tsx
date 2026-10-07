export function Avatar({ name, className = 'size-10' }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-line bg-surface-2 font-display font-bold text-gold-text ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
