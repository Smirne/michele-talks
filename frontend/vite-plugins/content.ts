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

/** Pixel size from the first SOF marker of a JPEG, or undefined when the bytes are not a JPEG. */
export const readJpegSize = (bytes: Buffer): { width: number; height: number } | undefined => {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined
  let offset = 2
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return undefined
    const marker = bytes[offset + 1] ?? 0
    if (marker === 0xff) {
      offset += 1
      continue
    }
    // SOF0..SOF15 except DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (offset + 9 > bytes.length) return undefined
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) }
    }
    offset += 2 + bytes.readUInt16BE(offset + 2)
  }
  return undefined
}

const photoDownloadError = (message: string): ContentValidationError =>
  new ContentValidationError([
    { file: 'profile.yaml', item: 'profile', field: 'photoDownload', message },
  ])

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

  const downloadRel = result.content.profile.photoDownload
  const downloadPath = path.join(dir, downloadRel)
  if (!existsSync(downloadPath)) {
    throw photoDownloadError(`no file at ${downloadRel} (relative to the content folder)`)
  }
  const size = readJpegSize(readFileSync(downloadPath))
  if (size === undefined) throw photoDownloadError(`${downloadRel} is not a JPEG image`)

  return {
    ...result.content,
    profile: {
      ...result.content.profile,
      photoDownload: { url: downloadPath, format: 'JPG', ...size },
    },
  }
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
      // The photos are imported so Vite fingerprints and emits it.
      return [
        `import photo from ${JSON.stringify(photo)}`,
        `import photoDownloadUrl from ${JSON.stringify(content.profile.photoDownload.url)}`,
        `const content = ${JSON.stringify(content)}`,
        'const { photoDownload } = content.profile',
        'export default { ...content, profile: { ...content.profile, photo,',
        '  photoDownload: { ...photoDownload, url: photoDownloadUrl } } }',
      ].join('\n')
    },
  }
}
