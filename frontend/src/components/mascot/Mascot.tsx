import uxStrategy from '@/assets/mascot/ux-strategy.png'

const POSES = {
  'ux-strategy': uxStrategy,
} as const

export type MascotPose = keyof typeof POSES

/** Native size of every pose in the WellD brand library. */
const WIDTH = 360
const HEIGHT = 200

type Props = {
  pose: MascotPose
  /** Alt text; an empty string makes the image decorative. */
  alt: string
  className?: string | undefined
}

/** D, the WellD mascot. Artwork is used unmodified, from the brand library. */
export const Mascot = ({ pose, alt, className }: Props) => (
  <img src={POSES[pose]} alt={alt} width={WIDTH} height={HEIGHT} className={className} />
)
