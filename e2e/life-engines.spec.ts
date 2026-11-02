import { expect, test } from '@playwright/test'

// Life Engines: local-first, signed out. Score an engine, make it the lead,
// fill its iceberg, see it survive a reload, and check the month export
// carries the counts and the lever but never the iceberg's free text.

test('engines can be scored, led and audited, and the export has no free text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('#/life')
  await page.getByRole('button', { name: 'Month', exact: true }).click()

  const score = page.getByTestId('engine-score-mind')
  await expect(score).toHaveText('–')
  await page.getByRole('button', { name: 'Raise Mind score' }).click()
  await expect(score).toHaveText('5')
  await page.getByRole('button', { name: 'Raise Mind score' }).click()
  await expect(score).toHaveText('6')

  const mindLead = page.getByRole('button', { name: 'Lead: Mind' })
  const moneyLead = page.getByRole('button', { name: 'Lead: Money' })
  await mindLead.click()
  await expect(mindLead).toHaveAttribute('aria-pressed', 'true')
  await moneyLead.click()
  await expect(moneyLead).toHaveAttribute('aria-pressed', 'true')
  await expect(mindLead).toHaveAttribute('aria-pressed', 'false')
  await mindLead.click()

  await page.getByRole('button', { name: 'Mind iceberg' }).click()
  const sheet = page.getByRole('dialog', { name: 'Mind iceberg' })
  await sheet.getByLabel('Event').fill('Engine test event')
  await sheet.getByLabel('Why 1').fill('Engine test why')
  await sheet.getByLabel('Lever').fill('Engine test lever')
  await sheet.getByRole('button', { name: 'Done' }).click()
  await expect(sheet).toBeHidden()

  await page.reload()
  await page.getByRole('button', { name: 'Month', exact: true }).click()
  await expect(page.getByTestId('engine-score-mind')).toHaveText('6')
  await expect(page.getByRole('button', { name: 'Lead: Mind' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Lead: Money' })).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('button', { name: 'Mind iceberg' }).click()
  await expect(page.getByRole('dialog', { name: 'Mind iceberg' }).getByLabel('Event')).toHaveValue('Engine test event')
  await page.getByRole('dialog', { name: 'Mind iceberg' }).getByRole('button', { name: 'Done' }).click()

  await page.getByRole('button', { name: /Export month/ }).click()
  await expect(page.getByRole('button', { name: /Copied/ })).toBeVisible()
  const md = await page.evaluate(() => navigator.clipboard.readText())
  expect(md).toContain('## Engines')
  expect(md).toContain('- Lead engine: Mind')
  expect(md).toContain(
    '- Mind: 6 (before: –); lead; iceberg: 1 of 4 layers, 1 whys; lever: Engine test lever; habits: 0',
  )
  expect(md).not.toContain('Engine test event')
  expect(md).not.toContain('Engine test why')
})

test('a habit tagged with an engine shows in that engine and counts in the export', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('#/habits')
  await page.getByRole('button', { name: /New habit/ }).click()
  const form = page.getByRole('dialog', { name: 'New habit' })
  await form.getByLabel('Name').fill('Engine test habit')
  const engine = form.getByRole('group', { name: 'Engine' })
  await expect(form.getByRole('button', { name: 'Create habit' })).toBeDisabled()
  await engine.getByRole('button', { name: 'Mind' }).click()
  await expect(engine.getByRole('button', { name: 'Mind' })).toHaveAttribute('aria-pressed', 'true')
  await form.getByRole('button', { name: 'Create habit' }).click()
  await expect(form).toBeHidden()

  await page.goto('#/life')
  await page.getByRole('button', { name: 'Month', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Mind iceberg' })).toContainText('1 habit')
  await page.getByRole('button', { name: 'Mind iceberg' }).click()
  const sheet = page.getByRole('dialog', { name: 'Mind iceberg' })
  await expect(sheet.getByTestId('engine-habits')).toContainText('Engine test habit')
  await sheet.getByRole('button', { name: 'Done' }).click()

  await page.getByRole('button', { name: /Export month/ }).click()
  await expect(page.getByRole('button', { name: /Copied/ })).toBeVisible()
  const md = await page.evaluate(() => navigator.clipboard.readText())
  expect(md).toContain('- Mind: – (before: –); no iceberg; habits: 1')
  expect(md).toContain('- Money: – (before: –); no iceberg; habits: 0')
})
