import { useEffect, useId, useMemo, useState } from 'react'
import { ImagePlus } from 'lucide-react'

interface FilePickerProps {
  label: string
  hint?: string
  file: File | null
  onFile: (file: File | null) => void
  error?: string
  /** Opens the front camera on phones. */
  selfie?: boolean
}

const MAX_BYTES = 5 * 1024 * 1024

export function FilePicker({ label, hint, file, onFile, error, selfie = false }: FilePickerProps) {
  const id = useId()
  const [problem, setProblem] = useState('')

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function onChange(picked: File | undefined) {
    if (!picked) return
    if (!picked.type.startsWith('image/')) return setProblem('Choose a photo (JPG or PNG).')
    if (picked.size > MAX_BYTES) return setProblem('That photo is over 5 MB. Choose a smaller one.')
    setProblem('')
    onFile(picked)
  }

  const message = problem || error

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-surface text-center transition-colors focus-within:border-gold-text hover:border-gold-text ${
          message ? 'border-bad' : 'border-line'
        } ${preview ? 'p-2' : 'px-4 py-8'}`}
      >
        {preview ? (
          <img src={preview} alt={`Your ${label.toLowerCase()}`} className="max-h-52 rounded-xl object-contain" />
        ) : (
          <>
            <ImagePlus className="size-8 text-gold-text" aria-hidden="true" />
            <span className="font-semibold">Tap to add a photo</span>
            {hint && <span className="text-sm text-muted">{hint}</span>}
          </>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          capture={selfie ? 'user' : undefined}
          className="sr-only"
          onChange={(e) => {
            onChange(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </label>
      {file && (
        <p className="mt-1.5 flex items-center justify-between gap-3 text-sm text-muted">
          <span className="truncate">{file.name}</span>
          <button type="button" onClick={() => onFile(null)} className="shrink-0 font-semibold text-gold-text hover:underline">
            Remove
          </button>
        </p>
      )}
      {message && <p className="mt-1.5 text-sm text-bad">{message}</p>}
    </div>
  )
}
