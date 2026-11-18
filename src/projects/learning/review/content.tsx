// What Ripasso shows for a queue item (from loaded content) and the one filtered queue the page and the Learning
// home both count from, so the two numbers always agree.
import { useEffect, useMemo, useState } from 'react'
import { courseMetaById, loadCourse, loadedCourse } from '../courses/registry'
import { HtmlText } from '../engine/HtmlText'
import type { Queue, QueueItem } from '../engine/review'
import { useQueue } from './useQueue'
import { loadAllThemes, loadedWord } from '../vocab/index'
import { VOCAB_COURSE_ID } from '../vocab/progress'
import { LANG_FLAG, LANG_LABEL, LANGS, type Lang } from '../vocab/types'

// --- Content lookup -------------------------------------------------------------------------

export interface Shown {
  context: string
  front: React.ReactNode
  back?: React.ReactNode
  quiz?: { q: string; options: string[]; answer: number; explanation: string }
}

function vocabParts(i: QueueItem): { wordId: string; lang: Lang } | null {
  const dot = i.itemId.lastIndexOf('.')
  const lang = i.itemId.slice(dot + 1) as Lang
  return dot > 0 && (LANGS as readonly string[]).includes(lang) ? { wordId: i.itemId.slice(0, dot), lang } : null
}

/** What to show for an item, from content already loaded; null = content gone (or not loaded yet). */
export function lookup(i: QueueItem): Shown | null {
  if (i.courseId === VOCAB_COURSE_ID) {
    // By word id, whatever the row's moduleId: the word may have moved to another theme.
    const p = vocabParts(i)
    const found = p && loadedWord(p.wordId)
    const t = p && found?.word[p.lang]
    if (!p || !found || !t) return null
    const { word, theme } = found
    return {
      context: `🗂️ Vocabolario · ${theme.title} · ${LANG_FLAG[p.lang]} ${LANG_LABEL[p.lang]}`,
      front: (
        <>
          {word.it} <span className="text-base font-normal text-slate-500">→ {LANG_FLAG[p.lang]}</span>
        </>
      ),
      back: (
        <>
          <span className="text-xl font-medium" lang={p.lang}>
            {t.w}
          </span>{' '}
          <span className="text-slate-500 dark:text-slate-400">[{t.pron}]</span>
          {t.note && <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400">{t.note}</span>}
        </>
      ),
    }
  }
  const course = loadedCourse(i.courseId)
  const mod = course?.modules.find((m) => m.id === i.moduleId)
  if (!course || !mod) return null
  const context = `${course.emoji} ${course.title} · ${mod.title}`
  if (i.kind === 'quiz') {
    const x = mod.quiz.find((y) => y.id === i.itemId)
    return x ? { context, front: <HtmlText html={x.q} />, quiz: x } : null
  }
  const c = mod.cards.find((y) => y.id === i.itemId)
  return c
    ? {
        context,
        front: <HtmlText html={c.front} />,
        back: <HtmlText html={c.back} />,
      }
    : null
}

/** Loads the course chunks (and Vocabolario) the due items need; true once done. */
function useContent(items: QueueItem[] | undefined): boolean {
  const need = useMemo(() => [...new Set((items ?? []).map((i) => i.courseId))].sort().join(','), [items])
  const [ready, setReady] = useState<string | null>(null)
  useEffect(() => {
    if (items === undefined) return
    let live = true
    const ids = need ? need.split(',') : []
    void Promise.all(
      ids.map((id) =>
        id === VOCAB_COURSE_ID ? loadAllThemes() : courseMetaById(id) ? loadCourse(id) : Promise.resolve(),
      ),
    )
      .catch(() => undefined)
      .then(() => live && setReady(need))
    return () => {
      live = false
    }
  }, [need, items])
  return ready === need
}

/** The Ripasso queue without items whose content is gone; `ready` once the needed courses are loaded. */
export function useReviewQueue(day: string): {
  q: Queue | undefined
  ready: boolean
} {
  const raw = useQueue(day)
  const ready = useContent(raw?.items)
  const keep = useMemo(() => (ready ? (i: QueueItem) => lookup(i) !== null : undefined), [ready])
  const q = useQueue(day, keep)
  // Undefined until the content is loaded: an unfiltered count would flash a number the page then disagrees with.
  return { q: ready ? q : undefined, ready }
}
