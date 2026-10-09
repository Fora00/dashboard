import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { SkeletonList } from '../../components/Skeleton'
import { FOCUS_RING } from '../../components/focus'
import { clearAllInterest } from '../../lib/eventInterestSync'
import { saveSeed, setPin } from '../../lib/eventInterestProfileSync'
import { useAuth } from '../../lib/useAuth'
import { useForYouSetting } from './forYou'
import {
  FEATURE_GROUPS,
  INTEREST_WEIGHTS,
  canOrderForYou,
  featureLabel,
  type FeatureStat,
  type Pin,
} from './interestScore'
import { kindOf } from './featureKeys'
import { MAX_SEED_INPUT_CHARS, decodeSeedParam, parseSeedJson, seedDiff } from './interestSeed'
import { interestModelFrom, useInterestRows } from './useInterestModel'

// /events/interests: what the events list has learned (interestScore.ts),
// the manual pins, the seed (a starting guess that fades) and its import, the
// "Ordina per te" switch and a reset of the 👍 / 👎. Dexie only: works signed
// out and offline; the owner's devices sync it (owner-only tables).
//
// Seed import: paste `{ "seed": { "<featureKey>": number } }`, or open
// `#/events/interests?seed=<base64url>` (scripts/events-seed-link.ts) to
// prefill the box. Like Life's import link, nothing is saved until Save.

/** Features listed per group in the liked / disliked sections. */
const PER_GROUP = 6
/** Below this |score| a learned feature is not worth listing. */
const MIN_LISTED = 0.01

const SUBTLE = 'text-xs text-slate-500 dark:text-slate-400'

function pct(v: number): string {
  const n = Math.round(v * 100)
  return n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0'
}

/** Diverging bar from the centre, with the number beside it (never colour alone). */
function ScoreBar({ value, label }: { value: number; label: string }) {
  const w = `${Math.min(1, Math.abs(value)) * 50}%`
  const up = value >= 0
  return (
    <div className="flex items-center gap-2">
      <div
        role="img"
        aria-label={`${label}: ${up ? 'likes' : 'dislikes'}, ${Math.abs(Math.round(value * 100))} out of 100`}
        className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-slate-400 dark:bg-slate-500" />
        <div
          aria-hidden
          className={`absolute inset-y-0 ${up ? 'left-1/2 rounded-r-full bg-emerald-500' : 'right-1/2 rounded-l-full bg-rose-500'}`}
          style={{ width: w }}
        />
      </div>
      <span aria-hidden className="w-12 shrink-0 text-right text-xs font-medium tabular-nums">
        {up ? '▲' : '▼'} {pct(value)}
      </span>
    </div>
  )
}

const PIN_BUTTONS: { pin: Pin; label: string; text: string }[] = [
  { pin: 'up', label: 'Pin as liked', text: '▲ Up' },
  { pin: 'down', label: 'Pin as disliked', text: '▼ Down' },
  { pin: 'mute', label: 'Mute (ignore this feature)', text: 'Mute' },
]

