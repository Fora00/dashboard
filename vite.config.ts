import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

function gitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return 'unknown'
  }
}

// Learning course content (E4a). A chunk made only of one course folder's files (courses/<id>/..., loaded by
// courses/registry.ts) and holding its index.ts is named `learn-course-<id>`; one made only of a language's
// words file (courses/<lang>/words.ts, loaded by vocab/index.ts) `learn-vocab-<lang>`. Only file names change,
// not the chunking: modules the app shares (kit.ts, pron.ts, vocabTable.ts) stay in ordinary chunks.
// These chunks are left OUT of the precache and cached at runtime (CacheFirst, 'learning-courses') the first
// time a course is opened or "Scarica per offline" is pressed. Exception, so no page breaks offline: a content
// chunk that a precached chunk imports STATICALLY (e.g. Life's week imports the whole course list) stays
// precached; see learningContentPrecache().
const COURSE_FILE = /[\\/]src[\\/]projects[\\/]learning[\\/]courses[\\/]([a-z0-9-]+)[\\/]([^\\/]+)\.ts$/
const LEARNING_CONTENT = /(^|\/)assets\/learn-(course|vocab)-[^/]+\.js$/

function chunkFileName(chunk: { facadeModuleId: string | null; moduleIds: readonly string[] }): string {
  const ids = chunk.moduleIds.length > 0 ? chunk.moduleIds : chunk.facadeModuleId ? [chunk.facadeModuleId] : []
  const files = ids.map((id) => COURSE_FILE.exec(id))
  const course = files[0]?.[1]
  if (!course || files.some((f) => f?.[1] !== course)) return 'assets/[name]-[hash].js'
  // A course chunk holds the course's index.ts; a same-folder chunk without it (e.g. pron.ts, also imported by
  // vocab/legend.ts) is shared with the app and stays an ordinary chunk.
  const kind = files.every((f) => f?.[2] === 'words')
    ? 'vocab'
    : files.some((f) => f?.[2] === 'index')
      ? 'course'
      : null
  if (!kind) return 'assets/[name]-[hash].js'
  return `assets/learn-${kind}-${course}-[hash].js`
}

/**
 * Collects (at generateBundle) the content chunks some other chunk imports statically, and drops every other
 * content chunk from the workbox precache manifest (manifestTransforms runs after the bundle is written).
 */
function learningContentPrecache() {
  const pinned = new Set<string>()
  const plugin: Plugin = {
    name: 'learning-content-precache',
    apply: 'build',
    generateBundle(_options, bundle) {
      pinned.clear()
      const chunks = Object.values(bundle).filter((c) => c.type === 'chunk')
      const byFile = new Map(chunks.map((c) => [c.fileName, c]))
      const seen = new Set<string>()
      const walk = (file: string) => {
        if (seen.has(file)) return
        seen.add(file)
        if (LEARNING_CONTENT.test(file)) pinned.add(file)
        for (const dep of byFile.get(file)?.imports ?? []) walk(dep)
      }
      for (const c of chunks) if (!LEARNING_CONTENT.test(c.fileName)) walk(c.fileName)
      const runtime = chunks.filter((c) => LEARNING_CONTENT.test(c.fileName) && !pinned.has(c.fileName)).length
      this.info(
        `learning content: ${runtime} chunk(s) runtime-cached, ${pinned.size} kept in the precache (imported statically)`,
      )
    },
  }
  const manifestTransform: ManifestTransform = async (entries) => ({
    manifest: entries.filter((e) => !LEARNING_CONTENT.test(e.url) || pinned.has(e.url.replace(/^.*?(assets\/)/, '$1'))),
    warnings: [],
  })
  return { plugin, manifestTransform }
}

type ManifestTransform = NonNullable<NonNullable<VitePWAOptions['workbox']>['manifestTransforms']>[number]

const learningContent = learningContentPrecache()

// Served from https://<user>.github.io/dashboard/ — keep `base` in sync with the repo name.
export default defineConfig({
  base: '/dashboard/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_COMMIT__: JSON.stringify(gitCommit()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@supabase')) return 'vendor-supabase'
          if (id.includes('node_modules/dexie')) return 'vendor-dexie'
          // Zine's HEIC decoder (libheif, ~3 MB): runtime-cached on first use, not precached (see workbox).
          if (id.includes('node_modules/heic-to')) return 'zine-heic'
        },
        chunkFileNames: chunkFileName,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    learningContent.plugin,
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Personal Dashboard',
        short_name: 'Dashboard',
        description: 'Personal hub for subprojects: file transfer, shop list and more.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // HashRouter: urls are relative to the manifest (inside scope), route in the hash.
        shortcuts: (
          [
            ['Events', 'events'],
            ['Life', 'life'],
            ['Todo', 'todo'],
            ['Shop List', 'shop-list'],
          ] as const
        ).map(([name, id]) => ({
          name,
          url: `./#/${id}`,
          icons: [
            {
              src: `icons/projects/${id}.png`,
              sizes: '180x180',
              type: 'image/png',
            },
          ],
        })),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['**/assets/zine-heic-*.js'],
        // Course content is cached on demand, not on install (see learningContentPrecache).
        manifestTransforms: [learningContent.manifestTransform],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            // Zine HEIC decoder: fetched the first time an iPhone photo is imported in a browser without HEIC.
            urlPattern: /\/assets\/zine-heic-[^/]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'zine-heic',
              expiration: { maxEntries: 2 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // A RegExp (not a function: it is serialized into the service worker). Same-origin only.
            urlPattern: /\/assets\/learn-(course|vocab)-[^/]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'learning-courses',
              // ~13 content chunks per build; room for a couple of deploys before the oldest are evicted.
              expiration: { maxEntries: 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
