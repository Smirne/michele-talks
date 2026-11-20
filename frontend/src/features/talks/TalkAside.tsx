import { ButtonLink } from '@/components/content'
import type { Appearance, Talk } from '@/content/schema'
import { t } from '@/i18n/t'
import { type ResourcePick, pickTalkResources } from './pick-talk-resources'
import styles from './TalkAside.module.css'

type Props = { talk: Talk; appearances: readonly Appearance[]; email: string }

const PickLink = ({ kind, pick }: { kind: 'recording' | 'slides'; pick: ResourcePick }) => {
  const vars = { language: pick.language.toUpperCase(), event: pick.event }
  return (
    <li>
      <a
        href={pick.url}
        hrefLang={pick.language}
        lang="en"
        className={styles.link}
        aria-label={t(
          kind === 'recording' ? 'talks.aside.recordingAria' : 'talks.aside.slidesAria',
          {
            ...vars,
            languageName: t(`content.language.${pick.language}` as const),
          }
        )}
      >
        {t(kind === 'recording' ? 'talks.aside.recording' : 'talks.aside.slides', vars)}
      </a>
    </li>
  )
}

/**
 * The invitation (mailto with the talk as the subject) and the talk's best recording and slides.
 * Renders nothing when the talk is no longer offered and has neither.
 */
export const TalkAside = ({ talk, appearances, email }: Props) => {
  const { recording, slides } = pickTalkResources(talk, appearances)
  const hasLinks = recording !== undefined || slides !== undefined
  if (!talk.offered && !hasLinks) return null
  const subject = encodeURIComponent(t('talks.aside.subject', { title: talk.title }))
  return (
    <aside className={styles.aside} aria-label={t('talks.aside.label')}>
      {talk.offered && (
        <>
          <ButtonLink href={`mailto:${email}?subject=${subject}`}>
            {t('talks.aside.invite')}
          </ButtonLink>
          <p className={styles.hint}>{t('talks.aside.hint')}</p>
        </>
      )}
      {hasLinks && (
        <ul
          className={talk.offered ? `${styles.links ?? ''} ${styles.divided ?? ''}` : styles.links}
        >
          {recording !== undefined && <PickLink kind="recording" pick={recording} />}
          {slides !== undefined && <PickLink kind="slides" pick={slides} />}
        </ul>
      )}
    </aside>
  )
}
