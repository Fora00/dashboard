// "Scarica per offline" (E4a): course content is not in the PWA precache. A course is cached by the service
// worker (runtime cache 'learning-courses', vite.config.ts) when its chunk is first loaded; this button loads
// every course and every Vocabolario words chunk at once, so all of them work offline afterwards.
import { useState } from 'react'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { useOnline } from '../../../lib/useOnline'
import { courseMetas, loadCourse } from '../courses/registry'
import { wordLoaders } from '../vocab'
import { LANGS } from '../vocab/types'

// Per-device convenience only: remembers that this build's chunks were all fetched (a new deploy = new chunk
// URLs, so the done state resets on its own). The real state is the browser cache.
const DONE_KEY = 'learning.offlineDownload'

const readDone = (): boolean => {
  try {
    return localStorage.getItem(DONE_KEY) === __BUILD_TIME__
  } catch {
    return false
  }
}

const saveDone = () => {
  try {
    localStorage.setItem(DONE_KEY, __BUILD_TIME__)
  } catch {
    // private mode / blocked storage: the done state just won't survive a reload
  }
}

const jobs: (() => Promise<unknown>)[] = [
  ...courseMetas.map((m) => () => loadCourse(m.id)),
  ...LANGS.map((l) => () => wordLoaders[l]()),
]

type State = { kind: 'idle' } | { kind: 'running'; done: number } | { kind: 'done' } | { kind: 'error'; failed: number }

export function OfflineDownload() {
  const online = useOnline()
  const [state, setState] = useState<State>(() => (readDone() ? { kind: 'done' } : { kind: 'idle' }))
  const total = jobs.length

  async function download() {
    let done = 0
    let failed = 0
    setState({ kind: 'running', done })
    // Three at a time: quick on a good connection, gentle on a phone one.
    const queue = [...jobs]
    const worker = async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        try {
          await job()
        } catch {
          failed++
        }
        done++
        setState({ kind: 'running', done })
      }
    }
    await Promise.all([worker(), worker(), worker()])
    if (failed > 0) {
      setState({ kind: 'error', failed })
    } else {
      saveDone()
      setState({ kind: 'done' })
    }
  }

  const running = state.kind === 'running'
  const noWorker =
    typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !navigator.serviceWorker.controller

  return (
    <Card className="flex flex-col gap-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">📥 Corsi offline</p>
          <p className="text-slate-500 dark:text-slate-400" aria-live="polite">
            {running
              ? `Scarico ${state.done}/${total}…`
              : state.kind === 'done'
                ? 'Tutti i corsi disponibili offline.'
                : state.kind === 'error'
                  ? `${state.failed} su ${total} non scaricati: riprova con una connessione stabile.`
                  : 'Un corso aperto una volta resta disponibile offline. Per averli tutti, scaricali ora.'}
          </p>
        </div>
        <Button
          variant={state.kind === 'done' ? 'ghost' : 'primary'}
          onClick={() => void download()}
          disabled={!online || running}
          className="shrink-0"
        >
          {running ? `${state.done}/${total}` : state.kind === 'done' ? 'Scarica di nuovo' : 'Scarica per offline'}
        </Button>
      </div>
      {!online && !running && (
        <p className="text-slate-500 dark:text-slate-400">Sei offline: collegati per scaricare i corsi.</p>
      )}
      {state.kind === 'done' && noWorker && (
        <p className="text-amber-700 dark:text-amber-400">
          L'app non è ancora pronta per l'offline: riaprila e premi di nuovo.
        </p>
      )}
    </Card>
  )
}
