import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { formatBytes } from '../../lib/format'
import { projectUrl } from '../../lib/projectInvites'
import { shareOrCopy } from '../../lib/share'
import { projects, type ProjectMeta } from '../../lib/projects'
import { runSafe } from '../../lib/runSafe'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { ProjectIcon } from '../../components/ProjectIcon'
import { SectionTitle } from '../../components/SectionTitle'
import { FOCUS_RING } from '../../components/focus'

// Picker for the small self-contained tools (registry entries with `tool: true`).
// Each works offline and signed out, so the share button hands out the plain
// app link (no invite). Dexie only, no network.
const tools = projects.filter((p) => p.tool && p.status === 'live')

function useToolStat(id: string): string | null {
  const fileStats = useLiveQuery(async () => {
    if (id !== 'local-transfer') return null
    const files = await db.files.toArray()
    return { count: files.length, bytes: files.reduce((sum, f) => sum + f.size, 0) }
  }, [id])
  if (!fileStats) return null
  return fileStats.count === 0 ? 'Nessun file' : `${fileStats.count} file · ${formatBytes(fileStats.bytes)}`
}

function ToolCard({ tool }: { tool: ProjectMeta }) {
  const stat = useToolStat(tool.id)
  const [notice, setNotice] = useState<string | null>(null)

  async function share() {
    const outcome = await shareOrCopy(`${tool.emoji} ${tool.name}: ${projectUrl(tool.path)}`)
    if (outcome === 'copied') setNotice('Link copiato')
    else if (outcome === 'shared') setNotice('Condiviso')
    else setNotice(null)
  }

  return (
    <Card className="flex flex-col gap-3">
      <Link to={tool.path} className={`-m-1 flex items-start gap-3 rounded-lg p-1 ${FOCUS_RING}`}>
        <ProjectIcon project={tool} />
        <span className="min-w-0">
          <span className="block font-medium">{tool.name}</span>
          <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{tool.description}</span>
          {stat && <span className="mt-2 block text-xs font-medium text-(--accent-border)">{stat}</span>}
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => void runSafe(share)()}>
          Condividi link
        </Button>
        <span role="status" className="text-xs text-slate-500 dark:text-slate-400">
          {notice}
        </span>
      </div>
    </Card>
  )
}

export function Strumenti() {
  return (
    <div>
      <PageHeader
        emoji="🧰"
        title="Strumenti"
        subtitle="Piccoli strumenti: funzionano offline e senza account. Condividi il link con chi vuoi."
      />
      <SectionTitle>Strumenti</SectionTitle>
      <div className="flex flex-col gap-3">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </div>
  )
}
