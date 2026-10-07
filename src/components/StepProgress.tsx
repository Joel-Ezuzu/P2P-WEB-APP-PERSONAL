export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-gold' : 'bg-surface-2'}`} />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">
        Step {step} of {total}
      </p>
    </div>
  )
}
