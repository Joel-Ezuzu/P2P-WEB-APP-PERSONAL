import { useCallback, useEffect, useRef, useState } from 'react'
import { Delete } from 'lucide-react'

interface PinPadProps {
  length?: number
  onComplete: (pin: string) => void
  error?: string
  disabled?: boolean
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export function PinPad({ length = 4, onComplete, error, disabled = false }: PinPadProps) {
  const [pin, setPin] = useState('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const press = useCallback(
    (digit: string) => {
      if (disabled || pin.length >= length) return
      const next = pin + digit
      setPin(next)
      if (next.length === length) {
        // A short pause lets the last dot fill before the result comes back.
        timer.current = window.setTimeout(() => {
          onComplete(next)
          setPin('')
        }, 180)
      }
    },
    [disabled, length, onComplete, pin],
  )

  const erase = useCallback(() => {
    if (!disabled) setPin((p) => p.slice(0, -1))
  }, [disabled])

  // Desktop keyboards work too.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') press(e.key)
      else if (e.key === 'Backspace') erase()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press, erase])

  const key =
    'grid h-14 place-items-center rounded-2xl border border-line bg-surface font-display text-xl font-bold transition-colors hover:border-gold-text active:bg-surface-2 disabled:opacity-50'

  return (
    <div>
      <div
        role="img"
        aria-label={`${pin.length} of ${length} digits entered`}
        className="mb-2 flex justify-center gap-4"
      >
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            className={`size-4 rounded-full border-2 transition-colors ${
              i < pin.length ? 'border-gold-text bg-gold' : error ? 'border-bad' : 'border-line'
            }`}
          />
        ))}
      </div>
      <p role="alert" className="mb-4 min-h-5 text-center text-sm text-bad">
        {error}
      </p>
      <div className="mx-auto grid max-w-72 grid-cols-3 gap-3">
        {digits.map((d) => (
          <button key={d} type="button" disabled={disabled} onClick={() => press(d)} aria-label={`Digit ${d}`} className={key}>
            {d}
          </button>
        ))}
        <span aria-hidden="true" />
        <button type="button" disabled={disabled} onClick={() => press('0')} aria-label="Digit 0" className={key}>
          0
        </button>
        <button type="button" disabled={disabled} onClick={erase} aria-label="Delete last digit" className={key}>
          <Delete className="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
