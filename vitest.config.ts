import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// Reuses the Vite config (aliases/plugins). Node environment by default: the
// only DOM-ish thing tests need is IndexedDB, and only the tests that touch
// Dexie import 'fake-indexeddb/auto' (see src/test/fakeDb.ts).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    },
  }),
)
