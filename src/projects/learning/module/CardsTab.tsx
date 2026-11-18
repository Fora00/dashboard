import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { FlipActions, FlipCard } from '../ui/FlipCard'
import { HtmlText } from '../engine/HtmlText'
import { deckOrder, nextInDeck, type CourseState } from '../engine/progress'
import { resetCards, setCardKnown } from '../../../lib/learningSync'
import type { CourseModule } from '../engine/types'

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
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Le conosci tutte: da qui in poi te le ripropone{' '}
          <Link to="/learning/ripasso" className="font-medium underline underline-offset-2">
            🔁 Ripasso
          </Link>{' '}
          quando è il momento.
        </p>
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
        Carta {pos + 1} di {deck.length} da imparare · quelle che segni «Lo so» tornano in{' '}
        <Link to="/learning/ripasso" className="underline underline-offset-2">
          Ripasso
        </Link>
      </p>
      <FlipCard
        onFlip={() => setFlipped((f) => !f)}
        label={flipped ? 'Mostra la domanda' : 'Mostra la risposta'}
        tag={flipped ? 'Risposta' : 'Domanda'}
      >
        <span className={flipped ? 'text-base leading-relaxed' : 'text-xl leading-snug font-medium'}>
          <HtmlText html={flipped ? card.back : card.front} />
        </span>
      </FlipCard>
      <FlipActions
        flipped={flipped}
        hint="Rispondi a voce, poi tocca la carta."
        onKnown={() => {
          void setCardKnown(courseId, mod.id, card.id, true)
          setFlipped(false)
        }}
        onLater={() => {
          setPosition(nextInDeck(pos, deck.length))
          setFlipped(false)
        }}
      />
    </div>
  )
}
