import { useState } from 'react'
import type { SiteNote, SiteNoteKind } from '../../lib/db'
import { MAX_NOTE_TEXT_LENGTH, addSiteNote, deleteSiteNote, restoreSiteNote, setSiteNoteDone } from '../../lib/sitiSync'
import { Button, ICON_BUTTON } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { TEXTAREA } from '../../components/field'
import { KIND_LABEL, agoIt } from './sitesView'

// The changes and ideas of one site (SI3), inside its card's edit view on
// /siti: open ones grouped by kind, newest first, with the page path; done
// ones collapsed below; tick, delete with Undo, add.

const GROUP_LABEL: Record<SiteNoteKind, string> = { change: 'Modifiche', idea: 'Idee' }

interface Props {
  siteId: string
  siteLabel: string
  /** This site's notes (any order). */
  notes: SiteNote[]
  onUndoable: (label: string, undo: () => Promise<void>) => void
}

export function SiteNotesPanel({ siteId, siteLabel, notes, onUndoable }: Props) {
  const [kind, setKind] = useState<SiteNoteKind>('change')
  const [text, setText] = useState('')
  const [showDone, setShowDone] = useState(false)
  const newest = [...notes].sort((a, b) => b.createdAt - a.createdAt)
  const open = newest.filter((n) => !n.done)
  const done = newest.filter((n) => n.done)

  async function add() {
    if (await addSiteNote(siteId, kind, text)) setText('')
  }

  async function remove(note: SiteNote) {
    await deleteSiteNote(note.id)
    onUndoable(`Eliminata la nota · Undo`, () => restoreSiteNote(note))
  }

  const row = (n: SiteNote) => (
    <li key={n.id} className="flex items-start gap-1" data-testid="site-note">
      <label className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-start gap-2 py-2">
        <input
          type="checkbox"
          checked={n.done}
          onChange={(e) => void setSiteNoteDone(n.id, e.target.checked)}
          aria-label={`Fatta: ${n.text}`}
          className="mt-0.5 size-5 shrink-0"
        />
        <span className="min-w-0">
          <span className={`block text-sm whitespace-pre-wrap ${n.done ? 'text-slate-500 line-through' : ''}`}>
            {n.text}
          </span>
          <span className="block text-xs break-all text-slate-500 dark:text-slate-400">
            {n.path ? `${n.path} · ` : ''}
            {agoIt(n.createdAt)}
          </span>
        </span>
      </label>
      <button type="button" onClick={() => void remove(n)} aria-label={`Elimina: ${n.text}`} className={ICON_BUTTON}>
        ✕
      </button>
    </li>
  )

  return (
    <section aria-label={`Modifiche e idee di ${siteLabel}`} className="space-y-3">
      {(['change', 'idea'] as const).map((k) => {
        const items = open.filter((n) => n.kind === k)
        if (items.length === 0) return null
        return (
          <div key={k}>
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {GROUP_LABEL[k]} ({items.length})
            </h3>
            <ul>{items.map(row)}</ul>
          </div>
        )
      })}
      {open.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">Nessuna modifica o idea aperta.</p>
      )}
      {done.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowDone(!showDone)}
            aria-expanded={showDone}
            className="min-h-10 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            {showDone ? '▾' : '▸'} Fatte ({done.length})
          </button>
          {showDone && <ul>{done.map(row)}</ul>}
        </div>
      )}
      <div className="space-y-2">
        <div role="group" aria-label="Tipo della nuova nota" className="flex gap-2">
          {(['change', 'idea'] as const).map((k) => (
            <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
              {KIND_LABEL[k]}
            </Chip>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          maxLength={MAX_NOTE_TEXT_LENGTH}
          aria-label={`Nuova nota per ${siteLabel}`}
          placeholder={kind === 'change' ? 'Una modifica da fare…' : 'Un’idea…'}
          className={TEXTAREA}
        />
        <Button variant="ghost" disabled={!text.trim()} onClick={() => void add()}>
          + Aggiungi {KIND_LABEL[kind].toLowerCase()}
        </Button>
      </div>
    </section>
  )
}
