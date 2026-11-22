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
})
