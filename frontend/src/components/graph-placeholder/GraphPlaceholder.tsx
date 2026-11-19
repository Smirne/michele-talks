import { t } from '@/i18n/t'
import styles from './GraphPlaceholder.module.css'

/**
 * Marks where the future talks graph goes (AC-2.4). A plain labelled region, not focusable;
 * replace it with the graph when that feature ships. Its strings live in the home namespace
 * because Home is its only user.
 */
export const GraphPlaceholder = () => (
  <section className={styles.reserved} aria-label={t('home.graph.region')}>
    <p className={styles.label}>{t('home.graph.label')}</p>
    <div>
      <p className={styles.title}>{t('home.graph.title')}</p>
      <p className={styles.body}>{t('home.graph.body')}</p>
    </div>
  </section>
)
