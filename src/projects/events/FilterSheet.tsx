import { useState, type ReactNode } from 'react'
import { Sheet } from '../../components/Sheet'
import { Button } from '../../components/Button'
import { areaLabel, categoryLabel } from './model'
import { normalizeText } from './filters'

const ROW_ON =
  'border-indigo-700 bg-indigo-600 text-white dark:border-indigo-300 dark:bg-indigo-500'
const ROW_OFF =
  'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200'

interface Props {
  open: boolean
  onClose: () => void
  catOrder: string[]
  catCounts: Map<string, number>
  activeCats: string[]
  favourites: string[]
  /** [area id, count], nearest first. */
  areaCounts: [string, number][]
  selectedAreas: string[]
  onToggleArea: (id: string) => void
  /** Cities of the selected areas only (all when none is selected). */
  cityCounts: [string, number][]
  selectedCities: string[]
  showHidden: boolean
  canShowHidden: boolean
  /** Any filter of the sheet is active: the Reset at the top is shown. */
  canReset: boolean
  total: number
  onToggleCat: (id: string) => void
  onToggleFavourite: (id: string) => void
  onToggleCity: (city: string) => void
  onShowHidden: (v: boolean) => void
  onClearAll: () => void
}

/** "Area" + " · Trentino" (one selected) or " · 2". Nothing when none. */
function summarize(selected: string[], label: (id: string) => string): string {
  if (selected.length === 0) return ''
  return selected.length === 1 ? label(selected[0] ?? '') : String(selected.length)
}

/**
 * Collapsible sheet section. `defaultOpen` only seeds the state when the
 * sheet opens (the body is mounted per opening), so ticking something inside
 * never makes sections jump. New sections (e.g. "Come") are one more <Section>.
 */
function Section({
  title,
  summary,
  defaultOpen,
  children,
}: {
  title: string
  summary: string
  defaultOpen: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="mb-2 border-b border-slate-100 pb-2 last:border-b-0 dark:border-slate-800">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-10 w-full items-center justify-between gap-2 text-left"
      >
        <span className="min-w-0 truncate text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {title}
          {summary && <span className="text-indigo-600 dark:text-indigo-400"> · {summary}</span>}
        </span>
        <span aria-hidden className="text-slate-400">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && <div className="pt-1 pb-1">{children}</div>}
    </section>
  )
}

