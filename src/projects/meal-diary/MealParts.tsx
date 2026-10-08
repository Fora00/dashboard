import type { MealEntry } from '../../lib/db'
import { Button } from '../../components/Button'
import { MACRO_EMOJI, dayTotals } from './nutrition'

export function DayTotalsLine({ entries }: { entries: MealEntry[] }) {
  const t = dayTotals(entries)
  if (t.counted === 0) return null
  return (
    <p
      className="text-xs text-slate-500 dark:text-slate-400"
      title={`${t.approximate ? 'About ' : ''}${t.kcal} kcal · ${t.proteinG} g protein · ${t.carbsG} g carbs · ${t.fatG} g fat${t.uncounted > 0 ? ` · ${t.uncounted} entries without values` : ''}`}
    >
      {MACRO_EMOJI.kcal} {t.approximate ? '≈ ' : ''}
      {t.kcal} · {MACRO_EMOJI.proteinG} {t.proteinG} · {MACRO_EMOJI.carbsG} {t.carbsG} · {MACRO_EMOJI.fatG} {t.fatG}
      {t.uncounted > 0 && ` · ❔ ${t.uncounted}`}
    </p>
  )
}

// ⚖️ weighed on a scale vs 👁️ by eye: a hint for the AI estimate, which trusts a
// written quantity when weighed and applies the owner's habits when not.
export function WeighedToggle({ weighed, onChange }: { weighed: boolean; onChange: (next: boolean) => void }) {
  const label = weighed ? 'Weighed on a scale (tap for by eye)' : 'By eye (tap for weighed)'
  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={weighed}
      aria-label={label}
      title={label}
      onClick={() => onChange(!weighed)}
      className="min-w-10 px-2"
    >
      {weighed ? '⚖️' : '👁️'}
    </Button>
  )
}
