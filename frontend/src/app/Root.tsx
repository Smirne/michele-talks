import { Outlet } from '@tanstack/react-router'
import { useRef } from 'react'
import { SiteLayout } from '@/components/layout'
import {
  NavigationTrackerContext,
  type NavigationTracker,
} from '@/components/layout/navigation-tracker'

export const Root = () => {
  const tracker = useRef<NavigationTracker>({ lastTitle: undefined })
  return (
    <NavigationTrackerContext.Provider value={tracker.current}>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </NavigationTrackerContext.Provider>
  )
}
