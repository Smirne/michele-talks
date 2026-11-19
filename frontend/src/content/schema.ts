// Relative imports only: this module is also loaded by the Vite plugin (Node tsconfig),
// where the `@/` alias does not exist.
import { z } from 'zod'

const kebab = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case (a-z, 0-9, -)')
const nonEmpty = z.string().trim().min(1, 'must not be empty')
const language = z.enum(['en', 'it'], 'must be "en" or "it"')

const httpUrl = z.string().refine((value) => {
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}, 'must be a valid http(s) URL')

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date written YYYY-MM-DD')
  .refine((value) => {
    const d = new Date(`${value}T00:00:00Z`)
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value)
  }, 'must be a real calendar date')

export const profileSchema = z.object({
  name: nonEmpty,
  photo: nonEmpty,
  photoAlt: nonEmpty,
  bioShort: nonEmpty,
  bio: z.array(nonEmpty),
  topics: z.array(nonEmpty).min(1, 'needs at least one topic'),
  email: z.email('must be a valid email address'),
  profiles: z.array(z.object({ label: nonEmpty, url: httpUrl })),
})

export const talkSchema = z.object({
  slug: kebab,
  title: nonEmpty,
  summary: nonEmpty,
  abstract: z.array(nonEmpty).min(1, 'needs at least one paragraph'),
  durationMinutes: z.number().int().positive(),
  level: z.enum(['beginner', 'intermediate', 'advanced'], 'unknown level'),
  format: z.enum(['talk', 'lightning', 'keynote', 'workshop', 'panel'], 'unknown format'),
  languages: z.array(language).min(1, 'needs at least one language'),
  topics: z.array(nonEmpty),
  alsoGivenAs: z.array(z.object({ title: nonEmpty, language })).optional(),
  hidden: z.boolean().default(false),
})

export const appearanceSchema = z
  .object({
    id: kebab,
    event: nonEmpty,
    date: isoDate,
    city: nonEmpty.optional(),
    country: nonEmpty.optional(),
    online: z.boolean(),
    language,
    talk: kebab.optional(),
    sessionTitle: nonEmpty.optional(),
    note: nonEmpty.optional(),
    eventUrl: httpUrl.optional(),
    resources: z
      .array(z.object({ type: z.enum(['slides', 'video'], 'unknown type'), url: httpUrl, language }))
      .optional(),
  })
  .superRefine((a, ctx) => {
    if (!a.online && (a.city === undefined || a.country === undefined)) {
      ctx.addIssue({
        code: 'custom',
        path: ['online'],
        message: 'must be true, or both city and country must be given',
      })
    }
  })

export type Profile = z.infer<typeof profileSchema>
export type Talk = z.infer<typeof talkSchema>
export type Appearance = z.infer<typeof appearanceSchema>

/** Published content: hidden talks are already removed. */
export type Content = {
  profile: Profile
  talks: Talk[]
  appearances: Appearance[]
}

export type RawContent = { profile: unknown; talks: unknown; appearances: unknown }

export type ContentFile = 'profile.yaml' | 'talks.yaml' | 'appearances.yaml'

export type ContentError = {
  file: ContentFile
  /** slug | id | "profile" */
  item: string
  /** dotted path inside the item */
  field: string
  message: string
}

export type ValidationResult =
  | { ok: true; content: Content }
  | { ok: false; errors: ContentError[] }

export const formatContentError = (e: ContentError): string =>
  `${e.file} › ${e.item} › ${e.field}: ${e.message}`

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined

const itemLabel = (raw: unknown, key: 'slug' | 'id', index: number): string => {
  const v = asRecord(raw)?.[key]
  return typeof v === 'string' && v !== '' ? v : `#${String(index + 1)}`
}

const fieldOf = (path: readonly PropertyKey[]): string =>
  path.length === 0 ? '(item)' : path.map(String).join('.')

const parseList = <S extends z.ZodType>(
  file: ContentFile,
  raw: unknown,
  schema: S,
  key: 'slug' | 'id',
  errors: ContentError[]
): z.infer<S>[] => {
  if (!Array.isArray(raw)) {
    errors.push({ file, item: '(file)', field: '(root)', message: 'must be a list' })
    return []
  }
  const items: z.infer<S>[] = []
  raw.forEach((entry: unknown, index) => {
    const result = schema.safeParse(entry)
    if (result.success) {
      items.push(result.data)
      return
    }
    const item = itemLabel(entry, key, index)
    for (const issue of result.error.issues) {
      errors.push({ file, item, field: fieldOf(issue.path), message: issue.message })
    }
  })
  return items
}

export const validateContent = (raw: RawContent): ValidationResult => {
  const errors: ContentError[] = []

  const profileResult = profileSchema.safeParse(raw.profile)
  if (!profileResult.success) {
    for (const issue of profileResult.error.issues) {
      errors.push({
        file: 'profile.yaml',
        item: 'profile',
        field: fieldOf(issue.path),
        message: issue.message,
      })
    }
  }

  const talks = parseList('talks.yaml', raw.talks, talkSchema, 'slug', errors)
  const appearances = parseList('appearances.yaml', raw.appearances, appearanceSchema, 'id', errors)

  const seenSlugs = new Set<string>()
  for (const talk of talks) {
    if (seenSlugs.has(talk.slug)) {
      errors.push({
        file: 'talks.yaml',
        item: talk.slug,
        field: 'slug',
        message: 'duplicate slug; every talk needs a unique slug',
      })
    }
    seenSlugs.add(talk.slug)
  }

  const seenIds = new Set<string>()
  for (const a of appearances) {
    if (seenIds.has(a.id)) {
      errors.push({
        file: 'appearances.yaml',
        item: a.id,
        field: 'id',
        message: 'duplicate id; every appearance needs a unique id',
      })
    }
    seenIds.add(a.id)
  }

  const hiddenSlugs = new Set(talks.filter((t) => t.hidden).map((t) => t.slug))
  for (const a of appearances) {
    if (a.talk === undefined) continue
    if (hiddenSlugs.has(a.talk)) {
      errors.push({
        file: 'appearances.yaml',
        item: a.id,
        field: 'talk',
        message: `"${a.talk}" is a hidden talk; a published appearance cannot link to it`,
      })
    } else if (!seenSlugs.has(a.talk)) {
      errors.push({
        file: 'appearances.yaml',
        item: a.id,
        field: 'talk',
        message: `no talk with slug "${a.talk}" in talks.yaml`,
      })
    }
  }

  if (errors.length > 0 || !profileResult.success) return { ok: false, errors }

  return {
    ok: true,
    content: {
      profile: profileResult.data,
      talks: talks.filter((t) => !t.hidden),
      appearances,
    },
  }
}
