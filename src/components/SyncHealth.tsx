import { Link } from 'react-router-dom'
import { useSyncIssues } from '../lib/syncHealth'

// Slim strip mounted in Layout next to OfflineBanner. Renders nothing while
// every sync engine is healthy; otherwise names the project and links to it
// (its SyncCard offers Retry / Discard for rejected changes).
export function SyncHealth() {
  const issues = useSyncIssues()
  const first = issues[0]
  if (!first) return null
  const error = first.severity === 'error'
  return (
    <div
      role="status"
      className={`border-b px-4 py-2 text-center text-xs font-medium ${
        error
          ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300'
          : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
      }`}
    >
      ⚠️{' '}
      <Link to={first.path} className="underline underline-offset-2">
        {first.label}
      </Link>
      : {first.message}
      {issues.length > 1 && ` (+${issues.length - 1} more)`}
    </div>
  )
}
