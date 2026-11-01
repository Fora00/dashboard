import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeEngine } from '../../../lib/db'
import { saveEngineIceberg, setEngineLead, setEngineScore } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { Sheet } from '../../../components/Sheet'
import { FOCUS_RING_FIELD, FOCUS_RING_INSET } from '../../../components/focus'
import {
  ENGINES,
  ENGINE_SCORE_MAX,
  ENGINE_SCORE_MIN,
  ICEBERG_LAYERS,
  LIFE_CAPS,
  TREND_ARROW,
  emptyEngine,
  engineTrend,
  habitsByEngine,
  icebergCounts,
  stepScore,
  type EngineKey,
  type IcebergInput,
} from '../model'

const FIELD = `w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800 ${FOCUS_RING_FIELD}`
const ICON_BTN = `flex size-10 shrink-0 items-center justify-center rounded-lg text-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600 ${FOCUS_RING_INSET}`

/**
 * Life Engines for the picked month: seven cards with a 1-10 score stepper,
 * last month's score and trend, and the lead toggle (at most one lead per
 * month: setting one clears the other). Tapping an engine opens its iceberg.
 * Local-first: Dexie only, synced by lifeSync.ts when signed in.
 */
export function EnginesSection({
  month,
  prevMonth,
  prevLabel,
}: {
  month: string
  prevMonth: string
  prevLabel: string
}) {
  const rows = useLiveQuery(() => db.lifeEngines.where('month').equals(month).toArray(), [month])
  const prevRows = useLiveQuery(() => db.lifeEngines.where('month').equals(prevMonth).toArray(), [prevMonth])
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const [open, setOpen] = useState<EngineKey | null>(null)
  if (!rows || !prevRows) return null
  const tagged = habitsByEngine(habits ?? [])
  const byKey = new Map(rows.map((r) => [r.engine, r]))
  const prevByKey = new Map(prevRows.map((r) => [r.engine, r]))
  const openLabel = ENGINES.find((e) => e.key === open)?.label ?? ''

  return (
    <Card className="space-y-2" aria-label="Life Engines">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Engines</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Score each area 1–10, pick one lead (★). Tap an engine for its iceberg.
        </p>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {ENGINES.map((e) => {
          const row = byKey.get(e.key)
          const score = row?.score ?? null
          const before = prevByKey.get(e.key)?.score ?? null
          const trend = engineTrend(score, before)
          const counts = row ? icebergCounts(row) : null
          const nHabits = tagged.get(e.key)?.length ?? 0
          const filled = counts ? counts.layers + counts.whys + (counts.hasLever ? 1 : 0) : 0
          const sub = [
            before === null ? `${prevLabel} –` : `${prevLabel} ${before}${trend ? ` ${TREND_ARROW[trend]}` : ''}`,
            counts && filled > 0 ? `iceberg ${counts.layers}/${ICEBERG_LAYERS.length}` : '',
            row?.lever.trim() ? 'lever set' : '',
            nHabits ? `${nHabits} habit${nHabits === 1 ? '' : 's'}` : '',
          ].filter(Boolean)
          return (
            <li key={e.key} className="flex items-center gap-1 py-1">
              <button
                type="button"
                onClick={() => setOpen(e.key)}
                aria-label={`${e.label} iceberg`}
                className={`flex min-h-12 min-w-0 flex-1 flex-col justify-center rounded-lg px-2 text-left hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-700/60 dark:active:bg-slate-600 ${FOCUS_RING_INSET}`}
              >
                <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{e.label}</span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">{sub.join(' · ')}</span>
              </button>
              <div role="group" aria-label={`${e.label} score`} className="flex items-center">
                <button
                  type="button"
                  aria-label={`Lower ${e.label} score`}
                  disabled={score === ENGINE_SCORE_MIN}
                  onClick={() =>
                    void runSafe(setEngineScore, 'Could not save the score')(month, e.key, stepScore(score, -1))
                  }
                  className={ICON_BTN}
                >
                  −
                </button>
                <span
                  data-testid={`engine-score-${e.key}`}
                  className="w-7 text-center text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100"
                >
                  {score ?? '–'}
                </span>
                <button
                  type="button"
                  aria-label={`Raise ${e.label} score`}
                  disabled={score === ENGINE_SCORE_MAX}
                  onClick={() =>
                    void runSafe(setEngineScore, 'Could not save the score')(month, e.key, stepScore(score, 1))
                  }
                  className={ICON_BTN}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                aria-pressed={row?.lead === true}
                aria-label={`Lead: ${e.label}`}
                onClick={() =>
                  void runSafe(setEngineLead, 'Could not save the lead')(month, e.key, !(row?.lead === true))
                }
                className={ICON_BTN}
              >
                {row?.lead ? <span className="text-amber-500 dark:text-amber-400">★</span> : '☆'}
              </button>
            </li>
          )
        })}
      </ul>
      {open && (
        <IcebergSheet
          key={`${month}:${open}`}
          month={month}
          label={openLabel}
          row={byKey.get(open) ?? emptyEngine(month, open, 0)}
          habits={tagged.get(open) ?? []}
          onDone={() => setOpen(null)}
        />
      )}
    </Card>
  )
}

