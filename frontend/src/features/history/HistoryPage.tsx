import { useEffect, useRef, useState } from 'react'
import defaultContent from 'virtual:content'
import { AppearanceRow, buttonClassName } from '@/components/content'
import { PageHeader } from '@/components/layout'
import { Mascot } from '@/components/mascot'
import type { Appearance, Talk } from '@/content/schema'
import { t } from '@/i18n/t'
import { splitAppearances } from '@/lib/schedule'
import styles from './HistoryPage.module.css'

const PAGE_SIZE = 5
const EASTER_EGG_URL = 'http://batteri.altervista.org'

type Props = {
  appearances: readonly Appearance[]
  talks: readonly Talk[]
  /** Injected by tests; the visitor's current time otherwise. */
  now?: Date
}

export const HistoryView = ({ appearances, talks, now = new Date() }: Props) => {
  const { upcoming, past } = splitAppearances(appearances, now)
  const talkTitles = new Map(talks.map((talk) => [talk.slug, talk.title]))
  const [shown, setShown] = useState(PAGE_SIZE)
  const total = past.length
  const visiblePast = past.slice(0, shown)
  const pastList = useRef<HTMLUListElement>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const focusIndex = useRef<number | null>(null)
  const showMore = () => {
    setShown((n) => Math.min(n + PAGE_SIZE, total))
  }
  const showMoreRef = useRef(showMore)
  showMoreRef.current = showMore
  const hasMore = shown < total

  // Scrolling to the end of the shown list loads the next batch. Without IntersectionObserver
  // (old browsers, jsdom) the button alone does it.
  useEffect(() => {
    const el = sentinel.current
    if (!hasMore || el === null || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) showMoreRef.current()
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [hasMore, shown])

  // After the button loads a batch, focus moves to its first row.
  useEffect(() => {
    const index = focusIndex.current
    if (index === null) return
    focusIndex.current = null
    const row = pastList.current?.children[index]
    if (row instanceof HTMLElement) {
      row.tabIndex = -1
      row.focus()
    }
  }, [shown])

  const onShowMore = () => {
    focusIndex.current = shown
    showMore()
  }

  const groups = [
    { id: 'upcoming', title: t('history.upcoming'), rows: upcoming },
    { id: 'past', title: t('history.past'), rows: visiblePast },
  ].filter((g) => g.rows.length > 0)

  return (
    <>
      <PageHeader
        title={t('common.nav.history')}
        mascot={<Mascot pose="ui" alt={t('common.mascot.alt.history')} />}
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
              <ul className={styles.rows} {...(g.id === 'past' ? { ref: pastList } : {})}>
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
              {g.id === 'past' && (
                <>
                  {hasMore && <div ref={sentinel} aria-hidden="true" className={styles.sentinel} />}
                  <p className={styles.status} role="status" aria-live="polite">
                    {total > PAGE_SIZE
                      ? t('history.shown', { shown: visiblePast.length, total })
                      : ''}
                  </p>
                  {hasMore && (
                    <button
                      type="button"
                      className={buttonClassName('secondary')}
                      onClick={onShowMore}
                    >
                      {t('history.showMore')}
                    </button>
                  )}
                  {!hasMore && (
                    <p className={styles.easterEgg}>
                      <a href={EASTER_EGG_URL} target="_blank" rel="noopener noreferrer">
                        {t('history.easterEgg')}
                      </a>
                    </p>
                  )}
                </>
              )}
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
