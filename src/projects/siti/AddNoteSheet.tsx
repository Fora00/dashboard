import { useState } from 'react'
import type { Site, SiteNoteKind } from '../../lib/db'
import { MAX_NOTE_PATH_LENGTH, MAX_NOTE_TEXT_LENGTH, addSiteNote } from '../../lib/sitiSync'
import { readString, writeString } from '../../lib/safeStorage'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { INPUT, SELECT, TEXTAREA } from '../../components/field'
import { Sheet } from '../../components/Sheet'
import { KIND_LABEL, siteName } from './sitesView'

// The "+" sheet on /siti (SI3): log a change or an idea for one site. The
// site defaults to the one whose detail is open, else the last one used here
// (a per-device convenience in localStorage), else the first in the list.
// Nothing is ever loaded by the websites themselves.

const LAST_SITE_KEY = 'siti:last-note-site'

interface Props {
  open: boolean
  onClose: () => void
  /** Sites in display order. */
  sites: Site[]
  /** The site whose detail is open, if any. */
  currentSiteId: string | null
}

export function AddNoteSheet({ open, onClose, sites, currentSiteId }: Props) {
  if (!open) return null
  return <SheetBody onClose={onClose} sites={sites} currentSiteId={currentSiteId} />
}

/** Mounted only while open, so every opening starts from fresh defaults. */
function SheetBody({ onClose, sites, currentSiteId }: Omit<Props, 'open'>) {
  const [siteId, setSiteId] = useState(() => {
    const known = (id: string | null) => (id && sites.some((s) => s.id === id) ? id : null)
    return known(currentSiteId) ?? known(readString(LAST_SITE_KEY)) ?? sites[0]?.id ?? ''
  })
  const [kind, setKind] = useState<SiteNoteKind>('change')
  const [path, setPath] = useState('')
  const [text, setText] = useState('')
  const canSave = Boolean(siteId) && Boolean(text.trim())

  async function save() {
    if (!canSave) return
    if (await addSiteNote(siteId, kind, text, path.trim())) {
      writeString(LAST_SITE_KEY, siteId)
      onClose()
    }
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Nuova modifica o idea"
      footer={
        <Button className="w-full" disabled={!canSave} onClick={() => void save()}>
          Salva
        </Button>
      }
    >
      <div className="space-y-3">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Sito
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className={`mt-1 w-full ${SELECT}`}>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {siteName(s)}
              </option>
            ))}
          </select>
        </label>
        <div role="group" aria-label="Tipo" className="flex gap-2">
          {(['change', 'idea'] as const).map((k) => (
            <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
              {KIND_LABEL[k]}
            </Chip>
          ))}
        </div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Pagina (facoltativa)
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            maxLength={MAX_NOTE_PATH_LENGTH}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            placeholder="/chi-siamo"
            className={`mt-1 ${INPUT}`}
          />
        </label>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          Testo
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={MAX_NOTE_TEXT_LENGTH}
            placeholder={kind === 'change' ? 'Cosa cambiare…' : 'L’idea…'}
            className={`mt-1 ${TEXTAREA}`}
          />
        </label>
      </div>
    </Sheet>
  )
}
