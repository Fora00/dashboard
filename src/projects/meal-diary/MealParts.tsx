import { useState } from 'react'
import type { MealEntry } from '../../lib/db'
import { Button } from '../../components/Button'
import { MACRO_EMOJI, dayTotals } from './nutrition'
import { MOODS } from './mood'

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

// Optional mood, 1-5. Empty (😶) means "not entered", i.e. indifferent; tapping
// the chosen face again clears it. The faces open in a small row under the button.
export function MoodPicker({
  mood,
  onChange,
}: {
  mood: number | null | undefined
  onChange: (next: number | null) => void
}) {
  const [open, setOpen] = useState(false)
  const current = MOODS.find((m) => m.value === mood)
  const label = current ? `Mood: ${current.label} (tap to change)` : 'Add a mood (optional)'
  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen(!open)}
        className="min-w-10 px-2"
      >
        {current ? current.face : '😶'}
      </Button>
      {open && (
        <div
          role="group"
          aria-label="Mood"
          className="absolute right-0 top-full z-10 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {MOODS.map((m) => (
            <Button
              key={m.value}
              type="button"
              variant={mood === m.value ? 'primary' : 'ghost'}
              aria-pressed={mood === m.value}
              aria-label={m.label}
              title={m.label}
              onClick={() => {
                onChange(mood === m.value ? null : m.value)
                setOpen(false)
              }}
              className="min-w-10 px-2 text-lg"
            >
              {m.face}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
