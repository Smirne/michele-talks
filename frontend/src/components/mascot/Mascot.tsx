import problemIdentification from '@/assets/mascot/problem-identification.png'
import softwareDevelopment from '@/assets/mascot/software-development.png'
import softwareDevelopment1 from '@/assets/mascot/software-development-1.png'
import softwareDevelopment3 from '@/assets/mascot/software-development-3.png'
import technicalAnalysis from '@/assets/mascot/technical-analysis.png'
import ui from '@/assets/mascot/ui.png'
import uxStrategy from '@/assets/mascot/ux-strategy.png'

const POSES = {
  'software-development': softwareDevelopment,
  'software-development-1': softwareDevelopment1,
  'software-development-3': softwareDevelopment3,
  'problem-identification': problemIdentification,
  'technical-analysis': technicalAnalysis,
  ui,
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
