import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8')

describe('tokens.css', () => {
  const tokens = read('./tokens.css')

  it('defines the Programme Board palette', () => {
    for (const [name, hex] of [
      ['mint', '#e3f1e7'],
      ['ink', '#10281f'],
      ['signal', '#b43a08'],
      ['muted', '#3f5a4c'],
      ['white', '#ffffff'],
    ]) {
      expect(tokens).toContain(`--${name ?? ''}: ${hex ?? ''};`)
    }
  })

  it('defines the three font families and the 8px spacing scale', () => {
    expect(tokens).toMatch(/--font-display:\s*'Big Shoulders Display'/)
    expect(tokens).toMatch(/--font-body:\s*'Public Sans'/)
    expect(tokens).toMatch(/--font-mono:\s*'Space Mono'/)
    expect(tokens).toContain('--space-1: 8px;')
    expect(tokens).toContain('--space-2: 16px;')
  })

  it('uses a 3px signal focus ring', () => {
    expect(tokens).toContain('--focus-ring: 3px solid var(--signal);')
  })
})

describe('global.css', () => {
  it('disables animation and transitions under prefers-reduced-motion: reduce', () => {
    const css = read('./global.css')
    const block = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}/.exec(css)?.[1] ?? ''
    expect(block).not.toBe('')
    expect(block).toMatch(/animation:\s*none/)
    expect(block).toMatch(/transition:\s*none/)
  })

  it('self-hosts fonts via @fontsource, with no CDN', () => {
    const main = read('../main.tsx')
    for (const face of ['big-shoulders-display', 'public-sans', 'space-mono']) {
      expect(main).toContain(`@fontsource/${face}`)
    }
    expect(read('./global.css')).not.toMatch(/https?:\/\//)
  })
})
