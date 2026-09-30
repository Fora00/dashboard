import { LIFE_CAPS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { inputClass, newId, removeAt, removeBtnClass, updateAt, type CheckinRow } from './rows'

export function CheckinsSection({
  checkins,
  setCheckins,
}: {
  checkins: CheckinRow[]
  setCheckins: (v: CheckinRow[]) => void
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Check-ins</h2>
      <Card className="space-y-2">
        {checkins.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <input
              type="date"
              value={c.date}
              onChange={(e) => setCheckins(updateAt(checkins, i, { date: e.target.value }))}
              aria-label="Check-in date"
              className={`${inputClass} w-40`}
            />
            <input
              value={c.label}
              onChange={(e) => setCheckins(updateAt(checkins, i, { label: e.target.value }))}
              maxLength={LIFE_CAPS.checkinLabel}
              placeholder="Label…"
              aria-label="Check-in label"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => setCheckins(removeAt(checkins, i))}
              aria-label="Remove check-in"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {checkins.length < LIFE_CAPS.checkins && (
          <Button
            variant="ghost"
            onClick={() => setCheckins([...checkins, { id: newId(), date: '', label: '' }])}
          >
            + Add check-in
          </Button>
        )}
      </Card>
    </section>
  )
}
