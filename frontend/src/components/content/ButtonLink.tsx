import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import styles from './ButtonLink.module.css'

type Variant = 'primary' | 'secondary'
type InternalTo = '/' | '/profile' | '/talks' | '/history' | '/contact'

type Props = { variant?: Variant; children: ReactNode } & (
  | { to: InternalTo; href?: never }
  | { href: string; to?: never }
)

/** A link that looks like a button. Always a real link: no button library, no onClick. */
export const ButtonLink = ({ variant = 'primary', children, to, href }: Props) => {
  const className = [styles.button, variant === 'primary' ? styles.primary : styles.secondary]
    .filter(Boolean)
    .join(' ')
  if (to !== undefined) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
