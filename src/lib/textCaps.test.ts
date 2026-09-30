import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { addTodo, MAX_TEXT_LENGTH as TODO_MAX } from './todoSync'
import { addArea, addShopItem, MAX_AREA_NAME_LENGTH, MAX_ITEM_LENGTH } from './shopSync'
import { addHabit, clipEmoji, MAX_EMOJI_LENGTH, MAX_NAME_LENGTH } from './habitSync'
import { addBookIdea, MAX_NOTES_LENGTH, MAX_TEXT_LENGTH as BOOK_MAX, updateNotes } from './bookIdeasSync'
import { addSession, MAX_LOCATION_LENGTH, MAX_NOTES_LENGTH as SESSION_NOTES_MAX } from './climbSync'

beforeEach(resetDb)
// Let the engine's background flush go quiet before the next resetDb closes the db.
afterEach(() => drain(async () => String(await db.outbox.count())))

const long = (n: number) => 'x'.repeat(n + 50)

describe('client text caps mirror the server CHECK constraints', () => {
  it('todo text is trimmed and capped; blank is ignored', async () => {
    await addTodo(`  ${long(TODO_MAX)}  `)
    await addTodo('   ')
    const all = await db.todos.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]?.text).toBe('x'.repeat(TODO_MAX))
  })

  it('shop item text and area name are capped', async () => {
    await addShopItem(long(MAX_ITEM_LENGTH), 'a')
    const area = await addArea(long(MAX_AREA_NAME_LENGTH))
    expect((await db.shopItems.toArray())[0]?.text).toHaveLength(MAX_ITEM_LENGTH)
    expect(area.name).toHaveLength(MAX_AREA_NAME_LENGTH)
  })

  it('habit name and emoji are capped, empty emoji defaults', async () => {
    const h = await addHabit(long(MAX_NAME_LENGTH), '🙂'.repeat(10))
    expect(h.name).toHaveLength(MAX_NAME_LENGTH)
    expect(h.emoji.length).toBeLessThanOrEqual(MAX_EMOJI_LENGTH)
    expect(h.emoji).toBe('🙂'.repeat(4))
    expect((await addHabit('y', '')).emoji).toBe('✅')
  })

  it('clipEmoji never leaves half a surrogate pair', () => {
    expect(clipEmoji('a'.repeat(7) + '🙂')).toBe('a'.repeat(7))
    expect(clipEmoji(' ✅ ')).toBe('✅')
  })

  it('book idea text and notes are capped', async () => {
    await addBookIdea(long(BOOK_MAX))
    const idea = (await db.bookIdeas.toArray())[0]!
    expect(idea.text).toHaveLength(BOOK_MAX)
    await updateNotes(idea, long(MAX_NOTES_LENGTH))
    expect((await db.bookIdeas.get(idea.id))?.notes).toHaveLength(MAX_NOTES_LENGTH)
  })

  it('climb session location and notes are capped', async () => {
    const s = await addSession({
      date: '2026-01-01',
      location: long(MAX_LOCATION_LENGTH),
      discipline: 'boulder',
      notes: long(SESSION_NOTES_MAX),
    })
    expect(s.location).toHaveLength(MAX_LOCATION_LENGTH)
    expect(s.notes).toHaveLength(SESSION_NOTES_MAX)
  })
})
