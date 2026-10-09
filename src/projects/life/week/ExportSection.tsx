import { useState } from 'react'
import type { EventMark, LifeEntry, LifePlan, MealEntry } from '../../../lib/db'
import { buildExportMarkdown } from '../model'
import { categoryLabel } from '../../events/model'
import { markExported } from '../lateEdit'
import { shareOrCopy } from '../../../lib/share'
import { useFlash } from '../../../lib/useFlash'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { CollapsibleSection } from './CollapsibleSection'

export function ExportSection({
  plan,
  entries,
  meals,
  eventMarks,
  favouriteCategories,
  open,
  onToggle,
  readOnly,
}: {
  plan: LifePlan
  entries: LifeEntry[]
  meals: MealEntry[]
  eventMarks: EventMark[]
  favouriteCategories: string[]
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  // "Copied ✓" on the button for 2s; when the clipboard is unavailable the
  // text is shown in a textarea instead (fallbackText).
  const [copied, flashCopied] = useFlash(2000)
  const [fallbackText, setFallbackText] = useState<string | null>(null)

  async function doExport() {
    const md = buildExportMarkdown(plan, entries, undefined, meals, {
      marks: eventMarks,
      favouriteCategories: favouriteCategories.map(categoryLabel),
    })
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(md)
        markExported(plan.week)
        setFallbackText(null)
        flashCopied()
        return
      } catch {
        // fall through to the textarea fallback below
      }
    }
    markExported(plan.week)
    setFallbackText(md)
  }

  async function doShare() {
    const md = buildExportMarkdown(plan, entries, undefined, meals, {
      marks: eventMarks,
      favouriteCategories: favouriteCategories.map(categoryLabel),
    })
    try {
      const outcome = await shareOrCopy(md, { title: `Week of ${plan.week}` })
      if (outcome !== 'cancelled') markExported(plan.week)
      if (outcome === 'copied') flashCopied()
    } catch {
      // cancelled or unavailable — nothing to do
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <CollapsibleSection title="Export" open={open} onToggle={onToggle} readOnly={readOnly}>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        Copies a summary of this week — focus, trackers with energy, Sunday answers, check-ins, tasks, food, saved
        events of next week — to paste into /settimana on your Mac. Exporting on or after Sunday also closes this week's
        late answers on this device.
      </p>
      <Card className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void doExport()}>
            {copied && fallbackText === null ? 'Copied ✓' : '📋 Export week'}
          </Button>
          {canShare && (
            <Button variant="ghost" onClick={() => void doShare()}>
              Share
            </Button>
          )}
        </div>
        {canShare && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sharing sends this week, food and saved events included, outside the app.
          </p>
        )}
        {fallbackText !== null && (
          <textarea
            readOnly
            aria-label="Week export text"
            value={fallbackText}
            rows={6}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        )}
      </Card>
    </CollapsibleSection>
  )
}
