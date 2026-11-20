import type { Talk } from '@/content/schema'
import { t } from '@/i18n/t'

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "18 Jun 2026" from YYYY-MM-DD, without a local-timezone shift. */
export const formatDate = (dateIso: string): string => dateFormat.format(new Date(`${dateIso}T00:00:00Z`))

type Duration = Talk['durationMinutes']
type Level = Talk['level']

const HOURS_FROM_MINUTES = 120

const hoursText = (minutes: number): string => String(Math.round((minutes / 60) * 10) / 10)

/**
 * "45 minutes", "2 hours", "6–8 hours": the unit follows the largest value (>= 120 minutes
 * is written in hours), and both ends of a range share it.
 */
export const formatDuration = (duration: Duration): string => {
  if (typeof duration === 'number') {
    return duration >= HOURS_FROM_MINUTES
      ? t('content.duration.hours', { value: hoursText(duration) })
      : t(duration === 1 ? 'content.duration.one' : 'content.duration.other', { minutes: duration })
  }
  return duration.max >= HOURS_FROM_MINUTES
    ? t('content.duration.hoursRange', { min: hoursText(duration.min), max: hoursText(duration.max) })
    : t('content.duration.minutesRange', { min: duration.min, max: duration.max })
}

/** "Intermediate", or "Beginner–Intermediate" for a range. */
export const formatLevel = (level: Level): string =>
  typeof level === 'string'
    ? t(`content.level.${level}` as const)
    : t('content.level.range', {
        from: t(`content.level.${level[0]}` as const),
        to: t(`content.level.${level[1]}` as const),
      })

/** "With A", "With A and B", "With A, B and C". */
export const formatCoHosts = (names: readonly string[]): string => {
  const last = names[names.length - 1] ?? ''
  const head = names.slice(0, -1).join(', ')
  return t('content.coHosts.with', {
    names: head === '' ? last : t('content.coHosts.and', { head, last }),
  })
}
