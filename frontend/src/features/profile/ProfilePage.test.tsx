import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
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
  bio: ['First paragraph.', 'Second paragraph.', 'Third paragraph.'],
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

  it('shows every bio paragraph', async () => {
    await renderWithRouter(<ProfileView profile={profile} />)
    for (const p of profile.bio) expect(screen.getByText(p)).toBeTruthy()
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
    await renderWithRouter(<ProfileView profile={{ ...profile, bio: [] }} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })
})
