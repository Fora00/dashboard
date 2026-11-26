import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Site, type SiteStatus } from '../../lib/db'
import { normalizeUrl } from '../../lib/normalizeUrl'
import {
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_URL_LENGTH,
  addManualSite,
  deleteSite,
  restoreSite,
  sync,
  updateSite,
} from '../../lib/sitiSync'
import { useFlash } from '../../lib/useFlash'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Chip } from '../../components/Chip'
import { EmptyState } from '../../components/EmptyState'
import { INPUT, TEXTAREA } from '../../components/field'
import { FOCUS_RING } from '../../components/focus'
import { PageHeader } from '../../components/PageHeader'
import { SkeletonList } from '../../components/Skeleton'
import { Snackbar } from '../../components/Snackbar'
import { Switch } from '../../components/Switch'
import { SyncCard } from '../../components/SyncCard'
import {
  FILTERS,
  STATUS_LABEL,
  agoIt,
  filterSites,
  hostOf,
  lastDeployAt,
  openNoteCounts,
  siteName,
  sortSites,
} from './sitesView'
import { SiteNotesPanel } from './SiteNotesPanel'
import { AddNoteSheet } from './AddNoteSheet'
import type { SiteFilter } from './sitesView'

// Siti (/siti, SI1): every website the owner publishes. GitHub Pages repos
// arrive through the import link (npm run sites:link -- --open →
// /siti/import); a site hosted elsewhere is added by hand. Tap a card to edit
// its name, notes, status and pin; delete has an Undo. Local-first: the whole
// page works signed out and offline against Dexie.

const STATUSES: SiteStatus[] = ['live', 'preview', 'archived']

const BADGE = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold'

