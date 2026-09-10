import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LinkItem } from '../../lib/db'
import {
  addLink,
  addTag,
  deleteLink,
  normalizeTag,
  normalizeUrl,
  removeTag,
  sync,
  toggleRead,
  updateLink,
} from '../../lib/linksSync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { Snackbar } from '../../components/Snackbar'
import { SwipeableRow } from '../../components/SwipeableRow'
import { SkeletonList } from '../../components/Skeleton'

// Mirrors MAX_TAGS in linksSync.ts / the links_tags_max_count SQL constraint —
// the UI stops at the same wall the mutation and the server enforce.
const MAX_TAGS = 10
const MAX_TAG_LENGTH = 30
// One shared <datalist> for every add-tag input on the page.
const TAG_OPTIONS_ID = 'link-tag-options'
// Tags shown inline on a collapsed row before they collapse into "+N".
const ROW_TAG_LIMIT = 3

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function Links() {
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const [text, setText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  // Filter selection is deliberately component state — never persisted.
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const raw = useLiveQuery(() => db.links.orderBy('createdAt').reverse().toArray())
  // Unread first, then newest-first within each group — a stable sort keeps
  // the createdAt-desc order the query already produced.
  const links = raw ? [...raw].sort((a, b) => a.read - b.read) : raw
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  const canAdd = normalizeUrl(text) !== null

  // Every distinct tag in use, most-used first then alphabetically. Computed
  // over the same live query result — no second Dexie round-trip.
  const tagCounts = new Map<string, number>()
  for (const link of links ?? []) {
    for (const tag of link.tags ?? []) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }
  const allTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)

  // AND semantics: a link shows only if it carries EVERY selected tag.
  const filtering = selectedTags.length > 0
  const visible = links?.filter((l) => selectedTags.every((t) => (l.tags ?? []).includes(t)))

  function toggleTagFilter(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    )
  }

  function clearFilters() {
    setSelectedTags([])
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!canAdd) return
    await addLink(text)
    setText('')
  }

  function toggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id))
  }

  async function toggle(link: LinkItem) {
    await toggleRead(link)
  }

  // A blanked title would leave the row with nothing to tap, so restore the
  // saved one in the field rather than writing an empty string.
  async function saveTitle(link: LinkItem, input: HTMLInputElement) {
    const trimmed = input.value.trim()
    if (!trimmed) {
      input.value = link.title
      return
    }
    if (trimmed === link.title) return
    await updateLink(link, { title: trimmed })
  }

  async function saveNotes(link: LinkItem, notes: string) {
    if (notes === link.notes) return
    await updateLink(link, { notes })
  }

  // Commits the add-tag field (Enter and blur both land here). The field is
  // cleared only when the tag actually landed, so a rejected entry stays on
  // screen to be fixed instead of vanishing silently.
  async function commitTag(link: LinkItem, input: HTMLInputElement) {
    const tag = normalizeTag(input.value)
    if (!tag) {
      if (!input.value.trim()) input.value = ''
      return
    }
    const tags = link.tags ?? []
    if (tags.length >= MAX_TAGS) return
    if (tags.includes(tag)) {
      input.value = ''
      return
    }
    await addTag(link, tag)
    input.value = ''
  }

  // Clipboard access is unavailable in insecure contexts and can be denied
  // outright, so a failure must not surface as an unhandled rejection.
  async function copyLink(link: LinkItem) {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(link.url)
    } catch {
      return
    }
    setCopiedId(link.id)
    setTimeout(() => setCopiedId((current) => (current === link.id ? null : current)), 1500)
  }

  // Delete executes immediately (same call as always); the snapshot lets
  // Undo re-insert the exact same row via a normal engine upsert.
  async function remove(link: LinkItem) {
    if (expandedId === link.id) setExpandedId(null)
    await deleteLink(link.id)
    trigger(`Deleted "${link.title}" · Undo`, () => sync.upsert('links', link))
  }

  const renderLink = (link: LinkItem) => {
    const expanded = expandedId === link.id
    const read = link.read === 1
    const tags = link.tags ?? []
    const rowTags = tags.slice(0, ROW_TAG_LIMIT)
    const hiddenTagCount = tags.length - rowTags.length
    const full = tags.length >= MAX_TAGS
    return (
      <li key={link.id}>
        <SwipeableRow onSwipeRight={() => void toggle(link)} onSwipeLeft={() => void remove(link)}>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => void toggle(link)}
              aria-label={read ? 'Mark as unread' : 'Mark as read'}
              className="flex min-h-12 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              {read ? '●' : '○'}
            </button>
            <button
              type="button"
              onClick={() => toggleExpand(link.id)}
              className="flex min-h-12 w-full min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              <span className={`w-full min-w-0 truncate ${read ? 'text-slate-500 line-through' : ''}`}>
                {link.title}
              </span>
              {/* Hostname keeps the whole remaining width and truncates; the
                  chips are shrink-0 but individually capped, so a 30-char tag
                  can't push the line past the row at 320px. */}
              <span className="flex w-full min-w-0 items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="min-w-0 flex-1 truncate">{hostname(link.url)}</span>
                {rowTags.map((tag) => (
                  <span
                    key={tag}
                    className="max-w-18 shrink-0 truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
                {hiddenTagCount > 0 && (
                  <span className="shrink-0 text-[10px] text-slate-500 dark:text-slate-400">
                    +{hiddenTagCount}
                  </span>
                )}
              </span>
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${link.title}`}
              className="flex min-h-12 min-w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-lg transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800"
            >
              ↗
            </a>
          </div>
        </SwipeableRow>
        {expanded && (
          <div className="mt-2 space-y-2">
            <input
              key={`title-${link.id}`}
              defaultValue={link.title}
              onBlur={(e) => void saveTitle(link, e.target)}
              maxLength={300}
              placeholder="Title…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <textarea
              key={`notes-${link.id}`}
              defaultValue={link.notes}
              onBlur={(e) => void saveNotes(link, e.target.value)}
              placeholder="Notes…"
              rows={3}
              maxLength={2000}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            {/* Tag editor: current tags as removable chips + an add field. */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex min-h-10 items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100 pr-0.5 pl-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span className="max-w-40 truncate">{tag}</span>
                  <button
                    type="button"
                    onClick={() => void removeTag(link, tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 active:bg-slate-300 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:active:bg-slate-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {full ? (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {MAX_TAGS} tags max
                </span>
              ) : (
                <input
                  key={`tag-${link.id}`}
                  list={TAG_OPTIONS_ID}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return
                    e.preventDefault()
                    void commitTag(link, e.currentTarget)
                  }}
                  onBlur={(e) => void commitTag(link, e.target)}
                  maxLength={MAX_TAG_LENGTH}
                  placeholder="Add tag…"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  aria-label={`Add a tag to ${link.title}`}
                  className="min-h-10 w-32 rounded-full border border-slate-300 bg-white px-3.5 text-xs placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              )}
            </div>
            {/* Swipe-left deletes too, but that's invisible on a desktop and
                unreachable by keyboard — so the row's delete lives here. */}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => void copyLink(link)}>
                {copiedId === link.id ? 'Copied ✓' : '🔗 Copy'}
              </Button>
              <Button
                variant="danger"
                onClick={() => void remove(link)}
                aria-label={`Delete ${link.title}`}
              >
                ✕ Delete
              </Button>
            </div>
          </div>
        )}
      </li>
    )
  }

  return (
    <div>
      <PageHeader emoji="🔗" title="Links" subtitle="Save links to read later. Saved on this device." />

      <SyncCard sync={sync} />

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={2000}
          placeholder="Paste a URL…"
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
        <Button type="submit" disabled={!canAdd}>
          Add
        </Button>
      </form>

      {/* Autocomplete source for every add-tag field, so a repeat tag is
          picked rather than retyped into a near-duplicate. */}
      <datalist id={TAG_OPTIONS_ID}>
        {allTags.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>

      {/* Tag filter bar. Scrolls horizontally with a full-bleed gutter so
          chips don't clip on a phone; Clear sits first so it never scrolls
          out of reach. Rendered while a selection exists even if its tags
          are gone, otherwise the filter could get stuck on with no way out. */}
      {(allTags.length > 0 || filtering) && (
        <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
          <div className="flex w-max items-center gap-2">
            {filtering && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-10 shrink-0 rounded-full border-2 border-slate-300 bg-white px-3.5 text-xs font-medium whitespace-nowrap text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                ✕ Clear
              </button>
            )}
            {allTags.map((tag) => {
              const on = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTagFilter(tag)}
                  aria-pressed={on}
                  className={`min-h-10 max-w-48 shrink-0 truncate rounded-full border-2 px-3.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    on
                      ? 'border-indigo-700 bg-indigo-600 text-white dark:border-indigo-300 dark:bg-indigo-500 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {on ? `✓ ${tag}` : tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {links === undefined || visible === undefined ? (
        <SkeletonList rows={4} rowClassName="h-12" />
      ) : links.length === 0 ? (
        <EmptyState
          emoji="🔗"
          title="No links yet"
          hint={
            isGuestViewer
              ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
              : 'Links you save are kept on this device and work offline.'
          }
        />
      ) : visible.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            emoji="🏷️"
            title="No links with these tags"
            hint={`Nothing carries ${selectedTags.map((t) => `"${t}"`).join(' + ')}.`}
          />
          <div className="flex justify-center">
            <Button variant="ghost" onClick={clearFilters}>
              ✕ Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">{visible.map(renderLink)}</ul>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
