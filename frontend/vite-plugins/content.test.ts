import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ContentValidationError, contentPlugin, loadContent } from './content'

const fixture = (name: string) =>
  path.resolve(import.meta.dirname, '../src/content/__fixtures__', name)

describe('loadContent', () => {
  it('throws one error naming file, item and field for an invalid fixture directory', () => {
    expect(() => loadContent(fixture('invalid-talk-ref'))).toThrow(
      /appearances\.yaml › broken-2026 › talk: .*does-not-exist/
    )
  })

  it('throws a ContentValidationError carrying the structured errors', () => {
    try {
      loadContent(fixture('invalid-talk-ref'))
      expect.unreachable()
    } catch (e) {
      expect(e).toBeInstanceOf(ContentValidationError)
      expect((e as ContentValidationError).errors[0]).toMatchObject({
        file: 'appearances.yaml',
        item: 'broken-2026',
        field: 'talk',
      })
    }
  })

  it('fails when the profile photo file does not exist', () => {
    expect(() => loadContent(fixture('missing-photo'))).toThrow(/profile\.yaml › profile › photo/)
  })

  it('fails when a content file is missing', () => {
    expect(() => loadContent(fixture('does-not-exist'))).toThrow(/profile\.yaml/)
  })

  it('omits hidden talks from the published content', () => {
    const content = loadContent(fixture('valid'))
    expect(content.talks.map((t) => t.slug)).toEqual(['shown'])
  })
})

describe('the real content in frontend/content', () => {
  it('validates unchanged', () => {
    const content = loadContent(path.resolve(import.meta.dirname, '../content'))
    expect(content.talks.length).toBeGreaterThan(0)
    expect(content.appearances.length).toBeGreaterThan(0)
    expect(content.talks.every((t) => !t.hidden)).toBe(true)
  })
})

describe('contentPlugin', () => {
  it('fails the build at start when content is invalid, even if nothing imports it', () => {
    const plugin = contentPlugin({ dir: fixture('invalid-talk-ref') })
    const buildStart = plugin.buildStart as () => void
    expect(() => {
      buildStart()
    }).toThrow(/broken-2026 › talk/)
  })
})
