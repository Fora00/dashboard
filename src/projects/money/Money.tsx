import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type MoneyBudget, type MoneyBudgetChoice, type MoneyGoal } from '../../lib/db'
import { sync } from '../../lib/moneySync'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SectionTitle } from '../../components/SectionTitle'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { Stat } from '../../components/Stat'
import { SyncCard } from '../../components/SyncCard'
import { SELECT } from '../../components/field'
import { Button } from '../../components/Button'
import { TEXTAREA } from '../../components/field'
import { MoneyBudgetSheet } from './MoneyBudgetSheet'
import { MoneyGoalSheet } from './MoneyGoalSheet'
import { goalFor, goalProgress, pctText, type YearGoal } from './moneyGoals'
import { MoneyCategories } from './MoneyCategories'
import { applyBudgets, budgetsCsv, type BudgetConflict, type BudgetedLine } from './moneyBudgets'
import { MoneyMonthChart, type ChartCompare } from './MoneyMonthChart'
import { MoneyTrends } from './MoneyTrendView'
import { ProjectionCard } from './ProjectionCard'
import { BudgetAlertsNote } from './BudgetAlertsNote'
import { forecastBudget, forecastLabel, projectYear } from './moneyProjection'
import {
  LAST_OPTIONS,
  addMonths,
  availableMonths,
  currentMonth,
  defaultSelection,
  monthLabel,
  monthsIn,
  periodLabel,
  periodLines,
  resolveComparison,
  resolvePeriod,
  shortLabel,
  type CompareMode,
  type Comparison,
  type LastN,
  type PeriodMode,
  type Selection,
} from './moneyPeriod'
import {
  MONTHS_IT,
  budgetMonthsLabel,
  categoryRows,
  euro,
  keptOf,
  monthlyTotals,
  outOf,
  pctChange,
  scaleTotals,
  totalsOf,
  type CategoryRow,
  type Line,
  type Totals,
} from './moneyStats'

// Soldi (/soldi): monthly totals per GreenBooks category, mirrored from
// ~/life/money/data/monthly-totals.csv by the import link (npm run
// life:money-link → /soldi/import). The totals are read-only here: the CSV is
// the source of truth. Budgets (MO8): GreenBooks budgets come with the CSV, and
// a tap on a category sets dashboard budgets on top (moneyBudgets.ts
// applyBudgets, applied right after the "escludi il mese in corso" filter, so
// every view below sees the effective budget). Local-first: reads Dexie, works
// offline and signed out.

type View = 'charts' | 'table' | 'trend'

export function Money() {
  const lines = useLiveQuery(() => db.moneyTotals.toArray())
  const rules = useLiveQuery(() => db.moneyBudgets.toArray())
  const choices = useLiveQuery(() => db.moneyBudgetChoices.toArray())
  const goals = useLiveQuery(() => db.moneyGoals.toArray())
  return (
    <div>
      <PageHeader emoji="💶" title="Soldi" subtitle="Entrate, uscite e messo da parte, da GreenBooks." />
      <SyncCard sync={sync} />
      <Link
        to="/soldi/patrimonio"
        className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        Patrimonio: saldi dei conti →
      </Link>
      {lines === undefined ||
      rules === undefined ||
      choices === undefined ||
      goals === undefined ? null : lines.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            emoji="💶"
            title="Ancora nessun dato"
            hint="Apri il link stampato da npm run life:money-link (in ~/life) per importare i totali mensili."
          />
        </div>
      ) : (
        <MoneyBody lines={lines} rules={rules} choices={choices} goals={goals} />
      )}
    </div>
  )
}

/** Window of the projection on Grafici (Andamento uses its own selector). */
const PROJECTION_WINDOW = 3

const PERIOD_MODES: { id: PeriodMode; label: string }[] = [
  { id: 'year', label: 'Anno' },
  { id: 'range', label: 'Intervallo di mesi' },
  { id: 'last', label: 'Ultimi mesi' },
  { id: 'month', label: 'Un mese' },
]

