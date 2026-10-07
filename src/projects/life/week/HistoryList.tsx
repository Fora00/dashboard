import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import type { LifeEntry, LifeWeek } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'
import { summarizeWeek } from '../model'
import { ProgressChart } from './ProgressChart'
import { WeekRecap } from './WeekRecap'

export function HistoryList({
  weeks,
  currentWeek,
  onBack,
  onOpen,
}: {
  weeks: LifeWeek[] | undefined
  currentWeek: string
  onBack: () => void
  onOpen: (week: string) => void
}) {
  const entries = useLiveQuery(() => db.lifeEntries.toArray())
  const past = weeks?.filter((w) => w.week !== currentWeek) ?? []
  return (
    <div>
      <PageHeader emoji="🧭" title="History" subtitle="Past weeks, newest first.">
        <Button variant="ghost" onClick={onBack}>
          ← This week
        </Button>
      </PageHeader>
      {weeks === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : past.length === 0 ? (
        <EmptyState emoji="🗓️" title="No past weeks yet" hint="Imported weeks show up here once a new week starts." />
      ) : (
        <>
          {entries && weeks && <ProgressChart weeks={weeks} entries={entries} currentWeek={currentWeek} />}
          <ul className="space-y-2">
            {past.map((w) => (
              <li key={w.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => onOpen(w.week)}
                  className="flex min-h-12 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left text-sm transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
                >
                  <span className="font-medium">Week of {w.week}</span>
                  <span aria-hidden className="text-slate-400">
                    ›
                  </span>
                </button>
                {entries && <WeekRecapRow week={w} entries={entries} />}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function WeekRecapRow({ week, entries }: { week: LifeWeek; entries: LifeEntry[] }) {
  const { plan } = week
  const summary = summarizeWeek(plan, entries)
  return (
    <WeekRecap
      title=""
      focus={[summary.focusDone.size, plan.focus.length]}
      trackers={summary.trackers}
      checkins={[summary.checkins.filter((c) => c.done).length, summary.checkins.length]}
      tasks={[plan.tasks.filter((t) => summary.sentTaskIds.has(t.id)).length, plan.tasks.length]}
    />
  )
}
