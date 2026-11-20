import { type ReactNode, useContext, useEffect, useRef } from 'react'
import { t } from '@/i18n/t'
import { NavigationTrackerContext } from './navigation-tracker'
import styles from './PageHeader.module.css'

type Props = {
  /** The visible h1. */
  title: string
  /** The full document title, when it differs from the headline (default "<title> | <site>"). */
  documentTitle?: string
  /** D (or another image) shown beside the title. */
  mascot?: ReactNode
  /** `compact` is the talk page's sentence-case title; `default` the big page heading. */
  size?: 'default' | 'compact'
}

/**
 * The page's single h1. It also owns two route-change duties, because it is the one thing
 * every page renders: set the document title, and move focus to the h1 after a navigation
 * (not on the first load, where the browser's own focus handling applies).
 */
export const PageHeader = ({ title, documentTitle, mascot, size = 'default' }: Props) => {
  const ref = useRef<HTMLHeadingElement>(null)
  const tracker = useContext(NavigationTrackerContext)

  useEffect(() => {
    const fullTitle =
      documentTitle ?? t('common.documentTitle', { page: title, site: t('common.siteName') })
    document.title = fullTitle
    // Keyed on the document title, not the pathname: a page that is about to unmount
    // re-renders with the new pathname first, but its title does not change. A different
    // title than the last one settled means a navigation happened. Re-running with the same
    // title (StrictMode) is not one. (The document title, not the h1: it is unique per route.)
    if (tracker) {
      if (tracker.lastTitle !== undefined && tracker.lastTitle !== fullTitle) ref.current?.focus()
      tracker.lastTitle = fullTitle
    }
  }, [title, documentTitle, tracker])

  return (
    <div className={styles.header}>
      <h1
        ref={ref}
        tabIndex={-1}
        className={
          size === 'compact' ? `${styles.title ?? ''} ${styles.compact ?? ''}` : styles.title
        }
      >
        {title}
      </h1>
      {mascot !== undefined && <div className={styles.mascot}>{mascot}</div>}
    </div>
  )
}
