import type { ReactNode } from 'react'

/** The small grey section heading used above cards. Keep the heading level via `as`. */
export function SectionTitle({ as: Tag = 'h2', children }: { as?: 'h2' | 'h3'; children: ReactNode }) {
  return <Tag className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{children}</Tag>
}
