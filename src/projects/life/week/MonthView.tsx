import { useState } from 'react'
import type { LifeWeek } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'
import { recapMonths } from './monthRecap'
import { RecapItems } from './RecapSection'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthName(m: string): string {
  return `${MONTHS[Number(m.slice(5, 7)) - 1] ?? m} ${m.slice(0, 4)}`
}

/** Read-only month view: the recap as it stood at the end of a month, and the
 * monthly question. Reads the same `plan.recap` as the week card; nothing is
 * stored here (the decision lives in Notion and Things). */
export function MonthView({ weeks, onBack }: { weeks: LifeWeek[] | undefined; onBack: () => void }) {
  const months = weeks ? recapMonths(weeks) : []
  const [picked, setPicked] = useState<string | null>(null)
  const idx = months.findIndex((m) => m.month === picked)
  const at = idx >= 0 ? idx : months.length - 1
  const cur = months[at]

  return (
    <div>
      <PageHeader emoji="🧭" title="Month" subtitle="How the month went, to decide go up, stay or go down.">
        <Button variant="ghost" onClick={onBack}>
          ← This week
        </Button>
      </PageHeader>
      {weeks === undefined ? (
        <SkeletonList rows={3} rowClassName="h-24" />
      ) : !cur ? (
        <EmptyState
          emoji="🔎"
          title="No recap yet"
          hint="Once an imported week carries a recap, its month shows up here."
        />
      ) : (
        <div className="max-w-xl space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" disabled={at === 0} onClick={() => setPicked(months[at - 1]!.month)}>
              ‹
            </Button>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{monthName(cur.month)}</p>
            <Button
              variant="ghost"
              disabled={at === months.length - 1}
              onClick={() => setPicked(months[at + 1]!.month)}
            >
              ›
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">From the week of {cur.week}.</p>
          <RecapItems week={cur.week} items={cur.items} />
          <Card className="space-y-1 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-100">Go up, stay, or go down?</p>
            <p className="text-slate-600 dark:text-slate-300">
              {cur.items.filter((i) => i.criterion && !i.closed).length > 0
                ? 'Look at the criteria above, then decide. Nothing is saved here.'
                : 'No criteria this month. Nothing is saved here.'}
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
