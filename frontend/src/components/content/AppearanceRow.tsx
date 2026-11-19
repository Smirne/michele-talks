import { Link } from '@tanstack/react-router'
import { t } from '@/i18n/t'
import { formatDate } from './format'
import { LanguageBadge } from './LanguageBadge'
import { ResourceLink } from './ResourceLink'
import type { Appearance } from './types'
import styles from './AppearanceRow.module.css'

type Props = {
  appearance: Appearance
  /** Catalogue title of `appearance.talk`; the caller looks it up. Falls back to the event. */
  talkTitle?: string
}

const placeOf = (a: Appearance): string =>
  a.city !== undefined && a.country !== undefined
    ? t('content.appearance.place', { city: a.city, country: a.country })
    : t('content.appearance.online')

/**
 * One appearance as a timetable row: date | what | where. Renders an `li`; the caller
 * supplies the `ul`. The row carries lang of the appearance (the language it was given in);
 * badge, resource links and place are interface text and reset to English.
 */
export const AppearanceRow = ({ appearance: a, talkTitle }: Props) => {
  const resources = a.resources ?? []
  return (
    <li className={styles.row} lang={a.language}>
      <time className={styles.date} dateTime={a.date} lang="en">
        {formatDate(a.date)}
      </time>
      <div className={styles.main}>
        <p className={styles.event}>{a.event}</p>
        {a.talk !== undefined && (
          <p className={styles.talk}>
            <Link to="/talks/$slug" params={{ slug: a.talk }} className={styles.link}>
              {talkTitle ?? a.sessionTitle ?? a.event}
            </Link>
          </p>
        )}
        {a.sessionTitle !== undefined && (
          <p className={styles.session}>
            {a.talk !== undefined && (
              <span className={styles.label} lang="en">
                {t('content.appearance.presentedAs')}{' '}
              </span>
            )}
            {a.sessionTitle}
          </p>
        )}
        {a.note !== undefined && <p className={styles.note}>{a.note}</p>}
        {(a.eventUrl !== undefined || resources.length > 0) && (
          <ul className={styles.links}>
            {a.eventUrl !== undefined && (
              <li>
                <a href={a.eventUrl} className={styles.link} lang="en">
                  {t('content.appearance.eventPage')}
                </a>
              </li>
            )}
            {resources.map((r) => (
              <li key={`${r.type}-${r.language}-${r.url}`}>
                <ResourceLink resource={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.where} lang="en">
        <LanguageBadge language={a.language} /> <span>{placeOf(a)}</span>
      </div>
    </li>
  )
}
