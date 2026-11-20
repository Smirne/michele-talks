// @vitest-environment node
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

// Resolve everything from this file, not from process.cwd(): the frontend root is two levels
// up, where eslint.config.js lives. Existing files are linted with the snippet as their text,
// because type-aware linting needs a path the tsconfig includes.
const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const lint = async (relativePath: string) => {
  const eslint = new ESLint({
    cwd: frontendRoot,
    overrideConfigFile: resolve(frontendRoot, 'eslint.config.js'),
  })
  const results = await eslint.lintText('export const Hello = () => <p>Hard coded</p>\n', {
    filePath: resolve(frontendRoot, relativePath),
    warnIgnored: true,
  })
  // Keep the full output so a CI failure says why, not only that the rule was missing.
  const report = JSON.stringify(
    results.map((r) => ({ file: r.filePath, messages: r.messages })),
    null,
    2
  )
  return { rules: results.flatMap((r) => r.messages.map((m) => m.ruleId)), report }
}

describe('react/jsx-no-literals (AC-8.3)', () => {
  it('flags a hard-coded string in a .tsx file under src', async () => {
    const { rules, report } = await lint('src/features/home/HomePage.tsx')
    expect(rules, report).toContain('react/jsx-no-literals')
  }, 30_000)

  it('does not flag test files', async () => {
    const { rules, report } = await lint('src/features/home/HomePage.test.tsx')
    expect(rules, report).not.toContain('react/jsx-no-literals')
  }, 30_000)
})
