import { useOnline } from '../lib/useOnline'

// Slim, full-width strip mounted once in Layout — the single place that
// tells the user "you're offline but it's fine". Per-page copy should not
// repeat this; pages can add page-specific offline notes on top if they say
// something this banner doesn't (e.g. local-transfer's upload-pending state).
export function OfflineBanner() {
  const online = useOnline()
  if (online) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
      Offline — changes are saved on this device and sync when you're back.
    </div>
  )
}
