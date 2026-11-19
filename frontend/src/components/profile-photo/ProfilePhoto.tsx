import { useState } from 'react'
import styles from './ProfilePhoto.module.css'

type Props = { src: string; alt: string; name: string }

const monogram = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * The speaker's photo in a box that reserves its 4:5 aspect ratio, so nothing shifts while
 * it loads. If the image fails, the monogram takes its place and keeps the alt text.
 */
export const ProfilePhoto = ({ src, alt, name }: Props) => {
  const [failed, setFailed] = useState(false)
  return (
    <div className={styles.box} data-aspect="4/5">
      {failed ? (
        <div className={styles.monogram} role="img" aria-label={alt}>
          {monogram(name)}
        </div>
      ) : (
        <img
          className={styles.image}
          src={src}
          alt={alt}
          onError={() => {
            setFailed(true)
          }}
        />
      )}
    </div>
  )
}
