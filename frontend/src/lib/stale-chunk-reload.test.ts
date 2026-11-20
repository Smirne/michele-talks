import { describe, expect, it, vi } from 'vitest'
import { installStaleChunkReload, shouldReload } from './stale-chunk-reload'

const memoryStorage = () => {
  const data = new Map<string, string>()
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v)
    },
  }
}

describe('stale chunk reload', () => {
  it('reloads once, then not again within 10 seconds', () => {
    const storage = memoryStorage()
    expect(shouldReload(storage, 100_000)).toBe(true)
    expect(shouldReload(storage, 105_000)).toBe(false)
    expect(shouldReload(storage, 111_000)).toBe(true)
  })

  it('reloads the page when Vite reports a failed chunk preload', () => {
    const reload = vi.fn()
    const target = new EventTarget()
    const win = Object.assign(target, {
      sessionStorage: memoryStorage(),
      location: { reload },
    }) as unknown as Window
    installStaleChunkReload(win)
    target.dispatchEvent(new Event('vite:preloadError', { cancelable: true }))
    expect(reload).toHaveBeenCalledTimes(1)
  })
})
