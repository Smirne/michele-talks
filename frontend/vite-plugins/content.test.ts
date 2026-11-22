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

  it('fails when the photoDownload file does not exist', () => {
    expect(() => loadContent(fixture('missing-photo-download'))).toThrow(
      /profile\.yaml › profile › photoDownload/
    )
  })

  it('fails when the photoDownload file is not a JPEG', () => {
    expect(() => loadContent(fixture('bad-photo-download'))).toThrow(
      /profile\.yaml › profile › photoDownload.*JPEG/
    )
  })

  it('fails naming the appearance when a card file does not exist (AC-7.5)', () => {
    expect(() => loadContent(fixture('missing-card'))).toThrow(
      /appearances\.yaml › shown-2026 › cards: no file at media\/cards\/nope\.webp \(relative to the content folder\)/
    )
  })

  it('resolves cards of the real content to files under media/cards', () => {
    const { appearances } = loadContent(path.resolve(import.meta.dirname, '../content'))
    const withCards = appearances.filter((a) => a.cards !== undefined)
    expect(withCards.map((a) => [a.id, a.cards?.length])).toEqual(
      expect.arrayContaining([
        ['devfest-milano-2026', 2],
        ['cloud-day-2026', 2],
        ['coffeetech', 1],
        ['crafted-software', 1],
        ['devoxx-belgium-2026', 1],
      ])
    )
    expect(withCards).toHaveLength(11)
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

  it('lists the Coffeetech and Crafted Software meetups (AC-8.1, AC-8.2)', () => {
    const { appearances } = loadContent(path.resolve(import.meta.dirname, '../content'))
    const coffeetech = appearances.find((a) => a.id === 'coffeetech')
    expect(coffeetech).toMatchObject({
      event: 'Coffeetech',
      date: '2025-11-14',
      city: 'Genova',
      country: 'Italy',
      language: 'it',
      sessionTitle:
        'Filiere energetiche rinnovabili: il progetto SPARklE per le Comunità di Energia Aggregate',
      coHosts: ['Roberto Catanzariti'],
      note: 'A domain talk on renewable energy communities and flexibility, with little technical content.',
    })
    expect(coffeetech?.talk).toBeUndefined()
    expect(appearances.find((a) => a.id === 'crafted-software')).toMatchObject({
      event: 'Crafted Software meetup — TCP Night: Lightning talks',
      date: '2025-11-27',
      city: 'Milan',
      country: 'Italy',
      language: 'it',
      talk: 'from-kubernetes-to-kilowatts',
      sessionTitle: "SPARklE – Gestione intelligente dell'energia",
      note: 'A very early, lightning-talk version of this talk.',
    })
  })

  it('exposes the photo download with its pixel size read from the JPEG', () => {
    const content = loadContent(path.resolve(import.meta.dirname, '../content'))
    expect(content.profile.photoDownload).toMatchObject({
      format: 'JPG',
      width: 1024,
      height: 1024,
    })
  })
})

describe('the official bios in the real content', () => {
  const { bios, bioShort } = loadContent(path.resolve(import.meta.dirname, '../content')).profile

  it('has three paragraphs in every version, each opening and closing as the owner wrote it', () => {
    expect(bios.en.short).toHaveLength(3)
    expect(bios.it.short).toHaveLength(3)
    expect(bios.en.extended).toHaveLength(3)
    expect(bios.it.extended).toHaveLength(3)
    expect(bios.en.short[2]).toBe(
      'He speaks at developer conferences in Italy and abroad and sits on the Voxxed Days Ticino programme committee.'
    )
    expect(bios.it.short[2]).toBe(
      "Interviene come speaker a conferenze per sviluppatori in Italia e all'estero e fa parte del comitato di programma di Voxxed Days Ticino."
    )
    expect(bios.en.extended[1]).toContain('SPARklE')
    expect(bios.it.extended[2]).toMatch(
      /^Ha tenuto il suo primo talk .* Professional Scrum Master \(PSM I\)/
    )
    expect(bios.it.extended[1]).toContain("un'attenzione particolare")
  })

  it('keeps the extended bio a superset of the short one and the Home summary as one paragraph', () => {
    expect(bios.en.extended[0]).toBe(bios.en.short[0])
    expect(bios.it.extended[0]).toBe(bios.it.short[0])
    expect(bioShort).toMatch(/^A Java developer at heart, Michele Giacobazzi is CTO/)
    expect(bioShort).not.toContain('\n')
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
