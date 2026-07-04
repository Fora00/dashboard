import { useOnline } from '../lib/useOnline'

export function OnlineBadge() {
  const online = useOnline()
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        online
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-amber-500/10 text-amber-400'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-amber-400'}`}
      />
      {online ? 'Online' : 'Offline'}
    </span>
  )
}
