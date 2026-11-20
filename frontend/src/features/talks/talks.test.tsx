import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import type { Appearance, Talk } from '@/content/schema'
import { TalkDetailView } from './TalkDetailPage'
import { TalksView } from './TalksPage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

const NOW = new Date(2026, 5, 18, 12)

const talk: Talk = {
  slug: 'flex-your-energy',
  title: 'Flex your energy',
  summary: 'A short summary.',
  abstract: ['First paragraph.', 'Second paragraph.'],
  durationMinutes: 45,
  level: 'intermediate',
  format: 'workshop',
  languages: ['en', 'it'],
  topics: [],
  hidden: false,
  offered: true,
}
const other: Talk = {
  ...talk,
  slug: 'solo-it',
  title: 'Solo italiano',
  durationMinutes: 20,
  level: 'beginner',
  format: 'lightning',
  languages: ['it'],
}

const appearance = (id: string, date: string, extra: Partial<Appearance> = {}): Appearance => ({
  id,
  event: `Event ${id}`,
  date,
  city: 'Milan',
  country: 'Italy',
  online: false,
  language: 'en',
  talk: 'flex-your-energy',
  ...extra,
})

describe('TalksView', () => {
  it('lists every talk with title link, summary, duration, level, format and badges', async () => {
    await renderWithRouter(<TalksView talks={[talk, other]} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Flex your energy' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Flex your energy' }).getAttribute('href')).toBe(
      '/talks/flex-your-energy'
    )
    expect(screen.getAllByText('A short summary.')).toHaveLength(2)
    expect(screen.getByText('45 minutes')).toBeTruthy()
    expect(screen.getByText('20 minutes')).toBeTruthy()
    expect(screen.getByText('Intermediate')).toBeTruthy()
    expect(screen.getByText('Lightning talk')).toBeTruthy()
    const card = screen.getByRole('link', { name: 'Flex your energy' }).closest('article')
    if (!card) throw new Error('no card')
    expect(within(card).getByText('EN')).toBeTruthy()
    expect(within(card).getByText('IT')).toBeTruthy()
  })

  it('shows the empty message with a Contact link when there are no talks', async () => {
    await renderWithRouter(<TalksView talks={[]} />)
    expect(screen.getByText(/No talks listed yet/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'get in touch' }).getAttribute('href')).toBe('/contact')
  })
})

