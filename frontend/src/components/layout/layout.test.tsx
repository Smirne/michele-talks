import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/components/content/test-utils'
import { PageHeader } from './PageHeader'
import { SiteLayout } from './SiteLayout'

beforeAll(() => {
  window.scrollTo = () => undefined
})
afterEach(cleanup)

describe('SiteLayout footer', () => {
  it('shows the WellD logo inside the WellD link, and no D', async () => {
    await renderWithRouter(<SiteLayout>content</SiteLayout>)
    const footer = screen.getByRole('contentinfo')
    const link = within(footer).getByRole('link', { name: 'WellD' })
    const logo = within(link).getByRole('img', { name: 'WellD' })
    expect(logo.getAttribute('src')).toMatch(/welld-logo-white/)
    expect(footer.querySelectorAll('img')).toHaveLength(1)
  })
})

describe('PageHeader', () => {
  it('renders the image slot beside the h1', () => {
    render(<PageHeader title="Talks" image={<img src="/d.png" alt="On stage" />} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Talks')
    expect(screen.getByRole('img', { name: 'On stage' })).toBeTruthy()
  })

  it('accepts a compact size', () => {
    render(<PageHeader title="A long talk title" size="compact" />)
    expect(screen.getByRole('heading', { level: 1 }).className).toMatch(/compact/)
  })

  it('has no image by default', () => {
    render(<PageHeader title="Talks" />)
    expect(screen.queryByRole('img')).toBeNull()
  })
})
