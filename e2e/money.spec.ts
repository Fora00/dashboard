import { deflateRawSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

// Soldi (MO5): local-first, signed out, against the production build. An empty
// page, an import link previewed and applied on tap, the page built from it
// (compare label, a mid-year budget that is not "over", the table view), then
// a second link that changes one month and empties another, and is
// idempotent. A damaged link is refused. Invented categories and figures only.

type Row = [string, string, 'income' | 'spend' | 'oneoff' | 'pass', number, number | null]

/** The `d` param the way scripts/life-money-link.ts builds it: base64url(deflate-raw(JSON)). */
const link = (from: string, to: string, rows: Row[]) =>
  `#/soldi/import?d=${deflateRawSync(Buffer.from(JSON.stringify({ v: 1, from, to, rows }), 'utf8')).toString('base64url')}`

const first = link('2025-01', '2026-02', [
  ['2025-01', 'Stipendio test', 'income', 200000, null],
  ['2025-01', 'Spesa test', 'auto', -30000, null],
  ['2025-02', 'Stipendio test', 'income', 200000, null],
  ['2025-02', 'Spesa test', 'auto', -30000, null],
  ['2026-01', 'Stipendio test', 'income', 210000, null],
  ['2026-01', 'Spesa test', 'auto', -40000, null],
  ['2026-01', 'Palestra test', 'auto', -5000, null],
  // The budget starts in February: January's spending must not count towards "over".
  ['2026-02', 'Stipendio test', 'income', 210000, null],
  ['2026-02', 'Spesa test', 'auto', -25000, -30000],
  ['2026-02', 'Palestra test', 'auto', -5000, -5000],
  // Gifts: received more than given in 2026, so income this year, spend in 2025.
  ['2025-01', 'Regali test', 'auto', -4000, null],
  ['2026-02', 'Regali test', 'auto', 9000, null],
])

// January 2026 gone from the CSV, February's groceries changed.
const second = link('2026-01', '2026-02', [
  ['2026-02', 'Stipendio test', 'income', 210000, null],
  ['2026-02', 'Spesa test', 'auto', -26000, -30000],
  ['2026-02', 'Palestra test', 'auto', -5000, -5000],
  ['2026-02', 'Regali test', 'auto', 9000, null],
])

test('empty page, import on tap, the page, a replacing import, idempotent', async ({ page }) => {
  await page.goto('#/soldi')
  await expect(page.getByText('Ancora nessun dato')).toBeVisible()

  await page.goto(first)
  await expect(page.getByTestId('money-import-summary')).toHaveText(
    'gen 2025 → feb 2026: 4 nuovi, 0 cambiati, 0 invariati',
  )
  await expect(page.getByTestId('money-import-row')).toHaveCount(4)
  await expect(page.getByTestId('money-import-row').first()).toContainText('+ nuovo')
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()

  // The page: newest year to date, compared with the same months of the year before.
  await expect(page).toHaveURL(/#\/soldi$/)
  await expect(page.getByText(/confronto con gen–feb 2025/)).toBeVisible()
  await expect(page.getByRole('region', { name: 'Totali' })).toContainText('entrate')
  const spend = page.getByRole('region', { name: 'Uscite per categoria' })
  const groceries = spend.getByRole('listitem').filter({ hasText: 'Spesa test' })
  await expect(groceries).toContainText('(budget feb)')
  await expect(groceries).not.toContainText('▲')

  await page.getByRole('radio', { name: 'Vedi come tabella' }).click()
  await expect(page.getByRole('region', { name: 'Tabella mesi' })).toBeVisible()
  await expect(page.getByRole('row').filter({ hasText: 'Spesa test' })).toContainText('(feb)')
  // An auto category that took in more than it spent this year is income this year.
  await expect(page.getByRole('row').filter({ hasText: 'Regali test' })).toContainText('entrata')

  await page.goto(second)
  await expect(page.getByTestId('money-import-summary')).toHaveText(
    'gen 2026 → feb 2026: 0 nuovi, 1 cambiati, 0 invariati, 1 da svuotare',
  )
  await expect(page.getByTestId('money-import-row').filter({ hasText: 'gen 2026' })).toContainText('da svuotare')
  await page.getByRole('button', { name: 'Importa (4 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)

  // Same link again: nothing to write. January is empty on both sides, so it is not listed.
  await page.goto(second)
  await expect(page.getByTestId('money-import-summary')).toHaveText(
    'gen 2026 → feb 2026: 0 nuovi, 0 cambiati, 1 invariati',
  )
  await expect(page.getByTestId('money-import-nothing')).toBeVisible()

  // 2025 is outside the second link's range: still there.
  await page.goto('#/soldi')
  await page.getByLabel('Anno').selectOption('2025')
  const spend2025 = page.getByRole('region', { name: 'Uscite per categoria' })
  await expect(spend2025).toContainText('Spesa test')
  // ... and spend the year it did not.
  await expect(spend2025).toContainText('Regali test')
})

test('a damaged link is refused and writes nothing', async ({ page }) => {
  await page.goto('#/soldi/import?d=not-a-real-link')
  await expect(page.getByText('Link non valido:')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Importa/ })).toHaveCount(0)
  await page.goto('#/soldi')
  await expect(page.getByText('Ancora nessun dato')).toBeVisible()
})
