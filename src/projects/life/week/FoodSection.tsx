import type { MealsWeek } from '../model'
import { addDays } from '../model/dates.ts'
import { CollapsibleSection } from './CollapsibleSection'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// The week's meal-diary totals, read-only (the diary is where you edit them).
// Shown for the current week and in History. Nothing renders without entries.
export function FoodSection({
  week,
  food,
  open,
  onToggle,
  readOnly,
}: {
  week: string
  food: MealsWeek
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  if (food.days.length === 0) return null
  const a = food.average
  const approx = food.approximate ? '≈ ' : ''
  const summary = a
    ? `${approx}${a.kcal} kcal/day · ${food.loggedDays} day${food.loggedDays === 1 ? '' : 's'}`
    : 'no values entered'
  return (
    <CollapsibleSection title="🍽️ Food" summary={summary} open={open} onToggle={onToggle} readOnly={readOnly}>
      {a && (
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
          Average per logged day: {approx}
          <span className="font-medium text-slate-800 dark:text-slate-100">{a.kcal} kcal</span> · P {a.proteinG} · C{' '}
          {a.carbsG} · F {a.fatG}
        </p>
      )}
      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {food.days.map((d) => {
          const t = d.totals
          const idx = Array.from({ length: 7 }, (_, i) => addDays(week, i)).indexOf(d.day)
          return (
            <li key={d.day} className="flex flex-wrap justify-between gap-x-3">
              <span>{WEEKDAYS[idx] ?? d.day}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {t.counted
                  ? `${t.approximate ? '≈ ' : ''}${t.kcal} kcal · P ${t.proteinG} · C ${t.carbsG} · F ${t.fatG}`
                  : `${d.entries.length} entr${d.entries.length === 1 ? 'y' : 'ies'}, no values`}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">From the Meal Diary; edit entries there.</p>
    </CollapsibleSection>
  )
}
