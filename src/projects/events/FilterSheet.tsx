import { useState } from 'react'
import { Sheet } from '../../components/Sheet'
import { Button } from '../../components/Button'
import { categoryLabel } from './model'

const ROW_ON =
  'border-indigo-700 bg-indigo-600 text-white dark:border-indigo-300 dark:bg-indigo-500'
const ROW_OFF =
  'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200'
const TOP_CITIES = 8

interface Props {
  open: boolean
  onClose: () => void
  catOrder: string[]
  catCounts: Map<string, number>
  activeCats: string[]
  favourites: string[]
  cityCounts: [string, number][]
  selectedCities: string[]
  showHidden: boolean
  canShowHidden: boolean
  total: number
  onToggleCat: (id: string) => void
  onToggleFavourite: (id: string) => void
  onToggleCity: (city: string) => void
  onShowHidden: (v: boolean) => void
  onClearAll: () => void
}

export function FilterSheet(p: Props) {
  const [allCities, setAllCities] = useState(false)
  const cities = allCities ? p.cityCounts : p.cityCounts.slice(0, TOP_CITIES)
  // Keep selected cities visible even when outside the top list.
  const shown = allCities
    ? cities
    : [...cities, ...p.cityCounts.filter(([c], i) => i >= TOP_CITIES && p.selectedCities.includes(c))]

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
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        Categories
      </h3>
      <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
        {p.catOrder.map((id) => {
          const on = p.activeCats.includes(id)
          const fav = p.favourites.includes(id)
          const count = p.catCounts.get(id) ?? 0
          const disabled = count === 0 && !on
          return (
            <li
              key={id}
              className={`flex min-h-10 items-stretch overflow-hidden rounded-lg border-2 ${on ? ROW_ON : ROW_OFF} ${
                disabled ? 'opacity-50' : ''
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

      {p.cityCounts.length > 1 && (
        <>
          <h3 className="mt-5 mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Cities
          </h3>
          <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
            {shown.map(([city, n]) => {
              const on = p.selectedCities.includes(city)
              return (
                <li key={city}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => p.onToggleCity(city)}
                    className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border-2 px-3 text-left text-sm ${
                      on ? ROW_ON : ROW_OFF
                    }`}
                  >
                    <span className="truncate">
                      {on ? '✓ ' : ''}
                      {city}
                    </span>
                    <span className="text-xs opacity-70">{n}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {p.cityCounts.length > TOP_CITIES && (
            <button
              type="button"
              onClick={() => setAllCities((v) => !v)}
              className="mt-2 min-h-10 text-sm text-indigo-600 underline dark:text-indigo-400"
            >
              {allCities ? 'Show fewer cities' : `Show all ${p.cityCounts.length} cities`}
            </button>
          )}
        </>
      )}

      {p.canShowHidden && (
        <label className="mt-4 flex min-h-10 items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-200">
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
    </Sheet>
  )
}
