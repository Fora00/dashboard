import { comboLabel } from '../lib/useHotkey'
import { gestures, layoutTips, scopeTitles, shortcuts, typingNote, type ShortcutScope } from '../lib/shortcuts'
import { Sheet } from './Sheet'

// The help sheet: renders lib/shortcuts.ts (keyboard, touch, layout tips), so
// it can never drift from what the pages bind. Sheet gives the dialog, focus
// trap and focus return; the body scrolls inside it.
const CAP =
  'inline-block rounded-md border border-b-2 border-slate-300 bg-slate-100 px-1.5 py-0.5 font-sans text-xs font-medium whitespace-nowrap text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

function Caps({ combo }: { combo: string }) {
  // "mod+k" -> separate caps for the modifier and the key.
  const parts = combo.split('+')
  if (combo === 'drag') return <kbd className={CAP}>Drag</kbd>
  if (combo === 'shift+click') return <kbd className={CAP}>{`${comboLabel('shift')} + click`}</kbd>
  return (
    <span className="inline-flex gap-1">
      {parts.map((p) => (
        <kbd key={p} className={CAP}>
          {comboLabel(p)}
        </kbd>
      ))}
    </span>
  )
}

const H = 'mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400'

export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scopes = (Object.keys(scopeTitles) as ShortcutScope[]).filter((s) => shortcuts.some((x) => x.scope === s))
  return (
    <Sheet open={open} onClose={onClose} title="Shortcuts and gestures">
      <div className="space-y-6 pb-2">
        <section aria-labelledby="help-keyboard">
          <h3 id="help-keyboard" className="text-base font-semibold">
            Keyboard
          </h3>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Mac, or iPad with a keyboard.</p>
          <div className="space-y-4">
            {scopes.map((scope) => (
              <div key={scope}>
                <h4 className={H}>{scopeTitles[scope]}</h4>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {shortcuts
                    .filter((s) => s.scope === scope)
                    .map((s) => (
                      <li key={s.id} className="flex min-h-10 items-start justify-between gap-3 py-2 text-sm">
                        <span className="min-w-0 text-slate-700 dark:text-slate-300">{s.description}</span>
                        <span className="shrink-0 pt-px">
                          <Caps combo={s.combo} />
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {typingNote}
          </p>
        </section>

        <section aria-labelledby="help-touch">
          <h3 id="help-touch" className="text-base font-semibold">
            Touch
          </h3>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">iPhone and iPad.</p>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {gestures.map((g) => (
              <li key={g.id} className="flex min-h-10 items-start justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 text-slate-700 dark:text-slate-300">{g.description}</span>
                <span className="shrink-0 pt-px">
                  <span className={CAP}>{g.gesture}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="help-layout">
          <h3 id="help-layout" className="mb-1 text-base font-semibold">
            Sidebar and layout
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {layoutTips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  )
}
