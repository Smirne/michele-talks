import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { readFileSync } from 'node:fs'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { Appearance, Talk } from '@/content/schema'
import {
  AppearanceRow,
  ButtonLink,
  LanguageBadge,
  ResourceLink,
  TalkCard,
  TopicTags,
} from './index'
import { renderWithRouter } from './test-utils'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

const talk: Talk = {
  slug: 'flex-your-energy',
  title: 'Flex your energy',
  summary: 'A short summary.',
  abstract: ['One.'],
  durationMinutes: 45,
  level: 'intermediate',
  format: 'talk',
  languages: ['en', 'it'],
  topics: [],
  hidden: false,
  offered: true,
}

const appearance: Appearance = {
  id: 'jug-milano-2026',
  event: 'JUG Milano',
  date: '2026-06-18',
  city: 'Milan',
  country: 'Italy',
  online: false,
  language: 'it',
}

const inList = (row: React.ReactElement) => <ul>{row}</ul>

describe('LanguageBadge', () => {
  it.each([
    ['en', 'EN'],
    ['it', 'IT'],
  ] as const)('renders %s as text %s', async (language, text) => {
    await renderWithRouter(<LanguageBadge language={language} />)
    expect(screen.getByText(text)).toBeTruthy()
  })
})

describe('ButtonLink', () => {
  it('renders an internal link with the route href', async () => {
    await renderWithRouter(<ButtonLink to="/talks">Go</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Go' }).getAttribute('href')).toBe('/talks')
  })
  it('renders an external href as a plain link', async () => {
    await renderWithRouter(
      <ButtonLink variant="secondary" href="mailto:a@b.co">
        Mail
      </ButtonLink>
    )
    expect(screen.getByRole('link', { name: 'Mail' }).getAttribute('href')).toBe('mailto:a@b.co')
  })
})

describe('ResourceLink', () => {
  it('is a link labelled with type and language', async () => {
    await renderWithRouter(
      <ResourceLink resource={{ type: 'slides', url: 'https://x.test/s', language: 'it' }} />
    )
    const link = screen.getByRole('link', { name: /Slides \(IT\)/ })
    expect(link.textContent).toBe('Slides (IT)')
    expect(link.getAttribute('href')).toBe('https://x.test/s')
    expect(link.getAttribute('aria-label')).toBe('Slides (IT), Italian')
  })
})

describe('TalkCard', () => {
  it('shows a title link to the detail, summary, written-out duration, level, format, badges', async () => {
    await renderWithRouter(<TalkCard talk={talk} />)
    const link = screen.getByRole('link', { name: 'Flex your energy' })
    expect(link.getAttribute('href')).toBe('/talks/flex-your-energy')
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy()
    expect(screen.getByText('A short summary.')).toBeTruthy()
    expect(screen.getByText('45 minutes')).toBeTruthy()
    expect(screen.getByText('Intermediate')).toBeTruthy()
    expect(screen.getByText('Talk')).toBeTruthy()
    expect(screen.getByText('EN')).toBeTruthy()
    expect(screen.getByText('IT')).toBeTruthy()
  })

  it('marks an Italian-only talk lang="it" and a bilingual one not', async () => {
    await renderWithRouter(<TalkCard talk={{ ...talk, languages: ['it'] }} />)
    expect(screen.getByRole('article').getAttribute('lang')).toBe('it')
    cleanup()
    await renderWithRouter(<TalkCard talk={talk} />)
    expect(screen.getByRole('article').getAttribute('lang')).toBeNull()
  })
})

describe('AppearanceRow', () => {
  it('shows event, <time datetime>, place and one language badge; Italian row has lang="it"', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={appearance} />))
    const row = screen.getByRole('listitem')
    expect(row.getAttribute('lang')).toBe('it')
    expect(within(row).getByText('JUG Milano')).toBeTruthy()
    expect(row.querySelector('time')?.getAttribute('datetime')).toBe('2026-06-18')
    expect(within(row).getByText('Milan, Italy')).toBeTruthy()
    expect(within(row).getByText('IT')).toBeTruthy()
  })

  it('shows Online and an English row without an Italian lang', async () => {
    await renderWithRouter(
      inList(
        <AppearanceRow
          appearance={{ ...appearance, city: undefined, country: undefined, online: true, language: 'en' }}
        />
      )
    )
    const row = screen.getByRole('listitem')
    expect(row.getAttribute('lang')).toBe('en')
    expect(within(row).getByText('Online')).toBeTruthy()
    expect(within(row).getByText('EN')).toBeTruthy()
  })

  it('links to the catalogue talk and shows the session title next to it', async () => {
    await renderWithRouter(
      inList(
        <AppearanceRow
          appearance={{ ...appearance, talk: 'flex-your-energy', sessionTitle: 'Scaling smart energy' }}
          talkTitle="Flex your energy"
        />
      )
    )
    const link = screen.getByRole('link', { name: 'Flex your energy' })
    expect(link.getAttribute('href')).toBe('/talks/flex-your-energy')
    expect(screen.getByText(/Scaling smart energy/)).toBeTruthy()
  })

  it('shows the session title as plain text when there is no catalogue talk', async () => {
    await renderWithRouter(
      inList(<AppearanceRow appearance={{ ...appearance, sessionTitle: 'Facilitator' }} />)
    )
    expect(screen.getByText('Facilitator')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('shows the note and the event page link, and each resource as a link', async () => {
    await renderWithRouter(
      inList(
        <AppearanceRow
          appearance={{
            ...appearance,
            note: 'Video selection, not a live slot.',
            eventUrl: 'https://event.test/page',
            resources: [
              { type: 'slides', url: 'https://x.test/s', language: 'it' },
              { type: 'video', url: 'https://x.test/v', language: 'en' },
            ],
          }}
        />
      )
    )
    expect(screen.getByText('Video selection, not a live slot.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Event page' }).getAttribute('href')).toBe(
      'https://event.test/page'
    )
    expect(screen.getByRole('link', { name: /Slides \(IT\)/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Video \(EN\)/ })).toBeTruthy()
  })

  it('renders none of talk link, session title, note, event link or resources when absent', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={appearance} />))
    const row = screen.getByRole('listitem')
    expect(within(row).queryAllByRole('link')).toHaveLength(0)
    expect(within(row).queryByText('Presented as')).toBeNull()
    // Only event name, date and place/badge text: nothing else.
    expect(row.querySelectorAll('p')).toHaveLength(1)
  })
})

