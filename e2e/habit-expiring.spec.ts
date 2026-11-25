import { expect, test } from '@playwright/test'

// Scadenze tab (owner, 2026-11-25): local-first, signed out. An experiment
// whose cycle ends within 14 days shows there with a count on the tab; one
// ending later does not. A row opens the habit page. Categorie groups every
// habit by engine, planned ones included.

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const inDays = (n: number) => dayKey(new Date(Date.now() + n * 86_400_000))

async function addExperiment(page: import('@playwright/test').Page, name: string, end: string, start?: string) {
  await page.getByRole('button', { name: /New habit/ }).click()
  const form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Nome').fill(name)
  await form
    .getByRole('group', { name: 'Tipo' })
    .getByRole('button', { name: /Esperimento/ })
    .click()
  await form.getByRole('group', { name: 'Engine' }).getByRole('button', { name: 'Mind' }).click()
  if (start) await form.getByLabel('Inizio').fill(start)
  await form.getByLabel('Fine').fill(end)
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()
}

test('the Scadenze tab lists cycles ending in the next 14 days', async ({ page }) => {
  await page.goto('#/habits')
  await addExperiment(page, 'Scade presto', inDays(3))
  await addExperiment(page, 'Scade dopo', inDays(30))

  const tab = page.getByRole('tab', { name: /Scadenze/ })
  await expect(tab).toContainText('1')
  await tab.click()

  await expect(page.getByRole('button', { name: /Scade presto/ })).toContainText(/Mind.*finisce tra 3 giorni/s)
  await expect(page.getByRole('button', { name: /Scade dopo/ })).toHaveCount(0)

  await page.getByRole('button', { name: /Scade presto/ }).click()
  await expect(page).toHaveURL(/#\/habits\/[^/]+$/)
})

test('the Categorie tab groups habits by engine into in corso, future and passate', async ({ page }) => {
  await page.goto('#/habits')
  await addExperiment(page, 'Cat presente', inDays(10))
  await addExperiment(page, 'Cat futura', inDays(40), inDays(12))

  await page.getByRole('tab', { name: /Categorie/ }).click()
  const mind = page.getByTestId('category-group').filter({ hasText: 'Mind' })
  await expect(mind).toContainText('1 in corso · 1 future · 0 passate')
  await expect(mind.getByRole('button', { name: /Cat futura/ })).toContainText('inizia tra 12 giorni')
  await expect(mind.getByRole('button', { name: /Cat presente/ })).toContainText('giorno 1/')
})
