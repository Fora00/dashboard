import { db, type BookIdea } from '../../lib/db'
import {
  addBookIdea,
  deleteBookIdea,
  MAX_NOTES_LENGTH,
  MAX_TEXT_LENGTH,
  sync,
  updateNotes,
} from '../../lib/bookIdeasSync'
import { IdeaList, type IdeaListConfig } from '../../components/IdeaList'

const config: IdeaListConfig<BookIdea> = {
  emoji: '📖',
  title: 'Book Ideas',
  subtitle: 'Writing ideas — tap one to jot notes. Saved on this device.',
  addPlaceholder: 'Add a book idea…',
  maxTextLength: MAX_TEXT_LENGTH,
  maxNotesLength: MAX_NOTES_LENGTH,
  emptyTitle: 'No book ideas yet',
  query: () => db.bookIdeas.orderBy('createdAt').reverse().toArray(),
  add: addBookIdea,
  remove: deleteBookIdea,
  updateNotes,
  sync,
  table: 'book_ideas',
}

export function BookIdeas() {
  return <IdeaList config={config} />
}
