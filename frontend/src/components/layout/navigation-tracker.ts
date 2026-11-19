import { createContext } from 'react'

/** Per-router memory of the last title a page header last settled on. */
export type NavigationTracker = { lastTitle: string | undefined }

export const NavigationTrackerContext = createContext<NavigationTracker | null>(null)
