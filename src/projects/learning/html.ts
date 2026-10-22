// Course text carries light HTML (<b>, <code>, <table>, <pre>, a few classes).
// Instead of dangerouslySetInnerHTML we parse it into a tiny tree and render it
// as React elements through an allowlist, so nothing outside it can ever reach
// the DOM. Pure (no DOM), so it is unit-tested in node.

export type HtmlNode = string | { tag: string; cls?: string | undefined; children: HtmlNode[] }

const ALLOWED = new Set([
  'p',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'b',
  'strong',
  'i',
  'em',
  'code',
  'pre',
  'br',
  'div',
  'span',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
])
const VOID = new Set(['br'])
const ALLOWED_CLASSES = new Set(['lead', 'say', 'tblw'])

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e.startsWith('#')) {
      const cp = e.charAt(1).toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m
    }
    return ENTITIES[e.toLowerCase()] ?? m
  })
}

const TOKEN = /<(\/?)([a-z][a-z0-9]*)((?:\s[^>]*)?)>|<[^>]*>|[^<]+|</gi

function classOf(attrs: string): string | undefined {
  const m = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(' ' + attrs)
  const kept = (m?.[1] ?? m?.[2] ?? '').split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c))
  return kept.length ? kept.join(' ') : undefined
}

/** Parse light HTML into an allowlisted tree; unknown tags are dropped (their text is kept). */
export function parseHtml(html: string): HtmlNode[] {
  const root: { children: HtmlNode[] } = { children: [] }
  const stack: { tag: string; children: HtmlNode[] }[] = [{ tag: '', children: root.children }]
  const top = () => stack[stack.length - 1] ?? { tag: '', children: root.children }
  for (const m of html.matchAll(TOKEN)) {
    const raw = m[0]
    const close = m[1]
    const name = m[2]
    const attrs = m[3]
    if (name === undefined) {
      if (raw.startsWith('<') && raw.length > 1) continue // comment / doctype / junk tag
      top().children.push(decodeEntities(raw)) // text, or a lone '<'
      continue
    }
    const tag = name.toLowerCase()
    if (!ALLOWED.has(tag)) continue
    if (close) {
      const i = stack.map((s) => s.tag).lastIndexOf(tag)
      if (i > 0) stack.length = i
      continue
    }
    const node = { tag, cls: classOf(attrs ?? ''), children: [] as HtmlNode[] }
    top().children.push(node)
    if (!VOID.has(tag)) stack.push(node)
  }
  return root.children
}

/** Plain text of a fragment (for aria-labels and tests). */
export function htmlToText(html: string): string {
  const walk = (nodes: HtmlNode[]): string => nodes.map((n) => (typeof n === 'string' ? n : walk(n.children))).join('')
  return walk(parseHtml(html))
}
