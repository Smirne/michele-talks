import type { Appearance, Talk } from '@/content/schema'

export type ResourcePick = { url: string; language: 'en' | 'it'; event: string }

/**
 * The recording and slides to offer on a talk's page, derived from its appearances (any date).
 * Recording: the featured one when set, else the video of the most recent appearance that has
 * one. Slides: those of the most recent appearance that has them. Date ties keep content order.
 */
export const pickTalkResources = (
  talk: Talk,
  appearances: readonly Appearance[]
): { recording?: ResourcePick; slides?: ResourcePick } => {
  const mine = appearances
    .filter((a) => a.talk === talk.slug)
    // Array.prototype.sort is stable, so equal dates keep their content order.
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  const find = (type: 'video' | 'slides', url?: string): ResourcePick | undefined => {
    for (const a of mine) {
      const resource = a.resources?.find(
        (r) => r.type === type && (url === undefined || r.url === url)
      )
      if (resource) return { url: resource.url, language: resource.language, event: a.event }
    }
    return undefined
  }

  const recording =
    (talk.featuredRecording !== undefined ? find('video', talk.featuredRecording) : undefined) ??
    find('video')
  const slides = find('slides')
  return {
    ...(recording ? { recording } : {}),
    ...(slides ? { slides } : {}),
  }
}
