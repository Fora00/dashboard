import { useState } from 'react'
import type { LifeEntry, LifePlan } from '../../../lib/db'
import { buildExportMarkdown } from '../model'
import { useFlash } from '../../../lib/useFlash'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { CollapsibleSection } from './CollapsibleSection'

export function ExportSection({
  plan,
  entries,
  open,
  onToggle,
  readOnly,
}: {
  plan: LifePlan
  entries: LifeEntry[]
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  // "Copied ✓" on the button for 2s; when the clipboard is unavailable the
  // text is shown in a textarea instead (fallbackText).
  const [copied, flashCopied] = useFlash(2000)
  const [fallbackText, setFallbackText] = useState<string | null>(null)

  async function doExport() {
    const md = buildExportMarkdown(plan, entries)
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(md)
        setFallbackText(null)
        flashCopied()
        return
      } catch {
        // fall through to the textarea fallback below
      }
    }
    setFallbackText(md)
  }

  async function doShare() {
    const md = buildExportMarkdown(plan, entries)
    try {
      await navigator.share({ title: `Week of ${plan.week}`, text: md })
    } catch {
      // cancelled or unavailable — nothing to do
    }
  }

  return (
    <CollapsibleSection title="Export" open={open} onToggle={onToggle} readOnly={readOnly}>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        Copies a summary of this week — focus, trackers with energy, Sunday answers, check-ins, tasks — to paste
        into /settimana on your Mac.
      </p>
      <Card className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void doExport()}>{copied && fallbackText === null ? 'Copied ✓' : '📋 Export week'}</Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button variant="ghost" onClick={() => void doShare()}>
              Share
            </Button>
          )}
        </div>
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
