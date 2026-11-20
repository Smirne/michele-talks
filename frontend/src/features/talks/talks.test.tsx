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

describe('talk page aside, topics and layout (003)', () => {
  const EMAIL = 'ada@example.com'
  const render = (over: Partial<Talk> = {}, appearances: Appearance[] = []) =>
    renderWithRouter(
      <TalkDetailView
        talk={{ ...talk, ...over }}
        now={NOW}
        appearances={appearances}
        email={EMAIL}
      />
    )
  const aside = () => screen.getByRole('complementary', { name: 'Invitation and links' })
  const after = (a: Node, b: Node) =>
    !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

  it('invites with a mailto link whose subject carries the encoded talk title', async () => {
    await render({ title: 'Flex your energy & more' })
    const link = within(aside()).getByRole('link', { name: 'Invite me with this talk' })
    expect(link.getAttribute('href')).toBe(
      `mailto:${EMAIL}?subject=${encodeURIComponent('Speaker invitation: Flex your energy & more')}`
    )
    expect(within(aside()).getByText(/Opens your email app/)).toBeTruthy()
  })

  it('has no invitation on a talk that is no longer offered, but still lists its links', async () => {
    await render({ offered: false }, [
      appearance('a', '2026-01-10', {
        resources: [{ type: 'video', url: 'https://v/a', language: 'it' }],
      }),
    ])
    expect(screen.queryByRole('link', { name: 'Invite me with this talk' })).toBeNull()
    expect(screen.queryByText(/Opens your email app/)).toBeNull()
    expect(within(aside()).getByRole('link', { name: /^Recording \(IT\)/ })).toBeTruthy()
  })

  it('has no aside at all when the talk is no longer offered and has no links', async () => {
    await render({ offered: false })
    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('shows recording and slides from the latest appearances, with language and event', async () => {
    await render({}, [
      appearance('old', '2025-01-10', {
        resources: [{ type: 'slides', url: 'https://s/old', language: 'en' }],
      }),
      appearance('new', '2026-02-10', {
        resources: [
          { type: 'video', url: 'https://v/new', language: 'it' },
          { type: 'slides', url: 'https://s/new', language: 'it' },
        ],
      }),
    ])
    const recording = within(aside()).getByRole('link', { name: /^Recording/ })
    expect(recording.textContent).toBe('Recording (IT), Event new')
    expect(recording.getAttribute('href')).toBe('https://v/new')
    expect(recording.getAttribute('aria-label')).toBe('Recording (IT), Event new, in Italian')
    const slides = within(aside()).getByRole('link', { name: /^Slides/ })
    expect(slides.textContent).toBe('Slides (IT), Event new')
    expect(slides.getAttribute('href')).toBe('https://s/new')
  })

  it('uses the featured recording instead of the latest one', async () => {
    await render({ featuredRecording: 'https://v/old' }, [
      appearance('old', '2025-01-10', {
        resources: [{ type: 'video', url: 'https://v/old', language: 'en' }],
      }),
      appearance('new', '2026-02-10', {
        resources: [{ type: 'video', url: 'https://v/new', language: 'it' }],
      }),
    ])
    expect(within(aside()).getByRole('link', { name: /^Recording/ }).textContent).toBe(
      'Recording (EN), Event old'
    )
  })

  it('leaves out the rows that have nothing to show', async () => {
    await render({}, [
      appearance('a', '2026-01-10', {
        resources: [{ type: 'slides', url: 'https://s/a', language: 'en' }],
      }),
    ])
    expect(within(aside()).queryByRole('link', { name: /^Recording/ })).toBeNull()
    expect(within(aside()).getByRole('link', { name: /^Slides/ })).toBeTruthy()
    expect(within(aside()).getByRole('link', { name: 'Invite me with this talk' })).toBeTruthy()
  })

  it('shows only the invitation when there is no recording and no slides', async () => {
    await render({}, [appearance('a', '2026-01-10')])
    expect(within(aside()).getAllByRole('link')).toHaveLength(1)
  })

  it('shows the topics in the head block, and nothing when there are none', async () => {
    const { unmount } = await render({ topics: ['Energy', 'Kubernetes'] })
    const list = screen.getByRole('list', { name: 'Topics' })
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    ).toEqual(['Energy', 'Kubernetes'])
    expect(after(screen.getByRole('heading', { level: 1 }), list)).toBe(true)
    expect(after(list, aside())).toBe(true)
    unmount()
    await render({ topics: [] })
    expect(screen.queryByRole('list', { name: 'Topics' })).toBeNull()
  })

  it('puts the aside after the head and before the note and the abstract in the DOM', async () => {
    await render({ note: 'Adapts to the event.' })
    expect(after(screen.getByRole('heading', { level: 1 }), aside())).toBe(true)
    expect(after(aside(), screen.getByText('Adapts to the event.'))).toBe(true)
    expect(after(aside(), screen.getByRole('heading', { name: 'Abstract' }))).toBe(true)
  })

  it('uses the compact title', async () => {
    await render()
    expect(screen.getByRole('heading', { level: 1 }).className).toMatch(/compact/)
  })
})
