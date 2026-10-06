import { useEffect, useState } from 'react'
import { Button } from './Button'

const DISMISS_KEY = 'dashboard.ios-install-hint-dismissed'

// Safari private mode / "block all cookies" makes localStorage access THROW
// rather than return null or silently no-op — this runs on the home page,
// so an unguarded call here would white-screen the app's entry point.
function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function storeDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {
    // Storage blocked — the dismissal just won't survive a reload this session.
  }
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const iOSDevice = /iphone|ipad|ipod/i.test(ua)
  // iPadOS 13+ identifies as "Macintosh" but has touch support, unlike a Mac.
  const iPadOS13 = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iOSDevice || iPadOS13
}

function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent)
}

// Chrome/Edge on Android fire this once the app is installable, often before
// the home page mounts — so it is captured at module load, not in an effect.
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
let deferredPrompt: InstallPromptEvent | null = null
const promptListeners = new Set<() => void>()
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as InstallPromptEvent
    promptListeners.forEach((l) => l())
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    promptListeners.forEach((l) => l())
  })
}

function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}

// One-time dismissible tip: the PWA is the intended experience — full-screen,
// no browser chrome. iOS Safari: Share → Add to Home Screen. Android: a real
// Install button when Chrome offers one, otherwise a browser-menu hint.
// Hidden entirely once installed, or once dismissed (persisted in localStorage).
export function InstallHint() {
  const [dismissed, setDismissed] = useState(() => readDismissed())
  const [eligible, setEligible] = useState<'ios' | 'android' | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    if (isStandalone()) return setEligible(null)
    setEligible(isIosSafari() ? 'ios' : isAndroid() ? 'android' : null)
    const rerender = () => setTick((n) => n + 1)
    promptListeners.add(rerender)
    return () => {
      promptListeners.delete(rerender)
    }
  }, [])

  if (dismissed || !eligible) return null

  function dismiss() {
    storeDismissed()
    setDismissed(true)
  }

  async function install() {
    const ev = deferredPrompt
    if (!ev) return
    deferredPrompt = null
    await ev.prompt()
    const { outcome } = await ev.userChoice
    if (outcome === 'accepted') dismiss()
    else setTick((n) => n + 1)
  }

  const canPrompt = eligible === 'android' && deferredPrompt !== null
  const strong = 'font-medium text-slate-600 dark:text-slate-300'

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <span className="text-xl">{eligible === 'ios' ? '⬆️' : '📲'}</span>
      <div className="flex-1 text-sm">
        <p className="font-medium text-slate-800 dark:text-slate-200">Install this app</p>
        <p className="mt-0.5 text-slate-500 dark:text-slate-400">
          {eligible === 'ios' ? (
            <>
              Tap <span className={strong}>Share</span>, then <span className={strong}>Add to Home Screen</span> for the
              full-screen app experience.
            </>
          ) : canPrompt ? (
            <>Add it to your home screen for the full-screen app experience.</>
          ) : (
            <>
              Open the browser menu <span className={strong}>⋮</span>, then <span className={strong}>Install app</span>{' '}
              (or Add to Home screen).
            </>
          )}
        </p>
        {canPrompt && (
          <Button className="mt-2" onClick={() => void install()}>
            Install
          </Button>
        )}
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
