// Vitest config lives HERE, not in vite.config.ts — the same split the backend uses, so
// test-only settings stay out of the production build config.
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { contentPlugin } from './vite-plugins/content'

export default defineConfig({
  plugins: [contentPlugin({ dir: path.resolve(__dirname, './content') })],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
