import { comboLabel } from '../lib/useHotkey'
import { scopeTitles, shortcuts, type ShortcutScope } from '../lib/shortcuts'
import { Sheet } from './Sheet'

// The help sheet: renders lib/shortcuts.ts grouped by scope, so it can never
// drift from what the pages bind.
export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scopes = (Object.keys(scopeTitles) as ShortcutScope[]).filter((s) => shortcuts.some((x) => x.scope === s))
  return (
    <Sheet open={open} onClose={onClose} title="Keyboard shortcuts">
      <div className="space-y-5 pb-2">
        {scopes.map((scope) => (
          <section key={scope} aria-label={scopeTitles[scope]}>
            <h3 className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{scopeTitles[scope]}</h3>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {shortcuts
                .filter((s) => s.scope === scope)
                .map((s) => (
                  <li key={s.id} className="flex min-h-10 items-center justify-between gap-4 py-1.5 text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{s.label}</span>
                    <kbd className="shrink-0 rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 font-sans text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                      {comboLabel(s.combo)}
                    </kbd>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </Sheet>
  )
}
