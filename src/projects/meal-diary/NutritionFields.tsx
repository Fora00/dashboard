import { lazy, Suspense, useState } from 'react'
import { Button } from '../../components/Button'
import { estimate, parseAmount, type NutritionField, type NutritionForm } from './nutrition'
import { LookupError, lookupProducts, scaleProduct, type Product } from './openFoodFacts'

// The optional nutrition inputs of an entry plus the "estimate" hint. State is
// kept as raw strings by the parent so an empty field stays empty (= null).

const FIELDS: { key: NutritionField; label: string; unit: string }[] = [
  { key: 'grams', label: 'Grams', unit: 'g' },
  { key: 'kcal', label: 'Calories', unit: 'kcal' },
  { key: 'proteinG', label: 'Protein', unit: 'g' },
  { key: 'carbsG', label: 'Carbs', unit: 'g' },
  { key: 'fatG', label: 'Fat', unit: 'g' },
]

const BOX =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800'

interface Props {
  text: string
  value: NutritionForm
  onChange: (next: NutritionForm) => void
}

export function NutritionFields({ text, value, onChange }: Props) {
  const est = estimate(text, parseAmount(value.grams, 'grams'))
  const hasValues = Boolean(value.kcal || value.proteinG || value.carbsG || value.fatG)

  function edit(key: NutritionField, raw: string) {
    // Typing a value yourself makes it yours again: no longer an estimate.
    onChange({ ...value, [key]: raw, estimated: key === 'grams' ? value.estimated : false })
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="min-w-0 text-xs text-slate-500 dark:text-slate-400">
            {f.label}
            <input
              value={value[f.key]}
              onChange={(e) => edit(f.key, e.target.value.replace(/[^\d.,]/g, ''))}
              inputMode="numeric"
              placeholder={f.unit}
              autoComplete="off"
              className={`${BOX} mt-0.5 text-center`}
            />
          </label>
        ))}
      </div>
      {est && !hasValues && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-200">
          <span>
            ≈ {est.kcal} kcal · P {est.proteinG} · C {est.carbsG} · F {est.fatG}
            <span className="block text-indigo-700/80 dark:text-indigo-300/80">
              {est.food.name}, {est.grams} g{est.typicalPortion ? ' (typical portion)' : ''}. Rough estimate.
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              onChange({
                grams: String(est.grams),
                kcal: String(est.kcal),
                proteinG: String(est.proteinG),
                carbsG: String(est.carbsG),
                fatG: String(est.fatG),
                estimated: true,
              })
            }
          >
            Use
          </Button>
        </div>
      )}
      <ProductLookup text={text} value={value} onChange={onChange} />
    </div>
  )
}

const BarcodeScanner = lazy(() => import('./BarcodeScanner'))

// Optional "look up a packaged product" (Open Food Facts). Online only; every
// failure is a message and the form keeps working by hand or with the estimate.
function ProductLookup({ text, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  async function search(q = query) {
    setBusy(true)
    setError(null)
    try {
      setResults(await lookupProducts(q))
    } catch (e) {
      setResults(null)
      setError(e instanceof LookupError ? e.message : 'Lookup failed.')
    } finally {
      setBusy(false)
    }
  }

  function pick(p: Product) {
    const v = scaleProduct(p, parseAmount(value.grams, 'grams'))
    const s = (n: number | null) => (n === null ? '' : String(n))
    // Label values scaled to the grams: data from the package, not an estimate.
    onChange({ grams: String(v.grams), kcal: String(v.kcal), proteinG: s(v.proteinG), carbsG: s(v.carbsG), fatG: s(v.fatG), estimated: false })
    setOpen(false)
    setResults(null)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setQuery(text.trim())
          setOpen(true)
        }}
        className="min-h-10 text-xs text-indigo-600 underline dark:text-indigo-300"
      >
        Look up a packaged product
      </button>
    )
  }

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (query.trim() && !busy) void search()
            }
          }}
          aria-label="Product name or barcode"
          placeholder="Product name or barcode"
          autoComplete="off"
          className={BOX}
        />
        <Button type="button" disabled={busy || !query.trim()} onClick={() => void search()}>
          {busy ? '…' : 'Search'}
        </Button>
        <Button type="button" variant="ghost" aria-label="Scan a barcode" onClick={() => setScanning((v) => !v)}>
          📷
        </Button>
        <Button type="button" variant="ghost" aria-label="Close lookup" onClick={() => setOpen(false)}>
          ✕
        </Button>
      </div>
      {scanning && (
        <Suspense fallback={<p className="text-xs text-slate-500">Starting the camera…</p>}>
          <BarcodeScanner
            onClose={() => setScanning(false)}
            onDetect={(code) => {
              setScanning(false)
              setQuery(code)
              void search(code)
            }}
          />
        </Suspense>
      )}
      {error && <p className="text-xs text-rose-700 dark:text-rose-400">{error} You can still type the values.</p>}
      {results && results.length === 0 && <p className="text-xs text-slate-500">Nothing found.</p>}
      {results && results.length > 0 && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((p) => (
            <li key={p.code || p.name}>
              <button type="button" onClick={() => pick(p)} className="min-h-10 w-full py-1.5 text-left text-sm">
                {p.name}
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {p.brand ? `${p.brand} · ` : ''}
                  {p.per100.kcal} kcal / 100 g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-slate-500">
        Data from{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" className="underline">
          Open Food Facts
        </a>{' '}
        (ODbL). Values are per 100 g, scaled to your grams (100 g if empty).
      </p>
    </div>
  )
}
