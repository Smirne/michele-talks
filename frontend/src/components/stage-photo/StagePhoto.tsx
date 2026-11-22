import { CreditLine } from '@/components/credit'
import type { Credit } from '@/content/schema'
import styles from './StagePhoto.module.css'

type Props = {
  src: string
  /** Describes the photo; never empty (a stage photo is content, not decoration). */
  alt: string
  /** Photographer or source, shown under the photo when known. */
  credit?: Credit | undefined
  /**
   * `crop` fills the 3:2 header frame; `whole` shows the full image, for licences that forbid
   * derivatives (e.g. CC BY-ND), where cropping would be an adaptation.
   */
  fit?: 'crop' | 'whole' | undefined
  className?: string | undefined
}

/** A photo from the stage, with an optional visible credit caption. */
export const StagePhoto = ({ src, alt, credit, fit = 'crop', className }: Props) => (
  <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
    <img
      src={src}
      alt={alt}
      className={[styles.img, fit === 'whole' ? styles.whole : undefined].filter(Boolean).join(' ')}
    />
    {credit !== undefined && (
      <figcaption className={styles.credit}>
        <CreditLine credit={credit} />
      </figcaption>
    )}
  </figure>
)
