import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Mascot } from './Mascot'

afterEach(cleanup)

describe('Mascot', () => {
  it('shows the pose with its alt text and its native size', () => {
    render(<Mascot pose="ux-strategy" alt="D, searching" />)
    const img = screen.getByRole('img', { name: 'D, searching' })
    expect(img.getAttribute('src')).toMatch(/ux-strategy/)
    expect(img.getAttribute('width')).toBe('360')
    expect(img.getAttribute('height')).toBe('200')
  })

  it('is decorative with an empty alt', () => {
    const { container } = render(<Mascot pose="software-development" alt="" />)
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
    expect(screen.queryByRole('img')).toBeNull()
  })
})
