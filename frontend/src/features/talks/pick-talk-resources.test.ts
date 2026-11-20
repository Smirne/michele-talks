import { describe, expect, it } from 'vitest'
import type { Appearance, Talk } from '@/content/schema'
import { pickTalkResources } from './pick-talk-resources'

const talk: Talk = {
  slug: 'flex',
  title: 'Flex',
  summary: 'S.',
  abstract: ['A.'],
  durationMinutes: 30,
  level: 'beginner',
  format: 'talk',
  languages: ['en'],
  topics: [],
  hidden: false,
  offered: true,
}

type Res = NonNullable<Appearance['resources']>[number]
const video = (url: string, language: 'en' | 'it' = 'en'): Res => ({ type: 'video', url, language })
const slides = (url: string, language: 'en' | 'it' = 'en'): Res => ({
  type: 'slides',
  url,
  language,
})

const appearance = (id: string, date: string, resources?: Res[], over: Partial<Appearance> = {}) =>
  ({
    id,
    event: `Event ${id}`,
    date,
    online: true,
    language: 'en',
    talk: 'flex',
    ...(resources ? { resources } : {}),
    ...over,
  }) satisfies Appearance

describe('pickTalkResources', () => {
  it('picks the video of the most recent appearance that has one', () => {
    const picks = pickTalkResources(talk, [
      appearance('old', '2025-01-01', [video('https://v/old')]),
      appearance('new', '2026-01-01', [video('https://v/new', 'it')]),
      appearance('newest-no-video', '2026-06-01', [slides('https://s/x')]),
    ])
    expect(picks.recording).toEqual({ url: 'https://v/new', language: 'it', event: 'Event new' })
  })

  it('lets the featured recording override the most recent one', () => {
    const picks = pickTalkResources({ ...talk, featuredRecording: 'https://v/old' }, [
      appearance('old', '2025-01-01', [video('https://v/old', 'it')]),
      appearance('new', '2026-01-01', [video('https://v/new')]),
    ])
    expect(picks.recording).toEqual({ url: 'https://v/old', language: 'it', event: 'Event old' })
  })

  it('picks the slides of the most recent appearance that has them', () => {
    const picks = pickTalkResources(talk, [
      appearance('a', '2025-01-01', [slides('https://s/a')]),
      appearance('b', '2026-01-01', [video('https://v/b')]),
      appearance('c', '2025-09-01', [slides('https://s/c', 'it')]),
    ])
    expect(picks.slides).toEqual({ url: 'https://s/c', language: 'it', event: 'Event c' })
  })

  it('breaks a date tie by content order', () => {
    const picks = pickTalkResources(talk, [
      appearance('first', '2026-01-01', [video('https://v/1'), slides('https://s/1')]),
      appearance('second', '2026-01-01', [video('https://v/2'), slides('https://s/2')]),
    ])
    expect(picks.recording?.url).toBe('https://v/1')
    expect(picks.slides?.url).toBe('https://s/1')
  })

  it('takes the first resource when one appearance has several of a type', () => {
    const picks = pickTalkResources(talk, [
      appearance('a', '2026-01-01', [video('https://v/1'), video('https://v/2')]),
    ])
    expect(picks.recording?.url).toBe('https://v/1')
  })

  it('ignores appearances of other talks', () => {
    const picks = pickTalkResources(talk, [
      appearance('other', '2026-01-01', [video('https://v/x')], { talk: 'else' }),
      appearance('free', '2026-01-02', [video('https://v/y')], { talk: undefined as never }),
    ])
    expect(picks).toEqual({})
  })

  it('returns nothing when there are no resources', () => {
    expect(pickTalkResources(talk, [])).toEqual({})
    expect(pickTalkResources(talk, [appearance('a', '2026-01-01')])).toEqual({})
  })
})
