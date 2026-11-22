import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// Feature 005 (T11): every page at 375px and 1280px has no horizontal scroll and passes an
// axe colour-contrast audit, including the social-card dialog open state.

const ROUTES = [
  ['Home', '/'],
  ['Profile', '/profile'],
  ['Talks', '/talks'],
  ['Talk detail', '/talks/from-kubernetes-to-kilowatts'],
  ['Workshop detail', '/talks/lego4scrum'],
  ['No longer offered', '/talks/repetition-is-bad'],
  ['On stage', '/on-stage'],
  ['Contact', '/contact'],
  ['Not found', '/no-such-page'],
] as const

const VIEWPORTS = [
  ['375px', { width: 375, height: 812 }],
  ['1280px', { width: 1280, height: 800 }],
] as const

const ready = async (page: Page, path: string) => {
  await page.goto(path)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

const contrast = async (page: Page) =>
  (await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()).violations

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

for (const [vpName, viewport] of VIEWPORTS) {
  test.describe(`sweep at ${vpName}`, () => {
    test.use({ viewport })

    for (const [name, path] of ROUTES) {
      test(`${name} ${path}: no horizontal scroll, colour contrast passes`, async ({ page }) => {
        await ready(page, path)
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
        expect(await contrast(page)).toEqual([])
      })
    }

    test('On stage with every past row shown: contrast and no horizontal scroll', async ({
      page,
    }) => {
      await ready(page, '/on-stage')
      const more = page.getByRole('button', { name: 'Show more past appearances' })
      await expect(async () => {
        if (await more.isVisible()) await more.click({ timeout: 1_000 })
        await expect(more).toBeHidden({ timeout: 500 })
      }).toPass({ timeout: 15_000 })
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
      expect(await contrast(page)).toEqual([])
    })

    test('social card dialog open: contrast and no horizontal scroll', async ({ page }) => {
      await ready(page, '/on-stage')
      await page
        .getByRole('button', { name: /^Social card for/ })
        .first()
        .click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
      expect(await contrast(page)).toEqual([])
    })
  })
}
