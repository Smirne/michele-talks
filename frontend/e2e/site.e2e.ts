import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  ['Home', '/'],
  ['Profile', '/profile'],
  ['Talks', '/talks'],
  ['Talk detail', '/talks/from-kubernetes-to-kilowatts'],
  ['Workshop detail', '/talks/lego4scrum'],
  ['No longer offered', '/talks/repetition-is-bad'],
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

test.describe('talk content update (002)', () => {
  test('/talks/flex-your-energy renders Page not found (AC-1.4)', async ({ page }) => {
    await ready(page, '/talks/flex-your-energy')
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  })

  test('the Talks page lists Kilowatts once and not Flex your Energy as its own talk (AC-1.1)', async ({
    page,
  }) => {
    await ready(page, '/talks')
    await expect(page.getByRole('link', { name: /^From Kubernetes to Kilowatts/ })).toHaveCount(1)
    await expect(page.getByRole('link', { name: /^Flex your Energy/ })).toHaveCount(0)
    await expect(
      page.getByRole('link', { name: 'Repetition is Bad, Repetition is Bad' })
    ).toHaveCount(0)
  })

  test('the Kilowatts page shows the note, level range and the Flex your Energy title', async ({
    page,
  }) => {
    await ready(page, '/talks/from-kubernetes-to-kilowatts')
    await expect(page.getByText(/Length and technical depth adapt to the event/)).toBeVisible()
    await expect(page.getByText('Beginner–Intermediate')).toBeVisible()
    const also = page
      .getByRole('heading', { name: 'Also given as' })
      .locator('xpath=following-sibling::ul[1]')
    await expect(
      also.getByText(
        'Flex your Energy: Building a Cloud-Native Platform for Renewable Energy Communities'
      )
    ).toBeVisible()
  })

  test('the Lego4Scrum page shows the duration range, co-host and related link', async ({
    page,
  }) => {
    await ready(page, '/talks/lego4scrum')
    await expect(page.getByText('6–8 hours')).toBeVisible()
    await expect(page.getByText('With Matteo Codogno').first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Lego4Scrum training at WellD' })).toHaveAttribute(
      'href',
      'https://welld.ch/services/training/lego4scrum'
    )
  })

  test('History lists both Voxxed Days Ticino rows; 2015 links to a page saying No longer offered', async ({
    page,
  }) => {
    await ready(page, '/history')
    await expect(page.getByText('Voxxed Days Ticino 2015', { exact: true })).toBeVisible()
    await expect(page.getByText('Voxxed Days Ticino 2025 workshop day')).toBeVisible()
    await page.getByRole('link', { name: 'Repetition is Bad, Repetition is Bad' }).click()
    await expect(
      page.getByRole('heading', { level: 1, name: 'Repetition is Bad, Repetition is Bad' })
    ).toBeVisible()
    await expect(page.getByText('No longer offered')).toBeVisible()
  })
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
