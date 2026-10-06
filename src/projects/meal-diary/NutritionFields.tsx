import type { NutritionField, NutritionForm } from './nutrition'

// The optional nutrition inputs of an entry, shown when editing it (to correct
// the AI estimate from /meal-reconcile by hand). State is raw strings so an
// empty field stays empty (= null).

const FIELDS: { key: NutritionField; label: string; unit: string }[] = [
  { key: 'grams', label: '⚖️ Grams', unit: 'g' },
  { key: 'kcal', label: '🔥 Calories', unit: 'kcal' },
  { key: 'proteinG', label: '🥩 Protein', unit: 'g' },
  { key: 'carbsG', label: '🍞 Carbs', unit: 'g' },
  { key: 'fatG', label: '🥑 Fat', unit: 'g' },
]

const BOX =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800'

interface Props {
  value: NutritionForm
  onChange: (next: NutritionForm) => void
}

export function NutritionFields({ value, onChange }: Props) {
  function edit(key: NutritionField, raw: string) {
    // Typing a value yourself makes it yours again: no longer an estimate.
    onChange({ ...value, [key]: raw, estimated: key === 'grams' ? value.estimated : false })
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {FIELDS.map((f) => (
        <label key={f.key} title={`${f.label.slice(3)} (${f.unit})`} className="min-w-0 text-xs text-slate-500 dark:text-slate-400">
          {f.label}
          <input
            value={value[f.key]}
            onChange={(e) => edit(f.key, e.target.value.replace(/[^\d.,]/g, ''))}
            inputMode="numeric"
            placeholder={f.unit}
            autoComplete="off"
            className={`${BOX} mt-0.5 text-center`}
          />
        </label>
      ))}
    </div>
  )
}
