import type { ReactNode } from 'react'

/** Header button (▸/▾ + title + collapsed summary) wrapping a section's
 * content. In read-only history, always expanded with a plain header and no
 * persistence — see useSections.ts. */
export function CollapsibleSection({
  title,
  summary,
  open,
  onToggle,
  readOnly,
  children,
}: {
  title: string
  summary?: string
  open: boolean
  onToggle: () => void
  readOnly: boolean
  children: ReactNode
}) {
  if (readOnly) {
    return (
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h2>
        {children}
      </section>
    )
  }
  return (
    <section className="mb-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          <span className="truncate">{title}</span>
          <span className="flex shrink-0 items-center gap-2">
            {!open && summary && (
              <span className="truncate text-xs font-normal text-slate-500 dark:text-slate-400">{summary}</span>
            )}
            <span aria-hidden>{open ? '▾' : '▸'}</span>
          </span>
        </button>
        {open && <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">{children}</div>}
      </div>
    </section>
  )
}
