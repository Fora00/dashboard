import { expect, test, type Locator, type Page } from '@playwright/test'

// HB2: Life → Habits is the same panel as the Habits page. Local-first, signed
// out: on #/habits and inside #/life the same flow works in place (tap a tile,
// hold for a rest day with its reason, open the detail, re-pick the day from
// the week tab and keep its reason). No navigation away from Life.

function dayKey(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function thisMonday(): string {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return dayKey(d)
}

const NAME = 'Panel test habit'

async function hold(page: Page, target: Locator) {
  const box = await target.boundingBox()
  if (!box) throw new Error('no tile')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(800)
  await page.mouse.up()
}

async function sameFlow(page: Page, root: Locator) {
  await root.getByRole('tab', { name: 'today' }).click()
  const tile = root.getByRole('button', { name: new RegExp(`^${NAME}: `) })
  await tile.click()
  await expect(tile).toHaveAttribute('aria-pressed', 'true')

  // Hold: today's state, with the rest reason, in a sheet on the same page.
  await hold(page, tile)
  const pick = page.getByRole('dialog', { name: new RegExp(NAME) })
  await pick.getByRole('button', { name: /Rest day/ }).click()
  await pick.getByRole('button', { name: /Vacation/ }).click()
  await expect(pick).toBeHidden()
  await expect(tile).toHaveAccessibleName(new RegExp(`^${NAME}: rest day`))

  // ⋯ opens the detail in place.
  await root.getByRole('button', { name: `Stats and settings for ${NAME}` }).click()
  const detail = page.getByRole('dialog', { name: new RegExp(NAME) })
  await expect(detail.getByRole('region', { name: 'Calendar' })).toBeVisible()
  await detail.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(detail).toBeHidden()

  // Week tab: re-picking Rest for today keeps the reason.
  await root.getByRole('tab', { name: 'week' }).click()
  await root.getByRole('button', { name: `${NAME}, ${dayKey()}: choose a state` }).click()
  await root
    .getByRole('group', { name: `State for ${dayKey()}` })
    .getByRole('button', { name: '⏸ Rest' })
    .click()
  const reasons = root.getByRole('group', { name: `Reason for ${dayKey()}` })
  await expect(reasons.getByRole('button', { name: /Vacation/ })).toHaveAttribute('aria-pressed', 'true')
  await reasons.getByRole('button', { name: 'Keep the reason' }).click()
  await expect(reasons).toBeHidden()

  // Clean up for the second run: clear today from the hold sheet.
  await root.getByRole('tab', { name: 'today' }).click()
  await hold(page, tile)
  await page
    .getByRole('dialog', { name: new RegExp(NAME) })
    .getByRole('button', { name: 'Clear today' })
    .click()
  await expect(tile).toHaveAttribute('aria-pressed', 'false')
}

test('the Habits page and Life → Habits run the same flow in place', async ({ page }) => {
  await page.goto('#/habits')
  await page.getByRole('button', { name: /New habit/ }).click()
  const form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Name').fill(NAME)
  await form.getByRole('group', { name: 'Engine' }).getByRole('button', { name: 'Mind' }).click()
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()

  await sameFlow(page, page.locator('main'))

  // Life needs a week to show its body.
  const plan = {
    version: 1,
    week: thisMonday(),
    focus: [{ id: 'f1', title: 'Focus A' }],
    rules: [],
    tasks: [],
    trackers: [],
    sundayCheck: [],
    checkins: [],
  }
  await page.goto('#/life/import')
  await page.getByLabel('Week JSON').fill(JSON.stringify(plan))
  await page.getByRole('button', { name: /^Save/ }).click()
  await expect(page.getByText('Focus A')).toBeVisible()

  const section = page
    .locator('section')
    .filter({ has: page.getByRole('tablist', { name: 'View' }) })
    .last()
  await expect(section.getByRole('tab', { name: 'week' })).toBeVisible()
  await sameFlow(page, section)
  await expect(page).toHaveURL(/#\/life/)
})
