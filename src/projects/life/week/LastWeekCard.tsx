import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { useLateEdit } from '../lateEdit'
import { addDays, summarizeWeek } from '../model'

/**
 * On Monday and Tuesday, a shortcut to last week while its Sunday check and
 * check-ins still take answers (lateEdit.ts). Hidden once the window closes,
 * when last week has nothing to answer, or when it has no plan here.
 */
export function LastWeekCard({ week, onOpen }: { week: string; onOpen: (week: string) => void }) {
  const prevWeek = addDays(week, -7)
  const late = useLateEdit(prevWeek)
  const open = late === 'open'
  const data = useLiveQuery(async () => {
    if (!open) return null
    const [row, entries] = await Promise.all([
      db.lifeWeeks.get(prevWeek),
      db.lifeEntries.where('week').equals(prevWeek).toArray(),
    ])
    return row ? { plan: row.plan, entries } : null
  }, [open, prevWeek])
  const summary = useMemo(() => (data ? summarizeWeek(data.plan, data.entries) : null), [data])

  if (!open || !data || !summary) return null
  const questions = data.plan.sundayCheck.length
  const checkins = summary.checkins.length
  if (questions === 0 && checkins === 0) return null
  const parts: string[] = []
  if (questions > 0) parts.push(`Sunday check ${summary.answers.size}/${questions} answered`)
  if (checkins > 0) parts.push(`check-ins ${summary.checkins.filter((c) => c.done).length}/${checkins} done`)

  return (
    <Card className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Last week, until Tuesday</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{parts.join(' · ')}</p>
      </div>
      <Button variant="ghost" onClick={() => onOpen(prevWeek)}>
        Answer last week
      </Button>
    </Card>
  )
}
