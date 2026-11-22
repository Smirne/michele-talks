import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/dela-gothic-one/latin-400'
import '@fontsource/figtree/latin-400'
import '@fontsource/figtree/latin-600'
import '@fontsource/figtree/latin-800'
import '@fontsource/space-mono/latin-400'
import '@fontsource/space-mono/latin-700'
import { App } from './App'
import { installStaleChunkReload } from './lib/stale-chunk-reload'
import './styles/global.css'

installStaleChunkReload()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
