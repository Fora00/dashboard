import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useSearchParams } from 'react-router-dom'
import { db } from '../../lib/db'
import { sync } from '../../lib/lifeSync'
import { weekKey } from './model'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { SkeletonList } from '../../components/Skeleton'
import { HistoryList } from './week/HistoryList'
import { PastWeek } from './week/PastWeek'
import { WeekBody } from './week/WeekBody'

// Week screen for the Life project (spec: docs/HANDOFF-life.md). Local-first:
// reads db.lifeWeeks / db.lifeEntries directly via useLiveQuery, works fully
// offline and signed out. Mutations go through src/lib/lifeSync.ts only. The
// page shell lives here; everything below it is in ./week/.

type View = { tab: 'week' } | { tab: 'history' } | { tab: 'past'; week: string }

export function Life() {
  const week = weekKey()
  const [view, setView] = useState<View>({ tab: 'week' })
  const [searchParams, setSearchParams] = useSearchParams()

  // Things appends `?x-things-ids=<JSON array>` to the xSuccess return URL
  // (see lifeReturnUrl in model.ts) — strip it once so the address bar stays
  // clean. `replace: true` so it doesn't leave an extra history entry.
  useEffect(() => {
    if (!searchParams.has('x-things-ids')) return
    const next = new URLSearchParams(searchParams)
    next.delete('x-things-ids')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // .get() resolves to undefined both while still loading and when no row
  // exists — map "no row" to null so `weekRow === undefined` means loading
  // and `weekRow === null` unambiguously means "no plan yet".
  const weekRow = useLiveQuery(() => db.lifeWeeks.get(week).then((w) => w ?? null), [week])
  const entries = useLiveQuery(() => db.lifeEntries.where('week').equals(week).toArray(), [week])
  const pastWeeks = useLiveQuery(() => db.lifeWeeks.orderBy('id').reverse().toArray())

  if (view.tab === 'history') {
    return (
      <HistoryList
        weeks={pastWeeks}
        currentWeek={week}
        onBack={() => setView({ tab: 'week' })}
        onOpen={(w) => setView({ tab: 'past', week: w })}
      />
    )
  }

  if (view.tab === 'past') {
    return <PastWeek weekKeyValue={view.week} onBack={() => setView({ tab: 'history' })} />
  }

  const header = (
    <PageHeader emoji="🧭" title="Life" subtitle="This week: focus, habits, Sunday check. Owner only.">
      <div className="flex flex-wrap gap-2">
        <Link to="/life/import">
          <Button variant="ghost">Import</Button>
        </Link>
        <Link to={`/life/edit?week=${week}`}>
          <Button variant="ghost">Edit week</Button>
        </Link>
        <Button variant="ghost" onClick={() => setView({ tab: 'history' })}>
          History
        </Button>
      </div>
    </PageHeader>
  )

  if (weekRow === undefined || entries === undefined) {
    return (
      <div>
        {header}
        <SkeletonList rows={4} rowClassName="h-16" />
      </div>
    )
  }

  if (!weekRow) {
    return (
      <div>
        {header}
        <EmptyState
          emoji="🧭"
          title="No plan for this week"
          hint="Import this week's plan to get started — paste JSON or open an import link from your Mac."
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/life/import">
            <Button>Import week</Button>
          </Link>
          <Link to="/life/edit">
            <Button variant="ghost">Create by hand</Button>
          </Link>
        </div>
        <div className="mt-6">
          <SyncCard sync={sync} />
        </div>
      </div>
    )
  }

  return (
    <div>
      {header}
      <WeekBody week={week} plan={weekRow.plan} entries={entries} readOnly={false} />
      <div className="mt-6">
        <SyncCard sync={sync} />
      </div>
    </div>
  )
}
