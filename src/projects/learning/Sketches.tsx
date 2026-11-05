// Photo diary of the learner's sheets (drawing courses). Local-only: photos
// live in Dexie (learningSketches) through src/lib/learningLocal.ts and never
// leave the device. Works offline and signed out.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '../../components/Button'
import { FOCUS_RING, FOCUS_RING_FIELD } from '../../components/focus'
import { Sheet } from '../../components/Sheet'
import type { LearningSketch } from '../../lib/db'
import {
  addSketch,
  deleteSketch,
  MAX_SKETCH_NOTE_LENGTH,
  setSketchNote,
  setSketchScore,
  sketchesOf,
} from '../../lib/learningLocal'
import { resizePhoto } from './photo'

const dateFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' })
const sketchDate = (ms: number) => dateFmt.format(new Date(ms))

/**
 * <img> of a stored photo through an object URL, created when the element
 * mounts and revoked by the ref cleanup (unmount or another photo). The photo
 * of a sketch never changes, so its id stands for the blob: live queries hand
 * back a new Blob object on every read and must not churn URLs.
 */
function SketchImg({ sketch, alt, className }: { sketch: LearningSketch; alt: string; className: string }) {
  const { id, photo } = sketch
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return
      const url = URL.createObjectURL(photo)
      img.src = url
      return () => URL.revokeObjectURL(url)
    },
    [id], // eslint-disable-line react-hooks/exhaustive-deps
  )
  return <img ref={ref} alt={alt} className={className} />
}

export function SketchThumb({
  sketch,
  caption,
  onOpen,
}: {
  sketch: LearningSketch
  /** Extra line under the date (the Diario shows the module). */
  caption?: string | undefined
  onOpen: () => void
}) {
  const when = sketchDate(sketch.createdAt)
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Apri la foto del ${when}${sketch.selfScore ? `, voto ${sketch.selfScore} su 5` : ''}`}
      className={`flex w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left dark:border-slate-700 dark:bg-slate-900 ${FOCUS_RING}`}
    >
      <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800">
        <SketchImg sketch={sketch} alt="" className="size-full object-cover" />
      </div>
      <div className="flex min-h-10 flex-col justify-center px-2 py-1">
        <span className="flex items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-400">
          <span>{when}</span>
          {sketch.selfScore && <span className="tabular-nums">{sketch.selfScore}/5</span>}
        </span>
        {caption && <span className="truncate text-xs text-slate-500">{caption}</span>}
        {sketch.note && <span className="truncate text-xs text-slate-500 italic">{sketch.note}</span>}
      </div>
    </button>
  )
}

function SketchDetail({ sketch, onDeleted }: { sketch: LearningSketch; onDeleted: () => void }) {
  const [note, setNote] = useState(sketch.note)
  const [armed, setArmed] = useState(false)
  const pending = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const flush = () => {
    clearTimeout(timer.current)
    if (pending.current !== null) void setSketchNote(sketch.id, pending.current)
    pending.current = null
  }
  // Never lose the last keystrokes when the sheet closes.
  useEffect(() => flush, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-40 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <SketchImg
          sketch={sketch}
          alt={`Il tuo foglio del ${dateTimeFmt.format(new Date(sketch.createdAt))}`}
          className="max-h-[55dvh] w-full rounded-lg object-contain"
        />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{dateTimeFmt.format(new Date(sketch.createdAt))}</p>
      <fieldset>
        <legend className="mb-1 text-sm font-medium">Quanto sei soddisfatto, 1-5</legend>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={sketch.selfScore === n}
              aria-label={`${n} su 5`}
              onClick={() => void setSketchScore(sketch.id, sketch.selfScore === n ? null : n)}
              className={`size-10 rounded-lg text-sm font-medium tabular-nums ${FOCUS_RING} ${
                sketch.selfScore === n
                  ? 'bg-(color:--accent) text-(color:--accent-fg)'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <textarea
        value={note}
        maxLength={MAX_SKETCH_NOTE_LENGTH}
        onChange={(e) => {
          setNote(e.target.value)
          pending.current = e.target.value
          clearTimeout(timer.current)
          timer.current = setTimeout(flush, 500)
        }}
        onBlur={flush}
        aria-label="Nota sulla foto"
        placeholder="Nota (opzionale): cosa è venuto bene, cosa rifare"
        className={`min-h-20 w-full resize-y rounded-lg border border-slate-300 bg-white p-2.5 text-base dark:border-slate-700 dark:bg-slate-900 ${FOCUS_RING_FIELD}`}
      />
      <div className="flex flex-wrap gap-2">
        {armed ? (
          <>
            <Button
              variant="danger"
              onClick={() => {
                pending.current = null
                void deleteSketch(sketch.id).then(onDeleted)
              }}
            >
              Conferma: elimina la foto
            </Button>
            <Button variant="ghost" onClick={() => setArmed(false)}>
              Annulla
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => setArmed(true)}>
            Elimina la foto
          </Button>
        )}
      </div>
    </div>
  )
}

/** Big view of one photo with its note, self-score and delete. `sketch` undefined = closed. */
export function SketchViewer({ sketch, onClose }: { sketch: LearningSketch | undefined; onClose: () => void }) {
  return (
    <Sheet open={sketch !== undefined} onClose={onClose} title="Foto del foglio">
      {sketch && <SketchDetail key={sketch.id} sketch={sketch} onDeleted={onClose} />}
    </Sheet>
  )
}

/** "Foto del foglio" + the photos of one exercise, oldest first. */
export function ItemSketches({ courseId, moduleId, itemId }: { courseId: string; moduleId: string; itemId: string }) {
  const sketches = useLiveQuery(() => sketchesOf(courseId, moduleId, itemId), [courseId, moduleId, itemId])
  const [openId, setOpenId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const camera = useRef<HTMLInputElement>(null)
  const library = useRef<HTMLInputElement>(null)

  const onFile = async (input: HTMLInputElement) => {
    const file = input.files?.[0]
    input.value = '' // the same file can be picked again
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const id = await addSketch(courseId, moduleId, itemId, await resizePhoto(file))
      setOpenId(id) // straight to the big view: rate it while it is fresh
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const open = sketches?.find((s) => s.id === openId)
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" disabled={busy} onClick={() => camera.current?.click()}>
          📷 Foto del foglio
        </Button>
        <Button variant="ghost" disabled={busy} onClick={() => library.current?.click()}>
          Dalla galleria
        </Button>
        {busy && <span className="text-sm text-slate-500">Salvo…</span>}
        <input
          ref={camera}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => void onFile(e.currentTarget)}
        />
        <input
          ref={library}
          type="file"
          accept="image/*"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => void onFile(e.currentTarget)}
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
          Foto non salvata: {error}
        </p>
      )}
      {sketches && sketches.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label="Le tue foto, dalla più vecchia">
          {sketches.map((s) => (
            <li key={s.id}>
              <SketchThumb sketch={s} onOpen={() => setOpenId(s.id)} />
            </li>
          ))}
        </ul>
      )}
      <SketchViewer sketch={open} onClose={() => setOpenId(null)} />
    </div>
  )
}
