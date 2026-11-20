import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { type ButtonVariant, buttonClassName } from './button-class'

type InternalTo = '/' | '/profile' | '/talks' | '/on-stage' | '/contact'

type Props = { variant?: ButtonVariant; children: ReactNode } & (
  | { to: InternalTo; href?: never; download?: never; ariaLabel?: never }
  /** `download`: the file name the browser saves the target under. */
  | { href: string; to?: never; download?: string; ariaLabel?: string }
)

/** A link that looks like a button. Always a real link: no button library, no onClick. */
export const ButtonLink = ({ variant = 'primary', children, to, href, download, ariaLabel }: Props) => {
  const className = buttonClassName(variant)
  if (to !== undefined) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} {...(download !== undefined ? { download } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </a>
  )
}
