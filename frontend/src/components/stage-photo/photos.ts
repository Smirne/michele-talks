import cloudDay from '@/assets/stage/history-cloud-day-2026.webp'
import codemotion from '@/assets/stage/contact-codemotion-2026.webp'
import devfest from '@/assets/stage/talks-devfest-milano-2026.webp'

/** Stage photos by page. No credit is known yet: add `credit` here when the owner has it. */
export const STAGE_PHOTOS = {
  talks: { src: devfest },
  history: { src: cloudDay },
  contact: { src: codemotion },
} as const