describe('new talk fields on TalkCard (002)', () => {
  it.each([
    [35, '35 minutes'],
    [120, '2 hours'],
    [360, '6 hours'],
    [150, '2.5 hours'],
    [{ min: 360, max: 480 }, '6–8 hours'],
    [{ min: 15, max: 30 }, '15–30 minutes'],
  ] as [Talk['durationMinutes'], string][])('writes the duration %j as "%s"', async (durationMinutes, text) => {
    await renderWithRouter(<TalkCard talk={{ ...talk, durationMinutes }} />)
    expect(screen.getByText(text)).toBeTruthy()
  })

  it('writes a level range with an en dash', async () => {
    await renderWithRouter(<TalkCard talk={{ ...talk, level: ['beginner', 'intermediate'] }} />)
    expect(screen.getByText('Beginner–Intermediate')).toBeTruthy()
  })

  it('writes the quickie format', async () => {
    await renderWithRouter(<TalkCard talk={{ ...talk, format: 'quickie' }} />)
    expect(screen.getByText('Quickie')).toBeTruthy()
  })

  it.each([
    [['Matteo Codogno'], 'With Matteo Codogno'],
    [['Ada', 'Grace'], 'With Ada and Grace'],
    [['Ada', 'Grace', 'Linus'], 'With Ada, Grace and Linus'],
  ])('writes the co-hosts %j as "%s"', async (coHosts, text) => {
    await renderWithRouter(<TalkCard talk={{ ...talk, coHosts }} />)
    expect(screen.getByText(text)).toBeTruthy()
  })

  it('shows no co-host line when there are none', async () => {
    await renderWithRouter(<TalkCard talk={talk} />)
    expect(screen.queryByText(/^With /)).toBeNull()
  })
})

describe('AppearanceRow co-hosts (002)', () => {
  it('reads "With <names>" when the appearance has co-hosts', async () => {
    await renderWithRouter(
      inList(<AppearanceRow appearance={{ ...appearance, coHosts: ['Matteo Codogno'] }} />)
    )
    expect(screen.getByText('With Matteo Codogno')).toBeTruthy()
  })
})

describe('TopicTags', () => {
  it('renders the topics as a list labelled "Topics", in content order', () => {
    render(<TopicTags topics={['Kubernetes', 'AI', 'PostgreSQL']} />)
    const list = screen.getByRole('list', { name: 'Topics' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Kubernetes',
      'AI',
      'PostgreSQL',
    ])
  })

  it('renders nothing for no topics', () => {
    const { container } = render(<TopicTags topics={[]} />)
    expect(container.innerHTML).toBe('')
  })
})

