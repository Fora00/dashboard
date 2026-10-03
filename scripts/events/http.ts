// Polite HTTP for the crawler:
// - honest User-Agent;
// - robots.txt fetched once per origin (RFC 9309 groups: our product token,
//   else `*`; Allow/Disallow with `*` and `$`, longest match wins, Allow wins
//   ties). 404/410 = allow all; any other failure = skip that host;
// - a robots.txt `Crawl-delay` (our group or `*`) raises the per-host delay;
// - a disallowed URL is never requested, redirects included (every hop is
//   checked, so a redirect to another host re-checks that host's robots);
// - ≥ MIN_DELAY_MS between requests to the same host, a timeout per request,
//   and a request cap per source.
import type { AdapterContext, FetchResult } from './types.ts'

export const USER_AGENT = 'dashboard-events-crawler/1.0 (+https://github.com/Fora00/dashboard)'
const PRODUCT_TOKEN = 'dashboard-events-crawler'
const MIN_DELAY_MS = 1500
const TIMEOUT_MS = 20_000
const MAX_REDIRECTS = 5
/** Ignore absurd Crawl-delay values rather than stall the whole run. */
const MAX_CRAWL_DELAY_S = 30

interface Rule { allow: boolean; pattern: string; re: RegExp }
type Robots = { rules: Rule[]; delayMs: number } | { error: string }

export class RobotsDisallowedError extends Error {}

function ruleRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith('$')
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(`^${body}${anchored ? '$' : ''}`)
}

/** Parse robots.txt and keep the rules (and Crawl-delay, in seconds) that apply to us. */
export function parseRobots(text: string): { rules: Rule[]; crawlDelay: number } {
  interface Group { agents: string[]; rules: Rule[]; delay: number }
  const groups: Group[] = []
  let current: Group | null = null
  let lastWasAgent = false
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/)
    if (!m) continue
    const key = (m[1] ?? '').toLowerCase()
    const value = (m[2] ?? '').trim()
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [], delay: 0 }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
      lastWasAgent = true
    } else {
      lastWasAgent = false
      if (current && key === 'crawl-delay') {
        const secs = Number(value)
        if (Number.isFinite(secs) && secs > 0) current.delay = Math.max(current.delay, secs)
        continue
      }
      if (!current || (key !== 'allow' && key !== 'disallow')) continue
      if (value === '') continue // "Disallow:" with no path allows everything
      current.rules.push({ allow: key === 'allow', pattern: value, re: ruleRegExp(value) })
    }
  }
  const ours = groups.filter((g) => g.agents.includes(PRODUCT_TOKEN))
  const chosen = ours.length ? ours : groups.filter((g) => g.agents.includes('*'))
  return {
    rules: chosen.flatMap((g) => g.rules),
    crawlDelay: Math.min(MAX_CRAWL_DELAY_S, Math.max(0, ...chosen.map((g) => g.delay))),
  }
}

/** Longest matching rule wins; Allow wins a tie; no match = allowed. */
export function isAllowed(rules: Rule[], pathAndQuery: string): boolean {
  let best: Rule | null = null
  for (const r of rules) {
    if (!r.re.test(pathAndQuery)) continue
    if (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.allow)) best = r
  }
  return best ? best.allow : true
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** One per crawl: shares the robots cache and per-host timing across sources. */
export class PoliteHttp {
  private robots = new Map<string, Promise<Robots>>()
  private lastRequest = new Map<string, number>()
  private hostDelay = new Map<string, number>()
  private hostQueue = new Map<string, Promise<void>>()
  requests = 0

  /** Wait until this host may be hit again, then mark the slot as taken. */
  private async slot(host: string): Promise<void> {
    const prev = this.hostQueue.get(host) ?? Promise.resolve()
    const mine = prev.then(async () => {
      const delay = Math.max(MIN_DELAY_MS, this.hostDelay.get(host) ?? 0)
      const wait = (this.lastRequest.get(host) ?? 0) + delay - Date.now()
      if (wait > 0) await sleep(wait)
      this.lastRequest.set(host, Date.now())
    })
    this.hostQueue.set(host, mine)
    await mine
  }

