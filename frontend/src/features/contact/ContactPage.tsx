import defaultContent from 'virtual:content'
import { PageHeader } from '@/components/layout'
import { STAGE_PHOTOS, StagePhoto } from '@/components/stage-photo'
import type { Profile } from '@/content/schema'
import { t } from '@/i18n/t'
import styles from './ContactPage.module.css'

export const ContactView = ({ profile }: { profile: Profile }) => (
  <>
    <PageHeader
      title={t('common.nav.contact')}
      image={<StagePhoto {...STAGE_PHOTOS.contact} alt={t('common.stage.alt.contact')} />}
    />
    <div className={styles.board}>
      <p className={styles.intro}>{t('contact.intro')}</p>
      <section className={styles.row} aria-labelledby="contact-email">
        <h2 id="contact-email" className={styles.heading}>
          {t('contact.email')}
        </h2>
        <a className={styles.email} href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </section>
      <section className={styles.row} aria-labelledby="contact-profiles">
        <h2 id="contact-profiles" className={styles.heading}>
          {t('contact.profiles')}
        </h2>
        <ul className={styles.contacts} aria-labelledby="contact-profiles">
          {profile.profiles.map((p) => (
            <li key={p.url} className={styles.profile}>
              <a href={p.url}>{p.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </>
)

export const ContactPage = () => <ContactView profile={defaultContent.profile} />
