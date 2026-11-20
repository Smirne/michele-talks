import type { Language } from './types'
import styles from './LanguageBadge.module.css'

/** "EN" / "IT". Text, never colour alone (AC-8.1). The code is UI, not content: lang="en". */
export const LanguageBadge = ({ language }: { language: Language }) => (
  <span className={styles.badge} lang="en">
    {language.toUpperCase()}
  </span>
)
