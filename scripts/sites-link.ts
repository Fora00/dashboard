// Prints the Siti import link (#/siti/import?d=…) listing every repo the owner
// publishes with GitHub Pages (SI1):
//
//   npm run sites:link -- [--open]
//
// Reads GitHub with the gh CLI (already signed in on the Mac): the owned repos
// (no forks) with Pages, each one's Pages url and latest Pages build (a 404,
// e.g. no build yet, is tolerated). A repo whose Pages are built by an Actions
// workflow (build_type "workflow", like the dashboard) has no legacy builds:
// its last deploy is the latest github-pages deployment and its status. No token ever goes into the link or the
// page. One link carries the whole list (a repo missing from it is marked
// "sparito da GitHub" on import), so it is never split. Prints only the link
// and counts, never repo names. --open opens the link in Chrome; the owner
// checks the preview and taps Importa.
import { execFileSync } from 'node:child_process'
import {
  encodeSitesLink,
  MAX_DESCRIPTION_LENGTH,
  pagesStatusFrom,
  pagesStatusFromDeployment,
  type SiteFromGithub,
} from '../src/projects/siti/sitesLink.ts'
import type { SitePagesStatus } from '../src/lib/db.ts'

const open = process.argv.slice(2).includes('--open')

/** `gh api <args>` → stdout, or null on an HTTP 404. Any other failure exits. */
function gh(args: string[]): string | null {
  try {
    return execFileSync('gh', ['api', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    })
  } catch (err) {
    const e = err as { code?: string; stderr?: string }
    if (e.code === 'ENOENT') {
      console.error('gh non trovato: installa la GitHub CLI e fai gh auth login.')
      process.exit(1)
    }
    if (/HTTP 404/.test(e.stderr ?? '')) return null
    console.error(`gh api ${args[args.length - 1]} non è riuscito:\n${(e.stderr ?? String(err)).trim()}`)
    process.exit(1)
  }
}

const time = (iso: unknown): number | null => {
  if (typeof iso !== 'string') return null
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : null
}

interface Deploy {
  status: SitePagesStatus | null
  at: number | null
}

/** Legacy Pages (built from a branch): the latest Pages build. */
function lastLegacyBuild(repo: string): Deploy {
  const out = gh([`/repos/${repo}/pages/builds/latest`])
  const b = out ? (JSON.parse(out) as { status?: unknown; updated_at?: unknown }) : null
  return { status: pagesStatusFrom(b?.status), at: time(b?.updated_at) }
}

/** Pages built by an Actions workflow: the latest github-pages deployment and its latest status. */
function lastWorkflowDeploy(repo: string): Deploy {
  const list = gh([`/repos/${repo}/deployments?environment=github-pages&per_page=1`])
  const d = list ? (JSON.parse(list) as { id?: unknown; created_at?: unknown }[])[0] : undefined
  if (!d || typeof d.id !== 'number') return { status: null, at: null }
  const st = gh([`/repos/${repo}/deployments/${d.id}/statuses?per_page=1`])
  const s = st ? (JSON.parse(st) as { state?: unknown; created_at?: unknown }[])[0] : undefined
  return { status: pagesStatusFromDeployment(s?.state), at: time(s?.created_at) ?? time(d.created_at) }
}

interface RepoLine {
  full_name: string
  description: string | null
  private: boolean
  pushed_at: string | null
}

const fetchedAt = Date.now()
const listing = gh([
  '--paginate',
  '/user/repos?per_page=100&affiliation=owner',
  '--jq',
  '.[] | select(.has_pages and (.fork | not)) | {full_name, description, private, pushed_at}',
])
const repos: RepoLine[] = (listing ?? '')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l) as RepoLine)

const sites: SiteFromGithub[] = []
let noUrl = 0
for (const r of repos) {
  const pages = gh([`/repos/${r.full_name}/pages`])
  const info = pages ? (JSON.parse(pages) as { html_url?: unknown; build_type?: unknown }) : null
  const htmlUrl = info?.html_url
  if (typeof htmlUrl !== 'string') {
    noUrl++
    continue
  }
  const deploy = info?.build_type === 'workflow' ? lastWorkflowDeploy(r.full_name) : lastLegacyBuild(r.full_name)
  sites.push({
    repo: r.full_name,
    url: htmlUrl,
    description: (r.description ?? '').slice(0, MAX_DESCRIPTION_LENGTH),
    private: r.private,
    pushedAt: time(r.pushed_at),
    pagesStatus: deploy.status,
    pagesBuiltAt: deploy.at,
  })
}

const failed = sites.filter((s) => s.pagesStatus === 'errored').length
console.log(
  `Siti: ${sites.length} repo con GitHub Pages` +
    (failed > 0 ? `, ${failed} con l'ultimo deploy fallito` : '') +
    (noUrl > 0 ? ` (${noUrl} senza indirizzo Pages, saltati)` : '') +
    '.',
)
let url: string
try {
  url = await encodeSitesLink({ fetchedAt, sites })
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}
if (open) {
  execFileSync('open', ['-a', 'Google Chrome', url])
  console.log('aperto in Chrome.')
} else console.log(url)
