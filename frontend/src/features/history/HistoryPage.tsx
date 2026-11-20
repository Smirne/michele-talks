import defaultContent from 'virtual:content'
import { AppearanceRow } from '@/components/content'
import { PageHeader } from '@/components/layout'
import { Mascot } from '@/components/mascot'
import type { Appearance, Talk } from '@/content/schema'
import { t } from '@/i18n/t'
import { splitAppearances } from '@/lib/schedule'
import styles from './HistoryPage.module.css'

type Props = {
  appearances: readonly Appearance[]
  talks: readonly Talk[]
  /** Injected by tests; the visitor's current time otherwise. */
  now?: Date
}

export const HistoryView = ({ appearances, talks, now = new Date() }: Props) => {
  const { upcoming, past } = splitAppearances(appearances, now)
  const talkTitles = new Map(talks.map((talk) => [talk.slug, talk.title]))
  const groups = [
    { id: 'upcoming', title: t('history.upcoming'), rows: upcoming },
    { id: 'past', title: t('history.past'), rows: past },
  ].filter((g) => g.rows.length > 0)

  return (
    <>
      <PageHeader
        title={t('common.nav.history')}
        mascot={<Mascot pose="ui" alt={t('common.mascot.history')} />}
      />
      {groups.length === 0 ? (
        <p className={styles.none}>{t('history.none')}</p>
      ) : (
        <div className={styles.board}>
          {groups.map((g) => (
            <section key={g.id} className={styles.group} aria-labelledby={`history-${g.id}`}>
              <h2 id={`history-${g.id}`} className={styles.heading}>
                {g.title}
              </h2>
              <ul className={styles.rows}>
                {g.rows.map((a) => (
                  <AppearanceRow
                    key={a.id}
                    appearance={a}
                    {...(a.talk !== undefined && talkTitles.has(a.talk)
                      ? { talkTitle: talkTitles.get(a.talk) as string }
                      : {})}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}

export const HistoryPage = () => (
  <HistoryView appearances={defaultContent.appearances} talks={defaultContent.talks} />
)
