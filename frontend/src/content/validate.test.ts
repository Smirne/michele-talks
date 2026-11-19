import { describe, expect, it } from 'vitest'
import { type ContentError, type RawContent, validateContent } from './schema'

const profile = {
  name: 'Ada Example',
  photo: 'media/ada.jpg',
  photoAlt: 'Portrait of Ada',
  bioShort: 'Short bio.',
  bio: ['First paragraph.'],
  topics: ['Testing'],
  email: 'ada@example.org',
  profiles: [{ label: 'Site', url: 'https://example.org' }],
}

const talk = {
  slug: 'first-talk',
  title: 'First talk',
  summary: 'Summary.',
  abstract: ['Abstract.'],
  durationMinutes: 30,
  level: 'beginner',
  format: 'talk',
  languages: ['en'],
  topics: ['Testing'],
}

const appearance = {
  id: 'meetup-2026',
  event: 'Meetup',
  date: '2026-01-31',
  city: 'Milan',
  country: 'Italy',
  online: false,
  language: 'en',
  talk: 'first-talk',
}

const omit = <T extends object>(obj: T, ...keys: (keyof T)[]): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as keyof T))) as Partial<T>

const raw = (over: Partial<Record<keyof RawContent, unknown>> = {}): RawContent => ({
  profile,
  talks: [talk],
  appearances: [appearance],
  ...over,
})

const errorsOf = (r: RawContent): ContentError[] => {
  const result = validateContent(r)
  if (result.ok) throw new Error('expected validation to fail')
  return result.errors
}

describe('validateContent', () => {
  it('accepts valid content', () => {
    const result = validateContent(raw())
    expect(result.ok).toBe(true)
  })

  it('names file, item and field for a missing required field', () => {
    const noTitle = omit(talk, 'title')
    expect(errorsOf(raw({ talks: [noTitle] }))).toContainEqual(
      expect.objectContaining({ file: 'talks.yaml', item: 'first-talk', field: 'title' })
    )
  })

  it('names the profile for a missing profile field', () => {
    const noEmail = omit(profile, 'email')
    expect(errorsOf(raw({ profile: noEmail }))).toContainEqual(
      expect.objectContaining({ file: 'profile.yaml', item: 'profile', field: 'email' })
    )
  })

  it('rejects an unknown language', () => {
    expect(errorsOf(raw({ appearances: [{ ...appearance, language: 'fr' }] }))).toContainEqual(
      expect.objectContaining({ file: 'appearances.yaml', item: 'meetup-2026', field: 'language' })
    )
  })

  it('rejects an unknown language inside a nested resource, with the dotted path', () => {
    const resources = [{ type: 'slides', url: 'https://example.org/s', language: 'de' }]
    expect(errorsOf(raw({ appearances: [{ ...appearance, resources }] }))).toContainEqual(
      expect.objectContaining({ item: 'meetup-2026', field: 'resources.0.language' })
    )
  })

  it.each(['31/01/2026', '2026-02-30', 'soon'])('rejects the malformed date %s', (date) => {
    expect(errorsOf(raw({ appearances: [{ ...appearance, date }] }))).toContainEqual(
      expect.objectContaining({ item: 'meetup-2026', field: 'date' })
    )
  })

  it('rejects an appearance whose talk is not in talks.yaml', () => {
    const errors = errorsOf(raw({ appearances: [{ ...appearance, talk: 'nope' }] }))
    const found = errors.find((e) => e.item === 'meetup-2026' && e.field === 'talk')
    expect(found?.message).toContain('nope')
  })

  it('rejects a duplicate talk slug', () => {
    expect(errorsOf(raw({ talks: [talk, talk] }))).toContainEqual(
      expect.objectContaining({ file: 'talks.yaml', item: 'first-talk', field: 'slug' })
    )
  })

  it('rejects a duplicate appearance id', () => {
    expect(errorsOf(raw({ appearances: [appearance, appearance] }))).toContainEqual(
      expect.objectContaining({ file: 'appearances.yaml', item: 'meetup-2026', field: 'id' })
    )
  })

  it('rejects an appearance that is neither online nor has city and country', () => {
    const noPlace = omit(appearance, 'city', 'country')
    expect(errorsOf(raw({ appearances: [noPlace] }))).toContainEqual(
      expect.objectContaining({ item: 'meetup-2026', field: 'online' })
    )
  })

  it('accepts an online appearance without city and country', () => {
    const noPlace = omit(appearance, 'city', 'country')
    expect(validateContent(raw({ appearances: [{ ...noPlace, online: true }] })).ok).toBe(true)
  })

  it('rejects an appearance whose talk is hidden', () => {
    const errors = errorsOf(raw({ talks: [{ ...talk, hidden: true }] }))
    expect(errors).toContainEqual(
      expect.objectContaining({ file: 'appearances.yaml', item: 'meetup-2026', field: 'talk' })
    )
  })

  it.each(['not a url', 'ftp://example.org/x', 'javascript:alert(1)'])(
    'rejects the malformed eventUrl %s',
    (eventUrl) => {
      expect(errorsOf(raw({ appearances: [{ ...appearance, eventUrl }] }))).toContainEqual(
        expect.objectContaining({ item: 'meetup-2026', field: 'eventUrl' })
      )
    }
  )

  it('reports every error at once, not just the first', () => {
    const errors = errorsOf(
      raw({
        talks: [{ ...talk, level: 'expert' }],
        appearances: [{ ...appearance, date: 'x', talk: 'nope' }],
      })
    )
    expect(errors.length).toBeGreaterThanOrEqual(3)
  })

  it('drops hidden talks from the published content (AC-4.4)', () => {
    const visible = { ...talk, slug: 'visible-talk' }
    const hidden = { ...talk, slug: 'hidden-talk', hidden: true }
    const result = validateContent(raw({ talks: [visible, hidden], appearances: [] }))
    if (!result.ok) throw new Error('expected ok')
    expect(result.content.talks.map((t) => t.slug)).toEqual(['visible-talk'])
  })

  it('defaults hidden to false', () => {
    const result = validateContent(raw())
    if (!result.ok) throw new Error('expected ok')
    expect(result.content.talks[0]?.hidden).toBe(false)
  })
})
