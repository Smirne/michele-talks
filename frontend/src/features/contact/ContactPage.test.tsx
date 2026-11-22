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
  bios: {
    en: { short: ['S.'], extended: ['Long bio.'] },
    it: { short: ['B.'], extended: ['E.'] },
  },
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

  it('shows the email in its own box, separate from the profile links', async () => {
    await renderWithRouter(<ContactView profile={profile} />)
    const emailBox = screen.getByRole('region', { name: 'Email' })
    expect(
      within(emailBox)
        .getAllByRole('link')
        .map((l) => l.textContent)
    ).toEqual(['ada@example.com'])
    const list = screen.getByRole('list', { name: 'Elsewhere online' })
    expect(
      within(list)
        .getAllByRole('link')
        .map((l) => [l.textContent, l.getAttribute('href')])
    ).toEqual([
      ['LinkedIn', 'https://www.linkedin.com/in/ada/'],
      ['GitHub', 'https://github.com/ada'],
    ])
  })

  it('shows an empty profiles list when there are no profile links', async () => {
    await renderWithRouter(<ContactView profile={{ ...profile, profiles: [] }} />)
    const list = screen.getByRole('list', { name: 'Elsewhere online' })
    expect(within(list).queryAllByRole('link')).toHaveLength(0)
  })
})

describe('Contact header', () => {
  it('shows one stage photo with its alt text', async () => {
    await renderWithRouter(<ContactView profile={profile} />)
    expect(screen.getAllByRole('img', { name: /Codemotion Tech Lead Summit 2026/ })).toHaveLength(1)
  })
})
