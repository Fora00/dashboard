import type { HTMLAttributes } from 'react'
import { FOCUS_RING } from './focus'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  // Only a focusable / clickable card gets a keyboard focus ring.
  const interactive = rest.onClick !== undefined || rest.tabIndex !== undefined
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/50 ${
        interactive ? FOCUS_RING : ''
      } ${className}`}
      {...rest}
    />
  )
}
