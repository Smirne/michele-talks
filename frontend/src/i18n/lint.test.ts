// @vitest-environment node
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import tseslint from 'typescript-eslint'
import { describe, expect, it } from 'vitest'

// Resolve everything from this file, not from process.cwd(): the frontend root is two levels
// up, where eslint.config.js lives.
const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

// The probe paths do not exist on disk, and type-aware parsing is switched off for the probe:
// with a TypeScript program in play, linting replacement text under a REAL file's path could
// silently read the file from disk instead (no literals there, so no error), which made this
// test pass locally and fail intermittently in CI. jsx-no-literals needs no type information.
const lint = async (relativePath: string) => {
  const eslint = new ESLint({
    cwd: frontendRoot,
    overrideConfigFile: resolve(frontendRoot, 'eslint.config.js'),
    overrideConfig: [tseslint.configs.disableTypeChecked],
  })
  const results = await eslint.lintText('export const Hello = () => <p>Hard coded</p>\n', {
    filePath: resolve(frontendRoot, relativePath),
    warnIgnored: true,
  })
  // Keep the full output so a failure says why, not only that the rule was missing.
  const report = JSON.stringify(
    results.map((r) => ({ file: r.filePath, messages: r.messages })),
    null,
    2
  )
  return { rules: results.flatMap((r) => r.messages.map((m) => m.ruleId)), report }
}

describe('react/jsx-no-literals (AC-8.3)', () => {
  it('flags a hard-coded string in a .tsx file under src', async () => {
    const { rules, report } = await lint('src/features/home/LintProbe.tsx')
    expect(rules, report).toContain('react/jsx-no-literals')
  }, 30_000)

  it('does not flag test files', async () => {
    const { rules, report } = await lint('src/features/home/LintProbe.test.tsx')
    expect(rules, report).not.toContain('react/jsx-no-literals')
    expect(rules, report).not.toContain(null)
  }, 30_000)
})
