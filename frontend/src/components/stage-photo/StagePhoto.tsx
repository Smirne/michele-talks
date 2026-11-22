import styles from './StagePhoto.module.css'

type Props = {
  src: string
  /** Describes the photo; never empty (a stage photo is content, not decoration). */
  alt: string
  /** Photographer or source line, shown under the photo when known. */
  credit?: string | undefined
  className?: string | undefined
}

/** A photo from the stage, with an optional visible credit caption. */
export const StagePhoto = ({ src, alt, credit, className }: Props) => (
  <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
    <img src={src} alt={alt} className={styles.img} />
    {credit !== undefined && credit !== '' && (
      <figcaption className={styles.credit}>{credit}</figcaption>
    )}
  </figure>
)