function PinButtons({ id, pin }: { id: string; pin: Pin | null }) {
  const name = featureLabel(id)
  return (
    <div className="flex flex-wrap gap-1.5">
      {PIN_BUTTONS.map((b) => (
        <button
          key={b.pin}
          type="button"
          aria-pressed={pin === b.pin}
          aria-label={`${b.label}: ${name}`}
          onClick={() => void setPin(id, pin === b.pin ? null : b.pin)}
          className={`min-h-10 min-w-12 rounded-lg px-2.5 text-xs font-medium ${FOCUS_RING} ${
            pin === b.pin
              ? 'bg-(color:--accent-selected) text-(color:--accent-fg)'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {b.text}
        </button>
      ))}
      {pin && (
        <button
          type="button"
          aria-label={`Clear pin: ${name}`}
          onClick={() => void setPin(id, null)}
          className={`min-h-10 rounded-lg px-2.5 text-xs font-medium text-(--accent-border) underline ${FOCUS_RING}`}
        >
          Clear pin
        </button>
      )}
    </div>
  )
}

interface Row {
  id: string
  value: number
  pin: Pin | null
  note?: string
}

function FeatureRow({ row, pins = true }: { row: Row; pins?: boolean }) {
  const label = featureLabel(row.id)
  return (
    <li className="space-y-1.5 py-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium">{label}</span>
        <span className={`${SUBTLE} shrink-0`}>
          {row.pin === 'mute' ? 'muted' : row.pin ? `pinned ${row.pin}` : row.note}
        </span>
      </div>
      {row.pin !== 'mute' && <ScoreBar value={row.value} label={label} />}
      {pins && <PinButtons id={row.id} pin={row.pin} />}
    </li>
  )
}

/** Rows grouped like FEATURE_GROUPS; empty groups are skipped. */
function Grouped({ rows, limit, pins }: { rows: Row[]; limit?: number; pins?: boolean }) {
  const groups = FEATURE_GROUPS.map((g) => ({
    ...g,
    rows: rows.filter((r) => {
      const k = kindOf(r.id)
      return k !== null && g.kinds.includes(k)
    }),
  })).filter((g) => g.rows.length > 0)
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <section key={g.id} aria-label={g.label}>
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {g.label}
          </h3>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {g.rows.slice(0, limit).map((r) => (
              <FeatureRow key={r.id} row={r} {...(pins === undefined ? {} : { pins })} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function signalsNote(st: FeatureStat): string {
  return `${st.count} ${st.count === 1 ? 'signal' : 'signals'}`
}

export function Interests() {
  const session = useAuth()
  const rows = useInterestRows()
  // The clock is read once per mount: decay is measured from here.
  const [now] = useState(() => Date.now())
  const model = useMemo(() => (rows ? interestModelFrom(rows, now) : null), [rows, now])
  const [forYouSetting, setForYou] = useForYouSetting()

  // --- Seed import (paste or link; nothing saved until Save) ---------------
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [linkErrors, setLinkErrors] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState<{ where: 'seed' | 'reset'; text: string } | null>(null)
  const seedParam = searchParams.get('seed')
  useEffect(() => {
    if (!seedParam) return
    const decoded = decodeSeedParam(seedParam)
    // Strip the seed from the URL (replace, not push): it is personal data
    // and must not linger in history. The text lives in state only.
    setSearchParams({}, { replace: true })
    if (decoded.ok) {
      setText(decoded.text)
      setLinkErrors(null)
    } else {
      setText('')
      setLinkErrors(decoded.errors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedParam])
  const parsed = useMemo(() => (text.trim() ? parseSeedJson(text) : null), [text])
  const diff = useMemo(() => (parsed?.ok && rows ? seedDiff(rows.profile, parsed.seed) : null), [parsed, rows])

  const [confirm, setConfirm] = useState<'reset' | 'clear-seed' | null>(null)

  if (!rows || !model) {
    return (
      <div>
        <PageHeader emoji="🎯" title="Your interests" />
        <SkeletonList rows={3} rowClassName="h-24" />
      </div>
    )
  }

  const { counts, nSignals, seedStrength } = model
  const available = canOrderForYou(nSignals)
  const min = INTEREST_WEIGHTS.minSignalsForOrdering
  const stats = [...model.features.values()]
  const learned = stats.filter((s) => s.pin === null && s.count > 0 && Math.abs(s.score) >= MIN_LISTED)
  const liked: Row[] = learned
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => ({ id: s.key, value: s.score, pin: null, note: signalsNote(s) }))
  const disliked: Row[] = learned
    .filter((s) => s.score < 0)
    .sort((a, b) => a.score - b.score)
    .map((s) => ({ id: s.key, value: s.score, pin: null, note: signalsNote(s) }))
  const pinned: Row[] = stats
    .filter((s) => s.pin !== null)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((s) => ({ id: s.key, value: s.score, pin: s.pin }))
  const seeded: Row[] = rows.profile
    .filter((p): p is typeof p & { seed: number } => p.seed !== null)
    .sort((a, b) => b.seed - a.seed || a.id.localeCompare(b.id))
    .map((p) => ({ id: p.id, value: p.seed, pin: p.pin }))
  const explicit = rows.signals.length

  async function onSaveSeed() {
    if (!parsed?.ok) return
    setSaving(true)
    try {
      await saveSeed(parsed.seed)
      setText('')
      setFlash({ where: 'seed', text: `Seed saved (${Object.keys(parsed.seed).length} features).` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        emoji="🎯"
        title="Your interests"
        subtitle="What the events list has learned from your 👍 / 👎, saved and hidden events."
      />
      <Link
        to="/events"
        className={`-mt-3 mb-4 inline-flex min-h-10 items-center text-sm text-(--accent-border) underline ${FOCUS_RING}`}
      >
        ← Events
      </Link>

      {session === null && (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Signed out: everything here stays on this device.
        </p>
      )}

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        <div className="space-y-4">
          <Card className="space-y-3">
            <h2 className="text-base font-semibold">
              {nSignals} {nSignals === 1 ? 'signal' : 'signals'} so far
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              👍 {counts.up} · 👎 {counts.down} · saved {counts.saved} · hidden {counts.hidden} · your own events{' '}
              {counts.manual}
            </p>
            <p className={SUBTLE}>
              Hides made by a 👎 count once (as the 👎). Older signals weigh less: half after{' '}
              {INTEREST_WEIGHTS.halfLifeDays} days.
            </p>
            <label className="flex min-h-10 items-center justify-between gap-2 text-sm font-medium">
              Ordina per te
              <input
                type="checkbox"
                role="switch"
                checked={forYouSetting && available}
                disabled={!available}
                aria-describedby="for-you-status"
                onChange={(e) => setForYou(e.target.checked)}
                className="size-5 disabled:cursor-not-allowed"
              />
            </label>
            <p id="for-you-status" className={SUBTLE}>
              {!available
                ? `Locked: ordering needs at least ${min} signals (${nSignals} so far). Nothing is reordered until then.`
                : forYouSetting
                  ? 'Active on this device: each day of the events list puts what matches these interests first.'
                  : 'Off on this device: the events list keeps its usual order.'}
            </p>
          </Card>

          <Card className="space-y-2">
            <h2 className="text-base font-semibold">What you like</h2>
            {liked.length ? (
              <Grouped rows={liked} limit={PER_GROUP} />
            ) : (
              <p className={SUBTLE}>Nothing learned yet. Tap 👍 or save events you like.</p>
            )}
          </Card>

          <Card className="space-y-2">
            <h2 className="text-base font-semibold">What you skip</h2>
            {disliked.length ? (
              <Grouped rows={disliked} limit={PER_GROUP} />
            ) : (
              <p className={SUBTLE}>Nothing learned yet. Tap 👎 or hide events you don't want.</p>
            )}
          </Card>

          {pinned.length > 0 && (
            <Card className="space-y-2">
              <h2 className="text-base font-semibold">Pinned</h2>
              <p className={SUBTLE}>
                A pin overrides what was learned: up and down count fully, mute ignores the feature.
              </p>
              <Grouped rows={pinned} />
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="space-y-3">
            <h2 className="text-base font-semibold">Starting guess (seed)</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              A guess you give up front, not something learned. It fades as real signals arrive: it counts{' '}
              <strong>{Math.round(seedStrength * 100)}%</strong> now and nothing from {INTEREST_WEIGHTS.seedFadeSignals}{' '}
              signals on.
            </p>
            {seeded.length > 0 ? (
              <>
                <Grouped rows={seeded} pins={false} />
                {confirm === 'clear-seed' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm">Remove the whole seed? Pins stay.</span>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setConfirm(null)
                        void saveSeed({}).then(() => setFlash({ where: 'seed', text: 'Seed removed.' }))
                      }}
                    >
                      Remove seed
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirm(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" onClick={() => setConfirm('clear-seed')}>
                    Remove seed…
                  </Button>
                )}
              </>
            ) : (
              <p className={SUBTLE}>No seed yet.</p>
            )}

            <h3 className="pt-2 text-sm font-semibold">Import seed</h3>
            <p className={SUBTLE}>
              Paste <code>{'{ "seed": { "<kind>:<value>": number } }'}</code>, values from −1 to 1, at most 200 keys.
              Kinds: cat, sub, tag, city, src, ring, wd (1-7), hour (morning, afternoon, evening, night). A new seed
              replaces the old one; pins are kept. Nothing is saved until you tap Save.
            </p>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setLinkErrors(null)
                setFlash(null)
              }}
              placeholder={'{ "seed": { "tag:example": 0.5, "wd:1": -0.25 } }'}
              aria-label="Seed JSON"
              rows={6}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs placeholder:text-slate-500 focus:border-(color:--accent-ring) focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-400"
            />
            {flash?.where === 'seed' && !text && (
              <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                {flash.text}
              </p>
            )}
            {linkErrors && !text.trim() && <ErrorList title="The seed link couldn't be read:" errors={linkErrors} />}
            {text.length > MAX_SEED_INPUT_CHARS && (
              <p className="text-sm text-rose-600 dark:text-rose-400">Too large.</p>
            )}
            {parsed && !parsed.ok && <ErrorList title="This isn't a valid seed:" errors={parsed.errors} />}
            {parsed?.ok && diff && (
              <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-sm font-medium">
                  Preview: {Object.keys(parsed.seed).length} features · {diff.added.length} new · {diff.changed.length}{' '}
                  changed · {diff.removed.length} removed · {diff.unchanged.length} unchanged
                </p>
                <ul className="max-h-64 space-y-0.5 overflow-y-auto text-xs">
                  {Object.entries(parsed.seed)
                    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-2">
                        <span className="truncate">
                          {featureLabel(k)} <span className="text-slate-500 dark:text-slate-400">({k})</span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {diff.added.includes(k) ? 'new ' : diff.changed.includes(k) ? 'changed ' : ''}
                          {pct(v)}
                        </span>
                      </li>
                    ))}
                  {diff.removed.map((k) => (
                    <li key={k} className="flex justify-between gap-2 text-slate-500 dark:text-slate-400">
                      <span className="truncate line-through">{featureLabel(k)}</span>
                      <span className="shrink-0">removed</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button disabled={saving} onClick={() => void onSaveSeed()}>
                    {saving ? 'Saving…' : 'Save seed'}
                  </Button>
                  <Button variant="ghost" onClick={() => setText('')}>
                    Discard
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="space-y-2">
            <h2 className="text-base font-semibold">Reset what was learned</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Deletes your {explicit} 👍 / 👎 on every device. Saved and hidden events stay as they are (and keep
              counting); the seed and the pins stay too.
            </p>
            {confirm === 'reset' ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    setConfirm(null)
                    void clearAllInterest().then((n) =>
                      setFlash({ where: 'reset', text: `${n} ${n === 1 ? 'signal' : 'signals'} deleted.` }),
                    )
                  }}
                >
                  Yes, delete {explicit} {explicit === 1 ? 'signal' : 'signals'}
                </Button>
                <Button variant="ghost" onClick={() => setConfirm(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="danger" disabled={explicit === 0} onClick={() => setConfirm('reset')}>
                Reset…
              </Button>
            )}
            {flash?.where === 'reset' && (
              <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                {flash.text}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function ErrorList({ title, errors }: { title: string; errors: string[] }) {
  return (
    <div className="space-y-1 text-sm text-rose-600 dark:text-rose-400">
      <p className="font-medium">{title}</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  )
}
