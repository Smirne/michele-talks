import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { t } from '@/i18n/t'
import { MainNav } from './MainNav'
import styles from './SiteLayout.module.css'

export const WELLD_URL = 'https://www.welld.ch'
export const MAIN_ID = 'main'

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
        <p className={styles.footerLine}>
          <span>{t('common.footer.prefix')}</span>
          <a href={WELLD_URL}>{t('common.footer.welld')}</a>
        </p>
      </footer>
    </div>
  )
}
