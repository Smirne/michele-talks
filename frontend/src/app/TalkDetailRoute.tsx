import { useParams } from '@tanstack/react-router'
import { TalkDetailPage } from '@/features/talks'

/** The route checks the slug in `beforeLoad` (unknown or hidden slugs are Not found). */
export const TalkDetailRoute = () => {
  const { slug } = useParams({ strict: false })
  return <TalkDetailPage slug={slug ?? ''} />
}
