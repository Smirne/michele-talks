import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import type { Profile } from '@/content/schema'
import { ContactView } from './ContactPage'

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
  bio: [],
  topics: ['Engines'],
  email: 'ada@example.com',
  profiles: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ada/' },
    { label: 'GitHub', url: 'https://github.com/ada' },
  ],
}

describe('Contact', () => {
  it('has the Contact h1', async () => {
    await renderWithRouter(<ContactView profile={profile} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Contact')
  })

  it('shows the email as a mailto link with the address as its text', async () => {
    await renderWithRouter(<ContactView profile={profile} />)
    const link = screen.getByRole('link', { name: 'ada@example.com' })
    expect(link.getAttribute('href')).toBe('mailto:ada@example.com')
    expect(link.textContent).toBe('ada@example.com')
  })

  it('shows one text link per profile, labelled with the platform name', async () => {
    await renderWithRouter(<ContactView profile={profile} />)
    const list = screen.getByRole('list', { name: 'Elsewhere online' })
    const links = within(list).getAllByRole('link')
    expect(links.map((l) => [l.textContent, l.getAttribute('href')])).toEqual([
      ['LinkedIn', 'https://www.linkedin.com/in/ada/'],
      ['GitHub', 'https://github.com/ada'],
    ])
  })

  it('shows only the email when there are no profile links', async () => {
    await renderWithRouter(<ContactView profile={{ ...profile, profiles: [] }} />)
    expect(screen.getByRole('link', { name: 'ada@example.com' })).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Elsewhere online' })).toBeNull()
    expect(screen.queryByText('Elsewhere online')).toBeNull()
  })
})
