import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'
import { WeekBody } from './WeekBody'

export function PastWeek({ weekKeyValue, onBack }: { weekKeyValue: string; onBack: () => void }) {
  const weekRow = useLiveQuery(() => db.lifeWeeks.get(weekKeyValue).then((w) => w ?? null), [weekKeyValue])
  const entries = useLiveQuery(() => db.lifeEntries.where('week').equals(weekKeyValue).toArray(), [weekKeyValue])
  return (
    <div>
      <PageHeader emoji="🧭" title={`Week of ${weekKeyValue}`} subtitle="Read-only.">
        <Button variant="ghost" onClick={onBack}>
          ← History
        </Button>
      </PageHeader>
      {weekRow === undefined || entries === undefined ? (
        <SkeletonList rows={4} rowClassName="h-16" />
      ) : !weekRow ? (
        <EmptyState emoji="🧭" title="Week not found" />
      ) : (
        <WeekBody key={weekKeyValue} week={weekKeyValue} plan={weekRow.plan} entries={entries} readOnly />
      )}
    </div>
  )
}
