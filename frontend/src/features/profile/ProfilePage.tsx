import defaultContent from 'virtual:content'
import { ButtonLink } from '@/components/content'
import { PageHeader } from '@/components/layout'
import { WELLD_URL } from '@/components/layout/SiteLayout'
import { ProfilePhoto } from '@/components/profile-photo'
import type { Profile } from '@/content/schema'
import { t } from '@/i18n/t'
import styles from './ProfilePage.module.css'

export const ProfileView = ({ profile }: { profile: Profile }) => (
  <>
    <PageHeader
      title={profile.name}
      documentTitle={t('common.documentTitle', {
        page: t('common.nav.profile'),
        site: t('common.siteName'),
      })}
    />
    <div className={styles.layout}>
      <div className={styles.photo}>
        <ProfilePhoto src={profile.photo} alt={profile.photoAlt} name={profile.name} />
      </div>
      <div className={styles.text}>
        {profile.bios.en.extended.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2 id="profile-topics" className={styles.heading}>
          {t('profile.topics')}
        </h2>
        <ul className={styles.topics} aria-labelledby="profile-topics">
          {profile.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
        <p className={styles.welld}>
          {t('profile.welld.prefix')} <a href={WELLD_URL}>{t('profile.welld.link')}</a>
          {t('profile.welld.suffix')}
        </p>
        <div className={styles.actions}>
          <ButtonLink to="/talks">{t('profile.closing.talks')}</ButtonLink>
          <ButtonLink variant="secondary" to="/contact">
            {t('profile.closing.contact')}
          </ButtonLink>
        </div>
      </div>
    </div>
  </>
)

export const ProfilePage = () => <ProfileView profile={defaultContent.profile} />
