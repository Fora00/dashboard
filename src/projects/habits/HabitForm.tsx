import { useState, type FormEvent, type ReactNode } from 'react'
import type { HabitKind, HabitVerdict } from '../../lib/db'
import { Button } from '../../components/Button'
import { MAX_EMOJI_LENGTH, MAX_NAME_LENGTH, MAX_TEXT_LENGTH } from '../../lib/habitSync'
import { shiftDayKey } from './habitStats'
import { AVOID_IDEAS, AVOID_PRESETS, CYCLE_DAYS, IDEAS, PRESETS, type HabitFormValues } from './habitFormDefaults'

const INPUT =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-500 focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800'
const CHIP = 'min-h-10 rounded-lg border px-3 text-sm'
const CHIP_ON = 'border-(color:--accent-ring) bg-(color:--accent)/15'
const CHIP_OFF = 'border-slate-300 dark:border-slate-700'

const VERDICTS: { value: HabitVerdict; label: string }[] = [
  { value: 'up', label: '⬆ up' },
  { value: 'stay', label: '＝ stay' },
  { value: 'down', label: '⬇ down' },
  { value: 'closed', label: '✕ closed' },
]
const KINDS: { value: HabitKind; label: string; hint: string }[] = [
  { value: 'forever', label: '♾ Forever', hint: 'one of the 2–3 I truly want for life' },
  { value: 'experiment', label: '🧪 Experiment', hint: 'a trial with an end date, closable without guilt' },
]

interface Props {
  initial: HabitFormValues
  submitLabel: string
  onSubmit: (values: HabitFormValues) => void | Promise<void>
  /** Show the starting-point presets (new habit only). */
  presets?: boolean
  /** Show the verdict row (editing a cycle). */
  verdict?: boolean
  /** Extra button next to submit (e.g. Archive). */
  extra?: ReactNode
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      {children}
    </label>
  )
}

