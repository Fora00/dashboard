import { useSyncExternalStore } from 'react'

// Tailwind `lg` (the shell's sidebar breakpoint, docs/ARCHITECTURE.md): from
// here Events is master-detail. Width only, no device sniffing; resizing a
// window or Stage Manager flips it live.
const LG = '(min-width: 1024px)'

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mq = window.matchMedia(LG)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const snapshot = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(LG).matches : false)

/** True at >= lg (1024px): filters rail + list + detail panel. */
export function useWide(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
