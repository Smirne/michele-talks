import { t } from '@/i18n/t'

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "18 Jun 2026" from YYYY-MM-DD, without a local-timezone shift. */
export const formatDate = (dateIso: string): string => dateFormat.format(new Date(`${dateIso}T00:00:00Z`))

/** "45 minutes", written out (design: no icon). */
export const formatDuration = (minutes: number): string =>
  t(minutes === 1 ? 'content.duration.one' : 'content.duration.other', { minutes })
