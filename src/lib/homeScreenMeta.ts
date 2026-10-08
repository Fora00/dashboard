import { useEffect } from 'react'
import { projectForPath } from './accent'

// IC4 EXPERIMENT: a different Home Screen icon and name per project. iOS
// Safari reads <link rel="apple-touch-icon"> and
// <meta name="apple-mobile-web-app-title"> when "Add to Home Screen" is
// tapped, so on a project page we point them at that project's tile. See
// docs/ARCHITECTURE.md ("Per-project Home Screen icon") for the test steps
// and what to delete if Safari ignores it.

export const DEFAULT_TITLE = 'Dashboard'

/** Icon and Home Screen name for a route. `base` is import.meta.env.BASE_URL. */
export function homeScreenMeta(pathname: string, base: string): { iconHref: string; title: string } {
  const p = projectForPath(pathname)
  return p
    ? { iconHref: `${base}icons/projects/${p.id}.png`, title: p.name }
    : { iconHref: `${base}icons/apple-touch-icon.png`, title: DEFAULT_TITLE }
}

/** Keeps exactly one apple-touch-icon link and one apple-mobile-web-app-title meta in sync with the route. */
export function useHomeScreenMeta(pathname: string): void {
  useEffect(() => {
    const { iconHref, title } = homeScreenMeta(pathname, import.meta.env.BASE_URL)

    const links = document.head.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    let link = links[0]
    for (const extra of [...links].slice(1)) extra.remove()
    if (!link) {
      link = document.createElement('link')
      link.rel = 'apple-touch-icon'
      document.head.appendChild(link)
    }
    if (link.getAttribute('href') !== iconHref) link.setAttribute('href', iconHref)

    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'apple-mobile-web-app-title'
      document.head.appendChild(meta)
    }
    meta.content = title
  }, [pathname])
}
