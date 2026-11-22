import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import content from 'virtual:content'
import { createAppRouter } from './router'

const renderAt = async (path: string) => {
  const router = createAppRouter({ history: createMemoryHistory({ initialEntries: [path] }) })
  const view = render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
  return { router, ...view }
}

// jsdom has no layout: silence its "not implemented" noise from the router's scroll
// restoration and axe's canvas probe.
beforeAll(() => {
  window.scrollTo = () => undefined
  HTMLCanvasElement.prototype.getContext = () => null
})

afterEach(cleanup)

const NAV = [
  ['Home', '/'],
  ['Profile', '/profile'],
  ['Talks', '/talks'],
  ['On stage', '/on-stage'],
  ['Contact', '/contact'],
] as const

const firstTalk = content.talks[0]
if (!firstTalk) throw new Error('the real content has no talks')

const ROUTES: [string, string][] = [
  ['On the programme', '/'],
  [content.profile.name, '/profile'],
  ['Talks', '/talks'],
  [firstTalk.title, `/talks/${firstTalk.slug}`],
  ['On stage', '/on-stage'],
  ['Contact', '/contact'],
  ['Page not found', '/nowhere'],
]

describe('app shell', () => {
  it.each(ROUTES)('renders %s at %s with landmarks and five nav links', async (_name, path) => {
    await renderAt(path)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => [l.textContent, l.getAttribute('href')])).toEqual(NAV)
    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
  })

  it.each(NAV)('marks exactly one nav link as the current page on %s', async (label, path) => {
    await renderAt(path)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const current = within(nav)
      .getAllByRole('link')
      .filter((l) => l.getAttribute('aria-current') === 'page')
    expect(current.map((l) => l.textContent)).toEqual([label])
  })

  it('keeps Talks current on a talk detail', async () => {
    await renderAt(`/talks/${firstTalk.slug}`)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Talks' }).getAttribute('aria-current')).toBe(
      'page'
    )
  })

  it('marks no nav link as current on Not found', async () => {
    await renderAt('/nowhere')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).queryAllByRole('link', { current: 'page' })).toHaveLength(0)
  })

  it.each(['/nowhere', '/talks/does-not-exist', '/profile/extra'])(
    'renders Not found with a link to Home at %s',
    async (path) => {
      await renderAt(path)
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found')
      const back = screen.getByRole('link', { name: 'Back to Home' })
      expect(back.getAttribute('href')).toBe('/')
    }
  )

  it('the skip link is the first focusable element and targets main', async () => {
    await renderAt('/')
    const skip = screen.getByRole('link', { name: 'Skip to content' })
    // First element in tab order: the first link/button/tabindex=0 in document order.
    expect(document.querySelector('a[href], button, input, [tabindex="0"]')).toBe(skip)
    const target = document.querySelector(skip.getAttribute('href') ?? '#none')
    expect(target).toBe(screen.getByRole('main'))
  })

  it('the footer has a WellD link', async () => {
    await renderAt('/')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'WellD' }).getAttribute('href')).toBe(
      'https://www.welld.ch'
    )
  })

  it('shows the name, the WellD role and the main profiles in the footer', async () => {
    await renderAt('/')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText('Michele Giacobazzi')).toBeDefined()
    expect(footer.textContent).toContain('CTO and co-founder @')
    const profiles = within(footer).getByRole('list', { name: 'Profiles' })
    expect(
      within(profiles)
        .getAllByRole('link')
        .map((l) => l.textContent)
    ).toEqual(['LinkedIn', 'GitHub', 'Sessionize'])
  })

  it('does not steal focus on the first load', async () => {
    await renderAt('/profile')
    expect(document.activeElement).toBe(document.body)
  })

  it('moves focus to the new h1 and sets the title when a nav link is activated', async () => {
    await renderAt('/')
    expect(document.title).toBe('Michele Talks')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'On stage',
      })
    )
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }))
    })
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('On stage')
    expect(document.title).toBe('On stage | Michele Talks')
  })

  it('gives Home the headline "On the programme" and Profile the speaker name, with their own titles', async () => {
    const { router } = await renderAt('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('On the programme')
    expect(document.title).toBe('Michele Talks')
    await act(async () => {
      await router.navigate({ to: '/profile' })
    })
    await waitFor(() => {
      expect(document.title).toBe('Profile | Michele Talks')
    })
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(content.profile.name)
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }))
    })
  })

  it('sets the title on Not found', async () => {
    await renderAt('/nowhere')
    expect(document.title).toBe('Page not found | Michele Talks')
  })

  it('focuses the h1 after back/forward navigation too', async () => {
    const { router } = await renderAt('/')
    await act(async () => {
      await router.navigate({ to: '/contact' })
    })
    await waitFor(() => {
      expect(document.title).toBe('Contact | Michele Talks')
    })
    await act(async () => {
      router.history.back()
      await Promise.resolve()
    })
    await waitFor(() => {
      expect(document.title).toBe('Michele Talks')
      expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }))
    })
  })

  it.each(ROUTES)('has no structural a11y violations on %s (%s)', async (_name, path) => {
    const { container } = await renderAt(path)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
