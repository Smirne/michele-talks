import { cleanup, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import { NotFoundPage } from './NotFoundPage'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

describe('Not found', () => {
  it('shows D searching as the main image, with its alt text', async () => {
    await renderWithRouter(<NotFoundPage />)
    expect(
      screen.getByRole('img', { name: 'D, the WellD mascot, searching with a magnifying glass' })
    ).toBeTruthy()
  })
})
