import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { parse } from 'yaml'

// Feature 003 (organiser feedback): layout, fit, organiser band. The a11y scan of every
// route lives in site.e2e.ts (ROUTES); here we add 003-specific states of those pages.

type TalkRow = { slug: string; title: string; hidden?: boolean; offered?: boolean }
const talks = parse(
  readFileSync(fileURLToPath(new URL('../content/talks.yaml', import.meta.url)), 'utf8')
) as TalkRow[]
const visible = talks.filter((t) => t.hidden !== true)
const longest = visible.reduce((a, b) => (b.title.length > a.title.length ? b : a))

const ready = async (page: Page, path: string) => {
  await page.goto(path)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

const bottom = async (el: ReturnType<Page['locator']>) => {
  await expect(el).toBeVisible()
  const box = await el.boundingBox()
  expect(box).not.toBeNull()
  return (box?.y ?? 0) + (box?.height ?? 0)
}

test.describe('talk page at 1280x800 (AC-5.1, AC-4.7)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test(`longest title (${longest.slug}): title, facts and invitation above y=800; aside beside abstract`, async ({
    page,
  }) => {
    await ready(page, `/talks/${longest.slug}`)
    const main = page.getByRole('main')
    expect(await bottom(main.getByRole('heading', { level: 1 }))).toBeLessThanOrEqual(800)
    expect(await bottom(main.getByText(/minutes|hour/i).first())).toBeLessThanOrEqual(800)
    const invite = main.getByRole('link', { name: 'Invite me with this talk' })
    expect(await bottom(invite)).toBeLessThanOrEqual(800)

    const aside = await main.getByRole('complementary').boundingBox()
    const abstract = await main.locator('#talk-abstract').boundingBox()
    expect(aside).not.toBeNull()
    expect(abstract).not.toBeNull()
    // Aside sits to the right of the abstract and they overlap vertically.
    expect(aside?.x ?? 0).toBeGreaterThan((abstract?.x ?? 0) + (abstract?.width ?? 0) - 1)
  })
})

test.describe('talk page at 375px (AC-4.7)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('aside is below the facts and above the abstract', async ({ page }) => {
    await ready(page, `/talks/${longest.slug}`)
    const main = page.getByRole('main')
    const facts = await main
      .locator('p', { hasText: /minutes|hour/i })
      .first()
      .boundingBox()
    const aside = await main.getByRole('complementary').boundingBox()
    const abstract = await main.locator('#talk-abstract').boundingBox()
    expect(facts && aside && abstract).toBeTruthy()
    expect(aside?.y ?? 0).toBeGreaterThanOrEqual((facts?.y ?? 0) + (facts?.height ?? 0) - 1)
    expect((aside?.y ?? 0) + (aside?.height ?? 0)).toBeLessThanOrEqual((abstract?.y ?? 0) + 1)
  })

  test('Home shows the photo, fully inside the viewport, with no horizontal scroll (AC-1.1, AC-1.2)', async ({
    page,
  }) => {
    await ready(page, '/')
    const photo = page.getByRole('main').getByRole('img').first()
    await expect(photo).toBeVisible()
    const box = await photo.boundingBox()
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0)
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(375)
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(sw).toBeLessThanOrEqual(375)
  })
})

test.describe('Talks list at 1280px (AC-5.3)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('every card title is at most two lines', async ({ page }) => {
    await ready(page, '/talks')
    const titles = page.getByRole('main').getByRole('heading', { level: 2 })
    expect(await titles.count()).toBeGreaterThan(0)
    const lines = await titles.evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el)
        return Math.round(el.getBoundingClientRect().height / parseFloat(s.lineHeight))
      })
    )
    for (const n of lines) expect(n).toBeLessThanOrEqual(2)
  })
})

