import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// Feature 005: sticky invite (T4), contacts in one row (T5), On stage progressive loading (T6).

const ready = async (page: Page, path: string) => {
  await page.goto(path)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

const inViewport = async (page: Page, el: ReturnType<Page['locator']>) => {
  const box = await el.boundingBox()
  const vh = page.viewportSize()?.height ?? 0
  expect(box).not.toBeNull()
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0)
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(vh)
}

const position = (el: ReturnType<Page['locator']>) =>
  el.evaluate((node) => getComputedStyle(node).position)

const noHorizontalScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)

const scrollToBottom = (page: Page) =>
  page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  })

const talkPath = '/talks/from-kubernetes-to-kilowatts'

test.describe('invite at 1280px (AC-2.2, AC-2.4)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Home: the invite stays in the viewport at the bottom of the page', async ({ page }) => {
    await ready(page, '/')
    const invite = page.getByRole('heading', { name: 'Invite me to speak' }).locator('xpath=..')
    await scrollToBottom(page)
    await expect
      .poll(() =>
        inViewport(page, invite).then(
          () => true,
          () => false
        )
      )
      .toBe(true)
  })

  test('talk page: the invite stays in the viewport at the bottom of the page', async ({
    page,
  }) => {
    await ready(page, talkPath)
    const invite = page.getByRole('link', { name: 'Invite me with this talk' })
    await scrollToBottom(page)
    await expect
      .poll(() =>
        inViewport(page, invite).then(
          () => true,
          () => false
        )
      )
      .toBe(true)
  })
})

test.describe('invite at 375px (AC-2.3, AC-2.4)', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('Home: the invite is not fixed or sticky and follows the upcoming list', async ({
    page,
  }) => {
    await ready(page, '/')
    const invite = page
      .getByRole('heading', { name: 'Invite me to speak' })
      .locator('xpath=ancestor::section[1]')
    expect(await position(invite)).toBe('static')
    const next = page.getByRole('region', { name: /^(Next|Recently)$/ })
    const [nb, ib] = [await next.boundingBox(), await invite.boundingBox()]
    expect(ib?.y ?? 0).toBeGreaterThan((nb?.y ?? 0) + (nb?.height ?? 0) - 1)
  })

  test('talk page: the invite is not fixed or sticky', async ({ page }) => {
    await ready(page, talkPath)
    const link = page.getByRole('link', { name: 'Invite me with this talk' })
    const aside = link.locator('xpath=ancestor::*[contains(@class,"aside")][1]')
    expect(await position(aside)).toBe('static')
  })
})

test.describe('Contact (AC-3.1, AC-3.2)', () => {
  test('at 1280px the email is one box and the profile links share one row in another', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await ready(page, '/contact')
    await expect(page.getByRole('region', { name: 'Email' }).getByRole('link')).toHaveAttribute(
      'href',
      /^mailto:/
    )
    const items = page.getByRole('list', { name: 'Elsewhere online' }).getByRole('listitem')
    expect(await items.count()).toBeGreaterThan(1)
    const tops = await items.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top))
    for (const top of tops) expect(Math.abs(top - (tops[0] ?? 0))).toBeLessThanOrEqual(4)
  })

  test('at 375px nothing scrolls sideways', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await ready(page, '/contact')
    expect(await noHorizontalScroll(page)).toBe(true)
    const hrefs = await page
      .getByRole('list', { name: 'Elsewhere online' })
      .getByRole('link')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''))
    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.every((h) => h.startsWith('http'))).toBe(true)
  })
})

test.describe('On stage progressive loading (AC-4.x, AC-6.1)', () => {
  test('scrolling to the end loads every past appearance and shows the easter egg', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await ready(page, '/on-stage')
    const egg = page.getByRole('link', { name: /Before 2015/ })
    const button = page.getByRole('button', { name: 'Show more past appearances' })
    await expect(button).toBeVisible()
    for (let i = 0; i < 20 && !(await egg.isVisible()); i++) {
      await scrollToBottom(page)
      await page.waitForTimeout(150)
    }
    await expect(egg).toBeVisible()
    await expect(button).toHaveCount(0)
    await expect(egg).toHaveAttribute('href', 'http://batteri.altervista.org')
    await expect(egg).toHaveAttribute('target', '_blank')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})
