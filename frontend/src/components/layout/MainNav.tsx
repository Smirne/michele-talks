import { Link } from '@tanstack/react-router'
import { t } from '@/i18n/t'
import styles from './MainNav.module.css'

export const MainNav = () => {
  return (
    <nav aria-label={t('common.nav.label')} className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link to="/" activeOptions={{ exact: true }} className={styles.link}>
            {t('common.nav.home')}
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.link}>
            {t('common.nav.profile')}
          </Link>
        </li>
        <li>
          <Link to="/talks" className={styles.link}>
            {t('common.nav.talks')}
          </Link>
        </li>
        <li>
          <Link to="/history" className={styles.link}>
            {t('common.nav.history')}
          </Link>
        </li>
        <li>
          <Link to="/contact" className={styles.link}>
            {t('common.nav.contact')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
