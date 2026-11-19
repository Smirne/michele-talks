import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import type { Appearance, Content, Talk } from '@/content/schema'
import { HomeView } from './HomePage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

const talk: Talk = {
  slug: 'flex-your-energy',
  title: 'Flex your energy',
  summary: 'Summary.',
  abstract: ['Abstract.'],
  durationMinutes: 45,
  level: 'beginner',
  format: 'talk',
  languages: ['en'],
  topics: [],
  hidden: false,
}

const appearance = (id: string, date: string): Appearance => ({
  id,
  event: `Event ${id}`,
  date,
  city: 'Milan',
  country: 'Italy',
  online: false,
  language: 'en',
})

const content: Content = {
  profile: {
    name: 'Ada Lovelace',
    photo: '/ada.jpg',
    photoAlt: 'Portrait of Ada',
    bioShort: 'Ada writes about engines.',
    bio: ['Long bio.'],
    topics: ['Engines'],
    email: 'ada@example.com',
    profiles: [],
  },
  talks: [talk, { ...talk, slug: 'second', title: 'Second talk' }],
  appearances: [
    appearance('p1', '2026-01-10'),
    appearance('u1', '2026-07-01'),
    appearance('u2', '2026-08-01'),
    appearance('u3', '2026-09-01'),
    appearance('u4', '2026-10-01'),
    appearance('p2', '2026-02-10'),
    { ...appearance('u0', '2026-06-20'), talk: 'flex-your-energy' },
  ],
}

const NOW = new Date(2026, 5, 18, 12)

const renderHome = (props: { now?: Date; content?: Content } = {}) =>
  renderWithRouter(<HomeView now={NOW} content={content} {...props} />)

const nextRegion = () => screen.getByRole('region', { name: /^(Next|Recently)$/ })

describe('Home', () => {
  it('shows the intro: speaker name and short bio', async () => {
    await renderHome()
    expect(screen.getByRole('heading', { level: 2, name: 'Ada Lovelace' })).toBeTruthy()
    expect(screen.getByText('Ada writes about engines.')).toBeTruthy()
  })

  it('has the primary call to action to the talks page, with the talk count', async () => {
    await renderHome()
    expect(screen.getByRole('link', { name: 'Open the talks' }).getAttribute('href')).toBe('/talks')
    expect(screen.getByText(/2 talks/)).toBeTruthy()
  })

  it('has a contact path: a link to /contact and the email as a mailto link', async () => {
    await renderHome()
    expect(screen.getByRole('link', { name: 'Contact details' }).getAttribute('href')).toBe(
      '/contact'
    )
    expect(screen.getByRole('link', { name: 'ada@example.com' }).getAttribute('href')).toBe(
      'mailto:ada@example.com'
    )
  })

  it('lists at most three upcoming appearances, soonest first, under "Next"', async () => {
    await renderHome()
    const region = nextRegion()
    expect(within(region).getByRole('heading', { name: 'Next' })).toBeTruthy()
    const items = within(region)
      .getAllByRole('listitem')
      .filter((li) => li.querySelector('time'))
    expect(items.map((li) => li.querySelector('time')?.getAttribute('datetime'))).toEqual([
      '2026-06-20',
      '2026-07-01',
      '2026-08-01',
    ])
    expect(within(region).queryByText('Event p1')).toBeNull()
  })

  it('links an appearance to its catalogue talk using the talk title', async () => {
    await renderHome()
    const link = within(nextRegion()).getByRole('link', { name: 'Flex your energy' })
    expect(link.getAttribute('href')).toBe('/talks/flex-your-energy')
  })

  it('falls back to "Recently" with the latest past appearances when nothing is upcoming', async () => {
    await renderHome({ now: new Date(2027, 0, 1) })
    const region = nextRegion()
    expect(within(region).getByRole('heading', { name: 'Recently' })).toBeTruthy()
    expect(within(region).queryByRole('heading', { name: 'Next' })).toBeNull()
    const dates = within(region)
      .getAllByRole('listitem')
      .map((li) => li.querySelector('time')?.getAttribute('datetime'))
      .filter(Boolean)
    expect(dates).toEqual(['2026-10-01', '2026-09-01', '2026-08-01'])
  })

  it('omits the list when there are no appearances at all', async () => {
    await renderHome({ content: { ...content, appearances: [] } })
    expect(screen.queryByRole('region', { name: /^(Next|Recently)$/ })).toBeNull()
  })

  it('reserves a labelled region for the future graph', async () => {
    await renderHome()
    const region = screen.getByRole('region', { name: 'Reserved area for the future talks graph' })
    expect(within(region).getByText('Talks graph goes here (future feature).')).toBeTruthy()
  })

  it('shows the D card with alt text and a caption linking to WellD', async () => {
    await renderHome()
    const img = screen.getByRole('img', { name: /D, the WellD mascot/ })
    const figure = img.closest('figure')
    if (!figure) throw new Error('D image is not in a figure')
    expect(within(figure).getByRole('link', { name: 'WellD' }).getAttribute('href')).toBe(
      'https://www.welld.ch'
    )
  })
})