/** The add and edit form for a habit: the same guided fields in both places. */
export function HabitForm({ initial, submitLabel, onSubmit, presets, verdict, extra }: Props) {
  const [v, setV] = useState(initial)
  const avoid = v.direction === 'avoid'
  const set = <K extends keyof HabitFormValues>(key: K, value: HabitFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!v.name.trim()) return
    await onSubmit(v)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div role="group" aria-label="Direction" className="space-y-1">
        <span className="text-sm font-medium">What kind of habit</span>
        <div className="flex gap-2">
          {(
            [
              ['do', '✅ Something to do'],
              ['avoid', '🚫 Something to avoid'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={v.direction === value}
              onClick={() =>
                setV((prev) => ({
                  ...prev,
                  direction: value,
                  target: value === 'avoid' ? 7 : prev.target,
                  perDay: value === 'avoid' ? 1 : prev.perDay,
                  grace: value === 'avoid' ? prev.grace : 0,
                }))
              }
              className={`${CHIP} flex-1 ${v.direction === value ? CHIP_ON : CHIP_OFF}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          {avoid
            ? 'Kept every day unless you mark a slip. Only days you used the app count, so a stopped log never looks like a perfect streak.'
            : 'Done when you tap it (or reach the taps you set).'}
        </span>
      </div>

      {presets && (
        <details className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
          <summary className="cursor-pointer font-medium">Ideas and ready-made habits</summary>
          <div className="mt-3 space-y-3">
            {[
              { area: avoid ? '⭐ Ready' : '⭐ The November cycles', items: avoid ? AVOID_PRESETS : PRESETS },
              ...(avoid ? [{ area: '🚫 More to avoid', items: AVOID_IDEAS }] : IDEAS),
            ].map((g) => (
              <div key={g.area}>
                <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">{g.area}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setV((prev) => ({ ...prev, ...p.values }))}
                      className={`${CHIP} ${CHIP_OFF}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex gap-2">
        <input
          value={v.emoji}
          onChange={(e) => set('emoji', e.target.value)}
          placeholder="✅"
          maxLength={MAX_EMOJI_LENGTH}
          autoComplete="off"
          aria-label="Emoji"
          className={`${INPUT} w-14 text-center`}
        />
        <input
          value={v.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Name, e.g. Journal"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          required
          aria-label="Name"
          className={INPUT}
        />
      </div>

      <Field
        label="Why"
        hint="What this serves, and what it costs me. A habit with no stated price gets dropped in the first bad week."
      >
        <input
          value={v.why}
          onChange={(e) => set('why', e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
          className={INPUT}
        />
      </Field>

      <div role="group" aria-label="With whom" className="space-y-1">
        <span className="text-sm font-medium">With whom</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          Habits with a person hold; solo ones are the fragile ones.
        </span>
        <div className="flex gap-2">
          {(
            [
              ['person', '👥 With a person'],
              ['alone', '🧍 Alone'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={v.social === value}
              onClick={() => set('social', v.social === value ? undefined : value)}
              className={`${CHIP} flex-1 ${v.social === value ? CHIP_ON : CHIP_OFF}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label={avoid ? 'What I do instead' : 'Anchor'}
        hint={
          avoid
            ? 'When the urge comes: the replacement that makes it easier.'
            : 'After what, and where. A habit with an anchor survives; without one it drifts.'
        }
      >
        <input
          value={v.anchor}
          onChange={(e) => set('anchor', e.target.value)}
          placeholder="After dinner, journal on the table"
          maxLength={MAX_TEXT_LENGTH}
          className={INPUT}
        />
      </Field>

      <>
        <Field
          label={avoid ? 'Ideal' : 'Normal version'}
          hint={avoid ? 'What a clean day looks like: none at all.' : 'What a good day looks like.'}
        >
          <input
            value={v.normal}
            onChange={(e) => set('normal', e.target.value)}
            maxLength={MAX_TEXT_LENGTH}
            className={INPUT}
          />
        </Field>

        <Field
          label={avoid ? 'Limit (the floor)' : 'Floor'}
          hint={
            avoid
              ? 'The most I allow myself on a bad day. Staying within it still counts as kept; going past it is a slip.'
              : 'The smallest version that still counts, on your worst day. It always runs; anything above is a bonus.'
          }
        >
          <input
            value={v.floor}
            onChange={(e) => set('floor', e.target.value)}
            placeholder={avoid ? 'One coffee, before noon' : 'Date + one line'}
            maxLength={MAX_TEXT_LENGTH}
            className={INPUT}
          />
        </Field>
        {!v.floor.trim() && (
          <p className="-mt-2 text-xs text-amber-700 dark:text-amber-300">
            {avoid
              ? 'No limit yet: every bad day will count as a full slip.'
              : 'No floor yet: on a bad day there is nothing to fall back on.'}
          </p>
        )}
      </>
      {avoid && (
        <div role="group" aria-label="Grace" className="space-y-1">
          <span className="text-sm font-medium">Grace</span>
          <div className="flex gap-2" role="group" aria-label="Grace scope">
            {(
              [
                ['day', 'a day'],
                ['week', 'a week'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={v.graceScope === value}
                onClick={() => set('graceScope', value)}
                className={`${CHIP} flex-1 ${v.graceScope === value ? CHIP_ON : CHIP_OFF}`}
              >
                slips {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={v.grace === n}
                onClick={() => set('grace', n)}
                className={`${CHIP} min-w-11 ${v.grace === n ? CHIP_ON : CHIP_OFF}`}
              >
                {n === 0 ? 'none' : `${n}×`}
              </button>
            ))}
          </div>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {v.grace === 0
              ? 'Every slip breaks the streak.'
              : v.graceScope === 'day'
                ? `Each tap on the tile is one slip. Up to ${v.grace} a day still count as a kept day (shown as within grace); the next one that day is a real slip.`
                : `${v.grace} slip${v.grace === 1 ? '' : 's'} a week are tolerated and do not break the streak; the next one does. The mirror of a weekly target: here it is a ceiling.`}
          </span>
        </div>
      )}
      {!avoid && (
        <>
          <div role="group" aria-label="Times per week" className="space-y-1">
            <span className="text-sm font-medium">How often</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={v.target === n}
                  onClick={() => set('target', n)}
                  className={`${CHIP} min-w-11 ${v.target === n ? CHIP_ON : CHIP_OFF}`}
                >
                  {n === 7 ? 'daily' : `${n}×`}
                </button>
              ))}
            </div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {v.target === 7
                ? 'Every day: the two-day rule applies (never miss twice).'
                : `${v.target} times a week: the ring counts the week, any days.`}
            </span>
          </div>

          <div role="group" aria-label="Taps per day" className="space-y-1">
            <span className="text-sm font-medium">Taps per day</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={v.perDay === n}
                  onClick={() => set('perDay', n)}
                  className={`${CHIP} min-w-11 ${v.perDay === n ? CHIP_ON : CHIP_OFF}`}
                >
                  {n === 1 ? 'once' : `${n}×`}
                </button>
              ))}
            </div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {v.perDay === 1
                ? 'One tap makes the day done.'
                : `Tap ${v.perDay} times a day (glasses of water, meals…): the day is done at ${v.perDay}.`}
            </span>
          </div>
        </>
      )}

      <div role="group" aria-label="Kind" className="space-y-1">
        <span className="text-sm font-medium">Kind</span>
        <div className="flex gap-2">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              aria-pressed={v.kind === k.value}
              onClick={() => set('kind', k.value)}
              className={`${CHIP} flex-1 ${v.kind === k.value ? CHIP_ON : CHIP_OFF}`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          {KINDS.find((k) => k.value === v.kind)?.hint}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-sm font-medium">Cycle</span>
        <div className="flex gap-2">
          <label className="flex-1 text-xs text-slate-500">
            Start
            <input
              type="date"
              value={v.cycleStart}
              onChange={(e) => set('cycleStart', e.target.value)}
              className={INPUT}
            />
          </label>
          <label className="flex-1 text-xs text-slate-500">
            End
            <input type="date" value={v.cycleEnd} onChange={(e) => set('cycleEnd', e.target.value)} className={INPUT} />
          </label>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => v.cycleStart && set('cycleEnd', shiftDayKey(v.cycleStart, CYCLE_DAYS - 1))}
          disabled={!v.cycleStart}
        >
          4 weeks from the start
        </Button>
      </div>

      {verdict && (
        <div role="group" aria-label="Verdict" className="space-y-1">
          <span className="text-sm font-medium">Verdict</span>
          <div className="flex flex-wrap gap-2">
            {VERDICTS.map((x) => (
              <button
                key={x.value}
                type="button"
                aria-pressed={v.verdict === x.value}
                onClick={() => set('verdict', v.verdict === x.value ? undefined : x.value)}
                className={`${CHIP} ${v.verdict === x.value ? CHIP_ON : CHIP_OFF}`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={!v.name.trim()}>
          {submitLabel}
        </Button>
        {extra}
      </div>
    </form>
  )
}
