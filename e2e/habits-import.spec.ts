import { expect, test } from '@playwright/test'

// Habits import link (EN4): local-first, signed out. A link with one new
// habit and one edit to an existing habit previews "+ new" and "~ change",
// applies on tap, and opening the same link again shows "no change".
// Made-up habits only.

const plan = {
  asOf: '2026-11-02',
  habits: [
    { name: 'Habit test A', emoji: '🧪', engine: 'mind', kind: 'experiment', target: 3, floor: 'test floor A' },
    { name: 'habit test existing', engine: 'emotions', floor: 'test floor new' },
  ],
}
const d = Buffer.from(JSON.stringify(plan), 'utf8').toString('base64url')

test('the import link previews, applies on tap, and is idempotent', async ({ page }) => {
  await page.goto('#/habits')
  await page.getByRole('button', { name: /New habit/ }).click()
  const form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Name').fill('Habit test existing')
  await form.getByRole('group', { name: 'Engine' }).getByRole('button', { name: 'Mind' }).click()
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()

  await page.goto(`#/habits/import?d=${d}`)
  await expect(page.getByTestId('habits-import-summary')).toHaveText(/1 new, 1 to change, 0 no change/)
  const rows = page.getByTestId('habits-import-row')
  await expect(rows.nth(0)).toContainText('+ new')
  await expect(rows.nth(1)).toContainText('~ change')
  await expect(rows.nth(1)).toContainText('Emotions')
  await page.getByRole('button', { name: 'Apply (2)' }).click()

  await expect(page).toHaveURL(/#\/habits$/)
  await expect(page.getByRole('button', { name: /^Habit test A: / })).toBeVisible()

  await page.goto(`#/habits/import?d=${d}`)
  await expect(page.getByTestId('habits-import-summary')).toHaveText(/0 new, 0 to change, 2 no change/)
  await expect(page.getByTestId('habits-import-nothing')).toBeVisible()
})
