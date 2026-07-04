import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { projects } from '../../lib/projects'
import { formatBytes } from '../../lib/format'
import { useOwner } from '../../lib/useOwner'
import { Card } from '../../components/Card'
import { IosInstallHint } from '../../components/IosInstallHint'

// Local calendar-day key, matching the Habits project's own day boundary
// ('YYYY-MM-DD' in device local time — see habits/habitStore.ts).
function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

// The dashboard home is itself the first "project": the entry point that
// surfaces every subproject and a live stat pulled from its data — an example
// of one project reading another project's data through the shared db.
export function Home() {
  const owner = useOwner()
  const visible = projects.filter((p) => !p.ownerOnly || owner)
  const fileStats = useLiveQuery(async () => {
    const files = await db.files.toArray()
    return {
      count: files.length,
      bytes: files.reduce((sum, f) => sum + f.size, 0),
    }
  })
  const shopStats = useLiveQuery(async () => {
    const open = await db.shopItems.where('done').equals(0).count()
    return { open }
  })
  const todoStats = useLiveQuery(async () => {
    const open = await db.todos.where('done').equals(0).count()
    return { open }
  })
  const habitStats = useLiveQuery(async () => {
    const habits = await db.habits.toArray()
    const active = habits.filter((h) => h.archivedAt === undefined)
    if (active.length === 0) return { remaining: 0 }
    const checksToday = await db.habitChecks.where('day').equals(todayKey()).toArray()
    const doneIds = new Set(checksToday.map((c) => c.habitId))
    return { remaining: active.filter((h) => !doneIds.has(h.id)).length }
  })

  const statFor = (id: string): string | null => {
    if (id === 'local-transfer' && fileStats) {
      return fileStats.count === 0
        ? 'No files yet'
        : `${fileStats.count} file${fileStats.count === 1 ? '' : 's'} · ${formatBytes(fileStats.bytes)}`
    }
    return null
  }

  // Small live counts shown as a pill on the tile; hidden entirely at zero.
  const badgeFor = (id: string): number | null => {
    if (id === 'shop-list') return shopStats && shopStats.open > 0 ? shopStats.open : null
    if (id === 'todo') return todoStats && todoStats.open > 0 ? todoStats.open : null
    if (id === 'habits') return habitStats && habitStats.remaining > 0 ? habitStats.remaining : null
    return null
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Everything lives on this device and works offline. Sign in to sync
        across devices.
      </p>
      <IosInstallHint />
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((p) => (
          <Link key={p.id} to={p.path} className="group">
            <Card className="h-full transition-colors group-hover:border-slate-400 group-active:bg-slate-100 dark:group-hover:border-slate-600 dark:group-active:bg-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xl">{p.emoji}</span>
                {p.status === 'planned' ? (
                  <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
                    planned
                  </span>
                ) : (
                  badgeFor(p.id) !== null && (
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                      {badgeFor(p.id)}
                    </span>
                  )
                )}
              </div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
              {statFor(p.id) && (
                <p className="mt-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">{statFor(p.id)}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
