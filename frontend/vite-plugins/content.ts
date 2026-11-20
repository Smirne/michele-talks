import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { parse } from 'yaml'
import {
  type Content,
  type ContentError,
  type ContentFile,
  formatContentError,
  validateContent,
} from '../src/content/schema'

const VIRTUAL_ID = 'virtual:content'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const FILES: ContentFile[] = ['profile.yaml', 'talks.yaml', 'appearances.yaml']

export class ContentValidationError extends Error {
  readonly errors: ContentError[]
  constructor(errors: ContentError[]) {
    super(
      `Invalid content (${String(errors.length)} problem${errors.length === 1 ? '' : 's'}):\n` +
        errors.map((e) => `  - ${formatContentError(e)}`).join('\n')
    )
    this.name = 'ContentValidationError'
    this.errors = errors
  }
}

const readYaml = (dir: string, file: ContentFile): unknown => {
  const full = path.join(dir, file)
  if (!existsSync(full)) {
    throw new ContentValidationError([
      { file, item: '(file)', field: '(root)', message: `file not found at ${full}` },
    ])
  }
  try {
    return parse(readFileSync(full, 'utf8')) as unknown
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause)
    throw new ContentValidationError([{ file, item: '(file)', field: '(yaml)', message }])
  }
}

/** Reads, validates and returns the published content; throws one error listing every problem. */
export const loadContent = (dir: string): Content => {
  const [profile, talks, appearances] = FILES.map((f) => readYaml(dir, f))
  const result = validateContent({ profile, talks, appearances })
  if (!result.ok) throw new ContentValidationError(result.errors)

  const photoPath = path.join(dir, result.content.profile.photo)
  if (!existsSync(photoPath)) {
    throw new ContentValidationError([
      {
        file: 'profile.yaml',
        item: 'profile',
        field: 'photo',
        message: `no file at ${result.content.profile.photo} (relative to the content folder)`,
      },
    ])
  }
  return result.content
}

/** `virtual:content`: validated, published content. Fails build and dev server when invalid. */
export const contentPlugin = (options: { dir: string }): Plugin => {
  const dir = path.resolve(options.dir)
  return {
    name: 'michele-talks:content',
    // Validate on every build and dev-server start, even before anything imports the module.
    buildStart() {
      loadContent(dir)
    },
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return undefined
      for (const f of FILES) this.addWatchFile(path.join(dir, f))
      const content = loadContent(dir)
      const photo = path.join(dir, content.profile.photo)
      // The photo is imported so Vite fingerprints and emits it.
      return [
        `import photo from ${JSON.stringify(photo)}`,
        `const content = ${JSON.stringify(content)}`,
        'export default { ...content, profile: { ...content.profile, photo } }',
      ].join('\n')
    },
  }
}