const COMPARE_MODES: { id: CompareMode; label: string }[] = [
  { id: 'yoy', label: 'stesso periodo, anno prima' },
  { id: 'prev', label: 'periodo precedente' },
  { id: 'custom', label: 'scelgo io' },
  { id: 'avg', label: 'media mensile storica' },
  { id: 'none', label: 'nessuno' },
]

function MoneyBody(props: { lines: Line[]; rules: MoneyBudget[]; choices: MoneyBudgetChoice[]; goals: MoneyGoal[] }) {
  const { lines: allLines, rules, choices, goals } = props
  const cur = currentMonth()
  const hasCurrent = allLines.some((l) => l.month === cur)
  const [excludeCurrent, setExclude] = useState(false)
  const raw = useMemo(
    () => (excludeCurrent && hasCurrent ? allLines.filter((l) => l.month !== cur) : allLines),
    [allLines, excludeCurrent, hasCurrent, cur],
  )
  // Effective budgets first, so every view and categoryRows work unchanged.
  const applied = useMemo(() => {
    const newest = raw.reduce((m, l) => (l.month > m ? l.month : m), '')
    return applyBudgets(raw, rules, choices, newest)
  }, [raw, rules, choices])
  const lines = applied.lines
  const months = useMemo(() => availableMonths(lines), [lines])
  const [picked, setPicked] = useState<Selection | null>(null)
  const [view, setView] = useState<View>('charts')

  if (months.length === 0) {
    return (
      <div className="mt-6 space-y-3">
        <ExcludeToggle show={hasCurrent} value={excludeCurrent} onChange={setExclude} />
        <p className="text-sm text-slate-500 dark:text-slate-400">Nessun mese chiuso da mostrare.</p>
      </div>
    )
  }
  const sel = picked ?? defaultSelection(months)
  const set = (patch: Partial<Selection>) => setPicked({ ...sel, ...patch })
  return (
    <MoneyView
      lines={lines}
      raw={raw}
      rules={rules}
      goals={goals}
      conflicts={applied.conflicts}
      months={months}
      sel={sel}
      set={set}
      view={view}
      setView={setView}
      toggle={<ExcludeToggle show={hasCurrent} value={excludeCurrent} onChange={setExclude} />}
    />
  )
}

function ExcludeToggle({ show, value, onChange }: { show: boolean; value: boolean; onChange: (v: boolean) => void }) {
  if (!show) return null
  return (
    <label className="flex min-h-10 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <input type="checkbox" className="size-5 shrink-0" checked={value} onChange={(e) => onChange(e.target.checked)} />
      Escludi il mese in corso
    </label>
  )
}

