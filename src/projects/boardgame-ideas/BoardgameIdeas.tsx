import { db, type BoardgameIdea } from '../../lib/db'
import {
  addBoardgameIdea,
  deleteBoardgameIdea,
  MAX_NOTES_LENGTH,
  MAX_TEXT_LENGTH,
  sync,
  updateNotes,
  updateText,
} from '../../lib/boardgameIdeasSync'
import { IdeaList, type IdeaListConfig } from '../../components/IdeaList'

const config: IdeaListConfig<BoardgameIdea> = {
  emoji: '🎲',
  title: 'Boardgame Ideas',
  subtitle: 'Board game design ideas — tap one to jot notes. Works offline, syncs when signed in.',
  addPlaceholder: 'Add a boardgame idea…',
  maxTextLength: MAX_TEXT_LENGTH,
  maxNotesLength: MAX_NOTES_LENGTH,
  emptyTitle: 'No boardgame ideas yet',
  query: () => db.boardgameIdeas.orderBy('createdAt').reverse().toArray(),
  add: addBoardgameIdea,
  remove: deleteBoardgameIdea,
  updateNotes,
  updateText,
  sync,
  table: 'boardgame_ideas',
}

export function BoardgameIdeas() {
  return <IdeaList config={config} />
}
