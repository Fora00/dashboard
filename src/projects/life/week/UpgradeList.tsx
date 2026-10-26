import { useState } from 'react'
import type { LifeUpgradeEntry, LifeUpgradeSize } from '../../../lib/db'
import { addUpgrade, removeUpgrade, restoreEntry, updateUpgrade } from '../../../lib/lifeSync'
import { runSafe } from '../../../lib/runSafe'
import { LIFE_CAPS, summarizeUpgrades } from '../model'
import { CollapsibleSection } from './CollapsibleSection'
import { useUpgradeList } from './useUpgradeList'

// "Upgrade list": small annoyances to fix, kept across weeks. Not a to-do list
// (nothing goes to Things). Rule it supports: annoyed a second time -> on the
// list; under 2 minutes -> fix it now; one weekly slot clears 1-2 items.
// Tap an item to mark it done (tap again to undo); ⋯ edits, moves, drops, deletes.

const SIZE_LABEL: Record<LifeUpgradeSize, string> = { quick: 'Quick', big: 'Bigger' }

function Row({
  item,
  trigger,
}: {
  item: LifeUpgradeEntry
  trigger: (label: string, undo: () => void | Promise<void>) => void
}) {
  const [menu, setMenu] = useState(false)
  const done = item.value.status === 'done'
  const save = runSafe(updateUpgrade, 'Could not save')

  async function toggleDone() {
    if (done) return updateUpgrade(item, { status: 'open' })
    await updateUpgrade(item, { status: 'done' })
    trigger('✓ Upgrade done', () =>
      updateUpgrade({ ...item, value: { ...item.value, status: 'done' } }, { status: 'open' }),
    )
  }

  return (
    <li className="py-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          onClick={() => void runSafe(toggleDone, 'Could not save')()}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-1 text-left text-sm"
        >
          <span
            aria-hidden
            className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${
              done ? 'border-emerald-400/60 bg-emerald-400/20' : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {done ? '✓' : ''}
          </span>
          <span className={done ? 'text-slate-500 line-through dark:text-slate-400' : ''}>{item.value.text}</span>
        </button>
        <button
          type="button"
          aria-label={`Options for ${item.value.text}`}
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ⋯
        </button>
      </div>
      {menu && (
        <div className="mt-1 space-y-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-900/60">
          <input
            // Remount when another device changes the text.
            key={item.value.text}
            type="text"
            defaultValue={item.value.text}
            maxLength={LIFE_CAPS.upgradeText}
            aria-label="Edit upgrade"
            onBlur={(ev) => {
              if (ev.target.value.trim() && ev.target.value.trim() !== item.value.text)
                void save(item, { text: ev.target.value })
              else ev.target.value = item.value.text
            }}
            className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={() => void save(item, { size: item.value.size === 'quick' ? 'big' : 'quick' })}
              className="min-h-10 rounded-lg border border-slate-200 px-3 dark:border-slate-700"
            >
              Move to {item.value.size === 'quick' ? 'Bigger' : 'Quick'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenu(false)
                void runSafe(async () => {
                  await updateUpgrade(item, { status: 'dropped' })
                  trigger('Dropped', () => restoreEntry(item))
                }, 'Could not save')()
              }}
              className="min-h-10 rounded-lg border border-slate-200 px-3 dark:border-slate-700"
            >
              Drop
            </button>
            <button
              type="button"
              onClick={() =>
                void runSafe(async () => {
                  await removeUpgrade(item.id)
                  trigger('Deleted', () => restoreEntry(item))
                }, 'Could not delete')()
              }
              className="min-h-10 rounded-lg border border-slate-200 px-3 text-rose-600 dark:border-slate-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

function Group({
  title,
  items,
  trigger,
}: {
  title: string
  items: LifeUpgradeEntry[]
  trigger: (label: string, undo: () => void | Promise<void>) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="mt-3">
      <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((i) => (
          <Row key={i.id} item={i} trigger={trigger} />
        ))}
      </ul>
    </div>
  )
}

export function UpgradeList({
  week,
  open,
  onToggle,
  trigger,
}: {
  week: string
  open: boolean
  onToggle: () => void
  trigger: (label: string, undo: () => void | Promise<void>) => void
}) {
  const entries = useUpgradeList()
  const [draft, setDraft] = useState('')
  const [size, setSize] = useState<LifeUpgradeSize>('quick')
  const [showDone, setShowDone] = useState(false)
  const s = summarizeUpgrades(entries ?? [], week)
  const counts = `${s.openCount} open · ${s.doneThisWeek.length} done this week`

  async function add() {
    const entry = await addUpgrade(week, draft, size)
    if (entry) setDraft('')
  }

  return (
    <CollapsibleSection title="🛠️ Upgrade list" summary={counts} open={open} onToggle={onToggle} readOnly={false}>
      <p className="text-xs text-slate-500 dark:text-slate-400">{counts}</p>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(ev) => {
          ev.preventDefault()
          void runSafe(add, 'Could not save')()
        }}
      >
        <input
          type="text"
          value={draft}
          maxLength={LIFE_CAPS.upgradeText}
          onChange={(ev) => setDraft(ev.target.value)}
          placeholder="What annoyed you again?"
          aria-label="New upgrade"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={() => setSize((z) => (z === 'quick' ? 'big' : 'quick'))}
          aria-label={`Size: ${SIZE_LABEL[size]} (tap to change)`}
          className="min-h-11 shrink-0 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700"
        >
          {SIZE_LABEL[size]}
        </button>
      </form>
      {s.nudge && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">1-2 this week?</p>}
      {entries && s.openCount === 0 && s.done.length === 0 && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nothing on the list.</p>
      )}
      <Group title="Veloci" items={s.quick} trigger={trigger} />
      <Group title="Più grandi" items={s.big} trigger={trigger} />
      {s.done.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            aria-expanded={showDone}
            onClick={() => setShowDone((d) => !d)}
            className="min-h-10 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {showDone ? '▾' : '▸'} Done ({s.done.length})
          </button>
          {showDone && (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {s.done.map((i) => (
                <Row key={i.id} item={i} trigger={trigger} />
              ))}
            </ul>
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}