function MoneyView(props: {
  lines: BudgetedLine[]
  raw: Line[]
  rules: MoneyBudget[]
  goals: MoneyGoal[]
  conflicts: Map<string, BudgetConflict[]>
  months: string[]
  sel: Selection
  set: (patch: Partial<Selection>) => void
  view: View
  setView: (v: View) => void
  toggle: ReactNode
}) {
  const { lines, raw, rules, goals, conflicts, months, sel, set, view, setView, toggle } = props
  const [editing, setEditing] = useState<string | null>(null)
  const [goalOpen, setGoalOpen] = useState<number | null>(null)
  const period = useMemo(() => resolvePeriod(sel, months), [sel, months])
  const cmp = useMemo(() => {
    const c = resolveComparison(sel, period, lines)
    // A comparison with no data at all says so once instead of showing zeros.
    return c && c.covered === 0 ? { empty: c } : { c }
  }, [sel, period, lines])
  const c: Comparison | null = cmp.c ?? null
  const current = useMemo(() => periodLines(lines, period), [lines, period])
  const t = useMemo(() => totalsOf(current), [current])
  const ct = useMemo(() => (c ? scaleTotals(totalsOf(c.lines), c.scale) : null), [c])
  const pMonths = useMemo(() => monthsIn(period), [period])
  const values = useMemo(() => monthlyTotals(lines, period), [lines, period])
  const chartCompare = useMemo<ChartCompare | null>(() => {
    if (!c) return null
    if (c.period === null) {
      return { label: c.label, flat: true, months: [], values: [scaleTotals(totalsOf(c.lines), 1 / c.covered)] }
    }
    return { label: c.label, flat: false, months: monthsIn(c.period), values: monthlyTotals(lines, c.period) }
  }, [c, lines])
  const rows = useMemo(() => {
    const cl = c ? { lines: c.lines, scale: c.scale } : null
    return {
      spend: categoryRows(current, 'spend', cl),
      oneoff: categoryRows(current, 'oneoff', cl),
      income: categoryRows(current, 'income', cl),
      pass: categoryRows(current, 'pass', cl),
    }
  }, [current, c])
  // MO8 markers per category over the period: a dashboard budget applies / a conflict is open.
  const flags = useMemo(() => {
    const m = new Map<string, { dashboard: boolean; conflict: boolean }>()
    for (const l of current) {
      if (l.budgetFrom !== 'dashboard' && !l.conflict) continue
      const f = m.get(l.category) ?? { dashboard: false, conflict: false }
      if (l.budgetFrom === 'dashboard') f.dashboard = true
      if (l.conflict) f.conflict = true
      m.set(l.category, f)
    }
    return m
  }, [current])
  const inPeriod = (category: string) =>
    (conflicts.get(category) ?? []).filter((c) => c.month >= period.from && c.month <= period.to)
  const label = periodLabel(period)
  const short = shortLabel(period)
  const multiYear = period.from.slice(0, 4) !== period.to.slice(0, 4)
  const cLabel = c?.short ?? null
  // MO11: the current year to date gets a year-end projection and per-category budget forecasts.
  const newest = months[months.length - 1]!
  const ytd = sel.mode === 'year' && period.from.endsWith('-01') && period.to === newest && !newest.endsWith('-12')
  const year = Number(newest.slice(0, 4))
  const projection = useMemo(() => (ytd ? projectYear(lines, year, PROJECTION_WINDOW) : null), [ytd, lines, year])
  const forecasts = useMemo(() => {
    const m = new Map<string, string>()
    if (!ytd) return m
    for (const r of rows.spend) {
      const f = forecastBudget(lines, r.category, year, PROJECTION_WINDOW)
      if (f) m.set(r.category, forecastLabel(f, euro))
    }
    return m
  }, [ytd, rows.spend, lines, year])
  // MO13: the savings goal shows when the period is a year (whole or to date).
  const goalYear = sel.mode === 'year' ? Number(period.from.slice(0, 4)) : null
  const goal = goalYear === null ? null : goalFor(goals, goalYear)
  const projectionGoal = goalFor(goals, year)

  return (
    <div className="mt-6 space-y-6">
      <BudgetAlertsNote link={false} />
      <div className="flex flex-wrap items-center gap-3">
        {toggle}
        <div className="ml-auto w-full sm:w-96">
          <SegmentedTabs
            label="Vista"
            kind="choice"
            options={[
              { id: 'charts', label: 'Grafici' },
              { id: 'table', label: 'Tabella' },
              { id: 'trend', label: 'Andamento' },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
      </div>
      {view === 'trend' ? (
        <MoneyTrends lines={lines} months={months} goals={goals} />
      ) : (
        <>
          <Controls sel={sel} set={set} months={months} period={period} />

          <section aria-label="Totali">
            <SectionTitle>
              {label}
              {c ? ` · confronto con ${c.label}` : ''}
            </SectionTitle>
            {cmp.empty && (
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400" data-testid="money-compare-note">
                Nessun dato per {cmp.empty.label}: niente confronto.
              </p>
            )}
            {c && c.period && c.covered < c.length && (
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400" data-testid="money-compare-note">
                Il confronto ha dati solo per {c.covered} {c.covered === 1 ? 'mese' : 'mesi'} su {c.length}.
              </p>
            )}
            <Tiles t={t} ct={ct} compareLabel={cLabel} goal={goal} />
            {goalYear !== null && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Button variant="ghost" onClick={() => setGoalOpen(goalYear)}>
                  {goal ? `Obiettivo ${goalYear}` : `Imposta obiettivo ${goalYear}`}
                </Button>
                {goal?.inherited && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">ereditato dal {goal.fromYear}</span>
                )}
              </div>
            )}
            {projection && projection.remaining > 0 && (
              <ProjectionCard p={projection} window={PROJECTION_WINDOW} compact goal={projectionGoal} />
            )}
          </section>

          {view === 'charts' ? (
            <>
              <section aria-label="Mese per mese">
                <SectionTitle>Messo da parte, mese per mese</SectionTitle>
                <Card>
                  <MoneyMonthChart months={pMonths} values={values} label={short} compare={chartCompare} />
                </Card>
              </section>
              <section aria-label="Uscite per categoria">
                <SectionTitle>Uscite per categoria · speso e budget ({label})</SectionTitle>
                <Card>
                  <MoneyCategories
                    rows={rows.spend}
                    compareLabel={cLabel}
                    multiYear={multiYear}
                    empty="Nessuna uscita nel periodo."
                    flags={flags}
                    onOpen={setEditing}
                    notes={forecasts}
                  />
                </Card>
              </section>
              <section aria-label="Una tantum">
                <SectionTitle>Una tantum (scala propria)</SectionTitle>
                <Card>
                  <MoneyCategories
                    rows={rows.oneoff}
                    compareLabel={cLabel}
                    multiYear={multiYear}
                    empty="Nessuna spesa una tantum nel periodo."
                    flags={flags}
                    onOpen={setEditing}
                  />
                </Card>
              </section>
            </>
          ) : (
            <Tables
              label={short}
              compareLabel={cLabel}
              months={pMonths}
              values={values}
              compare={chartCompare}
              rows={rows}
              multiYear={multiYear}
              flags={flags}
              onOpen={setEditing}
            />
          )}

          <PassBlock rows={rows.pass} compareLabel={cLabel} />
          <MoneyBudgetSheet
            category={editing}
            onClose={() => setEditing(null)}
            periodLabel={label}
            gbLines={editing === null ? [] : periodLines(raw, period).filter((l) => l.category === editing)}
            rules={editing === null ? [] : rules.filter((r) => r.category === editing)}
            conflicts={editing === null ? [] : inPeriod(editing)}
            months={months}
          />
          <MoneyGoalSheet year={goalOpen} onClose={() => setGoalOpen(null)} goals={goals} />
        </>
      )}

      <CopyBudgets rules={rules} />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Dati da <code>monthly-totals.csv</code>: aggiorna con <code>npm run life:money-link</code> e apri il link (
        <Link to="/soldi/import" className="underline">
          importa
        </Link>
        ).
      </p>
    </div>
  )
}

