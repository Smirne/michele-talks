import { t } from '@/i18n/t'
import type { Appearance } from './types'
import styles from './ResourceLink.module.css'

type Resource = NonNullable<Appearance['resources']>[number]

/** "Slides (IT)": type and language as text; the aria-label spells the language out. */
export const ResourceLink = ({ resource }: { resource: Resource }) => {
  const type = t(`content.resource.${resource.type}` as const)
  const language = resource.language.toUpperCase()
  return (
    <a
      href={resource.url}
      hrefLang={resource.language}
      lang="en"
      className={styles.link}
      aria-label={t('content.resource.ariaLabel', {
        type,
        language,
        languageName: t(`content.language.${resource.language}` as const),
      })}
    >
      {t('content.resource.label', { type, language })}
    </a>
  )
}