  private async rawGet(url: URL, redirect: 'follow' | 'manual', attempt = 0, body?: string, contentType = 'application/json'): Promise<Response> {
    await this.slot(url.host)
    this.requests++
    try {
      return await fetch(url, {
        redirect,
        headers: body === undefined
          ? { 'User-Agent': USER_AGENT, Accept: '*/*' }
          : { 'User-Agent': USER_AGENT, Accept: 'application/json', 'Content-Type': contentType },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        ...(body === undefined ? {} : { method: 'POST', body }),
      })
    } catch (e) {
      // A server closing a reused keep-alive socket ("other side closed",
      // seen on myarteven.it) is not an answer: retry once, after the usual
      // per-host delay. A timeout is retried (Comune di Mantova is
      // slow from GitHub's runners, Filarmonica Rovereto answers fast from a
      // laptop but sometimes times out in CI) twice; DNS errors are not.
      const code = (e as { cause?: { code?: string } }).cause?.code
      const timedOut = (e as Error).name === 'TimeoutError'
      if ((timedOut && attempt < 2) || (attempt < 1 && (code === 'UND_ERR_SOCKET' || code === 'ECONNRESET'))) {
        return this.rawGet(url, redirect, attempt + 1, body, contentType)
      }
      throw e
    }
  }

  private robotsFor(url: URL): Promise<Robots> {
    let p = this.robots.get(url.origin)
    if (!p) {
      p = (async (): Promise<Robots> => {
        try {
          const res = await this.rawGet(new URL('/robots.txt', url.origin), 'follow')
          if (res.status === 404 || res.status === 410) return { rules: [], delayMs: 0 }
          if (!res.ok) return { error: `robots.txt for ${url.host} returned HTTP ${res.status}; skipping host` }
          const parsed = parseRobots(await res.text())
          const delayMs = parsed.crawlDelay * 1000
          if (delayMs > 0) this.hostDelay.set(url.host, delayMs)
          return { rules: parsed.rules, delayMs }
        } catch (e) {
          return { error: `robots.txt for ${url.host} failed (${(e as Error).message}); skipping host` }
        }
      })()
      this.robots.set(url.origin, p)
    }
    return p
  }

  async assertAllowed(url: URL): Promise<void> {
    const robots = await this.robotsFor(url)
    if ('error' in robots) throw new RobotsDisallowedError(robots.error)
    if (!isAllowed(robots.rules, url.pathname + url.search)) {
      throw new RobotsDisallowedError(`robots.txt disallows ${url.href}`)
    }
  }

  /** GET following redirects by hand so every hop passes the robots check. */
  async get(href: string): Promise<FetchResult> {
    let url = new URL(href)
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await this.assertAllowed(url)
      const res = await this.rawGet(url, 'manual')
      const location = res.headers.get('location')
      if (res.status >= 300 && res.status < 400 && location) {
        await res.body?.cancel()
        url = new URL(location, url)
        continue
      }
      const text = await res.text()
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.href}`)
      return { status: res.status, url: url.href, text }
    }
    throw new Error(`too many redirects for ${href}`)
  }

  /**
   * POST a JSON body (APIs that only answer POST, e.g. Teatro Stabile del
   * Veneto's list). Same robots check, delay and timeout as a GET; redirects
   * are not followed (a POST API that redirects is an error).
   */
  async post(href: string, body: unknown, form = false): Promise<FetchResult> {
    const url = new URL(href)
    await this.assertAllowed(url)
    const res = form
      ? await this.rawGet(url, 'manual', 0, new URLSearchParams(body as Record<string, string>).toString(), 'application/x-www-form-urlencoded')
      : await this.rawGet(url, 'manual', 0, JSON.stringify(body))
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status} for POST ${url.href}`)
    return { status: res.status, url: url.href, text }
  }

  /** A per-source view with its own request budget. */
  context(sourceId: string, maxRequests: number, now: number, horizonDays: number): AdapterContext {
    let used = 0
    const budget = () => {
      if (used >= maxRequests) throw new Error(`${sourceId}: request cap (${maxRequests}) reached`)
      used++
    }
    const parse = <T>(res: FetchResult): T => {
      try {
        return JSON.parse(res.text) as T
      } catch {
        throw new Error(`invalid JSON from ${res.url}: ${res.text.slice(0, 120)}`)
      }
    }
    const fetchText = async (url: string): Promise<FetchResult> => {
      budget()
      return this.get(url)
    }
    return {
      now,
      horizonDays,
      fetchText,
      async fetchJson<T>(url: string): Promise<T> {
        return parse<T>(await fetchText(url))
      },
      postJson: async <T>(url: string, body: unknown): Promise<T> => {
        budget()
        return parse<T>(await this.post(url, body))
      },
      postForm: async <T>(url: string, body: Record<string, string>): Promise<T> => {
        budget()
        return parse<T>(await this.post(url, body, true))
      },
    }
  }
}
