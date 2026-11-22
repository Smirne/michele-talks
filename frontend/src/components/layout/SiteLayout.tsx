import content from 'virtual:content'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import welldLogo from '@/assets/welld/welld-logo-white.svg'
import { t } from '@/i18n/t'
import { MainNav } from './MainNav'
import styles from './SiteLayout.module.css'

export const WELLD_URL = 'https://www.welld.ch'
export const MAIN_ID = 'main'

/** The profiles the footer links to, in this order, matched by their label in profile.yaml. */
const FOOTER_PROFILES = ['LinkedIn', 'GitHub', 'Sessionize'] as const
const footerProfiles = FOOTER_PROFILES.flatMap((label) =>
  content.profile.profiles.filter((p) => p.label === label)
)

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.shell}>
      <a href={`#${MAIN_ID}`} className={styles.skip}>
        {t('common.skipLink')}
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Not a nav item: aria-current stays with the nav link for Home. */}
          <Link to="/" className={styles.wordmark} aria-current={undefined}>
            {t('common.siteName')}
          </Link>
          <MainNav />
        </div>
      </header>
      <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerLine}>
          <p className={styles.footerText}>
            <strong>{content.profile.name}</strong>
            <span>
              {t('common.footer.role')}{' '}
              <a href={WELLD_URL}>
                <img src={welldLogo} alt={t('common.footer.welld')} className={styles.welldLogo} />
              </a>
            </span>
          </p>
          <ul className={styles.footerProfiles} aria-label={t('common.footer.profiles')}>
            {footerProfiles.map((p) => (
              <li key={p.url}>
                <a href={p.url}>{p.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
