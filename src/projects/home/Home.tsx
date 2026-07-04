import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { projects } from '../../lib/projects'
import { formatBytes } from '../../lib/format'
import { Card } from '../../components/Card'

// The dashboard home is itself the first "project": the entry point that
// surfaces every subproject and a live stat pulled from its data — an example
// of one project reading another project's data through the shared db.
export function Home() {
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

  const statFor = (id: string): string | null => {
    if (id === 'local-transfer' && fileStats) {
      return fileStats.count === 0
        ? 'No files yet'
        : `${fileStats.count} file${fileStats.count === 1 ? '' : 's'} · ${formatBytes(fileStats.bytes)}`
    }
    if (id === 'shop-list' && shopStats) {
      return shopStats.open === 0 ? null : `${shopStats.open} items to buy`
    }
    return null
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="mb-6 text-sm text-slate-400">
        Everything lives on this device and works offline. Cloud sync coming soon.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} to={p.path} className="group">
            <Card className="h-full transition-colors group-hover:border-slate-600 group-active:bg-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xl">{p.emoji}</span>
                {p.status === 'planned' && (
                  <span className="rounded-full bg-slate-700/60 px-2.5 py-1 text-xs text-slate-400">
                    planned
                  </span>
                )}
              </div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{p.description}</p>
              {statFor(p.id) && (
                <p className="mt-3 text-xs font-medium text-indigo-400">{statFor(p.id)}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