export function Siti() {
  const raw = useLiveQuery(() => db.sites.toArray())
  const allNotes = useLiveQuery(() => db.siteNotes.toArray())
  const openCounts = openNoteCounts(allNotes ?? [])
  const [filter, setFilter] = useState<SiteFilter>('all')
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [copiedId, flashCopied] = useFlash<string>(1500)
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  const all = raw ? sortSites(raw) : undefined
  const visible = all ? filterSites(all, filter) : undefined
  const count = (f: SiteFilter) => (all ? filterSites(all, f).length : 0)
  const lastFetch = raw?.reduce<number | null>(
    (m, s) => (s.fetchedAt !== null && s.fetchedAt > (m ?? -1) ? s.fetchedAt : m),
    null,
  )
  const canAdd = normalizeUrl(newUrl) !== null

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!(await addManualSite(newUrl, newName))) return
    setNewUrl('')
    setNewName('')
    setAdding(false)
  }

  async function copyLink(site: Site) {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(site.url)
    } catch {
      return
    }
    flashCopied(site.id)
  }

  async function remove(site: Site) {
    if (editingId === site.id) setEditingId(null)
    const notes = await deleteSite(site.id)
    trigger(`Eliminato “${siteName(site)}” · Undo`, () => restoreSite(site, notes))
  }

  async function saveName(site: Site, input: HTMLInputElement) {
    const name = input.value.trim()
    if (name === site.name) return
    await updateSite(site, { name })
  }

  async function saveNotes(site: Site, notes: string) {
    if (notes === site.notes) return
    await updateSite(site, { notes })
  }

  async function saveUrl(site: Site, input: HTMLInputElement) {
    const url = normalizeUrl(input.value)
    if (!url) {
      input.value = site.url
      return
    }
    if (url === site.url) return
    await updateSite(site, { url })
  }

  const renderSite = (site: Site) => {
    const name = siteName(site)
    const editing = editingId === site.id
    const deployAt = lastDeployAt(site)
    const openNotes = openCounts.get(site.id) ?? 0
    return (
      <li key={site.id} data-testid="site-card">
        <Card className={`p-0! ${site.status === 'archived' ? 'opacity-70' : ''}`}>
          <div className="flex items-stretch gap-1 p-1">
            <button
              type="button"
              onClick={() => setEditingId(editing ? null : site.id)}
              aria-expanded={editing}
              aria-label={`Modifica ${name}`}
              className={`flex min-h-12 min-w-0 flex-1 flex-col items-start justify-center gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING}`}
            >
              <span className="flex w-full min-w-0 items-center gap-1.5">
                {site.pinned && (
                  <span aria-label="fissato" title="fissato">
                    📌
                  </span>
                )}
                <span className="min-w-0 truncate font-semibold" data-testid="site-name">
                  {name}
                </span>
                {site.private && (
                  <span aria-label="repo privato" title="repo privato">
                    🔒
                  </span>
                )}
              </span>
              <span className="w-full min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">
                {hostOf(site.url)}
              </span>
              {site.repo && (
                <span className="w-full min-w-0 truncate text-xs text-slate-500 dark:text-slate-400">{site.repo}</span>
              )}
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                {site.status !== 'live' && (
                  <span className={`${BADGE} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200`}>
                    {STATUS_LABEL[site.status]}
                  </span>
                )}
                {site.pagesStatus === 'errored' && (
                  <span className={`${BADGE} bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300`}>
                    deploy fallito
                  </span>
                )}
                {site.pagesStatus === 'building' && (
                  <span className={`${BADGE} bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`}>
                    deploy in corso
                  </span>
                )}
                {site.goneFromGithub && (
                  <span className={`${BADGE} bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`}>
                    sparito da GitHub
                  </span>
                )}
                {openNotes > 0 && (
                  <span
                    className={`${BADGE} bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300`}
                    data-testid="site-open-notes"
                  >
                    📝 {openNotes} {openNotes === 1 ? 'aperta' : 'aperte'}
                  </span>
                )}
                {deployAt !== null && <span>ultimo deploy {agoIt(deployAt)}</span>}
                {!site.repo && <span>aggiunto a mano</span>}
              </span>
            </button>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Apri ${name}`}
              className={`flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 ${FOCUS_RING}`}
            >
              ↗
            </a>
            <button
              type="button"
              onClick={() => void copyLink(site)}
              aria-label={`Copia il link di ${name}`}
              className={`flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-base text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 ${FOCUS_RING}`}
            >
              {copiedId === site.id ? '✓' : '🔗'}
            </button>
          </div>
          {editing && (
            <div className="space-y-3 border-t border-slate-200 p-3 dark:border-slate-700">
              {site.description && <p className="text-sm text-slate-600 dark:text-slate-300">{site.description}</p>}
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Nome
                <input
                  key={`name-${site.id}`}
                  defaultValue={site.name}
                  onBlur={(e) => void saveName(site, e.target)}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder={site.repo ? siteName({ ...site, name: '' }) : 'Nome del sito'}
                  className={`mt-1 ${INPUT}`}
                />
              </label>
              {!site.repo && (
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                  Indirizzo
                  <input
                    key={`url-${site.id}`}
                    defaultValue={site.url}
                    onBlur={(e) => void saveUrl(site, e.target)}
                    maxLength={MAX_URL_LENGTH}
                    inputMode="url"
                    autoCapitalize="off"
                    autoComplete="off"
                    spellCheck={false}
                    className={`mt-1 ${INPUT}`}
                  />
                </label>
              )}
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Note
                <textarea
                  key={`notes-${site.id}`}
                  defaultValue={site.notes}
                  onBlur={(e) => void saveNotes(site, e.target.value)}
                  maxLength={MAX_NOTES_LENGTH}
                  rows={3}
                  placeholder="Cliente, password di anteprima, cosa manca…"
                  className={`mt-1 ${TEXTAREA}`}
                />
              </label>
              <div role="group" aria-label="Stato" className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <Chip
                    key={s}
                    active={site.status === s}
                    onClick={() => void (site.status !== s && updateSite(site, { status: s }))}
                  >
                    {STATUS_LABEL[s]}
                  </Chip>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Fissato in alto</span>
                <Switch
                  checked={site.pinned}
                  onChange={(pinned) => void updateSite(site, { pinned })}
                  aria-label="Fissato in alto"
                />
              </div>
              <SiteNotesPanel
                siteId={site.id}
                siteLabel={name}
                notes={(allNotes ?? []).filter((n) => n.siteId === site.id)}
                onUndoable={trigger}
              />
              {site.goneFromGithub && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  GitHub non lo elenca più (repo cancellato, rinominato o senza Pages). Resta qui finché non lo elimini.
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => void remove(site)}>
                  ✕ Elimina
                </Button>
              </div>
            </div>
          )}
        </Card>
      </li>
    )
  }

  return (
    <div className="pb-24">
      <PageHeader emoji="🌐" title="Siti" subtitle="I siti che pubblichi: GitHub Pages e quelli aggiunti a mano." />

      <SyncCard sync={sync} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filtra per stato" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)} count={count(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>
        <Button variant="ghost" className="ml-auto" onClick={() => setAdding(!adding)} aria-expanded={adding}>
          + Aggiungi sito
        </Button>
      </div>

      {adding && (
        <Card className="mb-4">
          <form onSubmit={(e) => void handleAdd(e)} className="space-y-2">
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              type="text"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              maxLength={MAX_URL_LENGTH}
              aria-label="Indirizzo del sito"
              placeholder="https://…"
              className={INPUT}
            />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              aria-label="Nome del sito"
              placeholder="Nome (facoltativo)"
              className={INPUT}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!canAdd}>
                Aggiungi
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      {lastFetch != null && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400" data-testid="sites-last-fetch">
          Dati GitHub letti {agoIt(lastFetch)}. Per aggiornarli: <code>npm run sites:link -- --open</code>
        </p>
      )}

      {all === undefined || visible === undefined ? (
        <SkeletonList rows={3} rowClassName="h-20" />
      ) : all.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            emoji="🌐"
            title="Ancora nessun sito"
            hint="Sul Mac lancia npm run sites:link -- --open: apre in Chrome il link con i tuoi repo GitHub Pages, controlli l’anteprima e tocchi Importa. Oppure aggiungi un sito a mano."
          />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState emoji="🔎" title="Nessun sito in questo stato" />
      ) : (
        <ul className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2">{visible.map(renderSite)}</ul>
      )}

      {all && all.length > 0 && (
        <>
          {/* Floating "+": a change or idea for a site. Sits above the Undo
              snackbar while one is showing; the page keeps room for it (pb-24). */}
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            aria-label="Nuova modifica o idea"
            className={`fixed z-10 flex size-11 items-center justify-center rounded-full bg-slate-900 text-2xl text-white shadow-lg hover:bg-slate-700 active:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white ${FOCUS_RING}`}
            style={{
              right: 'calc(env(safe-area-inset-right) + 1rem)',
              bottom: `calc(env(safe-area-inset-bottom) + ${pending ? '4.5rem' : '1rem'})`,
            }}
          >
            +
          </button>
          <AddNoteSheet open={noteOpen} onClose={() => setNoteOpen(false)} sites={all} currentSiteId={editingId} />
        </>
      )}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
