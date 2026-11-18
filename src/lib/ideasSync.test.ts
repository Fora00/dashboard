import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import { addBookIdea, MAX_TEXT_LENGTH, updateText } from './bookIdeasSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

describe('idea title edit', () => {
  it('updates a trimmed, capped title and bumps updatedAt', async () => {
    await addBookIdea('Old')
    const idea = (await db.bookIdeas.toArray())[0]!
    await updateText({ ...idea, updatedAt: 0 }, `  ${'x'.repeat(MAX_TEXT_LENGTH + 5)} `)
    const row = (await db.bookIdeas.get(idea.id))!
    expect(row.text).toHaveLength(MAX_TEXT_LENGTH)
    expect(row.updatedAt).toBeGreaterThan(0)
  })

  it('ignores empty or unchanged titles', async () => {
    await addBookIdea('Keep')
    const idea = (await db.bookIdeas.toArray())[0]!
    await updateText(idea, '   ')
    await updateText(idea, 'Keep')
    expect((await db.bookIdeas.get(idea.id))!.updatedAt).toBe(idea.updatedAt)
  })
})