const LABEL = 'text-xs text-slate-500 dark:text-slate-400'

/**
 * A caption above a select, tied by id (not by wrapping, which would put every
 * option's text into the select's accessible name). Children: the caption
 * text, then the <select>.
 */
function Field({ children }: { children: ReactNode }) {
  const id = useId()
  const parts = Children.toArray(children)
  const control = parts.find(isValidElement) as ReactElement<{ id?: string }> | undefined
  const caption = parts.filter((p) => !isValidElement(p))
  return (
    <div className={LABEL}>
      <label htmlFor={id}>{caption}</label>
      {control && cloneElement(control, { id })}
    </div>
  )
}

function MonthSelect(props: {
  label: string
  value: string
  options: readonly string[]
  onChange: (m: string) => void
}) {
  return (
    <Field>
      {props.label}
      <select
        className={`${SELECT} mt-1 block w-36`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {[...props.options].reverse().map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>
    </Field>
  )
}

function Controls(props: {
  sel: Selection
  set: (patch: Partial<Selection>) => void
  months: string[]
  period: { from: string; to: string }
}) {
  const { sel, set, months, period } = props
  const years = [...new Set(months.map((m) => Number(m.slice(0, 4))))].sort((a, b) => b - a)
  const len = monthsIn(period).length
  // Custom compare: any start that keeps the whole compare period before the newest month.
  const starts = months.filter((m) => addMonths(m, len - 1) <= months[months.length - 1]!)
  const startYears = years.filter((y) => y !== Number(period.from.slice(0, 4)))
  const pickCompare = (mode: CompareMode) => {
    if (mode !== 'custom') return set({ compare: mode })
    // Start from the year before: the same as "stesso periodo" until changed.
    const guess = addMonths(period.from, -12)
    set({ compare: mode, compareStart: guess < months[0]! ? months[0]! : guess })
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field>
          Periodo
          <select
            className={`${SELECT} mt-1 block w-44`}
            value={sel.mode}
            onChange={(e) => set({ mode: e.target.value as PeriodMode })}
          >
            {PERIOD_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        {sel.mode === 'year' && (
          <Field>
            Anno
            <select
              className={`${SELECT} mt-1 block w-32`}
              value={Number(period.from.slice(0, 4))}
              onChange={(e) => set({ year: Number(e.target.value) })}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
        )}
        {sel.mode === 'range' && (
          <>
            <MonthSelect
              label="Da"
              value={period.from}
              options={months}
              onChange={(m) => set({ from: m, to: period.to })}
            />
            <MonthSelect
              label="A"
              value={period.to}
              options={months}
              onChange={(m) => set({ from: period.from, to: m })}
            />
          </>
        )}
        {sel.mode === 'last' && (
          <Field>
            Quanti
            <select
              className={`${SELECT} mt-1 block w-32`}
              value={sel.last}
              onChange={(e) => set({ last: Number(e.target.value) as LastN })}
            >
              {LAST_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  ultimi {n}
                </option>
              ))}
            </select>
          </Field>
        )}
        {sel.mode === 'month' && (
          <MonthSelect label="Mese" value={period.from} options={months} onChange={(m) => set({ month: m })} />
        )}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Field>
          Confronta con
          <select
            className={`${SELECT} mt-1 block w-56`}
            value={sel.compare}
            onChange={(e) => pickCompare(e.target.value as CompareMode)}
          >
            {COMPARE_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        {sel.compare === 'custom' &&
          (sel.mode === 'year' ? (
            <Field>
              Anno di confronto
              <select
                className={`${SELECT} mt-1 block w-32`}
                value={Number(sel.compareStart.slice(0, 4))}
                onChange={(e) => set({ compareStart: `${e.target.value}-01` })}
              >
                {!startYears.includes(Number(sel.compareStart.slice(0, 4))) && (
                  <option value={Number(sel.compareStart.slice(0, 4))}>{sel.compareStart.slice(0, 4)}</option>
                )}
                {startYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <MonthSelect
              label={len === 1 ? 'Mese di confronto' : `Dal mese (${len} mesi)`}
              value={starts.includes(sel.compareStart) ? sel.compareStart : (starts[0] ?? months[0]!)}
              options={starts.length ? starts : [months[0]!]}
              onChange={(m) => set({ compareStart: m })}
            />
          ))}
      </div>
    </div>
  )
}

function vs(now: number, before: number | undefined, compareLabel: string | null): string | undefined {
  if (before === undefined || compareLabel === null) return undefined
  const p = pctChange(now, before)
  return `${compareLabel}: ${euro(before)}${p ? ` (${p})` : ''}`
}

function Tiles({
  t,
  ct,
  compareLabel,
  goal,
}: {
  t: Totals
  ct: Totals | null
  compareLabel: string | null
  goal: YearGoal | null
}) {
  const kept = keptOf(t)
  const rate = t.income > 0 ? Math.round((kept / t.income) * 100) : null
  return (
    <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3 lg:grid-cols-5">
      <Stat label="entrate" value={euro(t.income)} sub={vs(t.income, ct?.income, compareLabel)} />
      <Stat label="uscite" value={euro(outOf(t))} sub={vs(outOf(t), ct ? outOf(ct) : undefined, compareLabel)} />
      <Stat
        label={`messo da parte${rate !== null ? ` · ${rate}%` : ''}`}
        value={euro(kept)}
        sub={vs(kept, ct ? keptOf(ct) : undefined, compareLabel)}
      >
        {goal && <GoalBar t={t} goal={goal} />}
      </Stat>
      <Stat label="uscite senza una tantum" value={euro(t.spend)} sub={vs(t.spend, ct?.spend, compareLabel)} />
      <Stat label="una tantum" value={euro(t.oneoff)} sub={vs(t.oneoff, ct?.oneoff, compareLabel)} />
    </div>
  )
}

/**
 * MO13, under "messo da parte": the goal as text (▲ reached / ▼ still missing,
 * so colour is never the only signal) and a thin bar of kept against target.
 */
function GoalBar({ t, goal }: { t: Totals; goal: YearGoal }) {
  const g = goalProgress(t, goal.rateBp)
  const share = g.target > 0 ? Math.max(0, Math.min(1, g.kept / g.target)) : g.reached ? 1 : 0
  return (
    <div className="mt-1" data-testid="money-goal-tile">
      <div className="text-[10px] text-slate-600 dark:text-slate-300">
        obiettivo {pctText(goal.rateBp)}
        {goal.inherited ? ` (dal ${goal.fromYear})` : ''} · {g.reached ? '▲ raggiunto' : `▼ mancano ${euro(g.gap)}`}
      </div>
      <div
        className="mx-auto mt-1 h-1 w-4/5 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-600"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full ${g.reached ? 'bg-sky-600 dark:bg-sky-400' : 'bg-slate-500 dark:bg-slate-300'}`}
          style={{ width: `${Math.round(share * 100)}%` }}
        />
      </div>
    </div>
  )
}

function PassBlock({ rows, compareLabel }: { rows: CategoryRow[]; compareLabel: string | null }) {
  if (rows.length === 0) return null
  return (
    <section aria-label="Prestiti e rimborsi">
      <SectionTitle>Prestiti e rimborsi (non contati)</SectionTitle>
      <Card className="space-y-1 text-sm">
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          Soldi prestati o anticipati e poi resi: né entrate né uscite. Netto del periodo (+ rientrato, − uscito).
        </p>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <li key={r.category} className="flex items-baseline justify-between gap-3 py-1">
              <span className="min-w-0 truncate">{r.category}</span>
              <span className="shrink-0 tabular-nums">
                {r.value > 0 ? '+' : ''}
                {euro(r.value)}
                {compareLabel !== null && r.compare !== null && (
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    {compareLabel}: {euro(r.compare)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}

const TH_BASE = 'px-2 py-1.5 font-medium text-slate-500 dark:text-slate-400'
const TH = `${TH_BASE} text-right`
const TH_LEFT = `${TH_BASE} text-left`
const TD = 'px-2 py-1.5 text-right tabular-nums'

function Tables(props: {
  label: string
  compareLabel: string | null
  months: string[]
  values: (Totals | null)[]
  compare: ChartCompare | null
  rows: Record<'spend' | 'oneoff' | 'income', CategoryRow[]>
  multiYear: boolean
  flags: ReadonlyMap<string, { dashboard: boolean; conflict: boolean }>
  /** Opens the budget sheet for a spend or one-off category. */
  onOpen: (category: string) => void
}) {
  const { label, compareLabel, months, values, compare, rows, multiYear, flags, onOpen } = props
  const cell = (t: Totals | null, f: (x: Totals) => number) => (t ? euro(f(t)) : '—')
  const cmpAt = (i: number) => (compare ? ((compare.flat ? compare.values[0] : compare.values[i]) ?? null) : null)
  const kinds: [string, CategoryRow[]][] = [
    ['entrata', rows.income],
    ['uscita', rows.spend],
    ['una tantum', rows.oneoff],
  ]
  const monthName = (m: string) => `${MONTHS_IT[Number(m.slice(5, 7)) - 1]}${multiYear ? ` ${m.slice(0, 4)}` : ''}`
  return (
    <>
      <section aria-label="Tabella mesi">
        <SectionTitle>Mese per mese · {label}</SectionTitle>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className={TH_LEFT}>Mese</th>
                <th className={TH}>Entrate</th>
                <th className={TH}>Uscite</th>
                <th className={TH}>Una tantum</th>
                <th className={TH}>Messo da parte</th>
                {compareLabel !== null && <th className={TH}>{compareLabel}</th>}
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => {
                const t = values[i] ?? null
                const c = cmpAt(i)
                if (!t && !c) return null
                return (
                  <tr key={m} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-2 py-1.5">{monthName(m)}</td>
                    <td className={TD}>{cell(t, (x) => x.income)}</td>
                    <td className={TD}>{cell(t, (x) => x.spend)}</td>
                    <td className={TD}>{cell(t, (x) => x.oneoff)}</td>
                    <td className={`${TD} font-medium`}>{cell(t, keptOf)}</td>
                    {compareLabel !== null && <td className={TD}>{cell(c, keptOf)}</td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </section>
      <section aria-label="Tabella categorie">
        <SectionTitle>Per categoria</SectionTitle>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className={TH_LEFT}>Categoria</th>
                <th className={TH_LEFT}>Tipo</th>
                <th className={TH}>{label}</th>
                <th className={TH}>Budget</th>
                <th className={TH}>Sforato</th>
                {compareLabel !== null && <th className={TH}>{compareLabel}</th>}
              </tr>
            </thead>
            <tbody>
              {kinds.flatMap(([kind, list]) =>
                list.map((r) => (
                  <tr
                    key={`${kind}:${r.category}`}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-2 py-1.5">
                      {kind === 'entrata' ? (
                        r.category
                      ) : (
                        <button
                          type="button"
                          className="-my-1.5 min-h-10 text-left underline decoration-slate-300 underline-offset-2 dark:decoration-slate-600"
                          onClick={() => onOpen(r.category)}
                          aria-label={`Budget di ${r.category}`}
                        >
                          {r.category}
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-slate-500 dark:text-slate-400">{kind}</td>
                    <td className={TD}>{euro(r.value)}</td>
                    <td className={TD}>
                      {r.budget === null ? 'senza budget' : euro(r.budget)}
                      {budgetMonthsLabel(r, multiYear) && (
                        <span className="text-slate-500 dark:text-slate-400"> ({budgetMonthsLabel(r, multiYear)})</span>
                      )}
                      {flags.get(r.category)?.dashboard && (
                        <span className="text-slate-500 dark:text-slate-400"> · dashboard</span>
                      )}
                      {flags.get(r.category)?.conflict && (
                        <span className="font-semibold text-orange-700 dark:text-orange-400"> ⚠ conflitto</span>
                      )}
                    </td>
                    <td className={TD}>{r.over > 0 ? `▲ ${euro(r.over)}` : ''}</td>
                    {compareLabel !== null && <td className={TD}>{r.compare === null ? '—' : euro(r.compare)}</td>}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  )
}

/**
 * "Copia budget per ~/life": the dashboard rules as plain CSV on the
 * clipboard, for `npm run life:money-budgets` (reads pbpaste) to write into
 * ~/life/money/data/budgets-dashboard.csv. Nothing goes to the cloud. Without
 * a clipboard the text shows in a box to copy by hand.
 */
function CopyBudgets({ rules }: { rules: MoneyBudget[] }) {
  const [copied, setCopied] = useState(false)
  const [fallback, setFallback] = useState<string | null>(null)
  async function copy() {
    const text = budgetsCsv(rules)
    try {
      if (!navigator.clipboard) throw new Error('no clipboard')
      await navigator.clipboard.writeText(text)
      setFallback(null)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setFallback(text)
    }
  }
  return (
    <section aria-label="Budget per ~/life" className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={() => void copy()}>
          Copia budget per ~/life
        </Button>
        <span className="text-xs text-slate-500 dark:text-slate-400" role="status">
          {copied ? 'Copiato: ora npm run life:money-budgets sul Mac.' : `${rules.length} budget dashboard`}
        </span>
      </div>
      {fallback !== null && (
        <textarea
          readOnly
          aria-label="Budget in CSV"
          className={`${TEXTAREA} h-32 font-mono text-xs`}
          value={fallback}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </section>
  )
}
