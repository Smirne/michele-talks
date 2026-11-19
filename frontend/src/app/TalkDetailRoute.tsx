import { notFound, useParams } from '@tanstack/react-router'
import content from 'virtual:content'
import { TalkDetailPage } from '@/features/talks'

export const TalkDetailRoute = () => {
  const { slug } = useParams({ strict: false })
  const talk = content.talks.find((t) => t.slug === slug)
  // Unreachable in practice (beforeLoad checks first); keeps the type narrow.
  // eslint-disable-next-line @typescript-eslint/only-throw-error -- notFound() is TanStack's control-flow object
  if (!talk) throw notFound()
  return <TalkDetailPage title={talk.title} />
}
