import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { StagePhoto } from './StagePhoto'

afterEach(cleanup)

describe('StagePhoto', () => {
  it('shows the photo with its alt text and no caption without a credit', () => {
    const { container } = render(<StagePhoto src="/a.webp" alt="Ada on stage" />)
    expect(screen.getByRole('img', { name: 'Ada on stage' }).getAttribute('src')).toBe('/a.webp')
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('shows a visible credit when given, with author and licence links', () => {
    const { container } = render(
      <StagePhoto
        src="/a.webp"
        alt="Ada on stage"
        credit={{
          by: 'Grace',
          url: 'https://example.com/photo',
          licence: 'CC BY-NC-ND 4.0',
          licenceUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
        }}
      />
    )
    expect(container.querySelector('figcaption')?.textContent).toBe(
      'Photo: Grace · CC BY-NC-ND 4.0'
    )
    expect(screen.getByRole('link', { name: 'Grace' }).getAttribute('href')).toBe(
      'https://example.com/photo'
    )
    expect(screen.getByRole('link', { name: 'CC BY-NC-ND 4.0' })).toBeTruthy()
  })

  it('shows a plain credit without links when no URL is known', () => {
    const { container } = render(
      <StagePhoto src="/a.webp" alt="Ada on stage" credit={{ by: 'Grace' }} />
    )
    expect(container.querySelector('figcaption')?.textContent).toBe('Photo: Grace')
    expect(screen.queryByRole('link')).toBeNull()
  })
})

describe('stage photo files', () => {
  it('every file in assets/stage is a WebP of at most 300 KB', async () => {
    const { readdirSync, statSync } = await import('node:fs')
    const path = await import('node:path')
    const dir = path.join(process.cwd(), 'src/assets/stage')
    const files = readdirSync(dir)
    expect(files.length).toBeGreaterThanOrEqual(3)
    for (const f of files) {
      expect(f).toMatch(/\.webp$/)
      expect(statSync(path.join(dir, f)).size).toBeLessThanOrEqual(300 * 1024)
    }
  })
})
