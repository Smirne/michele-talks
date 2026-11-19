import { describe, expect, it } from 'vitest'
import { createT, t } from './t'

const dict = {
  a: { plain: 'Hello', greet: 'Hi {name}, you have {n} talks' },
} as const

describe('createT', () => {
  const tt = createT(dict)

  it('looks up a dotted key', () => {
    expect(tt('a.plain')).toBe('Hello')
  })

  it('interpolates variables', () => {
    expect(tt('a.greet', { name: 'Ada', n: 3 })).toBe('Hi Ada, you have 3 talks')
  })

  it('leaves an unknown placeholder visible rather than printing undefined', () => {
    expect(tt('a.greet', { name: 'Ada' })).toBe('Hi Ada, you have {n} talks')
  })

  it('rejects an unknown key at compile time', () => {
    // @ts-expect-error -- 'a.missing' is not a key of the dictionary
    expect(() => tt('a.missing')).toThrow(/a\.missing/)
  })
})

describe('t (English set)', () => {
  it('resolves the site name from the common namespace', () => {
    expect(t('common.siteName')).toBe('Michele Talks')
  })
})
