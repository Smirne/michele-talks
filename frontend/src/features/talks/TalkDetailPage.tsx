import defaultContent from 'virtual:content'
import { Link } from '@tanstack/react-router'
import {
  AppearanceRow,
  LanguageBadge,
  TopicTags,
  formatCoHosts,
  formatDuration,
  formatLevel,
} from '@/components/content'
import { PageHeader } from '@/components/layout'
import type { Appearance, Talk } from '@/content/schema'
import { t } from '@/i18n/t'
import { splitAppearances } from '@/lib/schedule'
import { TalkAside } from './TalkAside'
import styles from './TalkDetailPage.module.css'

type ViewProps = {
  talk: Talk
  /** All published appearances; the view keeps the ones for this talk. */
  appearances: readonly Appearance[]
  /** Injected by tests; the visitor's current time otherwise. */
  now?: Date
  /** The speaker's address for the invitation; the published profile's by default. */
  email?: string
}

export const TalkDetailView = ({
  talk,
  appearances,
  now = new Date(),
  email = defaultContent.profile.email,
}: ViewProps) => {
  const { upcoming, past } = splitAppearances(
    appearances.filter((a) => a.talk === talk.slug),
    now
  )
  const italianOnly = talk.languages.every((l) => l === 'it')
  const groups = [
    { id: 'upcoming', title: t('talks.detail.upcoming'), rows: upcoming },
    { id: 'past', title: t('talks.detail.past'), rows: past },
  ].filter((g) => g.rows.length > 0)

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <PageHeader title={talk.title} size="compact" />
        {!talk.offered && <p className={styles.retired}>{t('talks.detail.noLongerOffered')}</p>}
        <p className={styles.meta}>
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
        <TopicTags topics={talk.topics} />
      </div>
      <div className={styles.aside}>
        <TalkAside talk={talk} appearances={appearances} email={email} />
      </div>
      <div className={styles.body}>
        {talk.note !== undefined && <p className={styles.note}>{talk.note}</p>}

        <section className={styles.section} aria-labelledby="talk-abstract">
          <h2 id="talk-abstract" className={styles.sectionHeading}>
            {t('talks.detail.abstract')}
          </h2>
          <div className={styles.abstract} {...(italianOnly ? { lang: 'it' } : {})}>
            {talk.abstract.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {talk.links !== undefined && talk.links.length > 0 && (
          <section className={styles.section} aria-labelledby="talk-links">
            <h2 id="talk-links" className={styles.sectionHeading}>
              {t('talks.detail.links')}
            </h2>
            <ul className={styles.also}>
              {talk.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} rel="noopener" className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {talk.alsoGivenAs !== undefined && talk.alsoGivenAs.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>{t('talks.detail.alsoGivenAs')}</h2>
            <ul className={styles.also}>
              {talk.alsoGivenAs.map((a) => (
                <li key={`${a.language}-${a.title}`}>
                  <LanguageBadge language={a.language} /> <span lang={a.language}>{a.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {groups.length === 0 ? (
          <p className={styles.none}>{t('talks.detail.none')}</p>
        ) : (
          groups.map((g) => (
            <section key={g.id} className={styles.section} aria-labelledby={`talk-${g.id}`}>
              <h2 id={`talk-${g.id}`} className={styles.sectionHeading}>
                {g.title}
              </h2>
              <ul className={styles.rows}>
                {g.rows.map((a) => (
                  <AppearanceRow key={a.id} appearance={a} talkTitle={talk.title} />
                ))}
              </ul>
            </section>
          ))
        )}

        <p className={styles.back}>
          <Link to="/talks">{t('talks.detail.back')}</Link>
        </p>
      </div>
    </div>
  )
}

export const TalkDetailPage = ({ slug }: { slug: string }) => {
  const talk = defaultContent.talks.find((x) => x.slug === slug)
  if (!talk) return null // The route checks the slug first and renders Not found.
  return <TalkDetailView talk={talk} appearances={defaultContent.appearances} />
}
