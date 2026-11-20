import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

/**
 * Renders `ui` inside a minimal router at "/" so `Link` works in component tests. The other
 * routes need not exist: links only have to resolve to an href.
 */
export const renderWithRouter = async (ui: ReactElement) => {
  const rootRoute = createRootRoute()
  const index = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => ui })
  const router = createRouter({
    routeTree: rootRoute.addChildren([index]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  return render(<RouterProvider router={router as never} />)
}
