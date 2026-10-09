import { defineConfig, devices } from '@playwright/test'

// End-to-end checks for the local-first promise: against the production build,
// signed out, the app works and keeps working offline. Run: npm run e2e
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4173/dashboard/', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/dashboard/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
