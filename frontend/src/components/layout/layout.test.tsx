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
  it('shows a decorative D next to the WellD link', async () => {
    await renderWithRouter(<SiteLayout>content</SiteLayout>)
    const footer = screen.getByRole('contentinfo')
    const img = footer.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('')
    expect(within(footer).getByRole('link', { name: 'WellD' })).toBeTruthy()
  })
})

describe('PageHeader', () => {
  it('renders the mascot slot beside the h1', () => {
    render(<PageHeader title="Talks" mascot={<img src="/d.png" alt="D, with a bubble" />} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Talks')
    expect(screen.getByRole('img', { name: 'D, with a bubble' })).toBeTruthy()
  })

  it('accepts a compact size', () => {
    render(<PageHeader title="A long talk title" size="compact" />)
    expect(screen.getByRole('heading', { level: 1 }).className).toMatch(/compact/)
  })

  it('has no mascot by default', () => {
    render(<PageHeader title="Talks" />)
    expect(screen.queryByRole('img')).toBeNull()
  })
})
