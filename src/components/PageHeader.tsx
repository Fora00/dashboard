import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  emoji: string
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHeader({ emoji, title, subtitle, children }: Props) {
  return (
    <div className="mb-6">
      <Link to="/" className="mb-3 inline-block text-sm text-slate-400 hover:text-slate-200">
        ← All projects
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="mr-2">{emoji}</span>
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
