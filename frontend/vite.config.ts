import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { contentPlugin } from './vite-plugins/content'

export default defineConfig({
  plugins: [react(), contentPlugin({ dir: path.resolve(__dirname, './content') })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
