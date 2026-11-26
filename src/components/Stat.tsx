import type { ReactNode } from 'react'

/** A figure tile. `children` (optional) goes under the sub line, e.g. a goal bar. */
export function Stat({
  label,
  value,
  sub,
  children,
}: {
  label: string
  value: string
  sub?: string | undefined
  children?: ReactNode
}) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
      {children}
    </div>
  )
}
