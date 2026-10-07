import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', value, maxLength, ...rest }: TextareaProps) {
  const id = useId()
  const length = typeof value === 'string' ? value.length : 0

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={5}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full resize-none rounded-xl border bg-surface px-3.5 py-3 text-base outline-none placeholder:text-muted focus:border-gold-text ${
          error ? 'border-bad' : 'border-line'
        }`}
        {...rest}
      />
      <div className="mt-1.5 flex justify-between gap-3 text-sm">
        {error ? (
          <p id={`${id}-error`} className="text-bad">
            {error}
          </p>
        ) : (
          <p className="text-muted">{hint}</p>
        )}
        {maxLength && (
          <p className="num shrink-0 text-muted">
            {length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
