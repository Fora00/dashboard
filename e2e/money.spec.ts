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
  // MO11: the year to date gets a year-end projection (data up to February: 10 months estimated).
  await expect(page.getByTestId('money-projection')).toContainText('A dicembre, a questo ritmo')
  await expect(page.getByTestId('money-projection')).toContainText('10 mesi stimati')
  const spend = page.getByRole('region', { name: 'Uscite per categoria' })
  const groceries = spend.getByRole('listitem').filter({ hasText: 'Spesa test' })
  await expect(groceries).toContainText('(budget feb)')
  await expect(groceries).not.toContainText('▲')

  await page.getByRole('radio', { name: 'Tabella' }).click()
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

test('periods and comparisons (MO6): one month, previous, average, a range across the year end', async ({ page }) => {
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  const totals = page.getByRole('region', { name: 'Totali' })

  await page.getByLabel('Periodo').selectOption('month')
  await page.getByLabel('Mese', { exact: true }).selectOption('2026-02')
  await page.getByLabel('Confronta con').selectOption('prev')
  await expect(totals).toContainText('feb 2026 · confronto con gen 2026')
  await expect(totals).toContainText('gen 26:')

  await page.getByLabel('Confronta con').selectOption('avg')
  await expect(totals).toContainText('confronto con media mensile storica (4 mesi)')
  await expect(page.getByTestId('money-chart-average')).toBeVisible()

  // Dec 2025 .. Feb 2026 against Dec 2024 .. Feb 2025: only two of those three months have data.
  await page.getByLabel('Periodo').selectOption('range')
  await page.getByLabel('Da', { exact: true }).selectOption('2025-12')
  await page.getByLabel('A', { exact: true }).selectOption('2026-02')
  await page.getByLabel('Confronta con').selectOption('yoy')
  await expect(totals).toContainText('dic 2025 – feb 2026 · confronto con dic 2024 – feb 2025')
  await expect(page.getByTestId('money-compare-note')).toHaveText('Il confronto ha dati solo per 2 mesi su 3.')

  // A chosen year: 2026 against all of 2025's same months.
  await page.getByLabel('Periodo').selectOption('year')
  await page.getByLabel('Confronta con').selectOption('custom')
  await page.getByLabel('Anno di confronto').selectOption('2025')
  await expect(totals).toContainText('gen–feb 2026 · confronto con gen–feb 2025')
})

