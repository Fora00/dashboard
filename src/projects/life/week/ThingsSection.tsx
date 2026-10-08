import { useMemo, useState } from 'react'
import type { LifeEntry, LifePlan } from '../../../lib/db'
import { markTasksSent } from '../../../lib/lifeSync'
import { formatLastSent, lastSentInfo } from '../format'
import { buildThingsUrl, canReturnFromThings, isIosLike, lifeReturnUrl, type WeekSummary } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { CollapsibleSection } from './CollapsibleSection'
import { runSafe } from '../../../lib/runSafe'

export function ThingsSection({
  week,
  plan,
  entries,
  summary,
  open,
  onToggle,
}: {
  week: string
  plan: LifePlan
  entries: LifeEntry[]
  summary: WeekSummary
  open: boolean
  onToggle: () => void
}) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const unsent = plan.tasks.filter((t) => !summary.sentTaskIds.has(t.id))
  const sent = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id))
  const lastSent = useMemo(() => lastSentInfo(entries), [entries])

  function toggleSelected(id: string) {
    setSelectedTaskIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // x-success only works on the Mac: an https link opened from another app
  // on iOS goes to Safari, never back into the installed PWA (see
  // canReturnFromThings in model.ts).
  const thingsOpts = canReturnFromThings() ? { xSuccess: lifeReturnUrl() } : {}

  // Mark sent BEFORE opening Things: on iOS the PWA can be suspended the
  // moment Things opens, so a write after the navigation may never land and
  // a second tap would duplicate every to-do.
  async function sendAll() {
    if (unsent.length === 0) return
    await markTasksSent(
      week,
      unsent.map((t) => t.id),
      true,
    )
    window.location.href = buildThingsUrl(unsent, thingsOpts)
  }

  // Records the resend time too (before navigating, same reason as above):
  // the Things status check finds each batch by its send time.
  async function resendSelected() {
    const tasks = plan.tasks.filter((t) => selectedTaskIds.has(t.id))
    if (tasks.length === 0) return
    await markTasksSent(
      week,
      tasks.map((t) => t.id),
      true,
    )
    setSelectedTaskIds(new Set())
    window.location.href = buildThingsUrl(tasks, thingsOpts)
  }

  return (
    <CollapsibleSection
      title="Things"
      summary={`Things · ${sent.length} of ${plan.tasks.length} sent`}
      open={open}
      onToggle={onToggle}
      readOnly={false}
    >
      <Card className="space-y-3 text-sm">
        {unsent.length > 0 ? (
          <>
            <Button onClick={() => void runSafe(sendAll, 'Could not send')()}>
              Send {unsent.length} task{unsent.length === 1 ? '' : 's'} to Things
            </Button>
            {isIosLike() && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                After Things opens, tap ◀ Dashboard at the top-left to come back.
              </p>
            )}
            <ul className="space-y-1 border-t border-slate-200 pt-2 dark:border-slate-800">
              {unsent.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{t.when ?? '—'}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">All tasks sent.</p>
        )}
        {lastSent && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last sent {formatLastSent(lastSent.at)} · {lastSent.count} task{lastSent.count === 1 ? '' : 's'}
          </p>
        )}
        {sent.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <ul className="space-y-1.5">
              {sent.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selectedTaskIds.has(t.id)}
                    aria-label={`Select ${t.title}`}
                    onClick={() => toggleSelected(t.id)}
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm ${
                      selectedTaskIds.has(t.id)
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {selectedTaskIds.has(t.id) && '✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `things:///search?query=${encodeURIComponent(t.title)}`
                    }}
                    className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="min-w-0 flex-1 truncate">{t.title}</span>
                    <span aria-hidden className="shrink-0 text-slate-400">
                      ↗
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              disabled={selectedTaskIds.size === 0}
              onClick={() => void runSafe(resendSelected, 'Could not send')()}
            >
              Resend selected
            </Button>
          </div>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Requires Things → Settings → General → Enable Things URLs.
        </p>
      </Card>
    </CollapsibleSection>
  )
}