/** Chip grid of `[id, label, count]` items; zero counts sort last and look disabled. */
function OptionGrid({
  items,
  selected,
  onToggle,
}: {
  items: { id: string; label: string; count: number }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  const sorted = [...items].sort((a, b) => Number(a.count === 0) - Number(b.count === 0))
  return (
    <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
      {sorted.map(({ id, label, count }) => {
        const on = selected.includes(id)
        const disabled = count === 0 && !on
        return (
          <li key={id}>
            <button
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onToggle(id)}
              className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border-2 px-3 text-left text-sm disabled:cursor-not-allowed ${
                on ? ROW_ON : ROW_OFF
              } ${count === 0 ? 'opacity-60' : ''}`}
            >
              <span className="truncate">
                {on ? '✓ ' : ''}
                {label}
              </span>
              <span className="text-xs opacity-70">{count}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function CityChecklist({
  cityCounts,
  selected,
  onToggle,
}: {
  cityCounts: [string, number][]
  selected: string[]
  onToggle: (city: string) => void
}) {
  const [q, setQ] = useState('')
  const nq = normalizeText(q)
  // Selected cities first (even with no event left in the current scope), then by count.
  const known = new Set(cityCounts.map(([c]) => c))
  const all: [string, number][] = [...cityCounts, ...selected.filter((c) => !known.has(c)).map((c): [string, number] => [c, 0])]
  const rank = ([c, n]: [string, number]) => (selected.includes(c) ? 0 : n === 0 ? 2 : 1)
  const rows = all
    .filter(([c]) => !nq || normalizeText(c).includes(nq))
    .sort((a, b) => rank(a) - rank(b))
  return (
    <>
      <input
        type="text"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Search cities"
        placeholder="Search cities…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-1 h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
      />
      <ul className="max-h-72 overflow-y-auto overscroll-contain">
        {rows.map(([city, n]) => (
          <li key={city}>
            <label
              className={`flex min-h-10 cursor-pointer items-center gap-3 px-1 text-sm text-slate-700 dark:text-slate-200 ${
                n === 0 ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(city)}
                onChange={() => onToggle(city)}
                className="size-5 shrink-0"
              />
              <span className="min-w-0 flex-1 truncate">{city}</span>
              <span className="text-xs opacity-70">{n}</span>
            </label>
          </li>
        ))}
        {rows.length === 0 && <li className="py-2 text-sm text-slate-500 dark:text-slate-400">No city matches</li>}
      </ul>
    </>
  )
}

export function FilterSheet(p: Props) {
  const cats = p.catOrder.map((id) => ({ id, count: p.catCounts.get(id) ?? 0 }))
  const zeroLast = [...cats].sort((a, b) => Number(a.count === 0) - Number(b.count === 0))

  return (
    <Sheet
      open={p.open}
      onClose={p.onClose}
      title="Filters"
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={p.onClearAll}>
            Clear all
          </Button>
          <Button className="flex-1" onClick={p.onClose}>
            Show {p.total} {p.total === 1 ? 'event' : 'events'}
          </Button>
        </div>
      }
    >
      {p.open && (
        <>
          {/* Sticky so Reset stays reachable while scrolling; the row is always
              rendered (button hidden) so nothing shifts when a filter turns on. */}
          <div className="sticky -top-3 z-10 -mx-4 -mt-3 mb-1 flex min-h-[3.25rem] items-center pt-3 justify-between bg-white px-4 dark:bg-slate-900">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {p.total} {p.total === 1 ? 'event' : 'events'}
            </span>
            <button
              type="button"
              onClick={p.onClearAll}
              className={`min-h-10 px-2 text-sm font-medium text-indigo-600 underline dark:text-indigo-400 ${
                p.canReset ? '' : 'invisible'
              }`}
              tabIndex={p.canReset ? 0 : -1}
            >
              Reset
            </button>
          </div>

          {p.areaCounts.length > 1 && (
            <Section
              title="Area"
              summary={summarize(p.selectedAreas, areaLabel)}
              defaultOpen
            >
              <OptionGrid
                items={p.areaCounts.map(([id, count]) => ({ id, label: areaLabel(id), count }))}
                selected={p.selectedAreas}
                onToggle={p.onToggleArea}
              />
            </Section>
          )}

          <Section
            title="Categories"
            summary={summarize(p.activeCats, categoryLabel)}
            defaultOpen
          >
            <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              {zeroLast.map(({ id, count }) => {
                const on = p.activeCats.includes(id)
                const fav = p.favourites.includes(id)
                const disabled = count === 0 && !on
                return (
                  <li
                    key={id}
                    className={`flex min-h-10 items-stretch overflow-hidden rounded-lg border-2 ${on ? ROW_ON : ROW_OFF} ${
                      count === 0 ? 'opacity-60' : ''
                    }`}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      aria-pressed={on}
                      onClick={() => p.onToggleCat(id)}
                      className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 px-3 text-left text-sm disabled:cursor-not-allowed"
                    >
                      <span className="truncate">
                        {on ? '✓ ' : ''}
                        {categoryLabel(id)}
                      </span>
                      <span className="text-xs opacity-70">{count}</span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={fav}
                      aria-label={`${fav ? 'Remove' : 'Add'} ${categoryLabel(id)} ${fav ? 'from' : 'to'} favourites`}
                      onClick={() => p.onToggleFavourite(id)}
                      className="flex size-10 shrink-0 items-center justify-center text-base"
                    >
                      {fav ? '★' : '☆'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Section>

          {(p.cityCounts.length > 1 || p.selectedCities.length > 0) && (
            <Section
              title="Cities"
              summary={summarize(p.selectedCities, (c) => c)}
              defaultOpen={p.selectedCities.length > 0}
            >
              <CityChecklist cityCounts={p.cityCounts} selected={p.selectedCities} onToggle={p.onToggleCity} />
            </Section>
          )}

          {p.canShowHidden && (
            <label className="mt-2 flex min-h-10 items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-200">
              Show hidden
              <input
                type="checkbox"
                role="switch"
                checked={p.showHidden}
                onChange={(e) => p.onShowHidden(e.target.checked)}
                className="size-5"
              />
            </label>
          )}
        </>
      )}
    </Sheet>
  )
}
