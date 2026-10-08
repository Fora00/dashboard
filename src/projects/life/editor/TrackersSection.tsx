import { LIFE_CAPS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { inputClass, newId, removeAt, removeBtnClass, updateAt, type CapMode, type TrackerRow } from './rows'

export function TrackersSection({
  trackers,
  setTrackers,
}: {
  trackers: TrackerRow[]
  setTrackers: (v: TrackerRow[]) => void
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Trackers</h2>
      <div className="space-y-2">
        {trackers.map((tr, i) => (
          <Card key={tr.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={tr.emoji}
                onChange={(e) => setTrackers(updateAt(trackers, i, { emoji: e.target.value }))}
                maxLength={LIFE_CAPS.emoji}
                placeholder="🔹"
                aria-label="Tracker emoji"
                className={`${inputClass} w-16 text-center`}
              />
              <input
                value={tr.label}
                onChange={(e) => setTrackers(updateAt(trackers, i, { label: e.target.value }))}
                maxLength={LIFE_CAPS.trackerLabel}
                placeholder="Tracker label…"
                aria-label="Tracker label"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setTrackers(removeAt(trackers, i))}
                aria-label={`Remove tracker ${tr.label || i + 1}`}
                className={removeBtnClass}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
                {(['target', 'max'] as CapMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTrackers(updateAt(trackers, i, { capMode: mode }))}
                    aria-pressed={tr.capMode === mode}
                    className={`min-h-10 px-3.5 text-sm font-medium capitalize transition-colors ${
                      tr.capMode === mode
                        ? 'bg-(color:--accent-selected) text-(color:--accent-fg)'
                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={LIFE_CAPS.countMax}
                value={tr.capValue}
                onChange={(e) => setTrackers(updateAt(trackers, i, { capValue: e.target.value }))}
                placeholder="e.g. 3"
                aria-label={`${tr.capMode} value`}
                className={`${inputClass} w-24`}
              />
              <button
                type="button"
                onClick={() => setTrackers(updateAt(trackers, i, { energy: !tr.energy }))}
                aria-pressed={tr.energy}
                className={`flex min-h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors ${
                  tr.energy
                    ? 'border-(color:--accent-border) bg-(color:--accent-selected) text-(color:--accent-fg)'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                ⚡ Energy {tr.energy ? 'on' : 'off'}
              </button>
            </div>
          </Card>
        ))}
      </div>
      {trackers.length < LIFE_CAPS.trackers && (
        <div className="mt-2">
          <Button
            variant="ghost"
            onClick={() =>
              setTrackers([
                ...trackers,
                { id: newId(), emoji: '', label: '', capMode: 'target', capValue: '', energy: false },
              ])
            }
          >
            + Add tracker
          </Button>
        </div>
      )}
    </section>
  )
}
