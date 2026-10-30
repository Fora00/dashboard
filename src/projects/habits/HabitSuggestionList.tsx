import { Button } from '../../components/Button'
import type { Suggestion } from './habitSuggestions'

interface Props {
  suggestions: readonly Suggestion[]
  onApply?: (s: Suggestion) => void
  title?: string
}

/** A few quiet, rule-based tips with an optional one-tap fix. */
export function HabitSuggestionList({ suggestions, onApply, title = '💡 Suggestions' }: Props) {
  if (suggestions.length === 0) return null
  return (
    <section aria-label="Suggestions" className="rounded-xl border border-sky-300/50 bg-sky-300/5 p-3 text-sm">
      <h3 className="font-medium">{title}</h3>
      <ul className="mt-2 space-y-2">
        {suggestions.map((s) => (
          <li key={s.id} className="space-y-1.5">
            <p className="text-slate-700 dark:text-slate-300">{s.text}</p>
            {s.action && onApply && (
              <Button variant="ghost" className="min-h-9" onClick={() => onApply(s)}>
                {s.action.label}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
