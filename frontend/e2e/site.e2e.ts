import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  ['Home', '/'],
  ['Profile', '/profile'],
  ['Talks', '/talks'],
  ['Talk detail', '/talks/from-kubernetes-to-kilowatts'],
  ['History', '/history'],
  ['Contact', '/contact'],
  ['404', '/no-such-page'],
  // AC-4.4: a hidden talk's address must be indistinguishable from an unknown one.
  ['Hidden talk', '/talks/what-the-aot-cache-actually-costs'],
] as const

// Wait until the lazy route has rendered its h1.
const ready = async (page: Page, path: string) => {
  await page.goto(path)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

test('hidden talk address renders Page not found (AC-4.4)', async ({ page }) => {
  await ready(page, '/talks/what-the-aot-cache-actually-costs')
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
})

test.describe('accessibility (WCAG 2.1 A/AA, incl. colour contrast)', () => {
  for (const [name, path] of ROUTES) {
    test(`${name} ${path}`, async ({ page }) => {
      await ready(page, path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }
})

test.describe('reflow at 375x812', () => {
  test.use({ viewport: { width: 375, height: 812 } })
  for (const [name, path] of ROUTES) {
    test(`${name} ${path}`, async ({ page }) => {
      await ready(page, path)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth).toBeLessThanOrEqual(375)
      const links = page.getByRole('navigation').first().getByRole('link')
      await expect(links).toHaveCount(5)
      for (const link of await links.all()) await expect(link).toBeVisible()
    })
  }
})

test.describe('above the fold at 1280x800', () => {
  test.use({ viewport: { width: 1280, height: 800 } })
  test('Home: Talks CTA and Contact path end within the fold', async ({ page }) => {
    await ready(page, '/')
    const main = page.getByRole('main')
    const cta = main.getByRole('link', { name: /talks/i }).first()
    const contact = main.getByRole('link', { name: /contact/i }).first()
    for (const el of [cta, contact]) {
      await expect(el).toBeVisible()
      const box = await el.boundingBox()
      expect(box).not.toBeNull()
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(800)
    }
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  for (const [name, path] of ROUTES) {
    test(`${name} ${path} has no running animations`, async ({ page }) => {
      await ready(page, path)
      const running = await page.evaluate(() =>
        document.getAnimations().map((a) => a.id || a.constructor.name)
      )
      expect(running).toEqual([])
    })
  }
})
