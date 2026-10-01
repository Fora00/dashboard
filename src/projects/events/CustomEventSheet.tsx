import { useId, useRef, useState, type ReactNode } from 'react'
import { Sheet } from '../../components/Sheet'
import { Button } from '../../components/Button'
import type { CustomEvent } from '../../lib/db'
import { saveCustomEvent } from '../../lib/customEventsSync'
import { CATEGORIES } from './model'
import {
  MAX_CITY_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_URL_LENGTH,
  MAX_VENUE_LENGTH,
  emptyForm,
  formToRow,
  rowToForm,
  type CustomEventForm,
} from './custom'
import { compressImage } from './image'

interface Props {
  open: boolean
  onClose: () => void
  /** The event being edited; null = adding a new one. */
  editing: CustomEvent | null
  /** Prefill for a new event (hash query); ignored when editing. */
  prefill: Partial<CustomEventForm> | null
  /** Town names for the city suggestions. */
  cities: string[]
  onDelete: (row: CustomEvent) => void
  onSaved: (row: CustomEvent, isNew: boolean) => void
}

const INPUT =
  'h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100'

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <label htmlFor={htmlFor} className="block text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}

/** Add / edit a hand-added event. The body is mounted per opening, so state starts fresh. */
export function CustomEventSheet(p: Props) {
  return (
    <Sheet open={p.open} onClose={p.onClose} title={p.editing ? 'Edit event' : 'Add event'}>
      {p.open && <Body {...p} />}
    </Sheet>
  )
}

function Body({ onClose, editing, prefill, cities, onDelete, onSaved }: Props) {
  const id = useId()
  const [form, setForm] = useState<CustomEventForm>(() =>
    editing ? rowToForm(editing) : { ...emptyForm(), ...(prefill ?? {}) },
  )
  const [error, setError] = useState<string | null>(null)
  const [imageBusy, setImageBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  // Focus the title only when adding without one (no keyboard pop-up on edit).
  const [autoFocusTitle] = useState(() => !editing && !form.title)

  const set = <K extends keyof CustomEventForm>(k: K, v: CustomEventForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setError(null)
  }

  async function pickImage(file: File | undefined) {
    if (!file) return
    setImageBusy(true)
    setError(null)
    try {
      set('image', await compressImage(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'This image could not be used.')
    } finally {
      setImageBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function submit() {
    const res = formToRow(form, Date.now(), editing ?? undefined)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setSaving(true)
    try {
      await saveCustomEvent(res.row)
      onSaved(res.row, !editing)
    } catch {
      setError('Could not save on this device.')
      setSaving(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void submit()
      }}
      className="space-y-3 pb-3"
    >
      <Field label="Title *" htmlFor={`${id}-title`}>
        <input
          id={`${id}-title`}
          autoFocus={autoFocusTitle}
          type="text"
          required
          maxLength={MAX_TITLE_LENGTH}
          enterKeyHint="next"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Serata boulder, contest…"
          className={INPUT}
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Date *" htmlFor={`${id}-date`}>
          <input
            id={`${id}-date`}
            type="date"
            required
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="End date" htmlFor={`${id}-end-date`}>
          <input
            id={`${id}-end-date`}
            type="date"
            min={form.date || undefined}
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Time" htmlFor={`${id}-time`}>
          <input
            id={`${id}-time`}
            type="time"
            value={form.time}
            onChange={(e) => set('time', e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="End time" htmlFor={`${id}-end-time`}>
          <input
            id={`${id}-end-time`}
            type="time"
            disabled={!form.time}
            value={form.time ? form.endTime : ''}
            onChange={(e) => set('endTime', e.target.value)}
            className={`${INPUT} disabled:opacity-50`}
          />
        </Field>
      </div>
      <p className="-mt-1 text-xs text-slate-500 dark:text-slate-400">No time = all day.</p>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Place" htmlFor={`${id}-venue`}>
          <input
            id={`${id}-venue`}
            type="text"
            maxLength={MAX_VENUE_LENGTH}
            value={form.venue}
            onChange={(e) => set('venue', e.target.value)}
            placeholder="Block3"
            className={INPUT}
          />
        </Field>
        <Field label="City" htmlFor={`${id}-city`}>
          <input
            id={`${id}-city`}
            type="text"
            list={`${id}-cities`}
            maxLength={MAX_CITY_LENGTH}
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className={INPUT}
          />
          <datalist id={`${id}-cities`}>
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Link" htmlFor={`${id}-url`}>
        <input
          id={`${id}-url`}
          type="url"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={MAX_URL_LENGTH}
          value={form.url}
          onChange={(e) => set('url', e.target.value)}
          placeholder="https://instagram.com/p/…"
          className={INPUT}
        />
      </Field>

      <Field label="Category" htmlFor={`${id}-cat`}>
        <select
          id={`${id}-cat`}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className={INPUT}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Note" htmlFor={`${id}-note`}>
        <textarea
          id={`${id}-note`}
          rows={3}
          maxLength={MAX_NOTE_LENGTH}
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
          placeholder="Price, booking, who's going…"
          className={`${INPUT} h-auto py-2`}
        />
      </Field>

      <div className="space-y-2">
        <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Image</span>
        {form.image && (
          <img src={form.image} alt="Event image preview" className="max-h-48 w-full rounded-lg bg-slate-100 object-contain dark:bg-slate-800" />
        )}
        <div className="flex flex-wrap gap-2">
          <label
            className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`}
          >
            {imageBusy ? 'Shrinking…' : form.image ? 'Change image' : '🖼 Add image'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={imageBusy}
              onChange={(e) => void pickImage(e.target.files?.[0])}
            />
          </label>
          {form.image && (
            <Button type="button" variant="ghost" onClick={() => set('image', null)}>
              Remove image
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        {editing && (
          <Button type="button" variant="danger" onClick={() => onDelete(editing)}>
            Delete
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={saving || imageBusy}>
          {editing ? 'Save' : 'Add event'}
        </Button>
      </div>
    </form>
  )
}
