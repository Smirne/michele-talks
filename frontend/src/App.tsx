import { RouterProvider } from '@tanstack/react-router'
import { createAppRouter } from '@/app/router'

const router = createAppRouter()

export const App = () => {
  return <RouterProvider router={router} />
}
