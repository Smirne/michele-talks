import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProfilePhoto } from './ProfilePhoto'

afterEach(cleanup)

describe('ProfilePhoto', () => {
  it('renders the photo with the content alt text', () => {
    render(<ProfilePhoto src="/p.jpg" alt="Portrait of Ada Lovelace" name="Ada Lovelace" />)
    const img = screen.getByRole('img', { name: 'Portrait of Ada Lovelace' })
    expect(img.getAttribute('src')).toBe('/p.jpg')
  })

  it('reserves a fixed aspect ratio box (no layout shift)', () => {
    const { container } = render(<ProfilePhoto src="/p.jpg" alt="x" name="Ada Lovelace" />)
    expect(container.firstElementChild?.getAttribute('data-aspect')).toBe('4/5')
  })

  it('reserves a square box for aspect="1/1"', () => {
    const { container } = render(
      <ProfilePhoto src="/p.jpg" alt="x" name="Ada Lovelace" aspect="1/1" />
    )
    expect(container.firstElementChild?.getAttribute('data-aspect')).toBe('1/1')
  })

  it('falls back to a monogram that keeps the alt text when the image fails to load', () => {
    render(<ProfilePhoto src="/missing.jpg" alt="Portrait of Ada Lovelace" name="Ada Lovelace" />)
    fireEvent.error(screen.getByRole('img', { name: 'Portrait of Ada Lovelace' }))
    expect(document.querySelector('img')).toBeNull()
    const fallback = screen.getByRole('img', { name: 'Portrait of Ada Lovelace' })
    expect(fallback.textContent).toBe('AL')
  })
})
