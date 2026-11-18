import type { ReactNode } from 'react'
import { Button } from '../../../components/Button'
import { FOCUS_RING } from '../../../components/focus'

/** The tap-to-flip card shared by the module flashcards and the vocabulary deck. */
export function FlipCard({
  onFlip,
  label,
  tag,
  children,
}: {
  onFlip: () => void
  label: string
  tag: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={label}
      className={`flex min-h-48 w-full flex-col justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-left dark:border-slate-700 dark:bg-slate-800/50 ${FOCUS_RING}`}
    >
      <span className="text-xs font-semibold tracking-wide text-(color:--accent-border) uppercase">{tag}</span>
      {children}
    </button>
  )
}

/** "Lo so" / "Da ripassare" under a flipped card; the hint shows while it is face-up. */
export function FlipActions({
  flipped,
  hint,
  onKnown,
  onLater,
}: {
  flipped: boolean
  hint: string
  onKnown: () => void
  onLater: () => void
}) {
  return flipped ? (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onKnown}>Lo so</Button>
      <Button variant="ghost" onClick={onLater}>
        Da ripassare
      </Button>
    </div>
  ) : (
    <p className="text-sm text-slate-500">{hint}</p>
  )
}
