// Tiny fuzzy matcher for the command palette. Pure, no dependency.
// Accents and case are ignored ("caffe" finds "Caffè"). Every whitespace
// separated token of the query must match; a token scores by how it matches:
// prefix of the text > start of a word > substring > subsequence.

/** Lower-case, accent-free form used for comparing. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function isWordStart(text: string, i: number): boolean {
  return i === 0 || /[^a-z0-9]/.test(text[i - 1] ?? '')
}

function tokenScore(text: string, token: string): number | null {
  if (text.startsWith(token)) return 100 - Math.min(text.length - token.length, 40) * 0.5
  let from = 0
  for (;;) {
    const i = text.indexOf(token, from)
    if (i < 0) break
    if (isWordStart(text, i)) return 80 - Math.min(i, 40) * 0.2
    from = i + 1
  }
  const sub = text.indexOf(token)
  if (sub >= 0) return 50 - Math.min(sub, 30) * 0.2
  // Subsequence: letters in order, rewarded when close together.
  let pos = -1
  let first = -1
  for (const ch of token) {
    pos = text.indexOf(ch, pos + 1)
    if (pos < 0) return null
    if (first < 0) first = pos
  }
  const span = pos - first + 1
  return Math.max(1, 25 - (span - token.length) - Math.min(first, 10) * 0.5)
}

/**
 * Score of `query` against `text` (higher is better), or null for no match.
 * An empty query matches everything with 0.
 */
export function fuzzyScore(query: string, text: string): number | null {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return 0
  const t = normalize(text)
  let total = 0
  for (const token of tokens) {
    const s = tokenScore(t, token)
    if (s === null) return null
    total += s
  }
  return total / tokens.length
}

/**
 * Best score over a primary label and weaker secondary keywords (area name,
 * id, description). Keywords count for half so a name match always wins.
 */
export function scoreItem(query: string, label: string, keywords: string[] = []): number | null {
  const main = fuzzyScore(query, label)
  let best = main
  for (const k of keywords) {
    const s = fuzzyScore(query, k)
    if (s !== null && (best === null || s / 2 > best)) best = s / 2
  }
  return best
}

/** Items that match, best first; ties keep the input order. */
export function rankItems<T>(query: string, items: T[], get: (item: T) => { label: string; keywords?: string[] }): T[] {
  if (normalize(query).trim() === '') return items
  return items
    .map((item, i) => {
      const { label, keywords } = get(item)
      return { item, i, score: scoreItem(query, label, keywords) }
    })
    .filter((x): x is { item: T; i: number; score: number } => x.score !== null)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.item)
}
