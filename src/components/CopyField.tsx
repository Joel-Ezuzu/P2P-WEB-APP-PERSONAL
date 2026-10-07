import { Copy } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export function CopyField({ label, value }: { label: string; value: string }) {
  const toast = useToast()

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      toast.show(`${label} copied`)
    } catch {
      toast.show('Could not copy. Select the text and copy it yourself.', 'error')
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">{label}</p>
        <p className="num break-all font-semibold">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 transition-colors hover:border-gold-text"
      >
        <Copy className="size-[18px]" aria-hidden="true" />
      </button>
    </div>
  )
}
