import { expect, test } from '@playwright/test'

// Learning is local-first: signed out, a quiz answer survives a reload and feeds progress.

test('a quiz answer persists across a reload and moves the progress', async ({ page }) => {
  await page.goto('#/learning')
  await page.getByRole('link', { name: /Backend Interview Lab/ }).click()
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
  await page.goto('#/learning')
  await page.getByRole('link', { name: /Backend Interview Lab/ }).click()
  await page
    .getByRole('link', { name: /HTTP e REST/ })
    .first()
    .click()
  await page.getByRole('tab', { name: /^Flashcard/ }).click()
  await expect(page.getByText('Carta 1 di 4 da ripassare')).toBeVisible()
  await page.getByRole('button', { name: 'Mostra la risposta' }).click()
  await page.getByRole('button', { name: 'Lo so' }).click()
  await expect(page.getByText('Carta 1 di 3 da ripassare')).toBeVisible()

  await page.reload()
  await page.getByRole('tab', { name: /^Flashcard/ }).click()
  await expect(page.getByText('Carta 1 di 3 da ripassare')).toBeVisible()
})
