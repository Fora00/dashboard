import { useEffect, useState } from 'react'
import { subscribeFlash } from '../lib/runSafe'

// Short error toast for runSafe() failures — same visual family as
// UpdateToast / Snackbar. Mounted once in Layout.
export function ErrorFlash() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => subscribeFlash(setMessage), [])
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 4000)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null
  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
    >
      <div
        role="alert"
        className="flex items-center gap-1 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-rose-600 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-rose-400 dark:ring-slate-700"
      >
        <span className="min-w-0">{message}</span>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setMessage(null)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  )
}
