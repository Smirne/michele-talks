import { Link } from '@tanstack/react-router'
import { t } from '@/i18n/t'
import { formatCoHosts, formatDuration, formatLevel } from './format'
import { LanguageBadge } from './LanguageBadge'
import type { Talk } from './types'
import styles from './TalkCard.module.css'

/**
 * One talk in the catalogue. The title is the only link (no whole-card click target).
 * A talk given only in Italian is written in Italian: lang="it" on the card; the metadata
 * line is interface text and resets to English.
 */
export const TalkCard = ({ talk }: { talk: Talk }) => {
  const italianOnly = talk.languages.every((l) => l === 'it')
  return (
    <article className={styles.card} {...(italianOnly ? { lang: 'it' } : {})}>
      <h2 className={styles.title}>
        <Link to="/talks/$slug" params={{ slug: talk.slug }} className={styles.link}>
          {talk.title}
        </Link>
      </h2>
      <p className={styles.summary}>{talk.summary}</p>
      <p className={styles.meta} lang="en">
        <span>{formatDuration(talk.durationMinutes)}</span>
        <span>{formatLevel(talk.level)}</span>
        <span>{t(`content.format.${talk.format}` as const)}</span>
        {talk.coHosts !== undefined && <span>{formatCoHosts(talk.coHosts)}</span>}
        <span className={styles.badges}>
          {talk.languages.map((l) => (
            <LanguageBadge key={l} language={l} />
          ))}
        </span>
      </p>
    </article>
  )
}
