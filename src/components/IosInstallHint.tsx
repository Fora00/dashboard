import { useEffect, useState } from 'react'

const DISMISS_KEY = 'dashboard.ios-install-hint-dismissed'

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const iOSDevice = /iphone|ipad|ipod/i.test(ua)
  // iPadOS 13+ identifies as "Macintosh" but has touch support, unlike a Mac.
  const iPadOS13 = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iOSDevice || iPadOS13
}

function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}

// One-time dismissible tip for iOS Safari visitors: the PWA (installed via
// Share → Add to Home Screen) is the intended experience — notifications,
// full-screen, no browser chrome. Hidden entirely once installed, or once
// dismissed (persisted in localStorage).
export function IosInstallHint() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    setEligible(isIosSafari() && !isStandalone())
  }, [])

  if (dismissed || !eligible) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <span className="text-xl">⬆️</span>
      <div className="flex-1 text-sm">
        <p className="font-medium text-slate-800 dark:text-slate-200">Install this app</p>
        <p className="mt-0.5 text-slate-500 dark:text-slate-400">
          Tap <span className="font-medium text-slate-600 dark:text-slate-300">Share</span>, then{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">Add to Home Screen</span> for the
          full-screen app experience.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install hint"
        className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
      >
        ✕
      </button>
    </div>
  )
}
