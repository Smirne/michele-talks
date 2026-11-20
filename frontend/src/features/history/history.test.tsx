import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import type { Appearance, Talk } from '@/content/schema'
import { HistoryView } from './HistoryPage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

const NOW = new Date(2026, 5, 18, 12)

const talks: Talk[] = [
  {
    slug: 'flex-your-energy',
    title: 'Flex your energy',
    summary: 'S.',
    abstract: ['A.'],
    durationMinutes: 45,
    level: 'beginner',
    format: 'talk',
    languages: ['en'],
    topics: [],
    hidden: false,
    offered: true,
  },
]

const appearance = (id: string, date: string, extra: Partial<Appearance> = {}): Appearance => ({
  id,
  event: `Event ${id}`,
  date,
  city: 'Milan',
  country: 'Italy',
  online: false,
  language: 'en',
  ...extra,
})

const onlineAppearance = (id: string, date: string): Appearance => ({
  id,
  event: `Event ${id}`,
  date,
  online: true,
  language: 'en',
})

const render = (appearances: Appearance[], now = NOW) =>
  renderWithRouter(<HistoryView appearances={appearances} talks={talks} now={now} />)

const dates = () =>
  screen
    .getAllByRole('listitem')
    .map((li) => li.querySelector('time')?.getAttribute('datetime'))
    .filter(Boolean)

describe('HistoryView', () => {
  it('shows event, <time> date, place or Online, and one language badge per appearance', async () => {
    await render([
      appearance('a', '2026-03-10'),
      { ...onlineAppearance('b', '2026-02-10'), language: 'it' },
    ])
    const rowA = screen.getByText('Event a').closest('li') as HTMLElement
    expect(within(rowA).getByText('10 Mar 2026').closest('time')?.getAttribute('datetime')).toBe(
      '2026-03-10'
    )
    expect(within(rowA).getByText('Milan, Italy')).toBeTruthy()
    expect(within(rowA).getByText('EN')).toBeTruthy()
    const rowB = screen.getByText('Event b').closest('li') as HTMLElement
    expect(within(rowB).getByText('Online')).toBeTruthy()
    expect(within(rowB).getByText('IT')).toBeTruthy()
  })

  it('puts Upcoming above Past, soonest first and newest first', async () => {
    await render([
      appearance('p1', '2026-01-10'),
      appearance('u2', '2026-09-01'),
      appearance('p2', '2026-03-10'),
      appearance('u1', '2026-07-01'),
    ])
    const up = screen.getByRole('heading', { level: 2, name: 'Upcoming' })
    const past = screen.getByRole('heading', { level: 2, name: 'Past' })
    expect(up.compareDocumentPosition(past) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(dates()).toEqual(['2026-07-01', '2026-09-01', '2026-03-10', '2026-01-10'])
  })

  it('has no Upcoming heading when nothing is upcoming', async () => {
    await render([appearance('p1', '2026-01-10')])
    expect(screen.queryByRole('heading', { name: 'Upcoming' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Past' })).toBeTruthy()
  })

  it('has no Past heading when everything is upcoming', async () => {
    await render([appearance('u1', '2026-09-01')])
    expect(screen.queryByRole('heading', { name: 'Past' })).toBeNull()
  })

  it('labels resources by type and language, and shows note, session title and event link', async () => {
    await render([
      appearance('a', '2026-03-10', {
        resources: [
          { type: 'slides', url: 'https://example.com/s', language: 'it' },
          { type: 'video', url: 'https://example.com/v', language: 'en' },
        ],
        note: 'Facilitator, working table',
        eventUrl: 'https://example.com/event',
        sessionTitle: 'Other title',
        talk: 'flex-your-energy',
      }),
    ])
    expect(screen.getByRole('link', { name: /Slides \(IT\)/ }).getAttribute('href')).toBe(
      'https://example.com/s'
    )
    expect(screen.getByRole('link', { name: /Video \(EN\)/ }).getAttribute('href')).toBe(
      'https://example.com/v'
    )
    expect(screen.getByText('Facilitator, working table')).toBeTruthy()
    expect(screen.getByText('Other title')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Event page' }).getAttribute('href')).toBe(
      'https://example.com/event'
    )
  })

  it('links an appearance with a talk to its detail using the catalogue title', async () => {
    await render([appearance('a', '2026-03-10', { talk: 'flex-your-energy' })])
    expect(screen.getByRole('link', { name: 'Flex your energy' }).getAttribute('href')).toBe(
      '/talks/flex-your-energy'
    )
  })

  it('shows "No appearances yet." and no group headings when there are none', async () => {
    await render([])
    expect(screen.getByText('No appearances yet.')).toBeTruthy()
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('shows co-hosts on a row', async () => {
    await render([appearance('w', '2026-03-10', { coHosts: ['Matteo Codogno'] })])
    expect(screen.getByText('With Matteo Codogno')).toBeTruthy()
  })

  it('links a row to a no-longer-offered talk, using its title', async () => {
    const retired: Talk = {
      ...(talks[0] as Talk),
      slug: 'retired',
      title: 'Retired talk',
      offered: false,
    }
    await renderWithRouter(
      <HistoryView
        appearances={[appearance('old', '2015-04-18', { talk: 'retired' })]}
        talks={[retired]}
        now={NOW}
      />
    )
    expect(screen.getByRole('link', { name: 'Retired talk' }).getAttribute('href')).toBe(
      '/talks/retired'
    )
  })
})
