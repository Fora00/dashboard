import type { LifeFocus } from '../../../lib/db'
import { toggleFocus, toggleFocusCancelled } from '../../../lib/lifeSync'
import { CollapsibleSection } from './CollapsibleSection'
import { runSafe } from '../../../lib/runSafe'

export function FocusSection({
  week,
  focus,
  focusDone,
  focusCancelled,
  focusTotal,
  open,
  onToggle,
  readOnly,
}: {
  week: string
  focus: LifeFocus[]
  focusDone: ReadonlySet<string>
  focusCancelled: ReadonlySet<string>
  focusTotal: number
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  return (
    <CollapsibleSection
      title="Focus"
      summary={`${focusDone.size}/${focusTotal}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <ul className="space-y-2">
        {focus.map((f) => {
          const done = focusDone.has(f.id)
          const cancelled = focusCancelled.has(f.id)
          return (
            <li key={f.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={readOnly || cancelled}
                aria-pressed={done}
                onClick={() => void runSafe(toggleFocus, 'Could not save')(week, f.id)}
                className={`flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors ${
                  readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
                } ${
                  cancelled
                    ? 'border-slate-300/60 bg-transparent opacity-60 dark:border-slate-700'
                    : done
                      ? 'border-emerald-400/60 bg-emerald-400/10'
                      : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                    cancelled
                      ? 'border-slate-400 text-slate-500 dark:border-slate-600'
                      : done
                        ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                        : 'border-slate-400 dark:border-slate-500'
                  }`}
                >
                  {cancelled ? '✕' : done && '✓'}
                </span>
                <span className={`min-w-0 flex-1 ${done || cancelled ? 'text-slate-500 line-through' : ''}`}>
                  {f.title}
                </span>
              </button>
              {!readOnly && (
                <button
                  type="button"
                  aria-label={cancelled ? `Restore focus: ${f.title}` : `Cancel focus: ${f.title}`}
                  onClick={() => void runSafe(toggleFocusCancelled, 'Could not save')(week, f.id)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {cancelled ? '↺' : '✕'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </CollapsibleSection>
  )
}
