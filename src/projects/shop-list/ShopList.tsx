import { useEffect, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ShopItem } from '../../lib/db'
import {
  addArea,
  addShopItem,
  clearBoughtItems,
  ensureDefaultArea,
  sync,
  toggleShopItem,
} from '../../lib/shopSync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { Snackbar } from '../../components/Snackbar'
import { SwipeableRow } from '../../components/SwipeableRow'
import { Skeleton, SkeletonList } from '../../components/Skeleton'
import { AreaManager } from './AreaManager'

const AREA_KEY = 'shop-list.selected-area'

export function ShopList() {
  const session = useAuth()
  const owner = useOwner()
  const [text, setText] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    () => localStorage.getItem(AREA_KEY),
  )
  const [addingArea, setAddingArea] = useState(false)
  const [areaName, setAreaName] = useState('')
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  const areas = useLiveQuery(() => db.shopAreas.orderBy('createdAt').toArray())

  // Local mode and the owner get a default area automatically; guests only
  // see areas that were shared with them.
  useEffect(() => {
    if (areas === undefined || areas.length > 0) return
    if (session === null || owner === true) void ensureDefaultArea()
  }, [areas, session, owner])

  const area = areas?.find((a) => a.id === selectedId) ?? areas?.[0]

  useEffect(() => {
    if (area) localStorage.setItem(AREA_KEY, area.id)
  }, [area])

  const items = useLiveQuery(
    () => (area ? db.shopItems.where('areaId').equals(area.id).sortBy('createdAt') : []),
    [area?.id],
  )

  const open = items?.filter((i) => i.done === 0) ?? []
  const bought = items?.filter((i) => i.done === 1) ?? []

  // Guests can't create areas; locally-unsynced users and the owner can.
  const canManageAreas = session === null || owner === true
  // Signed-in, non-owner viewer — used to swap empty-state copy to an
  // invite-aware message instead of a generic "nothing here" one.
  const isGuestViewer = Boolean(session) && owner === false

  async function addItem(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !area) return
    await addShopItem(trimmed, area.id)
    setText('')
  }

  async function createArea(e: FormEvent) {
    e.preventDefault()
    const name = areaName.trim()
    if (!name) return
    const created = await addArea(name)
    setSelectedId(created.id)
    setAreaName('')
    setAddingArea(false)
  }

  // No standalone "delete item" button exists in this UI — swipe-to-delete
  // is the only entry point, so it goes straight through the engine's
  // generic remove() (same helper deleteArea/clearBoughtItems build on).
  async function removeItem(item: ShopItem) {
    await sync.remove('shop_items', item.id)
    trigger(`Deleted "${item.text}" · Undo`, () => sync.upsert('shop_items', item))
  }

  async function clearBought() {
    if (!area) return
    const snapshot = bought
    await clearBoughtItems(area.id)
    trigger(
      snapshot.length === 1
        ? 'Cleared 1 bought item · Undo'
        : `Cleared ${snapshot.length} bought items · Undo`,
      async () => {
        for (const i of snapshot) await sync.upsert('shop_items', i)
      },
    )
  }

  const renderItem = (item: ShopItem) => (
    <li key={item.id}>
      <SwipeableRow onSwipeRight={() => void toggleShopItem(item)} onSwipeLeft={() => void removeItem(item)}>
        <button
          type="button"
          onClick={() => void toggleShopItem(item)}
          className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-left transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
        >
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
              item.done === 1
                ? 'border-emerald-400 bg-emerald-400 text-slate-900'
                : 'border-slate-400 dark:border-slate-500'
            }`}
          >
            {item.done === 1 && '✓'}
          </span>
          <span className={item.done === 1 ? 'text-slate-500 line-through' : ''}>
            {item.text}
          </span>
        </button>
      </SwipeableRow>
    </li>
  )

  return (
    <div>
      <PageHeader
        emoji="🛒"
        title="Shop List"
        subtitle="Areas keep lists separate — share each area with the people who need it."
      />

      <SyncCard sync={sync} />

      {areas === undefined ? (
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap gap-2">
          {areas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedId(a.id)}
              className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
                a.id === area?.id
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {a.name}
            </button>
          ))}
          {canManageAreas && !addingArea && (
            <button
              type="button"
              onClick={() => setAddingArea(true)}
              className="min-h-10 rounded-full border border-dashed border-slate-400 px-3.5 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
            >
              + Area
            </button>
          )}
        </div>
      )}

      {addingArea && (
        <form onSubmit={createArea} className="mb-4 flex gap-2">
          <input
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            placeholder="Area name, e.g. Pharmacy"
            autoFocus
            className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <Button type="submit" disabled={!areaName.trim()}>
            Create
          </Button>
          <Button variant="ghost" type="button" onClick={() => setAddingArea(false)}>
            ✕
          </Button>
        </form>
      )}

      {area && <AreaManager area={area} />}

      {!area ? (
        areas !== undefined && (
          <EmptyState
            emoji="🗂️"
            title="No areas yet"
            hint={
              canManageAreas
                ? 'Create an area to start a list.'
                : isGuestViewer
                  ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
                  : 'No areas have been shared with you yet — ask for an invite link.'
            }
          />
        )
      ) : (
        <>
          <form onSubmit={addItem} className="mb-6 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Add to ${area.name}…`}
              autoComplete="off"
              enterKeyHint="done"
              className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <Button type="submit" disabled={!text.trim()}>
              Add
            </Button>
          </form>

          {items === undefined ? (
            <SkeletonList rows={3} rowClassName="h-12" />
          ) : items.length === 0 ? (
            <EmptyState
              emoji="🧺"
              title={`${area.name} is empty`}
              hint="Items you add are saved on this device and sync when online."
            />
          ) : (
            <div className="space-y-6">
              {open.length > 0 && (
                <section>
                  <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    To buy · {open.length}
                  </h2>
                  <ul className="space-y-2">{open.map(renderItem)}</ul>
                </section>
              )}
              {bought.length > 0 && (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Bought · {bought.length}
                    </h2>
                    <Button variant="danger" onClick={() => void clearBought()}>
                      Clear bought
                    </Button>
                  </div>
                  <ul className="space-y-2">{bought.map(renderItem)}</ul>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
