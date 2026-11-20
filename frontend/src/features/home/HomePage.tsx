import defaultContent from 'virtual:content'
import { AppearanceRow, ButtonLink, LanguageBadge } from '@/components/content'
import { GraphPlaceholder } from '@/components/graph-placeholder'
import { PageHeader } from '@/components/layout'
import { WELLD_URL } from '@/components/layout/SiteLayout'
import type { Content } from '@/content/schema'
import { t } from '@/i18n/t'
import { splitAppearances } from '@/lib/schedule'
import mascot from '@/assets/mascot/ux-strategy.png'
import styles from './HomePage.module.css'

const TEASER_COUNT = 3

type Props = {
  /** Injected by tests; the visitor's current time otherwise. */
  now?: Date
  content?: Content
}

/**
 * Home as a programme board: intro, the NOW row (Talks call to action), the contact row,
 * then the "Next" teaser and the reserved graph area. The D card sits in the intro row.
 */
export const HomeView = ({ now = new Date(), content = defaultContent }: Props) => {
  const { profile, talks, appearances } = content
  const { upcoming, past } = splitAppearances(appearances, now)
  const showingUpcoming = upcoming.length > 0
  const teaser = (showingUpcoming ? upcoming : past).slice(0, TEASER_COUNT)
  const teaserTitle = t(showingUpcoming ? 'home.next.upcoming' : 'home.next.recent')
  const talkTitles = new Map(talks.map((talk) => [talk.slug, talk.title]))

  return (
    <>
      <PageHeader title={t('home.headline')} documentTitle={t('common.siteName')} />
      <div className={styles.board}>
        <section className={styles.slot}>
          <p className={styles.label}>{t('home.intro.label')}</p>
          <div>
            <h2 className={styles.heading}>{profile.name}</h2>
            <p className={styles.text}>{profile.bioShort}</p>
            <p className={styles.where}>
              <LanguageBadge language="en" /> <LanguageBadge language="it" />{' '}
              <span>{t('home.intro.where')}</span>
            </p>
          </div>
          <figure className={styles.dCard}>
            <img src={mascot} alt={t('home.dCard.alt')} width={360} height={200} />
            <figcaption>
              {t('home.dCard.caption')} <a href={WELLD_URL}>{t('home.dCard.welld')}</a>
            </figcaption>
          </figure>
        </section>

        <section className={[styles.slot, styles.now].filter(Boolean).join(' ')}>
          <p className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            {t('home.talks.label')}
          </p>
          <div>
            <h2 className={styles.heading}>{t('home.talks.title')}</h2>
            <p className={styles.text}>{t('home.talks.body', { count: talks.length })}</p>
            <ButtonLink to="/talks">{t('home.talks.cta')}</ButtonLink>
          </div>
        </section>

        <section className={styles.slot}>
          <p className={styles.label}>{t('home.contact.label')}</p>
          <div>
            <h2 className={styles.heading}>{t('home.contact.title')}</h2>
            <p className={styles.text}>{t('home.contact.body')}</p>
            <div className={styles.actions}>
              <ButtonLink to="/contact">{t('home.contact.cta')}</ButtonLink>
              <ButtonLink variant="secondary" href={`mailto:${profile.email}`}>
                {profile.email}
              </ButtonLink>
            </div>
          </div>
        </section>

        {teaser.length > 0 && (
          <section className={styles.next} aria-labelledby="home-next">
            <h2 id="home-next" className={styles.nextHeading}>
              {teaserTitle}
            </h2>
            <ul className={styles.rows}>
              {teaser.map((a) => (
                <AppearanceRow
                  key={a.id}
                  appearance={a}
                  {...(a.talk !== undefined && talkTitles.has(a.talk)
                    ? { talkTitle: talkTitles.get(a.talk) as string }
                    : {})}
                />
              ))}
            </ul>
            <div className={styles.more}>
              <ButtonLink variant="secondary" to="/history">
                {t('home.next.all')}
              </ButtonLink>
            </div>
          </section>
        )}
      </div>
      <GraphPlaceholder />
    </>
  )
}

/** The routed page: Home over the published content at the visitor's current time. */
export const HomePage = () => <HomeView />
