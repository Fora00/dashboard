import { setTrackerEnergy } from '../../../lib/lifeSync'
import type { LifeTrackerEntry } from '../../../lib/db'
import { Button } from '../../../components/Button'

const SCALE5 = [1, 2, 3, 4, 5]

export function EnergyPicker({ entry, onDone }: { entry: LifeTrackerEntry; onDone: () => void }) {
  return (
    <div className="space-y-2 border-t border-slate-200 pt-2 dark:border-slate-800">
      <EnergyScale
        label="Energy before"
        value={entry.value.energyBefore}
        onPick={(n) => void setTrackerEnergy(entry, { energyBefore: n })}
      />
      <EnergyScale
        label="Energy after"
        value={entry.value.energyAfter}
        onPick={(n) => void setTrackerEnergy(entry, { energyAfter: n })}
      />
      <div className="flex justify-end">
        <Button variant="ghost" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}

export function EnergyScale({
  label,
  value,
  onPick,
}: {
  label?: string
  value: number | undefined
  onPick: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="w-28 shrink-0 text-xs text-slate-500 dark:text-slate-400">{label}</span>}
      <div className="flex gap-1">
        {SCALE5.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            aria-pressed={value === n}
            aria-label={label ? `${label}: ${n} of 5` : `${n} of 5`}
            className={`flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
              value === n
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
