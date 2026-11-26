import { deflateRawSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

// Soldi Patrimonio (MO17): local-first, signed out, against the production
// build. An empty page, a link previewed and imported on tap, the tiles and
// the per-account table (a zero account hidden, then shown), a second link
// that replaces one month and empties another, and a damaged link (and a
// monthly-totals link) refused. Invented accounts and figures only.

type Row = [string, string, 'liquidita' | 'risparmi' | 'investimenti', number]

/** The `d` param the way scripts/life-money-balances-link.ts builds it: base64url(deflate-raw(JSON)). */
const param = (json: unknown) => deflateRawSync(Buffer.from(JSON.stringify(json), 'utf8')).toString('base64url')
const link = (from: string, to: string, rows: Row[]) =>
  `#/soldi/patrimonio/import?d=${param({ v: 'balances-1', from, to, rows })}`

const first = link('2025-01', '2026-02', [
  ['2025-01', 'Conto test', 'liquidita', 100000],
  ['2025-01', 'Fondo test', 'investimenti', 300000],
  ['2025-02', 'Conto test', 'liquidita', 110000],
  ['2025-02', 'Fondo test', 'investimenti', 310000],
  ['2026-01', 'Conto test', 'liquidita', 150000],
  ['2026-01', 'Deposito test', 'risparmi', 500000],
  ['2026-01', 'Fondo test', 'investimenti', 400000],
  ['2026-01', 'Vecchio conto test', 'liquidita', 2000],
  ['2026-02', 'Conto test', 'liquidita', 170000],
  ['2026-02', 'Deposito test', 'risparmi', 510000],
  ['2026-02', 'Fondo test', 'investimenti', 420000],
  ['2026-02', 'Vecchio conto test', 'liquidita', 0],
])

// January 2026 gone, February's current account changed.
const second = link('2026-01', '2026-02', [
  ['2026-02', 'Conto test', 'liquidita', 180000],
  ['2026-02', 'Deposito test', 'risparmi', 510000],
  ['2026-02', 'Fondo test', 'investimenti', 420000],
  ['2026-02', 'Vecchio conto test', 'liquidita', 0],
])

test('empty page, import on tap, tiles and table, zero accounts, a replacing import', async ({ page }) => {
  await page.goto('#/soldi/patrimonio')
  await expect(page.getByText('Ancora nessun saldo')).toBeVisible()
  await expect(page.getByText('npm run life:money-balances-link')).toBeVisible()

  await page.goto(first)
  await expect(page.getByTestId('balances-import-summary')).toHaveText(
    'gen 2025 → feb 2026: 4 nuovi, 0 cambiati, 0 invariati',
  )
  await expect(page.getByTestId('balances-import-row')).toHaveCount(4)
  await expect(page.getByTestId('balances-import-row').first()).toContainText('+ nuovo')
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()

  // The page: newest month by default.
  await expect(page).toHaveURL(/#\/soldi\/patrimonio$/)
  await expect(page.getByLabel('Mese', { exact: true })).toHaveValue('2026-02')
  const totals = page.getByRole('region', { name: 'Totali' })
  // 1.700 + 5.100 + 4.200 = 11.000 €; a month before 10.520 €; a year before 4.200 €.
  await expect(totals).toContainText(/11\.000\s€/)
  await expect(totals).toContainText(/mese prima \+480\s€/)
  await expect(totals).toContainText(/anno prima \+6800\s€/)
  await expect(page.getByTestId('balances-invest-note')).toHaveText(
    'Investimenti: quanto ci hai messo, non il valore di mercato.',
  )
  await expect(page.getByRole('group', { name: /Patrimonio per gruppo/ })).toBeVisible()

  const table = page.getByRole('region', { name: 'Conti' })
  await expect(table.getByRole('row').filter({ hasText: 'Conto test' })).toContainText(/\+200\s€/)
  // The emptied account is hidden until asked.
  await expect(table.getByText('Vecchio conto test')).toHaveCount(0)
  await table.getByRole('button', { name: 'Mostra conti a zero (1)' }).click()
  await expect(table.getByRole('row').filter({ hasText: 'Vecchio conto test' })).toContainText(/−20\s€/)
  await table.getByRole('button', { name: 'Nascondi conti a zero' }).click()
  await expect(table.getByText('Vecchio conto test')).toHaveCount(0)

  // An earlier month: the old account had money then, so it shows without asking.
  await page.getByLabel('Mese', { exact: true }).selectOption('2026-01')
  await expect(table.getByRole('row').filter({ hasText: 'Vecchio conto test' })).toBeVisible()
  await expect(table.getByRole('row').filter({ hasText: 'Deposito test' })).toContainText('—')

  // A replacing link: February changed, January emptied, 2025 untouched.
  await page.goto(second)
  await expect(page.getByTestId('balances-import-summary')).toHaveText(
    'gen 2026 → feb 2026: 0 nuovi, 1 cambiati, 0 invariati, 1 da svuotare',
  )
  await page.getByRole('button', { name: 'Importa (5 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi\/patrimonio$/)
  await expect(page.getByRole('region', { name: 'Totali' })).toContainText(/11\.100\s€/)
  await expect(page.getByLabel('Mese', { exact: true }).locator('option')).toHaveText([
    'feb 2026',
    'feb 2025',
    'gen 2025',
  ])

  // Same link again: nothing to write.
  await page.goto(second)
  await expect(page.getByTestId('balances-import-nothing')).toBeVisible()
})

test('a damaged link and a monthly-totals link are refused, nothing written', async ({ page }) => {
  await page.goto('#/soldi/patrimonio/import?d=not-a-real-link')
  await expect(page.getByText('Link non valido:')).toBeVisible()
  await expect(page.getByRole('button', { name: /Importa/ })).toHaveCount(0)

  await page.goto(
    `#/soldi/patrimonio/import?d=${param({ v: 1, from: '2026-01', to: '2026-01', rows: [['2026-01', 'Spesa test', 'spend', -100, null]] })}`,
  )
  await expect(page.getByText(/monthly-totals link/)).toBeVisible()

  await page.goto('#/soldi/patrimonio')
  await expect(page.getByText('Ancora nessun saldo')).toBeVisible()
})