/** The iceberg of one engine: four layers, up to three whys, one lever, an
 *  optional link. Edits a draft; saved when the sheet closes (Done, ✕, Esc or
 *  a backdrop tap), so nothing typed is lost. */
function IcebergSheet({
  month,
  label,
  row,
  habits,
  onDone,
}: {
  month: string
  label: string
  row: LifeEngine
  /** Names of the live habits tagged with this engine (read-only). */
  habits: readonly string[]
  onDone: () => void
}) {
  const [draft, setDraft] = useState<IcebergInput>(() => ({
    event: row.event,
    pattern: row.pattern,
    system: row.system,
    belief: row.belief,
    whys: [0, 1, 2].map((i) => row.whys[i] ?? ''),
    lever: row.lever,
    link: row.link,
  }))
  const closed = useRef(false)

  function close() {
    if (closed.current) return
    closed.current = true
    void runSafe(async () => {
      try {
        await saveEngineIceberg(month, row.engine, draft)
      } finally {
        onDone()
      }
    }, 'Could not save the iceberg')()
  }

  const set = (patch: Partial<IcebergInput>) => setDraft((d) => ({ ...d, ...patch }))

  return (
    <Sheet
      open
      onClose={close}
      title={`${label} iceberg`}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          {row.score !== null ? (
            <Button
              variant="ghost"
              onClick={() => void runSafe(setEngineScore, 'Could not clear the score')(month, row.engine, null)}
            >
              Clear score
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={close}>Done</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <section aria-label={`${label} habits`} data-testid="engine-habits">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Habits <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{habits.length}</span>
          </p>
          {habits.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {habits.map((name, i) => (
                <li
                  key={`${i}:${name}`}
                  className="rounded-full border border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No habit tagged with this engine yet (Habits → a habit → Engine).
            </p>
          )}
        </section>
        {ICEBERG_LAYERS.map((l) => (
          <label key={l.key} className="block">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{l.label}</span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{l.hint}</span>
            <textarea
              rows={2}
              value={draft[l.key]}
              maxLength={LIFE_CAPS.engineLayer}
              onChange={(ev) => set({ [l.key]: ev.target.value })}
              className={`mt-1 ${FIELD}`}
            />
          </label>
        ))}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Whys <span className="text-xs font-normal text-slate-500 dark:text-slate-400">up to three</span>
          </legend>
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              aria-label={`Why ${i + 1}`}
              value={draft.whys[i] ?? ''}
              maxLength={LIFE_CAPS.engineWhy}
              onChange={(ev) => set({ whys: draft.whys.map((w, j) => (j === i ? ev.target.value : w)) })}
              className={`min-h-10 ${FIELD}`}
            />
          ))}
        </fieldset>
        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Lever</span>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">One sentence: the one change.</span>
          <input
            type="text"
            value={draft.lever}
            maxLength={LIFE_CAPS.engineLever}
            onChange={(ev) => set({ lever: ev.target.value })}
            className={`mt-1 min-h-10 ${FIELD}`}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Link</span>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
            A habit or experiment, by name (optional).
          </span>
          <input
            type="text"
            value={draft.link}
            maxLength={LIFE_CAPS.engineLink}
            onChange={(ev) => set({ link: ev.target.value })}
            className={`mt-1 min-h-10 ${FIELD}`}
          />
        </label>
      </div>
    </Sheet>
  )
}
