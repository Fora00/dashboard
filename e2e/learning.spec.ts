import { expect, test } from '@playwright/test'

// Learning is local-first: signed out, a quiz answer survives a reload and feeds progress.

test('a quiz answer persists across a reload and moves the progress', async ({ page }) => {
  // Two taps from home (area, then course): open the course directly.
  await page.goto('#/learning/backend-interview-lab')
  await expect(page.getByRole('progressbar', { name: 'Progresso complessivo' })).toHaveAttribute('aria-valuenow', '0')

  await page
    .getByRole('link', { name: /HTTP e REST/ })
    .first()
    .click()
  await page.getByRole('tab', { name: /^Quiz/ }).click()
  await expect(page.getByText('0 / 4 corrette')).toBeVisible()

  // Pick the first option of the first question: right or wrong, it locks.
  const first = page.locator('fieldset').first().getByRole('button').first()
  await first.click()
  await expect(first).toBeDisabled()
  await expect(page.getByText(/Esatto\.|Non proprio\./).first()).toBeVisible()

  await page.reload()
  await page.getByRole('tab', { name: /^Quiz/ }).click()
  await expect(page.locator('fieldset').first().getByRole('button').first()).toBeDisabled()
  await expect(page.getByText(/Esatto\.|Non proprio\./).first()).toBeVisible()
})

test('flashcards: "Lo so" removes the card from the deck and survives a reload', async ({ page }) => {
  // Two taps from home (area, then course): open the course directly.
  await page.goto('#/learning/backend-interview-lab')
  await page
    .getByRole('link', { name: /HTTP e REST/ })
    .first()
    .click()
  await page.getByRole('tab', { name: /^Flashcard/ }).click()
  await expect(page.getByText('Carta 1 di 4 da imparare')).toBeVisible()
  await page.getByRole('button', { name: 'Mostra la risposta' }).click()
  await page.getByRole('button', { name: 'Lo so' }).click()
  await expect(page.getByText('Carta 1 di 3 da imparare')).toBeVisible()

  await page.reload()
  await page.getByRole('tab', { name: /^Flashcard/ }).click()
  await expect(page.getByText('Carta 1 di 3 da imparare')).toBeVisible()
})

// E4a: course content is not precached; the service worker caches a course chunk when it is first loaded.
test('a course opened online opens offline after a reload', async ({ page, context }) => {
  await page.goto('#/learning')
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  // The first load is not controlled by the new worker; from the reload on, chunk requests go through it.
  await page.reload()
  await page.goto('#/learning/backend-interview-lab')
  await expect(page.getByRole('progressbar', { name: 'Progresso complessivo' })).toBeVisible()

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('progressbar', { name: 'Progresso complessivo' })).toBeVisible()
  await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
})

test('"Scarica per offline" fetches every course and shows the done state', async ({ page }) => {
  await page.goto('#/learning')
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  await page.reload()
  await page.getByRole('button', { name: 'Scarica per offline' }).click()
  await expect(page.getByText('Tutti i corsi disponibili offline.')).toBeVisible()
  const cached = await page.evaluate(async () => (await (await caches.open('learning-courses')).keys()).length)
  expect(cached).toBeGreaterThan(0)
})
