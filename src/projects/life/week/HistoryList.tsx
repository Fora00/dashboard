import type { LifeWeek } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'

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
        <ul className="space-y-2">
          {past.map((w) => (
            <li key={w.id}>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
