import type { ReactNode } from 'react'

/**
 * A tiny keyboard-key chip, e.g. the "/" hint inside a search field. Only
 * shown from lg up and only with a fine pointer (a mouse/trackpad, so a
 * keyboard is likely at hand); never on phones or touch tablets.
 */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-slate-300 bg-slate-100 px-1.5 font-mono text-xs leading-5 text-slate-500 lg:pointer-fine:inline-block dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
    >
      {children}
    </kbd>
  )
}
