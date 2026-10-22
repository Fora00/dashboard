import { useState } from 'react'
import { Button } from '../../components/Button'
import { FOCUS_RING } from '../../components/focus'
import { HtmlText } from './HtmlText'
import { deckOrder, nextInDeck, type CourseState } from './progress'
import { resetCards, setCardKnown } from '../../lib/learningSync'
import type { CourseModule } from './types'

interface Props {
  courseId: string
  mod: CourseModule
  state: CourseState
}

export function CardsTab({ courseId, mod, state }: Props) {
  const [position, setPosition] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const known = new Set(
    state.cards.filter((c) => c.courseId === courseId && c.moduleId === mod.id).map((c) => c.itemId),
  )
  const deck = deckOrder(mod.cards, known)

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="font-medium">Mazzo completato</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Le conosci tutte. Ripassale tra qualche giorno.</p>
        <Button
          onClick={() => {
            void resetCards(courseId, mod.id)
            setPosition(0)
            setFlipped(false)
          }}
        >
          Ricomincia il mazzo
        </Button>
      </div>
    )
  }

  const pos = Math.min(position, deck.length - 1)
  const index = deck[pos] as number
  const card = mod.cards[index]
  if (!card) return null
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600 tabular-nums dark:text-slate-400">
        Carta {pos + 1} di {deck.length} da ripassare
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Mostra la domanda' : 'Mostra la risposta'}
        className={`flex min-h-48 w-full flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-white p-6 text-left dark:border-slate-700 dark:bg-slate-800/50 ${FOCUS_RING}`}
      >
        <span className="text-xs font-semibold tracking-wide text-(color:--accent-border) uppercase">
          {flipped ? 'Risposta' : 'Domanda'}
        </span>
        <span className={flipped ? 'text-base leading-relaxed' : 'text-xl leading-snug font-medium'}>
          <HtmlText html={flipped ? card.back : card.front} />
        </span>
      </button>
      {flipped ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              void setCardKnown(courseId, mod.id, card.id, true)
              setFlipped(false)
            }}
          >
            Lo so
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPosition(nextInDeck(pos, deck.length))
              setFlipped(false)
            }}
          >
            Da ripassare
          </Button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Rispondi a voce, poi tocca la carta.</p>
      )}
    </div>
  )
}
