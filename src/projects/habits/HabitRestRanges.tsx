import { useState } from 'react'
import { confirm } from '../../lib/confirm'
import { DATE, SELECT } from '../../components/field'
import { db, type Habit } from '../../lib/db'
import { Button } from '../../components/Button'
import { daysInRange, MAX_REST_RANGE, setRestRange } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { shiftDayKey } from './habitStats'
import { REST_REASONS } from './habitStates'

/** Vacation (in the quick sheet, M2): one habit, every day from X to Y becomes
 *  a rest day with a reason (default 🏖 Vacation), whatever it held before.
 *  Future days allowed. Compact: from, to, reason, one button. A day set by
 *  mistake is cleared from the page's calendar. */
export function HabitRestRanges({ habit, today }: { habit: Habit; today: string }) {
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(shiftDayKey(today, 6))
  const [reason, setReason] = useState<string>('vacation')
  const days = from && to ? daysInRange(from, to) : []
  const tooLong = from && to && days.length > MAX_REST_RANGE
  const valid = days.length > 0 && !tooLong
  async function apply() {
    if (!valid) return
    // Only stored checks count: a habit to avoid shows a derived "kept" on days with nothing saved.
    const stored = await db.habitChecks
      .where('[habitId+day]')
      .between([habit.id, days[0]!], [habit.id, days[days.length - 1]!], true, true)
      .filter((c) => c.status !== 'skip')
      .count()
    if (
      stored > 0 &&
      !(await confirm({
        title: 'Anche questi giorni a riposo?',
        body: `${stored} giorn${stored === 1 ? 'o' : 'i'} nel periodo hanno già uno stato.`,
        confirmLabel: 'Metti a riposo',
      }))
    )
      return
    void runSafe(setRestRange, 'Could not save')(habit.id, from, to, reason)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-500">
          Dal
          <input type="date" className={DATE} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-xs text-slate-500">
          Al
          <input type="date" className={DATE} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <label className="block text-xs text-slate-500">
        Motivo
        <select className={SELECT} value={reason} onChange={(e) => setReason(e.target.value)}>
          {REST_REASONS.map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Button type="button" className="w-full" disabled={!valid} onClick={() => void apply()}>
        {valid ? `Metti ${days.length} giorn${days.length === 1 ? 'o' : 'i'} a riposo` : 'Metti a riposo'}
      </Button>
      <p className="text-xs text-slate-500">
        {tooLong
          ? `Al massimo ${MAX_REST_RANGE} giorni alla volta.`
          : 'I giorni di riposo non rompono la serie. Vanno bene anche giorni futuri.'}
      </p>
    </div>
  )
}
