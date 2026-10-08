import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useProjectAccent } from '../lib/useProjectAccent'

interface Props {
  emoji: string
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHeader({ emoji, title, subtitle, children }: Props) {
  // Accent marker only on project pages; join pages keep the plain title.
  const accent = useProjectAccent()
  return (
    <div className="mb-6">
      <Link
        to="/"
        className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← All projects
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {accent && (
              <span
                aria-hidden="true"
                className="mr-2.5 inline-block h-6 w-1 rounded-full align-[-0.2em]"
                style={{ backgroundImage: 'linear-gradient(180deg, var(--accent), var(--accent-2))' }}
              />
            )}
            <span className="mr-2">{emoji}</span>
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
