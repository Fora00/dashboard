import { useOnline } from '../lib/useOnline'

// `compact`: dot only (collapsed sidebar rail); the state stays readable to
// screen readers and as a tooltip.
export function OnlineBadge({ compact = false }: { compact?: boolean }) {
  const online = useOnline()
  const label = online ? 'Online' : 'Offline'
  return (
    <span
      title={compact ? label : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium ${compact ? 'p-2' : 'px-2.5 py-1'} ${
        online
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
      }`}
    >
      <span className={`size-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      {compact ? <span className="sr-only">{label}</span> : label}
    </span>
  )
}