test('trend view (MO7): super total, moving average, year on year, movers', async ({ page }) => {
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  await page.getByRole('radio', { name: 'Andamento' }).click()
  // The history runs gen 2025 → feb 2026: 14 months, the empty ones included.
  await expect(page.getByRole('region', { name: 'Super totale' })).toContainText('gen 2025 – feb 2026 (14 mesi)')
  await expect(page.getByRole('group', { name: 'Uscite e media mobile a 3 mesi' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Proiezione a fine anno' })).toContainText('a dicembre')
  // MO15: one row per calendar month; February is the newest month in the data.
  await expect(page.getByTestId('money-season').getByRole('listitem')).toHaveCount(12)
  await expect(page.getByTestId('money-season').getByRole('listitem').nth(1)).toContainText('← ora')
  await expect(page.getByRole('region', { name: 'Anno su anno' })).toContainText('Serve più di un anno di dati.')
  await expect(page.getByTestId('money-rising')).toContainText('Spesa test')
  await page.getByLabel('Finestra').selectOption('12')
  await expect(page.getByRole('region', { name: 'Categorie in movimento' })).toContainText('Servono almeno 24 mesi')
  // The period controls belong to the other views.
  await expect(page.getByLabel('Periodo')).toHaveCount(0)
})

// February's groceries budget changed in GreenBooks (300 → 320 €), the rest as in `first`.
const gbChanged = link('2026-02', '2026-02', [
  ['2026-02', 'Stipendio test', 'income', 210000, null],
  ['2026-02', 'Spesa test', 'auto', -25000, -32000],
  ['2026-02', 'Palestra test', 'auto', -5000, -5000],
  ['2026-02', 'Regali test', 'auto', 9000, null],
])

test('dashboard budgets (MO8): set from the sheet, a GreenBooks change conflicts, resolved, removed', async ({
  page,
}) => {
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  const spend = page.getByRole('region', { name: 'Uscite per categoria' })
  const groceries = spend.getByRole('listitem').filter({ hasText: 'Spesa test' })

  // 280 € a month from January: January had no budget, February's 300 € (GreenBooks) is overridden on save.
  await groceries.getByRole('button').click()
  const sheet = page.getByRole('dialog', { name: 'Budget · Spesa test' })
  await expect(sheet.getByRole('region', { name: 'Budget GreenBooks' })).toContainText('feb 2026')
  await sheet.getByLabel('Importo al mese (€)').fill('280')
  await sheet.getByLabel('Da mese').selectOption('2026-01')
  await sheet.getByRole('button', { name: 'Salva' }).click()
  await expect(sheet.getByTestId('money-budget-rules')).toContainText('280 €/mese · da gen 2026')
  await sheet.getByRole('button', { name: 'Close' }).click()
  // Spent 400 + 250 against 2 × 280: 90 over, both months budgeted now.
  await expect(groceries).toContainText('/ 560 €')
  await expect(groceries).toContainText('▲ 90 €')
  await expect(groceries).toContainText('budget dashboard')
  await expect(groceries).not.toContainText('conflitto')

  // GreenBooks now says 320 € for February: the pick made on save no longer holds.
  await page.goto(gbChanged)
  await page.getByRole('button', { name: /^Importa/ }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  await expect(groceries).toContainText('⚠ conflitto')
  // Unresolved: GreenBooks is used for February (280 + 320).
  await expect(groceries).toContainText('/ 600 €')
  await groceries.getByRole('button').click()
  await expect(sheet.getByTestId('money-budget-conflicts')).toContainText('feb 2026')
  await expect(sheet.getByTestId('money-budget-conflicts')).toContainText('GreenBooks 320 € · dashboard 280 €')
  await sheet.getByRole('button', { name: 'Usa dashboard' }).click()
  await expect(sheet.getByTestId('money-budget-conflicts')).toHaveCount(0)
  await sheet.getByRole('button', { name: 'Close' }).click()
  await expect(groceries).not.toContainText('conflitto')
  await expect(groceries).toContainText('/ 560 €')

  // The export button, then removing the rule brings GreenBooks back.
  await page.getByRole('button', { name: 'Copia budget per ~/life' }).click()
  await expect(page.getByText(/Copiato/).or(page.getByLabel('Budget in CSV'))).toBeVisible()
  await groceries.getByRole('button').click()
  // Cancel first: nothing removed.
  await sheet.getByRole('button', { name: /^Rimuovi/ }).click()
  const ask = page.getByRole('dialog', { name: 'Rimuovere questo budget?' })
  await ask.getByRole('button', { name: 'Cancel' }).click()
  await expect(sheet.getByTestId('money-budget-rules')).toContainText('280 €/mese')
  await sheet.getByRole('button', { name: /^Rimuovi/ }).click()
  await ask.getByRole('button', { name: 'Rimuovi' }).click()
  await expect(sheet.getByText('Nessun budget impostato qui.')).toBeVisible()
  await sheet.getByRole('button', { name: 'Close' }).click()
  await expect(groceries).not.toContainText('budget dashboard')
  await expect(groceries).toContainText('(budget feb)')

  // The table view opens the same sheet from a spend row (MO9); income rows are plain text.
  await page.getByRole('radio', { name: 'Tabella' }).click()
  await page.getByRole('button', { name: 'Budget di Spesa test' }).click()
  await expect(sheet).toBeVisible()
  await sheet.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('button', { name: 'Budget di Stipendio test' })).toHaveCount(0)
})

test('budget alerts on /soldi (MO12): faster than the month’s pace', async ({ page }) => {
  // On 10 February 2026 the import is from that day: February's budgets are checked at day 10 of 28.
  await page.clock.setFixedTime(new Date(2026, 1, 10, 12))
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  const alerts = page.getByTestId('money-alerts')
  // Groceries 250 of 300 (pace 107), gym 50 of 50 (pace 18).
  await expect(alerts).toContainText('Spesa test: 250 € su 300 € al giorno 10 su 28 · troppo veloce')
  await expect(alerts).toContainText('Palestra test: 50 € su 50 €')
})

test('savings goal (MO13): set from the sheet, in the tile, the projection and per year; inherited; removed', async ({
  page,
}) => {
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  const totals = page.getByRole('region', { name: 'Totali' })
  const sheet = page.getByRole('dialog', { name: 'Obiettivo 2026' })

  // 2026 so far: 4290 € in, 3540 € kept (83%). A 90% goal is still 321 € away.
  await expect(page.getByTestId('money-goal-tile')).toHaveCount(0)
  await page.getByRole('button', { name: 'Imposta obiettivo 2026' }).click()
  await expect(sheet.getByTestId('money-goal-note')).toContainText('Nessun obiettivo per il 2026.')
  await expect(sheet.getByTestId('money-goal-note')).toContainText('Vale anche per gli anni dopo')
  await sheet.getByLabel('Messo da parte, in % delle entrate').fill('abc')
  await sheet.getByRole('button', { name: 'Salva' }).click()
  await expect(sheet.getByRole('alert')).toContainText('percentuale da 0 a 100')
  await sheet.getByLabel('Messo da parte, in % delle entrate').fill('90')
  await sheet.getByRole('button', { name: 'Salva' }).click()
  await expect(sheet).toHaveCount(0)
  await expect(totals.getByTestId('money-goal-tile')).toHaveText(/obiettivo 90% · ▼ mancano 321\s€/)
  await expect(page.getByTestId('money-projection-goal')).toContainText('obiettivo 90%: a dicembre ≈')

  // Andamento: per year, 2026 with its goal, 2025 (no goal before it) without.
  await page.getByRole('radio', { name: 'Andamento' }).click()
  const perYear = page.getByRole('table', { name: 'Messo da parte per anno' })
  await expect(perYear.getByRole('row').filter({ hasText: '2026' })).toContainText('90%')
  await expect(perYear.getByRole('row').filter({ hasText: '2025' })).toContainText('—')
  await expect(perYear.getByRole('row')).toHaveCount(3)
  await expect(page.getByRole('region', { name: 'Proiezione a fine anno' })).toContainText('obiettivo 90%')

  // 2025 has no goal of its own and none before it: nothing shown, only the button.
  await page.getByRole('radio', { name: 'Grafici' }).click()
  await page.getByLabel('Anno').selectOption('2025')
  await expect(page.getByTestId('money-goal-tile')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Imposta obiettivo 2025' })).toBeVisible()

  // Another period mode: no goal controls.
  await page.getByLabel('Periodo').selectOption('month')
  await expect(page.getByRole('button', { name: /obiettivo/i })).toHaveCount(0)
  await page.getByLabel('Periodo').selectOption('year')
  await page.getByLabel('Anno').selectOption('2026')

  // Remove, cancelling first.
  await page.getByRole('button', { name: 'Obiettivo 2026' }).click()
  await expect(sheet.getByLabel('Messo da parte, in % delle entrate')).toHaveValue('90')
  await sheet.getByRole('button', { name: 'Rimuovi' }).click()
  const ask = page.getByRole('dialog', { name: 'Rimuovere questo obiettivo?' })
  await expect(ask).toContainText('Il 2026 resterà senza obiettivo.')
  await ask.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByTestId('money-goal-tile')).toHaveCount(1)
  await sheet.getByRole('button', { name: 'Rimuovi' }).click()
  await ask.getByRole('button', { name: 'Rimuovi' }).click()
  await expect(sheet).toHaveCount(0)
  await expect(page.getByTestId('money-goal-tile')).toHaveCount(0)
  await expect(page.getByTestId('money-projection-goal')).toHaveCount(0)

  // A goal on 2025 carries into 2026 until 2026 gets its own.
  await page.getByLabel('Anno').selectOption('2025')
  await page.getByRole('button', { name: 'Imposta obiettivo 2025' }).click()
  await page.getByRole('dialog', { name: 'Obiettivo 2025' }).getByLabel('Messo da parte, in % delle entrate').fill('20')
  await page.getByRole('dialog', { name: 'Obiettivo 2025' }).getByRole('button', { name: 'Salva' }).click()
  await page.getByLabel('Anno').selectOption('2026')
  await expect(totals).toContainText('ereditato dal 2025')
  await expect(totals.getByTestId('money-goal-tile')).toHaveText('obiettivo 20% (dal 2025) · ▲ raggiunto')
  await page.getByRole('button', { name: 'Obiettivo 2026' }).click()
  await expect(sheet.getByTestId('money-goal-note')).toContainText('Ereditato dal 2025: 20%.')
  // An inherited goal is not removed from the year that inherits it.
  await expect(sheet.getByRole('button', { name: 'Rimuovi' })).toHaveCount(0)
})

test('category history (MO14): from the row to its page, budget over time, year by year', async ({ page }) => {
  await page.goto(first)
  await page.getByRole('button', { name: 'Importa (12 righe)' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  await page.getByRole('link', { name: 'Storia di Spesa test' }).click()
  await expect(page).toHaveURL(/#\/soldi\/categoria\/Spesa%20test$/)
  await expect(page.getByRole('heading', { name: 'Spesa test' })).toBeVisible()
  await expect(page.getByRole('group', { name: /Spesa test: uscite e media a 3 mesi/ })).toBeVisible()
  // February 2026 had a 300 € budget and 250 € spent: never over.
  await expect(page.getByTestId('money-cat-over')).toContainText('Mai sopra il budget (1 mese con budget).')
  const years = page.getByRole('region', { name: 'Anno per anno' })
  await expect(years.getByRole('row')).toHaveCount(3)
  await expect(years.getByRole('row').filter({ hasText: '2026' })).toContainText('▲')
  await page.getByRole('button', { name: 'Budget', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Budget · Spesa test' })).toBeVisible()
  await page.getByRole('dialog', { name: 'Budget · Spesa test' }).getByRole('button', { name: 'Close' }).click()
  await page.getByRole('link', { name: '← Soldi' }).click()
  await expect(page).toHaveURL(/#\/soldi$/)
  await page.goto('#/soldi/categoria/Non%20esiste')
  await expect(page.getByText('Nessun dato per questa categoria')).toBeVisible()
})

test('a damaged link is refused and writes nothing', async ({ page }) => {
  await page.goto('#/soldi/import?d=not-a-real-link')
  await expect(page.getByText('Link non valido:')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Importa/ })).toHaveCount(0)
  await page.goto('#/soldi')
  await expect(page.getByText('Ancora nessun dato')).toBeVisible()
})
