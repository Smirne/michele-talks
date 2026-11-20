import { t } from '@/i18n/t'
import styles from './TopicTags.module.css'

/** A talk's topics as chips: plain list items, not links. Renders nothing when there are none. */
export const TopicTags = ({ topics }: { topics: readonly string[] }) => {
  if (topics.length === 0) return null
  return (
    // role="list" keeps list semantics in Safari, where list-style: none removes them.
    <ul role="list" aria-label={t('content.topics.label')} className={styles.list}>
      {topics.map((topic) => (
        <li key={topic} className={styles.tag}>
          {topic}
        </li>
      ))}
    </ul>
  )
}
