import { cleanup, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import { TalksView } from './TalksPage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

describe('Talks page header', () => {
  it('shows one D with its alt text, also when there are no talks', async () => {
    await renderWithRouter(<TalksView talks={[]} />)
    expect(
      screen.getAllByRole('img', { name: 'D, the WellD mascot, with a code speech bubble' })
    ).toHaveLength(1)
  })
})
