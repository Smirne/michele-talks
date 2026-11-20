import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import type { Profile } from '@/content/schema'
import { ProfileView } from './ProfilePage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

const profile: Profile = {
  name: 'Ada Lovelace',
  photo: '/ada.jpg',
  photoAlt: 'Portrait of Ada Lovelace',
  photoDownload: { url: '/ada-1024.jpg', format: 'JPG', width: 1024, height: 1024 },
  bioShort: 'Short.',
  bios: {
    en: {
      short: ['Short en one.', 'Short en two.'],
      extended: ['First paragraph.', 'Second paragraph.', 'Third paragraph.'],
    },
    it: { short: ['Breve.'], extended: ['Esteso uno.', 'Esteso due.'] },
  },
  topics: ['Engines', 'Notes on the Analytical Engine'],
  email: 'ada@example.com',
  profiles: [],
}

describe('Profile', () => {
  it('shows the name as the h1', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Ada Lovelace')
    expect(document.title).toBe('Profile | Michele Talks')
  })

  it('shows the photo with the content alt text and a reserved aspect ratio', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    expect(screen.getByRole('img', { name: 'Portrait of Ada Lovelace' })).toBeTruthy()
    expect(document.querySelector('[data-aspect]')).toBeTruthy()
  })

  it('shows the extended English bio, paragraph by paragraph, as the main bio', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    for (const p of profile.bios.en.extended) expect(screen.getByText(p)).toBeTruthy()
  })

  it('shows every topic in a list', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    const list = screen.getByRole('list', { name: 'Topics' })
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    ).toEqual(profile.topics)
  })

  it('mentions WellD with a link to www.welld.ch', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    expect(screen.getByRole('link', { name: 'WellD' }).getAttribute('href')).toBe(
      'https://www.welld.ch'
    )
  })

  it('closes with links to the talks and the contact page', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    expect(screen.getByRole('link', { name: 'Browse the talks' }).getAttribute('href')).toBe(
      '/talks'
    )
    expect(screen.getByRole('link', { name: 'Get in touch' }).getAttribute('href')).toBe('/contact')
  })

  it('renders without bio paragraphs', async () => {
    await renderWithRouter(
      <ProfileView
        profile={{
          ...profile,
          bios: { ...profile.bios, en: { ...profile.bios.en, extended: [] } },
        }}
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  describe('For organisers', () => {
    const band = () => screen.getByRole('region', { name: 'For organisers' })
    const setClipboard = (writeText: ((text: string) => Promise<void>) | undefined) => {
      Object.defineProperty(navigator, 'clipboard', {
        value: writeText === undefined ? undefined : { writeText },
        configurable: true,
      })
    }

    it('shows the heading and the short English bio by default', async () => {
      await renderWithRouter(<ProfileView profile={profile} />)
      expect(screen.getByRole('heading', { level: 2, name: 'For organisers' })).toBeTruthy()
      const box = document.getElementById('short-bio') as HTMLElement
      expect(
        within(box)
          .getAllByRole('paragraph')
          .map((p) => p.textContent)
      ).toEqual(['Short en one.', 'Short en two.'])
      expect(box.getAttribute('lang')).toBeNull()
      expect(within(band()).getByRole('radio', { name: 'English' })).toHaveProperty('checked', true)
      expect(within(band()).getByRole('radio', { name: 'Short' })).toHaveProperty('checked', true)
    })

    it('offers the choices as two labelled radio groups', async () => {
      await renderWithRouter(<ProfileView profile={profile} />)
      const language = within(band()).getByRole('group', { name: 'Language' })
      const length = within(band()).getByRole('group', { name: 'Length' })
      expect(within(language).getAllByRole('radio')).toHaveLength(2)
      expect(within(length).getAllByRole('radio')).toHaveLength(2)
    })

    it('shows Italian extended in a box marked lang="it"', async () => {
      await renderWithRouter(<ProfileView profile={profile} />)
      fireEvent.click(within(band()).getByRole('radio', { name: 'Italian' }))
      fireEvent.click(within(band()).getByRole('radio', { name: 'Extended' }))
      const box = document.getElementById('short-bio') as HTMLElement
      expect(box.getAttribute('lang')).toBe('it')
      expect(
        within(box)
          .getAllByRole('paragraph')
          .map((p) => p.textContent)
      ).toEqual(['Esteso uno.', 'Esteso due.'])
    })

    it('copies exactly the shown paragraphs joined by a blank line and says so', async () => {
      const writeText = vi.fn(() => Promise.resolve())
      setClipboard(writeText)
      await renderWithRouter(<ProfileView profile={profile} />)
      fireEvent.click(within(band()).getByRole('radio', { name: 'Italian' }))
      fireEvent.click(within(band()).getByRole('radio', { name: 'Extended' }))
      fireEvent.click(screen.getByRole('button', { name: 'Copy bio' }))
      await waitFor(() => {
        expect(within(band()).getByRole('status').textContent).toBe('Bio copied to the clipboard.')
      })
      expect(writeText).toHaveBeenCalledWith('Esteso uno.\n\nEsteso due.')
    })

    it('keeps the status region in the DOM, empty, until used; changing a choice clears it', async () => {
      setClipboard(() => Promise.resolve())
      await renderWithRouter(<ProfileView profile={profile} />)
      expect(within(band()).getByRole('status').textContent).toBe('')
      fireEvent.click(screen.getByRole('button', { name: 'Copy bio' }))
      await waitFor(() => {
        expect(within(band()).getByRole('status').textContent).not.toBe('')
      })
      fireEvent.click(within(band()).getByRole('radio', { name: 'Extended' }))
      expect(within(band()).getByRole('status').textContent).toBe('')
    })

    it.each([
      ['rejects', () => Promise.reject(new Error('denied'))],
      ['is absent', undefined],
    ])('says copying failed and selects the bio when the clipboard %s', async (_name, write) => {
      setClipboard(write)
      await renderWithRouter(<ProfileView profile={profile} />)
      fireEvent.click(screen.getByRole('button', { name: 'Copy bio' }))
      await waitFor(() => {
        expect(within(band()).getByRole('status').textContent).toBe(
          'Copying failed. Select the text above and copy it yourself.'
        )
      })
      const selection = window.getSelection()
      expect(selection?.rangeCount).toBe(1)
      expect(selection?.getRangeAt(0).commonAncestorContainer).toBe(
        document.getElementById('short-bio')
      )
    })

    it('links the 1024 px JPEG as a download named after the speaker', async () => {
      await renderWithRouter(<ProfileView profile={profile} />)
      const link = within(band()).getByRole('link', { name: /^Download photo/ })
      expect(link.getAttribute('href')).toBe('/ada-1024.jpg')
      expect(link.getAttribute('download')).toBe('ada-lovelace.jpg')
      expect(link.textContent).toContain('JPG, 1024 × 1024 px')
      expect(link.hasAttribute('aria-label')).toBe(false)
    })

    it('shows D with its alt text in the band', async () => {
      await renderWithRouter(<ProfileView profile={profile} />)
      expect(
        within(band()).getByRole('img', { name: 'D, the WellD mascot, with a documents icon' })
      ).toBeTruthy()
    })
  })
})