describe('TalkCard topics and title (003)', () => {
  it('shows the topics after the facts, in content order', async () => {
    await renderWithRouter(<TalkCard talk={{ ...talk, topics: ['GitOps', 'AI'] }} />)
    const list = screen.getByRole('list', { name: 'Topics' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'GitOps',
      'AI',
    ])
  })

  it('shows no topics list for a talk without topics', async () => {
    await renderWithRouter(<TalkCard talk={talk} />)
    expect(screen.queryByRole('list', { name: 'Topics' })).toBeNull()
  })

  it('renders the title link with its content text (case is CSS, never the text)', async () => {
    await renderWithRouter(<TalkCard talk={{ ...talk, title: 'Before Delegating: ADRs' }} />)
    expect(screen.getByRole('link', { name: 'Before Delegating: ADRs' }).textContent).toBe(
      'Before Delegating: ADRs'
    )
  })

  it('styles the title in sentence case and underlines it only on hover or focus', () => {
    const css = readFileSync('src/components/content/TalkCard.module.css', 'utf8')
    const title = /\.title\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(title).not.toMatch(/text-transform:\s*uppercase/)
    expect(title).toMatch(/font-size:\s*clamp\(20px, 1\.9vw, 26px\)/)
    const link = /\.link\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(link).toMatch(/text-decoration:\s*none/)
    expect(css).toMatch(/\.link:hover,\s*\.link:focus-visible\s*\{[^}]*text-decoration:\s*underline/)
  })
})

describe('CardViewer on AppearanceRow', () => {
  beforeAll(() => {
    // jsdom has no <dialog> modal support: model open/close and the close event.
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  })

  const one = { ...appearance, cards: [{ url: '/a.webp' }] }
  const two = { ...appearance, cards: [{ url: '/a.webp', alt: 'First card' }, { url: '/b.webp' }] }

  it('shows the first card as a thumbnail button named by the default alt (AC-7.1)', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={one} />))
    const button = screen.getByRole('button', { name: 'Social card for JUG Milano' })
    expect(button.querySelector('img')?.getAttribute('src')).toBe('/a.webp')
  })

  it('uses the card alt when the content gives one', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={two} />))
    expect(screen.getByRole('button', { name: 'First card' })).toBeTruthy()
  })

  it('shows no thumbnail, button or dialog without cards (AC-7.4)', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={appearance} />))
    expect(screen.queryByRole('button')).toBeNull()
    expect(document.querySelector('dialog')).toBeNull()
    expect(document.querySelector('img')).toBeNull()
  })

  it('opens the dialog from the thumbnail and closes it with the button, returning focus (AC-7.2)', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={one} />))
    const thumb = screen.getByRole('button', { name: 'Social card for JUG Milano' })
    fireEvent.click(thumb)
    const dialog = document.querySelector('dialog') as HTMLDialogElement
    expect(dialog.hasAttribute('open')).toBe(true)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(thumb)
  })

  it('closes on Escape and returns focus to the thumbnail (AC-7.2)', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={one} />))
    const thumb = screen.getByRole('button', { name: 'Social card for JUG Milano' })
    fireEvent.click(thumb)
    const dialog = document.querySelector('dialog') as HTMLDialogElement
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(thumb)
  })

  it('has no previous/next with one card and steps through two, wrapping (AC-7.3)', async () => {
    await renderWithRouter(inList(<AppearanceRow appearance={one} />))
    fireEvent.click(screen.getByRole('button', { name: 'Social card for JUG Milano' }))
    expect(screen.queryByRole('button', { name: 'Next card' })).toBeNull()
    cleanup()

    await renderWithRouter(inList(<AppearanceRow appearance={two} />))
    fireEvent.click(screen.getByRole('button', { name: 'First card' }))
    const dialog = document.querySelector('dialog') as HTMLDialogElement
    const shown = () => dialog.querySelector('img')?.getAttribute('src')
    expect(shown()).toBe('/a.webp')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next card' }))
    expect(shown()).toBe('/b.webp')
    expect(within(dialog).getByText('2 of 2')).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next card' }))
    expect(shown()).toBe('/a.webp')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Previous card' }))
    expect(shown()).toBe('/b.webp')
  })

  it('passes axe with the dialog open', async () => {
    const { container } = await renderWithRouter(inList(<AppearanceRow appearance={two} />))
    fireEvent.click(screen.getByRole('button', { name: 'First card' }))
    expect((await axe(container)).violations).toEqual([])
  })
})
