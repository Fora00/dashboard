import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card'
import { today, useQueue } from './useQueue'

export function ReviewHomeCard() {
  const [day] = useState(today)
  const q = useQueue(day)
  const n = q?.items.length ?? 0
  return (
    <Link to="ripasso" className="block rounded-xl focus-visible:outline-none">
      <Card className="flex items-center gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <span className="text-2xl" aria-hidden>
          🔁
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium">Ripasso</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {!q
              ? '…'
              : n > 0
                ? `${n} da ripassare oggi`
                : q.doneToday > 0
                  ? `Fatto per oggi (${q.doneToday})`
                  : 'Niente da ripassare oggi'}
          </p>
        </div>
        {n > 0 && (
          <span className="rounded-full bg-(color:--accent) px-2.5 py-0.5 text-sm font-semibold text-(color:--accent-fg) tabular-nums">
            {n}
          </span>
        )}
      </Card>
    </Link>
  )
}
