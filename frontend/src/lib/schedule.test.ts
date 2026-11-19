import { describe, expect, it } from 'vitest'
import { isUpcoming, splitAppearances } from './schedule'

// Local time, late evening: "today" is 2026-06-18 whatever the machine's timezone.
const now = new Date(2026, 5, 18, 23, 30)

const a = (id: string, date: string) => ({ id, date })

describe('isUpcoming', () => {
  it('is false for today', () => {
    expect(isUpcoming('2026-06-18', now)).toBe(false)
  })
  it('is true for tomorrow', () => {
    expect(isUpcoming('2026-06-19', now)).toBe(true)
  })
  it('is false for yesterday', () => {
    expect(isUpcoming('2026-06-17', now)).toBe(false)
  })
  it('uses the local date, not the UTC date', () => {
    // 00:30 local on the 19th is still the 18th in UTC for any timezone ahead of UTC.
    expect(isUpcoming('2026-06-19', new Date(2026, 5, 19, 0, 30))).toBe(false)
  })
})

describe('splitAppearances', () => {
  it('puts upcoming soonest first and past newest first, today counting as past', () => {
    const { upcoming, past } = splitAppearances(
      [
        a('far', '2026-12-01'),
        a('old', '2025-01-10'),
        a('today', '2026-06-18'),
        a('soon', '2026-06-19'),
        a('recent', '2026-06-01'),
      ],
      now
    )
    expect(upcoming.map((x) => x.id)).toEqual(['soon', 'far'])
    expect(past.map((x) => x.id)).toEqual(['today', 'recent', 'old'])
  })

  it('returns an empty upcoming group when nothing is after today', () => {
    const { upcoming, past } = splitAppearances([a('x', '2026-06-18'), a('y', '2020-01-01')], now)
    expect(upcoming).toEqual([])
    expect(past).toHaveLength(2)
  })

  it('does not mutate its input', () => {
    const input = [a('b', '2026-01-01'), a('c', '2026-02-01')]
    splitAppearances(input, now)
    expect(input.map((x) => x.id)).toEqual(['b', 'c'])
  })
})