describe('TalkDetailView', () => {
  it('shows the title, meta, the full abstract, and both appearance groups', async () => {
    await renderWithRouter(
      <TalkDetailView
        talk={talk}
        now={NOW}
        appearances={[
          appearance('past-old', '2026-01-10'),
          appearance('past-new', '2026-03-10'),
          appearance('up', '2026-09-01'),
          appearance('elsewhere', '2026-09-02', { talk: 'solo-it' }),
        ]}
      />
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Flex your energy' })).toBeTruthy()
    expect(screen.getByText('First paragraph.')).toBeTruthy()
    expect(screen.getByText('Second paragraph.')).toBeTruthy()
    expect(screen.getByText('45 minutes')).toBeTruthy()
    expect(screen.getByText('Workshop')).toBeTruthy()

    const upcoming = screen.getByRole('heading', { level: 2, name: 'Upcoming' })
    const past = screen.getByRole('heading', { level: 2, name: 'Past' })
    expect(upcoming.compareDocumentPosition(past) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    const dates = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('time')?.getAttribute('datetime'))
      .filter(Boolean)
    expect(dates).toEqual(['2026-09-01', '2026-03-10', '2026-01-10'])
    expect(screen.getByRole('link', { name: 'All talks' }).getAttribute('href')).toBe('/talks')
  })

  it('shows "Also given as" with each title and its language badge, absent when none', async () => {
    const { unmount } = await renderWithRouter(
      <TalkDetailView
        talk={{
          ...talk,
          alsoGivenAs: [
            { title: 'Un altro titolo', language: 'it' },
            { title: 'Another title', language: 'en' },
          ],
        }}
        now={NOW}
        appearances={[]}
      />
    )
    const heading = screen.getByRole('heading', { name: 'Also given as' })
    const list = heading.nextElementSibling as HTMLElement
    const items = within(list).getAllByRole('listitem')
    expect(items.map((li) => li.textContent)).toEqual([
      expect.stringContaining('Un altro titolo'),
      expect.stringContaining('Another title'),
    ])
    expect(within(items[0] as HTMLElement).getByText('IT')).toBeTruthy()
    expect(items[0]?.querySelector('[lang="it"]')?.textContent).toContain('Un altro titolo')
    expect(within(items[1] as HTMLElement).getByText('EN')).toBeTruthy()
    unmount()
    await renderWithRouter(<TalkDetailView talk={talk} now={NOW} appearances={[]} />)
    expect(screen.queryByText('Also given as')).toBeNull()
  })

  it('shows only the groups that have entries, and a message when there are none', async () => {
    const { unmount } = await renderWithRouter(
      <TalkDetailView talk={talk} now={NOW} appearances={[appearance('p', '2026-01-10')]} />
    )
    expect(screen.queryByRole('heading', { name: 'Upcoming' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Past' })).toBeTruthy()
    unmount()
    await renderWithRouter(<TalkDetailView talk={talk} now={NOW} appearances={[]} />)
    expect(screen.queryByRole('heading', { name: 'Upcoming' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Past' })).toBeNull()
    expect(screen.getByText('Not given in public yet.')).toBeTruthy()
  })
})

describe('offered: false and new fields (002)', () => {
  const retired: Talk = { ...talk, slug: 'retired', title: 'Retired talk', offered: false }

  it('leaves a no-longer-offered talk out of the Talks list', async () => {
    await renderWithRouter(<TalksView talks={[talk, retired]} />)
    expect(screen.getByRole('link', { name: 'Flex your energy' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Retired talk' })).toBeNull()
  })

  it('shows the empty message when every talk is no longer offered', async () => {
    await renderWithRouter(<TalksView talks={[retired]} />)
    expect(screen.getByText(/No talks listed yet/)).toBeTruthy()
  })

  it('says "No longer offered" on the page, with abstract and appearances', async () => {
    await renderWithRouter(
      <TalkDetailView
        talk={retired}
        now={NOW}
        appearances={[appearance('p', '2026-01-10', { talk: 'retired' })]}
      />
    )
    expect(screen.getByText('No longer offered')).toBeTruthy()
    expect(screen.getByText('First paragraph.')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Past' })).toBeTruthy()
  })

  it('does not say it for an offered talk', async () => {
    await renderWithRouter(<TalkDetailView talk={talk} now={NOW} appearances={[]} />)
    expect(screen.queryByText('No longer offered')).toBeNull()
  })

  it('shows the note under the title, before the abstract, and nothing when absent', async () => {
    const { unmount } = await renderWithRouter(
      <TalkDetailView talk={{ ...talk, note: 'Adapts to the event.' }} now={NOW} appearances={[]} />
    )
    const note = screen.getByText('Adapts to the event.')
    const abstract = screen.getByRole('heading', { name: 'Abstract' })
    const title = screen.getByRole('heading', { level: 1 })
    expect(title.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(note.compareDocumentPosition(abstract) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    unmount()
    await renderWithRouter(<TalkDetailView talk={talk} now={NOW} appearances={[]} />)
    expect(screen.queryByText('Adapts to the event.')).toBeNull()
  })

  it('shows level range, duration range, co-hosts and quickie in the page meta', async () => {
    await renderWithRouter(
      <TalkDetailView
        talk={{
          ...talk,
          level: ['beginner', 'intermediate'],
          durationMinutes: { min: 360, max: 480 },
          coHosts: ['Matteo Codogno'],
          format: 'quickie',
        }}
        now={NOW}
        appearances={[]}
      />
    )
    expect(screen.getByText('Beginner–Intermediate')).toBeTruthy()
    expect(screen.getByText('6–8 hours')).toBeTruthy()
    expect(screen.getByText('With Matteo Codogno')).toBeTruthy()
    expect(screen.getByText('Quickie')).toBeTruthy()
  })

  it('lists related links by label, after the abstract, opening safely', async () => {
    await renderWithRouter(
      <TalkDetailView
        talk={{ ...talk, links: [{ label: 'Training page', url: 'https://example.org/training' }] }}
        now={NOW}
        appearances={[]}
      />
    )
    const link = screen.getByRole('link', { name: 'Training page' })
    expect(link.getAttribute('href')).toBe('https://example.org/training')
    expect(link.getAttribute('rel')).toBe('noopener')
    const abstract = screen.getByRole('heading', { name: 'Abstract' })
    expect(abstract.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
