import { cleanup, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import { TalksView } from './TalksPage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

describe('Talks page header', () => {
  it('shows one stage photo with its alt text, also when there are no talks', async () => {
    await renderWithRouter(<TalksView talks={[]} />)
    expect(screen.getAllByRole('img', { name: /Devoxx Belgium 2026 stage/ })).toHaveLength(1)
  })

  it('credits the Devoxx photo with its author and CC BY-NC-ND licence', async () => {
    await renderWithRouter(<TalksView talks={[]} />)
    expect(screen.getByRole('link', { name: 'Devoxx Belgium (BeJUG)' }).getAttribute('href')).toBe(
      'https://www.flickr.com/photos/bejug/55580685219/'
    )
    expect(screen.getByRole('link', { name: 'CC BY-NC-ND 4.0' }).getAttribute('href')).toBe(
      'https://creativecommons.org/licenses/by-nc-nd/4.0/'
    )
  })
})
