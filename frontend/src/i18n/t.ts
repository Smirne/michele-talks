import { en } from './en'

type Dict = { readonly [key: string]: string | Dict }

type Join<K extends string, P extends string> = `${K}.${P}`

/** Dotted paths to every string leaf of a dictionary. */
export type KeyPath<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Dict
      ? Join<K, KeyPath<T[K]>>
      : never
}[keyof T & string]

export type Vars = Readonly<Record<string, string | number>>

export const createT = <const D extends Dict>(dict: D) => {
  return (key: KeyPath<D>, vars?: Vars): string => {
    let node: string | Dict | undefined = dict
    for (const part of key.split('.')) {
      node = typeof node === 'object' ? node[part] : undefined
    }
    if (typeof node !== 'string') {
      throw new Error(`Unknown i18n key: ${key}`)
    }
    return node.replace(/\{(\w+)\}/g, (whole, name: string) => {
      const value = vars?.[name]
      return value === undefined ? whole : String(value)
    })
  }
}

export const t = createT(en)
export type TranslationKey = KeyPath<typeof en>
