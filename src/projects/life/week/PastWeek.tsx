import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { Button } from '../../../components/Button'
import { EmptyState } from '../../../components/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { SkeletonList } from '../../../components/Skeleton'
import { useLateEdit } from '../lateEdit'
import { WeekBody } from './WeekBody'

const SUBTITLES = {
  open: 'Last week, until Tuesday: the Sunday check and check-ins still take answers. The rest is read-only.',
  exported: 'Last week. Exported, so read-only.',
  closed: 'Read-only.',
} as const

export function PastWeek({
  weekKeyValue,
  onBack,
  backLabel = '← History',
}: {
  weekKeyValue: string
  onBack: () => void
  backLabel?: string
}) {
  const late = useLateEdit(weekKeyValue)
  const weekRow = useLiveQuery(() => db.lifeWeeks.get(weekKeyValue).then((w) => w ?? null), [weekKeyValue])
  const entries = useLiveQuery(() => db.lifeEntries.where('week').equals(weekKeyValue).toArray(), [weekKeyValue])
  return (
    <div>
      <PageHeader emoji="🧭" title={`Week of ${weekKeyValue}`} subtitle={SUBTITLES[late]}>
        <Button variant="ghost" onClick={onBack}>
          {backLabel}
        </Button>
      </PageHeader>
      {weekRow === undefined || entries === undefined ? (
        <SkeletonList rows={4} rowClassName="h-16" />
      ) : !weekRow ? (
        <EmptyState emoji="🧭" title="Week not found" />
      ) : (
        <WeekBody
          key={weekKeyValue}
          week={weekKeyValue}
          plan={weekRow.plan}
          entries={entries}
          readOnly
          lateEdit={late === 'open'}
        />
      )}
    </div>
  )
}