// 005 AC-2.1 moved the Talks link below the upcoming list; the invite (email) stays in the fold.
test('Home at 1280x800: the email CTA ends within 800px (001 AC-2.3)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await ready(page, '/')
  const main = page.getByRole('main')
  expect(
    await bottom(main.getByRole('link', { name: /contact|email|mailto/i }).first())
  ).toBeLessThanOrEqual(800)
})

test('every page has a footer D and one D in the footer, all images have alt (AC-2.1, AC-2.4)', async ({
  page,
}) => {
  for (const path of ['/', '/profile', '/talks', '/on-stage', '/contact', '/no-such-page']) {
    await ready(page, path)
    // The footer D is decorative (alt=""): the WellD link next to it says what it is.
    await expect(page.locator('footer img')).toHaveCount(1)
    // AC-2.4: every image has an alt attribute (text, or empty for decorative).
    for (const img of await page.locator('img').all()) {
      expect(await img.getAttribute('alt')).not.toBeNull()
    }
  }
})

test.describe('For organisers band (AC-3.1 to AC-3.6)', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('language and length change the bio; Italian box has lang="it"', async ({ page }) => {
    await ready(page, '/profile')
    const band = page.getByRole('region', { name: 'For organisers' })
    await expect(band).toBeVisible()
    const bio = band.locator('#short-bio')
    await expect(band.getByRole('radio', { name: 'English' })).toBeChecked()
    await expect(band.getByRole('radio', { name: 'Short' })).toBeChecked()
    const enShort = await bio.innerText()
    await expect(bio).not.toHaveAttribute('lang', /.*/)

    await band.getByRole('radio', { name: 'Extended' }).check()
    await expect(band.getByRole('radio', { name: 'Extended' })).toBeChecked()
    const enExt = await bio.innerText()
    expect(enExt).not.toBe(enShort)
    expect(enExt.length).toBeGreaterThan(enShort.length)

    await band.getByRole('radio', { name: 'Italian' }).check()
    await expect(band.getByRole('radio', { name: 'Italian' })).toBeChecked()
    await expect(bio).toHaveAttribute('lang', 'it')
    const itExt = await bio.innerText()
    expect(itExt).not.toBe(enExt)

    await band.getByRole('radio', { name: 'Short' }).check()
    const itShort = await bio.innerText()
    expect(itShort).not.toBe(itExt)
    expect(itShort).not.toBe(enShort)
    await expect(bio).toHaveAttribute('lang', 'it')
  })

  test('Copy bio puts the shown text on the clipboard and shows the status', async ({ page }) => {
    await ready(page, '/profile')
    const band = page.getByRole('region', { name: 'For organisers' })
    await band.getByRole('radio', { name: 'Italian' }).check()
    const paragraphs = await band.locator('#short-bio p').allInnerTexts()
    await band.getByRole('button', { name: 'Copy bio' }).click()
    const status = band.getByRole('status')
    await expect(status).toHaveText('Bio copied to the clipboard.')
    await expect(status).toBeVisible()
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    expect(clip).toBe(paragraphs.join('\n\n'))
  })

  test('Download photo link is a JPG download named after the speaker (AC-3.4, AC-3.5)', async ({
    page,
  }) => {
    await ready(page, '/profile')
    const link = page.getByRole('link', { name: /Download photo/ })
    await expect(link).toHaveAttribute('download', 'michele-giacobazzi.jpg')
    await expect(link).toContainText(/JPG, \d+ × \d+ px/)
    const href = (await link.getAttribute('href')) ?? ''
    const res = await page.request.get(href)
    expect(res.ok()).toBe(true)
    expect(res.headers()['content-type']).toContain('image/jpeg')
  })

  test('axe: organiser band in Italian extended state has no violations', async ({ page }) => {
    await ready(page, '/profile')
    const band = page.getByRole('region', { name: 'For organisers' })
    await band.getByRole('radio', { name: 'Italian' }).check()
    await band.getByRole('radio', { name: 'Extended' }).check()
    await band.getByRole('button', { name: 'Copy bio' }).click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
})
