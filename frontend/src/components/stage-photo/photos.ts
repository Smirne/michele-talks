import cloudDay from '@/assets/stage/history-cloud-day-2026.webp'
import codemotion from '@/assets/stage/contact-codemotion-2026.webp'
import devoxx from '@/assets/stage/talks-devoxx-belgium-2026.webp'
import type { Credit } from '@/content/schema'

type StagePhotoEntry = { src: string; credit?: Credit; fit?: 'crop' | 'whole' }

/** Licence and author of the Devoxx Belgium photos (Flickr account bejug, CC BY-NC-ND 4.0). */
export const devoxxCredit = (photoId: string): Credit => ({
  by: 'Devoxx Belgium (BeJUG)',
  url: `https://www.flickr.com/photos/bejug/${photoId}/`,
  licence: 'CC BY-NC-ND 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
})

/**
 * Stage photos by page. The Codemotion credit is not known yet (the owner is asking the
 * organisers): add it here when he has it.
 */
export const STAGE_PHOTOS: Record<'talks' | 'history' | 'contact', StagePhotoEntry> = {
  // CC BY-NC-ND: shown whole and only resized, never cropped.
  talks: { src: devoxx, credit: devoxxCredit('55580685219'), fit: 'whole' },
  history: { src: cloudDay, credit: { by: 'Luigi Di Stefano' } },
  contact: { src: codemotion },
}
