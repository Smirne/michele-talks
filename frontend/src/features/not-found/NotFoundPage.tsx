import { Link } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout'
import { Mascot } from '@/components/mascot'
import { t } from '@/i18n/t'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => {
  return (
    <div className={styles.layout}>
      <div>
        <PageHeader title={t('common.notFound.title')} />
        <p>{t('common.notFound.body')}</p>
        <p>
          <Link to="/">{t('common.notFound.back')}</Link>
        </p>
      </div>
      <Mascot pose="ux-strategy" alt={t('common.mascot.alt.notFound')} className={styles.mascot} />
    </div>
  )
}
