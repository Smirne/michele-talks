import { Link } from '@tanstack/react-router'
import defaultContent from 'virtual:content'
import { TalkCard } from '@/components/content'
import { PageHeader } from '@/components/layout'
import type { Talk } from '@/content/schema'
import { t } from '@/i18n/t'
import styles from './TalksPage.module.css'

/** Talks no longer offered stay published (History links to them) but are not listed here. */
export const TalksView = ({ talks: all }: { talks: readonly Talk[] }) => {
  const talks = all.filter((talk) => talk.offered)
  return (
    <>
      <PageHeader title={t('common.nav.talks')} />
      {talks.length === 0 ? (
        <p className={styles.empty}>
          {t('talks.empty.prefix')}
          <Link to="/contact">{t('talks.empty.link')}</Link>
          {t('talks.empty.suffix')}
        </p>
      ) : (
        <div className={styles.list}>
          {talks.map((talk) => (
            <TalkCard key={talk.slug} talk={talk} />
          ))}
        </div>
      )}
    </>
  )
}

export const TalksPage = () => <TalksView talks={defaultContent.talks} />
