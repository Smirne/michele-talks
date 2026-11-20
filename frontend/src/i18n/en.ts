import { contentStrings } from '@/components/content/strings.en'
import { contactStrings } from '@/features/contact/strings.en'
import { historyStrings } from '@/features/history/strings.en'
import { homeStrings } from '@/features/home/strings.en'
import { profileStrings } from '@/features/profile/strings.en'
import { talksStrings } from '@/features/talks/strings.en'
import { commonStrings } from './common.en'

export const en = {
  common: commonStrings,
  content: contentStrings,
  home: homeStrings,
  profile: profileStrings,
  contact: contactStrings,
  talks: talksStrings,
  history: historyStrings,
} as const
