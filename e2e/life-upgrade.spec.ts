import { expect, test } from '@playwright/test'

// Upgrade list: local-first, signed out. Add an item, mark it done, and see it
// in the week export (read back from the clipboard).

function thisMonday(): string {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

test('an upgrade can be added, marked done and shows up in the export', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
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

  await page.getByLabel('New upgrade').fill('loose door handle')
  await page.getByLabel('New upgrade').press('Enter')
  const item = page.getByRole('checkbox', { name: 'loose door handle' })
  await expect(item).toHaveAttribute('aria-checked', 'false')

  await page.reload()
  await expect(item).toBeVisible()
  await item.click()
  // Done items move into the collapsed "Done" group.
  await page.getByRole('button', { name: /Done \(1\)/ }).click()
  await expect(item).toHaveAttribute('aria-checked', 'true')

  await page.getByRole('button', { name: /Export week/ }).click()
  await expect(page.getByRole('button', { name: /Copied/ })).toBeVisible()
  const md = await page.evaluate(() => navigator.clipboard.readText())
  expect(md).toContain('## Upgrade list')
  expect(md).toContain('- Done this week:\n  - loose door handle (quick,')
})
