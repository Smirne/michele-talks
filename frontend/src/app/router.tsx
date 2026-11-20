import {
  createRoute,
  createRootRoute,
  createRouter,
  lazyRouteComponent,
  notFound,
  type RouterHistory,
} from '@tanstack/react-router'
import content from 'virtual:content'
import { NotFoundPage } from '@/features/not-found'
import { Root } from './Root'
import { TalkDetailRoute } from './TalkDetailRoute'

const rootRoute = createRootRoute({ component: Root, notFoundComponent: NotFoundPage })

const child = <P extends string>(path: P, component: ReturnType<typeof lazyRouteComponent>) =>
  createRoute({ getParentRoute: () => rootRoute, path, component })

const talkDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/talks/$slug',
  // Hidden talks are not in the published content, so their address is Not found too.
  beforeLoad: ({ params }) => {
    if (!content.talks.some((t) => t.slug === params.slug)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- notFound() is TanStack's control-flow object
      throw notFound()
    }
  },
  component: TalkDetailRoute,
})

const routeTree = rootRoute.addChildren([
  child(
    '/',
    lazyRouteComponent(() => import('@/features/home'), 'HomePage')
  ),
  child(
    '/profile',
    lazyRouteComponent(() => import('@/features/profile'), 'ProfilePage')
  ),
  child(
    '/talks',
    lazyRouteComponent(() => import('@/features/talks'), 'TalksPage')
  ),
  talkDetailRoute,
  child(
    '/history',
    lazyRouteComponent(() => import('@/features/history'), 'HistoryPage')
  ),
  child(
    '/contact',
    lazyRouteComponent(() => import('@/features/contact'), 'ContactPage')
  ),
])

export const createAppRouter = (options: { history?: RouterHistory } = {}) =>
  createRouter({
    routeTree,
    defaultNotFoundComponent: NotFoundPage,
    ...(options.history ? { history: options.history } : {}),
  })

declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- declaration merging requires `interface`
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
