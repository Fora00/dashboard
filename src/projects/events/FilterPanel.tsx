import { useState, type ReactNode } from 'react'
import { Chip } from '../../components/Chip'
import { rowTone } from '../../components/chipTone'
import { FOCUS_RING_INSET } from '../../components/focus'
import { categoryLabel } from './model'
import { DISTANCE_STEPS, NEAR_MINUTES, minutesLabel } from './distance'
import { FORMAT_CHIPS, formatLabel } from './format'
import { categoryOfSubcategory, subLabel, subcategoriesOf } from './subcategories'

/** Everything the filters need; shared by the sheet (< lg) and the rail (lg+). */
export interface FilterPanelProps {
  catOrder: string[]
  catCounts: Map<string, number>
  activeCats: string[]
  favourites: string[]
  /** Events within each distance step (max driving minutes from Rovereto). */
  distanceCounts: Map<number, number>
  maxMin: number | null
  onToggleMaxMin: (m: number) => void
  formatCounts: Map<string, number>
  selectedFormats: string[]
  onToggleFormat: (id: string) => void
  /** Events per subcategory id (respecting every filter except the subcategory one). */
  subCounts: Map<string, number>
  /** Per category with an active subcategory filter: events hidden for having no subcategory. */
  noSubHidden: Map<string, number>
  selectedSubs: string[]
  onToggleSub: (id: string) => void
  showHidden: boolean
  canShowHidden: boolean
  /** Any filter of the panel is active: the Reset at the top is shown. */
  canReset: boolean
  total: number
  onToggleCat: (id: string) => void
  onToggleFavourite: (id: string) => void
  onShowHidden: (v: boolean) => void
  onClearAll: () => void
}

/**
 * 'sheet': inside the bottom sheet (two option columns from 400px, sticky
 * Reset row under the sheet title). 'rail': the narrow permanent column on
 * wide screens (one option column, plain header).
 */
export type FilterVariant = 'sheet' | 'rail'

/** "Area" + " · Trentino" (one selected) or " · 2". Nothing when none. */
function summarize(selected: string[], label: (id: string) => string): string {
  if (selected.length === 0) return ''
  return selected.length === 1 ? label(selected[0] ?? '') : String(selected.length)
}

/**
 * Collapsible section. `defaultOpen` only seeds the state when the panel
 * mounts (the sheet body is mounted per opening), so ticking something inside
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
        className={`flex min-h-10 w-full items-center justify-between gap-2 text-left ${FOCUS_RING_INSET}`}
      >
        <span className="min-w-0 truncate text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {title}
          {summary && <span className="text-(--accent-border)"> · {summary}</span>}
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
  gridClass,
}: {
  items: { id: string; label: string; count: number }[]
  selected: string[]
  onToggle: (id: string) => void
  gridClass: string
}) {
  const sorted = [...items].sort((a, b) => Number(a.count === 0) - Number(b.count === 0))
  return (
    <ul className={gridClass}>
      {sorted.map(({ id, label, count }) => {
        const on = selected.includes(id)
        const disabled = count === 0 && !on
        return (
          <li key={id}>
            <Chip
              shape="row"
              active={on}
              count={count}
              disabled={disabled}
              onClick={() => onToggle(id)}
              className={count === 0 ? 'opacity-60' : ''}
            >
              {label}
            </Chip>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Second-level filter: the subcategories of the selected category. With
 * several selected categories that have some, a row of category chips picks
 * which one to look at (local state; the picks themselves are all kept).
 */
function SubcategorySection({ p, gridClass }: { p: FilterPanelProps; gridClass: string }) {
  const [picked, setPicked] = useState<string | null>(null)
  const withSubs = p.activeCats.filter((c) => subcategoriesOf(c).length > 0)
  if (withSubs.length === 0) return null
  const cat =
    withSubs.length === 1 ? (withSubs[0] ?? '') : withSubs.includes(picked ?? '') ? (picked ?? '') : (withSubs[0] ?? '')
  const items = subcategoriesOf(cat).map((s) => ({ id: s.id, label: s.label, count: p.subCounts.get(s.id) ?? 0 }))
  const mine = p.selectedSubs.filter((id) => categoryOfSubcategory(id) === cat)
  const hidden = mine.length > 0 ? (p.noSubHidden.get(cat) ?? 0) : 0
  return (
    <Section
      title="Sottocategoria"
      summary={summarize(p.selectedSubs, subLabel)}
      defaultOpen={withSubs.length === 1 || p.selectedSubs.length > 0}
    >
      {withSubs.length > 1 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {withSubs.map((c) => (
            <li key={c}>
              <Chip toggle={false} active={c === cat} onClick={() => setPicked(c)}>
                {categoryLabel(c)}
              </Chip>
            </li>
          ))}
        </ul>
      )}
      <OptionGrid gridClass={gridClass} items={items} selected={p.selectedSubs} onToggle={p.onToggleSub} />
      {hidden > 0 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hidden} senza sottocategoria nascosti</p>
      )}
    </Section>
  )
}

