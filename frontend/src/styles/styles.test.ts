import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8')

describe('tokens.css', () => {
  const tokens = read('./tokens.css')

  it('defines the Sticker Sheet palette', () => {
    for (const [name, hex] of [
      ['mint', '#ffd93b'],
      ['ink', '#16110f'],
      ['signal', '#0b7a72'],
      ['muted', '#4a3f00'],
      ['white', '#ffffff'],
      ['pink', '#ff5c93'],
    ]) {
      expect(tokens).toContain(`--${name ?? ''}: ${hex ?? ''};`)
    }
  })

  it('defines the three font families and the 8px spacing scale', () => {
    expect(tokens).toMatch(/--font-display:\s*'Dela Gothic One'/)
    expect(tokens).toMatch(/--font-body:\s*'Figtree'/)
    expect(tokens).toMatch(/--font-mono:\s*'Space Mono'/)
    expect(tokens).toContain('--space-1: 8px;')
    expect(tokens).toContain('--space-2: 16px;')
  })

  it('defines the title-size and topic-tag tokens (003)', () => {
    expect(tokens).toContain('--title-size-card: clamp(24px, 2.4vw, 32px);')
    expect(tokens).toContain('--title-size-page: clamp(28px, 3.6vw, 48px);')
    expect(tokens).toContain('--tag-bg: var(--white);')
    expect(tokens).toContain('--tag-ink: var(--ink);')
    expect(tokens).toContain('--tag-border: var(--ink);')
    expect(tokens).toContain('--tag-size: 13px;')
  })

  it('uses a 4px ink focus ring and the sticker edge tokens', () => {
    expect(tokens).toContain('--focus-ring: 4px solid var(--ink);')
    expect(tokens).toContain('--radius: 18px;')
    expect(tokens).toContain('--shadow-hard: 5px 5px 0 var(--ink);')
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
    for (const face of ['dela-gothic-one', 'figtree', 'space-mono']) {
      expect(main).toContain(`@fontsource/${face}`)
    }
    expect(main).not.toMatch(/big-shoulders|public-sans/)
    expect(read('./global.css')).not.toMatch(/https?:\/\//)
  })
})
