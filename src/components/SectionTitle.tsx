import type { ReactNode } from 'react'

/** SectionTitle's classes, for markup built outside React. */
export const SECTION_TITLE = 'mb-2 text-sm font-medium text-slate-500 dark:text-slate-400'

/** The small grey section heading used above cards. Keep the heading level via `as`. */
export function SectionTitle({ as: Tag = 'h2', children }: { as?: 'h2' | 'h3'; children: ReactNode }) {
  return <Tag className={SECTION_TITLE}>{children}</Tag>
}
