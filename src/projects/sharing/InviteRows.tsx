import { Button } from '../../components/Button'
import type { ProjectMeta } from '../../lib/projects'

function Label({ project, notice }: { project: ProjectMeta; notice: string | null }) {
  return (
    <span className="min-w-0 flex-1 truncate text-sm">
      {project.emoji} {project.name}
      {notice && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">{notice}</span>}
    </span>
  )
}

interface ProjectInviteRowProps {
  project: ProjectMeta
  notice: string | null
  busy: boolean
  armed: boolean
  onReset: () => void
  onInvite: () => void
}

export function ProjectInviteRow({ project: p, notice, busy, armed, onReset, onInvite }: ProjectInviteRowProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Label project={p} notice={notice} />
      <Button
        variant="ghost"
        disabled={busy}
        onClick={onReset}
        aria-label={`Reset ${p.name} invite link`}
        className={armed ? 'text-rose-600 dark:text-rose-400' : ''}
      >
        {armed ? 'Reset?' : '♻️'}
      </Button>
      <Button variant="ghost" disabled={busy} onClick={onInvite} aria-label={`Share ${p.name} invite link`}>
        🔗 Invite
      </Button>
    </div>
  )
}

export function PublicLinkRow({
  project: p,
  notice,
  onShare,
}: {
  project: ProjectMeta
  notice: string | null
  onShare: () => void
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Label project={p} notice={notice} />
      <Button variant="ghost" onClick={onShare} aria-label={`Share ${p.name} link`}>
        🔗 Link
      </Button>
    </div>
  )
}
