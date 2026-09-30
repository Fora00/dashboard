import type { LifeFocus } from '../../../lib/db'
import { toggleFocus } from '../../../lib/lifeSync'
import { CollapsibleSection } from './CollapsibleSection'

export function FocusSection({
  week,
  focus,
  focusDone,
  open,
  onToggle,
  readOnly,
}: {
  week: string
  focus: LifeFocus[]
  focusDone: ReadonlySet<string>
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  return (
    <CollapsibleSection
      title="Focus"
      summary={`${focusDone.size}/${focus.length}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <ul className="space-y-2">
        {focus.map((f) => {
          const done = focusDone.has(f.id)
          return (
            <li key={f.id}>
              <button
                type="button"
                disabled={readOnly}
                aria-pressed={done}
                onClick={() => void toggleFocus(week, f.id)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors ${
                  readOnly ? '' : 'active:bg-slate-100 dark:active:bg-slate-800'
                } ${
                  done
                    ? 'border-emerald-400/60 bg-emerald-400/10'
                    : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600'
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-sm ${
                    done
                      ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                      : 'border-slate-400 dark:border-slate-500'
                  }`}
                >
                  {done && '✓'}
                </span>
                <span className={`min-w-0 flex-1 ${done ? 'text-slate-500 line-through' : ''}`}>{f.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </CollapsibleSection>
  )
}
