import { defineConfig, devices } from '@playwright/test'

// Fixed preview port, away from the dev server (5173) and vite preview's default (4173).
const PORT = 4179

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${String(PORT)}`,
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Preview serves the production build; `mise run frontend:e2e` builds first.
    command: `pnpm exec vite preview --port ${String(PORT)} --strictPort`,
    url: `http://localhost:${String(PORT)}`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
