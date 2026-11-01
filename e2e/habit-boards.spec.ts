import { expect, test } from '@playwright/test'

// Board tab (EN3): local-first, signed out. A forever habit tagged with an
// engine and an untagged experiment land on two boards, each legend grouped
// by engine with the group's lifetime wins.

test('the board shows forever wins and experiments, grouped by engine', async ({ page }) => {
  await page.goto('#/habits')

  await page.getByRole('button', { name: /New habit/ }).click()
  let form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Name').fill('Board test forever')
  await form.getByRole('group', { name: 'Engine' }).getByRole('button', { name: 'Mind' }).click()
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()

  await page.getByRole('tab', { name: 'board' }).click()
  await expect(page.getByTestId('no-experiments')).toBeVisible()
  await page.getByRole('tab', { name: 'today' }).click()

  await page.getByRole('button', { name: /New habit/ }).click()
  form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Name').fill('Board test experiment')
  await form
    .getByRole('group', { name: 'Kind' })
    .getByRole('button', { name: /Experiment/ })
    .click()
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()

  await page.getByRole('button', { name: /^Board test forever: / }).click()
  await expect(page.getByRole('button', { name: /^Board test forever: / })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('tab', { name: 'board' }).click()
  const forever = page.getByTestId('lifeboard-forever')
  await expect(page.getByTestId('lifeboard-forever-total')).toHaveText('1')
  await expect(forever.getByTestId('lifeboard-forever-group')).toHaveText([/Mind\s*1.*Board test forever/s])

  const experiments = page.getByTestId('lifeboard-experiment')
  await expect(experiments).toBeVisible()
  await expect(page.getByTestId('lifeboard-experiment-total')).toHaveText('0')
  await expect(experiments.getByTestId('lifeboard-experiment-group')).toHaveText([
    /No engine\s*0.*Board test experiment/s,
  ])
  await expect(page.getByTestId('no-experiments')).toBeHidden()
})
