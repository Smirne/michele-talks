/**
 * After a new deploy, a tab opened on the previous one still asks for the old route chunks,
 * which no longer exist. Vite fires `vite:preloadError` when such a chunk fails to load; the fix
 * is to reload once so the tab picks up the new build. The timestamp guard stops a reload loop if
 * the chunk is missing for another reason.
 */
const KEY = 'stale-chunk-reload-at'
const MIN_INTERVAL_MS = 10_000

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>

export const shouldReload = (storage: Storage, now: number): boolean => {
  const last = Number(storage.getItem(KEY) ?? 0)
  if (now - last < MIN_INTERVAL_MS) return false
  storage.setItem(KEY, String(now))
  return true
}

export const installStaleChunkReload = (win: Window = window): void => {
  win.addEventListener('vite:preloadError', (event) => {
    let reload = true
    try {
      reload = shouldReload(win.sessionStorage, Date.now())
    } catch {
      // Storage blocked: reload anyway; a loop needs a missing chunk on every load.
    }
    if (reload) {
      event.preventDefault()
      win.location.reload()
    }
  })
}
