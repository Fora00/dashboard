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

// vite-plugin-pwa runs in `registerType: 'autoUpdate'` mode: when a new
// service worker activates it reloads the page immediately with no prompt
// (see registerSW's default `onNeedReload` — `window.location.reload()`).
// We hook that same callback to leave a breadcrumb in localStorage, then
// reload as usual; on the next mount (post-reload) we show a small passive
// "app updated" toast so the swap isn't a silent surprise, and clear the flag
// so it only shows once.
export function UpdateToast() {
  const [visible, setVisible] = useState(false)

  useRegisterSW({
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
