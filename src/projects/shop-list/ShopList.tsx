import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ShopItem } from '../../lib/db'
import { syncEnabled } from '../../lib/sync'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'

export function ShopList() {
  const [text, setText] = useState('')
  const items = useLiveQuery(() => db.shopItems.orderBy('createdAt').toArray())

  const open = items?.filter((i) => i.done === 0) ?? []
  const bought = items?.filter((i) => i.done === 1) ?? []

  async function addItem(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    await db.shopItems.add({
      id: crypto.randomUUID(),
      text: trimmed,
      done: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    setText('')
  }

  async function toggle(item: ShopItem) {
    await db.shopItems.update(item.id, {
      done: item.done === 0 ? 1 : 0,
      updatedAt: Date.now(),
    })
  }

  async function clearBought() {
    await db.shopItems.where('done').equals(1).delete()
  }

  const renderItem = (item: ShopItem) => (
    <li key={item.id}>
      <button
        type="button"
        onClick={() => toggle(item)}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 px-4 text-left transition-colors hover:border-slate-600 active:bg-slate-800"
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
            item.done === 1
              ? 'border-emerald-400 bg-emerald-400 text-slate-900'
              : 'border-slate-500'
          }`}
        >
          {item.done === 1 && '✓'}
        </span>
        <span className={item.done === 1 ? 'text-slate-500 line-through' : ''}>
          {item.text}
        </span>
      </button>
    </li>
  )

  return (
    <div>
      <PageHeader
        emoji="🛒"
        title="Shop List"
        subtitle="Tap an item to mark it as bought."
      />

      <form onSubmit={addItem} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add something to buy…"
          autoComplete="off"
          enterKeyHint="done"
          className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <Button type="submit" disabled={!text.trim()}>
          Add
        </Button>
      </form>

      {!syncEnabled && (
        <Card className="mb-6 text-sm text-slate-400">
          👥 Sharing with guests needs cloud sync, which isn't configured yet —
          for now the list lives on this device only. See ROADMAP.md.
        </Card>
      )}

      {items === undefined ? null : items.length === 0 ? (
        <EmptyState
          emoji="🧺"
          title="List is empty"
          hint="Items you add are saved on this device and work offline."
        />
      ) : (
        <div className="space-y-6">
          {open.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-slate-400">
                To buy · {open.length}
              </h2>
              <ul className="space-y-2">{open.map(renderItem)}</ul>
            </section>
          )}
          {bought.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-400">
                  Bought · {bought.length}
                </h2>
                <Button variant="danger" onClick={clearBought}>
                  Clear bought
                </Button>
              </div>
              <ul className="space-y-2">{bought.map(renderItem)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
