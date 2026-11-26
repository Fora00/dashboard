import { deflateRawSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

// Siti (SI1): local-first, signed out, against the production build. An empty
// page, an import link previewed and imported on tap, the cards (failed
// deploy badge, preview status from the repo name), owner edits that survive
// a second import (which also flags a repo gone from GitHub), the status
// filter, a manual site, delete with Undo, and a damaged link refused.
// Invented repos and urls only.

type Row = [string, string, string, 0 | 1, number | null, 'built' | 'errored' | 'building' | null, number | null]

const DAY = 86_400_000
const now = Date.now()

/** The `d` param the way scripts/sites-link.ts builds it: base64url(deflate-raw(JSON)). */
const param = (json: unknown) => deflateRawSync(Buffer.from(JSON.stringify(json), 'utf8')).toString('base64url')
const link = (fetchedAt: number, rows: Row[]) => `#/siti/import?d=${param({ v: 'sites-1', fetchedAt, rows })}`

const first = link(now - DAY, [
  [
    'example-user/shop-site',
    'https://example-user.github.io/shop-site/',
    'Un negozio',
    0,
    now - 3 * DAY,
    'built',
    now - 3 * DAY,
  ],
  [
    'example-user/client-preview',
    'https://example-user.github.io/client-preview/',
    '',
    1,
    now - DAY,
    'built',
    now - DAY,
  ],
  ['example-user/blog', 'https://example-user.github.io/blog/', '', 0, now - 2 * DAY, 'errored', now - 2 * DAY],
])

// The shop rebuilt, the client preview gone from GitHub, the blog unchanged.
const second = link(now, [
  [
    'example-user/shop-site',
    'https://example-user.github.io/shop-site/',
    'Un negozio',
    0,
    now - DAY / 2,
    'built',
    now - DAY / 2,
  ],
  ['example-user/blog', 'https://example-user.github.io/blog/', '', 0, now - 2 * DAY, 'errored', now - 2 * DAY],
])

test('import on tap, cards, owner fields survive a second import, filter, manual site, undo', async ({ page }) => {
  await page.goto('#/siti')
  await expect(page.getByText('Ancora nessun sito')).toBeVisible()
  await expect(page.getByText(/npm run sites:link -- --open/)).toBeVisible()

  await page.goto(first)
  await expect(page.getByTestId('sites-import-summary')).toHaveText(
    '3 nuovi, 0 aggiornati, 0 spariti da GitHub, 0 invariati',
  )
  await expect(page.getByTestId('sites-import-added').getByRole('listitem')).toHaveCount(3)
  await page.getByRole('button', { name: 'Importa' }).click()

  await expect(page).toHaveURL(/#\/siti$/)
  const cards = page.getByTestId('site-card')
  await expect(cards).toHaveCount(3)
  // Most recent deploy first: client-preview (1 day), blog (2), shop-site (3).
  await expect(page.getByTestId('site-name')).toHaveText(['client-preview', 'blog', 'shop-site'])
  const blog = cards.filter({ hasText: 'example-user/blog' })
  await expect(blog.getByText('deploy fallito')).toBeVisible()
  await expect(blog.getByText(/ultimo deploy/)).toBeVisible()
  await expect(blog.getByRole('link', { name: 'Apri blog' })).toHaveAttribute(
    'href',
    'https://example-user.github.io/blog/',
  )
  await expect(blog.getByRole('link', { name: 'Apri blog' })).toHaveAttribute('target', '_blank')
  // A -preview repo starts as preview.
  await expect(
    cards.filter({ hasText: 'example-user/client-preview' }).getByText('preview', { exact: true }),
  ).toBeVisible()

  // Owner edits on the shop: name, notes, status, pinned.
  await page.getByRole('button', { name: 'Modifica shop-site' }).click()
  const shop = cards.filter({ hasText: 'example-user/shop-site' })
  await shop.getByLabel('Nome').fill('Negozio di prova')
  await shop.getByLabel('Note').click()
  await expect(page.getByTestId('site-name').filter({ hasText: 'Negozio di prova' })).toBeVisible()
  await shop.getByLabel('Note').fill('Cliente inventato')
  await shop.getByRole('group', { name: 'Stato' }).getByRole('button', { name: 'archiviato' }).click()
  await shop.getByRole('switch', { name: 'Fissato in alto' }).click()
  await expect(page.getByTestId('site-name')).toHaveText(['Negozio di prova', 'client-preview', 'blog'])

  // Second import: GitHub fields refreshed, owner fields kept, a repo gone.
  await page.goto(second)
  await expect(page.getByTestId('sites-import-summary')).toHaveText(
    '0 nuovi, 1 aggiornati, 1 spariti da GitHub, 1 invariati',
  )
  await expect(page.getByTestId('sites-import-updated')).toContainText('Negozio di prova')
  await expect(page.getByTestId('sites-import-gone')).toContainText('client-preview')
  await page.getByRole('button', { name: 'Importa' }).click()
  await expect(page).toHaveURL(/#\/siti$/)
  await expect(cards).toHaveCount(3)
  await expect(page.getByTestId('site-name')).toHaveText(['Negozio di prova', 'client-preview', 'blog'])
  await expect(cards.filter({ hasText: 'example-user/client-preview' }).getByText('sparito da GitHub')).toBeVisible()
  await page.getByRole('button', { name: 'Modifica Negozio di prova' }).click()
  await expect(shop.getByLabel('Note')).toHaveValue('Cliente inventato')
  await expect(shop.getByRole('switch', { name: 'Fissato in alto' })).toHaveAttribute('aria-checked', 'true')
  await expect(shop.getByRole('button', { name: 'archiviato' })).toHaveAttribute('aria-pressed', 'true')

  // Same link again: nothing to write.
  await page.goto(second)
  await expect(page.getByTestId('sites-import-nothing')).toBeVisible()
  await page.goto('#/siti')

  // Status filter.
  const filters = page.getByRole('group', { name: 'Filtra per stato' })
  await filters.getByRole('button', { name: /preview/ }).click()
  await expect(page.getByTestId('site-name')).toHaveText(['client-preview'])
  await filters.getByRole('button', { name: /archiviati/ }).click()
  await expect(page.getByTestId('site-name')).toHaveText(['Negozio di prova'])
  await filters.getByRole('button', { name: /tutti/ }).click()

  // A manual site (no repo).
  await page.getByRole('button', { name: '+ Aggiungi sito' }).click()
  await page.getByLabel('Indirizzo del sito').fill('portfolio.example.org')
  await page.getByLabel('Nome del sito').fill('Portfolio di prova')
  await page.getByRole('button', { name: 'Aggiungi', exact: true }).click()
  await expect(cards).toHaveCount(4)
  const manual = cards.filter({ hasText: 'Portfolio di prova' })
  await expect(manual.getByText('aggiunto a mano')).toBeVisible()
  await expect(manual.getByRole('link', { name: 'Apri Portfolio di prova' })).toHaveAttribute(
    'href',
    'https://portfolio.example.org/',
  )

  // Delete with Undo.
  await page.getByRole('button', { name: 'Modifica blog' }).click()
  await cards.filter({ hasText: 'example-user/blog' }).getByRole('button', { name: '✕ Elimina' }).click()
  await expect(cards).toHaveCount(3)
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(cards).toHaveCount(4)
  await expect(cards.filter({ hasText: 'example-user/blog' }).getByText('deploy fallito')).toBeVisible()
})

test('a damaged link and a link of another format are refused, nothing written', async ({ page }) => {
  await page.goto('#/siti/import?d=not-a-real-link')
  await expect(page.getByText('Link non valido:')).toBeVisible()
  await expect(page.getByRole('button', { name: /Importa/ })).toHaveCount(0)

  await page.goto(`#/siti/import?d=${param({ v: 'balances-1', from: '2026-01', to: '2026-01', rows: [] })}`)
  await expect(page.getByText(/Unknown import link format/)).toBeVisible()

  await page.goto('#/siti')
  await expect(page.getByText('Ancora nessun sito')).toBeVisible()
})

// SI3: changes and ideas, logged from the floating "+" on /siti (nothing on
// the websites themselves). Count on the card, list by kind, done, Undo.
test('the + sheet logs a change or idea; count on the card, done and undo', async ({ page }) => {
  await page.goto('#/siti')
  await expect(page.getByRole('button', { name: 'Nuova modifica o idea' })).toHaveCount(0)
  for (const [url, name] of [
    ['alpha.example.org', 'Sito Alfa'],
    ['beta.example.org', 'Sito Beta'],
  ]) {
    await page.getByRole('button', { name: '+ Aggiungi sito' }).click()
    await page.getByLabel('Indirizzo del sito').fill(url)
    await page.getByLabel('Nome del sito').fill(name)
    await page.getByRole('button', { name: 'Aggiungi', exact: true }).click()
  }
  const cards = page.getByTestId('site-card')
  await expect(cards).toHaveCount(2)
  const beta = cards.filter({ hasText: 'Sito Beta' })

  // With Beta's detail open, the sheet defaults to Beta.
  await page.getByRole('button', { name: 'Modifica Sito Beta' }).click()
  await page.getByRole('button', { name: 'Nuova modifica o idea' }).click()
  const sheet = page.getByRole('dialog', { name: 'Nuova modifica o idea' })
  await expect(sheet.getByLabel('Sito').locator('option:checked')).toHaveText('Sito Beta')
  await sheet.getByRole('group', { name: 'Tipo' }).getByRole('button', { name: 'Idea' }).click()
  await sheet.getByLabel('Pagina (facoltativa)').fill('/galleria')
  await expect(sheet.getByRole('button', { name: 'Salva' })).toBeDisabled()
  await sheet.getByLabel('Testo').fill('Una galleria di foto')
  await sheet.getByRole('button', { name: 'Salva' }).click()
  await expect(sheet).toBeHidden()

  await expect(beta.getByTestId('site-open-notes')).toHaveText('📝 1 aperta')
  const notes = beta.getByRole('region', { name: 'Modifiche e idee di Sito Beta' })
  await expect(notes.getByText('Idee (1)')).toBeVisible()
  await expect(notes.getByTestId('site-note')).toContainText('/galleria')

  // Done: off the count, collapsed below. Delete, then Undo.
  await notes.getByRole('checkbox', { name: 'Fatta: Una galleria di foto' }).click()
  await expect(beta.getByTestId('site-open-notes')).toHaveCount(0)
  await notes.getByRole('button', { name: 'Fatte (1)' }).click()
  await notes.getByRole('button', { name: 'Elimina: Una galleria di foto' }).click()
  await expect(notes.getByTestId('site-note')).toHaveCount(0)
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(notes.getByRole('button', { name: /Fatte \(1\)/ })).toBeVisible()

  // A change added from the site's own list.
  await notes.getByLabel('Nuova nota per Sito Beta').fill('Correggere il footer')
  await notes.getByRole('button', { name: '+ Aggiungi modifica' }).click()
  await expect(notes.getByText('Modifiche (1)')).toBeVisible()
  await expect(beta.getByTestId('site-open-notes')).toHaveText('📝 1 aperta')

  // Detail closed: the sheet remembers the last site used.
  await page.getByRole('button', { name: 'Modifica Sito Beta' }).click()
  await page.getByRole('button', { name: 'Nuova modifica o idea' }).click()
  await expect(sheet.getByLabel('Sito').locator('option:checked')).toHaveText('Sito Beta')
  await sheet.getByLabel('Sito').selectOption({ label: 'Sito Alfa' })
  await sheet.getByLabel('Testo').fill('Nuovo logo')
  await sheet.getByRole('button', { name: 'Salva' }).click()
  await expect(cards.filter({ hasText: 'Sito Alfa' }).getByTestId('site-open-notes')).toHaveText('📝 1 aperta')

  // Deleting a site takes its notes; Undo brings both back.
  await page.getByRole('button', { name: 'Modifica Sito Alfa' }).click()
  await cards.filter({ hasText: 'Sito Alfa' }).getByRole('button', { name: '✕ Elimina' }).click()
  await expect(cards).toHaveCount(1)
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(cards.filter({ hasText: 'Sito Alfa' }).getByTestId('site-open-notes')).toHaveText('📝 1 aperta')
})
