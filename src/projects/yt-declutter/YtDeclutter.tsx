import { useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { bookmarkletRef, buildBookmarkletHref } from './script'

// Static, no-Dexie page: hands out a javascript: bookmarklet that hides
// YouTube mobile web's Home tab. Nothing here persists or syncs, so this
// page must work fully offline and fully signed out.

export function YtDeclutter() {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(buildBookmarkletHref())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <PageHeader
        emoji="📺"
        title="YouTube Declutter"
        subtitle="Hide YouTube's Home tab on mobile, one tap per session."
      />

      <div className="space-y-6">
        <Card className="space-y-2 text-sm">
          <p className="text-slate-500 dark:text-slate-400">
            This is a bookmarklet — a tiny script disguised as a bookmark, not a browser
            extension. Running it hides the <strong className="text-slate-800 dark:text-slate-200">Home</strong> tab
            in YouTube mobile web's bottom nav bar, so opening YouTube drops you straight into
            Subscriptions/Shorts/Search instead of an endless recommendation feed.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            It's session-based, not permanent: because there's no extension running in the
            background, you need to run it again after a fresh page load (a new tab, or
            reopening YouTube after fully closing the browser).
          </p>
        </Card>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Get the bookmarklet</h2>
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => void copyCode()}>
                {copied ? 'Copied! ✅' : 'Copy bookmarklet code'}
              </Button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                This is the primary way to install it on iPhone/iPad — see the steps below.
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              <a
                ref={bookmarkletRef}
                className="inline-flex min-h-10 items-center rounded-lg border border-dashed border-slate-300 bg-slate-100 px-3.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                🚫 Hide YouTube Home
              </a>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Desktop only: drag this link to your bookmarks bar. On mobile it's inert —
                tapping a link can't run a bookmarklet, use the copy button above instead.
              </p>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Install on iOS Safari</h2>
          <Card className="text-sm text-slate-500 dark:text-slate-400">
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Bookmark any page (Share → Add Bookmark).</li>
              <li>Edit that bookmark (Bookmarks list → Edit).</li>
              <li>Replace its URL with the copied bookmarklet code, then save.</li>
              <li>
                Whenever you're on youtube.com, open Bookmarks and tap it — it runs against the
                current page and hides Home.
              </li>
            </ol>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Install on iOS Chrome</h2>
          <Card className="text-sm text-slate-500 dark:text-slate-400">
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Bookmark any page (⋮ menu → Add to Bookmarks).</li>
              <li>Edit that bookmark and replace its URL with the copied bookmarklet code, then save.</li>
              <li>
                Give it a short, distinctive name, e.g. <span className="text-slate-800 dark:text-slate-200">"Hide YT Home"</span>.
              </li>
              <li>
                Chrome for iOS can't run a bookmarklet from a tap in the Bookmarks list. Instead,
                while on YouTube, tap the address bar, type that name, and select it from the
                suggestions to run it.
              </li>
            </ol>
          </Card>
        </section>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          YouTube's markup changes over time, and this bookmarklet targets specific elements in
          it. It's built to silently do nothing rather than break the page, so if Home stops
          disappearing after a YouTube update, that's most likely why — it isn't a sign that
          anything else is wrong.
        </p>
      </div>
    </div>
  )
}
