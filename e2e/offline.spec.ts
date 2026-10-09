import { expect, test } from '@playwright/test'

// The non-negotiable: signed out and offline, every page works against Dexie.

test('a todo added offline survives a reload', async ({ page, context }) => {
  await page.goto('#/todo')
  const input = page.getByLabel('Add a todo')
  await expect(input).toBeVisible()

  // Wait for the service worker so the shell is cached, then cut the network.
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  await context.setOffline(true)

  await input.fill('buy stamps')
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.getByText('buy stamps')).toBeVisible()

  await page.reload()
  await expect(page.getByText('buy stamps')).toBeVisible()
})

test('every route renders without an error screen, signed out', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  for (const path of [
    '',
    'todo',
    'habits',
    'shop-list',
    'links',
    'life',
    'meal-diary',
    'events',
    'events/interests',
    'settings',
  ]) {
    await page.goto(`#/${path}`)
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  }
  expect(errors).toEqual([])
})

test('the settings backup exports a file', async ({ page }) => {
  await page.goto('#/settings')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup' }).click()
  expect((await download).suggestedFilename()).toMatch(/^dashboard-backup-\d{4}-\d{2}-\d{2}\.json$/)
})
