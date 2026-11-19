// @vitest-environment node
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

// Existing files are linted with the snippet as their text: type-aware linting needs a path
// the tsconfig includes.
const lint = async (filePath: string) => {
  // vitest runs from the frontend root, where eslint.config.js lives.
  const eslint = new ESLint({ cwd: process.cwd() })
  const [result] = await eslint.lintText('export const Hello = () => <p>Hard coded</p>\n', {
    filePath,
  })
  return result?.messages.map((m) => m.ruleId) ?? []
}

describe('react/jsx-no-literals (AC-8.3)', () => {
  it('flags a hard-coded string in a .tsx file under src', async () => {
    expect(await lint('src/features/home/HomePage.tsx')).toContain('react/jsx-no-literals')
  })

  it('does not flag test files', async () => {
    expect(await lint('src/features/home/HomePage.test.tsx')).not.toContain('react/jsx-no-literals')
  })
})