/** The filter controls themselves: Reset row, distance, categories (+ favourites), "Come", show hidden. */
export function FilterPanel({ variant, ...p }: FilterPanelProps & { variant: FilterVariant }) {
  const rail = variant === 'rail'
  const gridClass = rail ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 gap-2 min-[400px]:grid-cols-2'
  const cats = p.catOrder.map((id) => ({
    id,
    count: p.catCounts.get(id) ?? 0,
  }))
  const zeroLast = [...cats].sort((a, b) => Number(a.count === 0) - Number(b.count === 0))
  const totalLabel = `${p.total} ${p.total === 1 ? 'event' : 'events'}`

  return (
    <>
      {/* Sheet: sticky so Reset stays reachable while scrolling. The row is
          always rendered (button hidden) so nothing shifts when a filter turns on. */}
      <div
        className={
          rail
            ? 'mb-1 flex min-h-10 items-center justify-between gap-2'
            : 'sticky -top-3 z-10 -mx-4 -mt-3 mb-1 flex min-h-[3.25rem] items-center justify-between bg-white px-4 pt-3 dark:bg-slate-900'
        }
      >
        {rail ? (
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Filters{' '}
            <span className="font-normal text-slate-500 dark:text-slate-400" title={totalLabel}>
              · {p.total}
            </span>
          </h2>
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">{totalLabel}</span>
        )}
        <button
          type="button"
          onClick={p.onClearAll}
          className={`min-h-10 px-2 text-sm font-medium text-(--accent-border) underline ${FOCUS_RING_INSET} ${
            p.canReset ? '' : 'invisible'
          }`}
          tabIndex={p.canReset ? 0 : -1}
        >
          Reset
        </button>
      </div>

      <Section
        title="Distanza da Rovereto"
        summary={p.maxMin === null ? '' : `entro ${minutesLabel(p.maxMin)}`}
        defaultOpen
      >
        <ul className={gridClass}>
          {DISTANCE_STEPS.map((m) => (
            <li key={m}>
              <Chip
                shape="row"
                active={p.maxMin === m}
                count={p.distanceCounts.get(m) ?? 0}
                onClick={() => p.onToggleMaxMin(m)}
              >
                Entro {minutesLabel(m)}
                {m === NEAR_MINUTES ? ' · Vicino' : ''}
              </Chip>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Categories" summary={summarize(p.activeCats, categoryLabel)} defaultOpen>
        <ul className={gridClass}>
          {zeroLast.map(({ id, count }) => {
            const on = p.activeCats.includes(id)
            const fav = p.favourites.includes(id)
            const disabled = count === 0 && !on
            return (
              <li
                key={id}
                className={`flex min-h-10 items-stretch overflow-hidden rounded-lg border-2 ${rowTone(on)} ${
                  count === 0 ? 'opacity-60' : ''
                }`}
              >
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={on}
                  onClick={() => p.onToggleCat(id)}
                  className={`flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 px-3 text-left text-sm disabled:cursor-not-allowed ${FOCUS_RING_INSET}`}
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
                  className={`flex size-10 shrink-0 items-center justify-center text-base ${FOCUS_RING_INSET}`}
                >
                  {fav ? '★' : '☆'}
                </button>
              </li>
            )
          })}
        </ul>
      </Section>

      <SubcategorySection p={p} gridClass={gridClass} />

      <Section
        title="Come"
        summary={summarize(p.selectedFormats, formatLabel)}
        defaultOpen={p.selectedFormats.length > 0}
      >
        <OptionGrid
          gridClass={gridClass}
          items={FORMAT_CHIPS.map(({ id, label }) => ({
            id,
            label,
            count: p.formatCounts.get(id) ?? 0,
          }))}
          selected={p.selectedFormats}
          onToggle={p.onToggleFormat}
        />
      </Section>

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
  )
}
