/// <reference types="vite-plugin-pwa/react" />
import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATED_FLAG = 'dashboard.sw-updated'

// Safari private mode / "block all cookies" makes localStorage access THROW
// rather than silently no-op. This component is mounted in Layout on every
// route, so an unguarded call here would white-screen the whole app.
function markUpdated(): void {
  try {
    localStorage.setItem(UPDATED_FLAG, '1')
  } catch {
    // Storage blocked — the post-reload toast just won't show this time.
  }
}

function consumeUpdatedFlag(): boolean {
  try {
    if (localStorage.getItem(UPDATED_FLAG) !== '1') return false
    localStorage.removeItem(UPDATED_FLAG)
    return true
  } catch {
    return false
  }
}

// vite-plugin-pwa runs in `registerType: 'prompt'` mode: a new service worker
// installs and then WAITS. We never reload on our own (an auto-reload could
// throw away a half-typed form); `needRefresh` shows a dismissible toast and
// only a tap on "Update" sends skipWaiting. Once the new worker takes control,
// registerSW calls `onNeedReload` — we leave a localStorage breadcrumb and
// reload; on the next mount (post-reload) a small passive "App updated" toast
// shows once and clears the flag.
export function UpdateToast() {
  const [visible, setVisible] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onNeedReload() {
      markUpdated()
      window.location.reload()
    },
  })

  useEffect(() => {
    if (!consumeUpdatedFlag()) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (needRefresh) {
    return (
      <div
        className="fixed inset-x-0 z-30 flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        <div
          role="status"
          className="flex items-center gap-1 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
        >
          <span className="min-w-0">New version available</span>
          <button
            type="button"
            onClick={() => void updateServiceWorker(true)}
            className="min-h-10 shrink-0 rounded-full px-3 font-semibold text-indigo-600 transition-colors hover:text-indigo-500 active:bg-slate-100 dark:text-indigo-300 dark:hover:text-indigo-200 dark:active:bg-slate-700"
          >
            Tap to update
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setNeedRefresh(false)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-slate-700 active:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:active:bg-slate-700"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    )
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 z-20 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
    >
      <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
        App updated ✓
      </div>
    </div>
  )
}
