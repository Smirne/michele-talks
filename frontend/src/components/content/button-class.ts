import styles from './ButtonLink.module.css'

export type ButtonVariant = 'primary' | 'secondary'

/** The button look, shared by the link-buttons and the one real `<button>` (copy). */
export const buttonClassName = (variant: ButtonVariant = 'primary'): string =>
  [styles.button, variant === 'primary' ? styles.primary : styles.secondary].join(' ')
