---
spec: 005
generated: 2026-11-22
synced: 2026-11-22
---

# Tasks: Sticker Sheet look, designer feedback and stage material

The visual reference is spike 004 (`spike/004-sticker-sheet`, `frontend/src/styles/sticker.css`
and `tokens.css` there, findings in `specs/004-sticker-sheet-reskin/brief.md`). Read it; do not
merge or cherry-pick that branch — its stylesheet is an override layer the spec rules out.

## Architecture notes
- Components touched: `tokens.css`, `global.css`, `main.tsx` (fonts); every `*.module.css` under
  `frontend/src/components/` and `frontend/src/features/`; `HomePage`, `TalkAside`,
  `ContactPage`, `HistoryPage` (the On stage page; module name unchanged), `AppearanceRow`,
  `SiteLayout`, `PageHeader`, `OrganisersSection`, `TalksPage`; content schema + Vite content
  plugin; NEW `CardViewer` (`frontend/src/components/content/`), NEW `StagePhoto`
  (`frontend/src/components/stage-photo/`).
- Look (T1–T3): tokens from the spike verbatim (`--mint #ffd93b`, `--ink #16110f`,
  `--signal #0b7a72`, `--muted #4a3f00`, `--pink #ff5c93`, `--radius 18px`,
  `--shadow-hard 5px 5px 0 var(--ink)`, `--focus-ring 4px solid var(--ink)`; display
  'Dela Gothic One', body 'Figtree' 400/600/800 via Fontsource; Big Shoulders / Public Sans
  removed from `package.json`). Each spike rule moves into the module of the component it
  styled. **No** `sticker.css`, **no** `[class*='_x_']` selectors, **no** `!important`, **no**
  `:has()` page-scoping hacks: a page-specific layout is written in that page's module.
- Contract — sticky invite (T4): at `min-width: 861px` Home's invite block and `TalkAside` use
  `position: sticky; top: var(--space-3)` inside a grid column that spans the page content;
  below 861px they are `position: static`. Desktop: left column intro (bio + photo) → upcoming
  list → "Browse the talks" link; right column the invite. Mobile (≤860px), one column:
  intro → upcoming → invite → "Browse the talks" (AC-2.3: the invite right after upcoming).
  The graph placeholder stays last on both.
- Contract — progressive loading (T6): `PAGE_SIZE = 5`. State `shown` starts at 5. A sentinel
  element after the last shown past row is observed with `IntersectionObserver`
  (`rootMargin: '200px'`); on intersect `shown = min(shown + 5, total)`. A
  `<button>` "Show more past appearances" is always rendered while `shown < total`; activating it
  does the same and moves focus to the first newly shown row. A polite live region announces
  `t('history.shown', { shown, total })` ("Showing 10 of 14 past appearances"). With no
  `IntersectionObserver` (jsdom, old browsers) the button alone works. When `shown === total`:
  no button, no sentinel, and the easter-egg line renders: `<p>` with a link
  `href="http://batteri.altervista.org" target="_blank" rel="noopener noreferrer"`, text from
  strings (`history.easterEgg`), using normal link colour at the small-text size.
- Contract — social cards (T8, T9): `appearanceSchema` gains
  `cards: z.array(z.object({ src: nonEmpty, alt: nonEmpty.optional() })).min(1).optional()`;
  `src` is relative to `frontend/content/` like `profile.photo`. The plugin fails the build with
  `{ file: 'appearances.yaml', item: <id>, field: 'cards', message: 'no file at <src> (relative
  to the content folder)' }` when a file is missing, and imports each card so Vite fingerprints
  it; the app sees `cards: { url: string; alt: string }[]`, `alt` defaulting to
  `t('content.card.alt', { event })` ("Social card for <event>"). Card files are WebP, ≤ 800px
  on the long side, ≤ 150 KB, under `frontend/content/media/cards/<appearance-id>-<n>.webp`.
- Contract — CardViewer (T9): `AppearanceRow` renders the first card as a 64px-high thumbnail
  `<button>` (accessible name = card alt) when `cards` is present, nothing otherwise. Activating
  it opens a native `<dialog>` via `showModal()` showing the card at up to 90vw/90vh, with a
  visible "Close" button, previous/next buttons when there are ≥2 cards, Escape closes, focus
  returns to the thumbnail. Shown wherever `AppearanceRow` renders (On stage, Home, talk page).
- Contract — stage photos and logo (T10): `PageHeader`'s `mascot` prop is renamed `image`.
  NEW `StagePhoto({ src, alt, credit? })` renders the photo with an optional visible
  `credit` caption. Photos live in `frontend/src/assets/stage/` as WebP ≤ 300 KB, ≤ 1600px:
  Talks — DevFest Milano 2026 (`DSC06263`); On stage — Cloud Day 2026 on stage
  (`1795016111069`); Contact — Codemotion 2026 portrait (`0440-A2200643`); sources are in the
  owner's pics.zip (session scratchpad `pics-zip2/pics/`). Footer: the white WellD logo SVG
  (`welld_logo_primary_white_rgb.svg` from the WellD brand assets) copied to
  `frontend/src/assets/welld/`, as `<img alt="WellD">` inside the existing WellD link. `Mascot`
  stays only on Not found; unused mascot PNGs are deleted.
- Data model: content only — 2 new appearances (T7), optional `cards` on appearances (T8). No
  backend.
- Deferred: per-page link-preview images (non-goal); credit text for each photo until the owner
  gives it (AC-5.6 is a release review, recorded by T12).

- [x] T1: Sticker Sheet tokens and fonts — refs: US-1, AC-1.1, AC-1.3 — deps: none
  - touch: `frontend/src/styles/tokens.css`, `frontend/src/styles/global.css`, `frontend/src/main.tsx`, `frontend/src/styles/styles.test.ts`, `frontend/package.json`, `frontend/pnpm-lock.yaml`
  - done when: `styles.test.ts` asserts the Sticker Sheet palette and fonts and passes; `pnpm build` succeeds with no Big Shoulders / Public Sans package left.
- [x] T2: Sticker styles in the shared components — refs: US-1, AC-1.1, AC-1.2, AC-1.4 — deps: T1
  - touch: `frontend/src/components/**/*.module.css`, `frontend/src/components/content/button-class.ts`
  - done when: cards, rows, buttons, nav, header, footer and tags look as in the spike at 375px and 1280px (screenshots in the PR); grep finds no `!important` or `[class*=` in `frontend/src`; lint and unit tests pass.
- [x] T3: Sticker styles in the feature pages — refs: US-1, AC-1.1, AC-1.2, AC-1.4 — deps: T2
  - touch: `frontend/src/features/**/*.module.css`
  - done when: Profile, Talks, talk page, On stage and Not found match the spike at 375px and 1280px with no Programme Board border lines (screenshots in the PR); lint and unit tests pass.
- [x] T4: Home layout and sticky invite — refs: US-2, AC-2.1, AC-2.2, AC-2.3, AC-2.4 — deps: T3
  - touch: `frontend/src/features/home/HomePage.tsx`, `frontend/src/features/home/HomePage.module.css`, `frontend/src/features/home/strings.en.ts`, `frontend/src/features/home/HomePage.test.tsx`, `frontend/src/features/talks/TalkAside.module.css`
  - done when: unit test checks the left-column order (intro → upcoming → browse link) and invite placement; an e2e test scrolls Home and a talk page to the bottom at 1280px and asserts the invite is in the viewport, and at 375px asserts it is not fixed.
- [x] T5: Contacts in one row — refs: US-3, AC-3.1, AC-3.2 — deps: T3
  - touch: `frontend/src/features/contact/ContactPage.tsx`, `frontend/src/features/contact/ContactPage.module.css`, `frontend/src/features/contact/ContactPage.test.tsx`
  - done when: an e2e test at 1280px asserts email and every profile link share one row (same top offset ±4px), and at 375px asserts no horizontal scroll and unchanged order.
- [x] T6: On stage progressive loading and easter egg — refs: US-4, US-6, AC-4.1, AC-4.2, AC-4.3, AC-4.4, AC-4.5, AC-6.1, AC-6.2 — deps: T3
  - touch: `frontend/src/features/history/HistoryPage.tsx`, `frontend/src/features/history/HistoryPage.module.css`, `frontend/src/features/history/strings.en.ts`, `frontend/src/features/history/history.test.tsx`
  - done when: unit tests cover first 5, "Show more" loading the next 5 with the live-region text, focus on the first new row, no button and the easter-egg link (URL, new tab, rel) once all are shown; an e2e test scrolls to the end and sees all past rows plus the link; axe passes on the page.
- [x] T7: Add the Coffeetech and Crafted Software meetups — refs: US-8, AC-8.1, AC-8.2 — deps: none
  - touch: `frontend/content/appearances.yaml`
  - done when: content validation passes; a unit/e2e check finds both appearances with the date, city, language, session title, note and co-host/talk link the ACs state, and Coffeetech has no talk link.
- [x] T8: Social cards in content — refs: US-7, AC-7.5 — deps: T7
  - touch: `frontend/src/content/schema.ts`, `frontend/src/content/validate.test.ts`, `frontend/src/content/__fixtures__/**`, `frontend/vite-plugins/content.ts`, `frontend/src/vite-env.d.ts`, `frontend/src/components/content/types.ts`, `frontend/content/appearances.yaml`, `frontend/content/media/cards/*`
  - done when: a fixture with a missing card file fails validation with the contract's error; every card listed in AC-7.5 is converted (WebP ≤ 150 KB, ≤ 800px) and attached to its appearance; `pnpm build` succeeds.
- [x] T9: Card thumbnails and full-size viewer — refs: US-7, AC-7.1, AC-7.2, AC-7.3, AC-7.4 — deps: T2, T8
  - touch: `frontend/src/components/content/AppearanceRow.tsx`, `frontend/src/components/content/AppearanceRow.module.css`, `frontend/src/components/content/CardViewer.*`, `frontend/src/components/content/index.ts`, `frontend/src/components/content/strings.en.ts`, `frontend/src/components/content/*.test.tsx`
  - done when: unit tests cover thumbnail with alt, no thumbnail without cards, dialog open/close by button and Escape with focus return, and previous/next with 2 cards; axe passes with the dialog open.
- [ ] T10: WellD logo and stage photos instead of D — refs: US-5, AC-5.1, AC-5.2, AC-5.3, AC-5.4, AC-5.5 — deps: T4, T5, T6
  - touch: `frontend/src/components/layout/SiteLayout.tsx`, `frontend/src/components/layout/SiteLayout.module.css`, `frontend/src/components/layout/PageHeader.tsx`, `frontend/src/components/layout/PageHeader.module.css`, `frontend/src/components/layout/layout.test.tsx`, `frontend/src/components/stage-photo/**`, `frontend/src/components/mascot/**`, `frontend/src/assets/stage/*`, `frontend/src/assets/welld/*`, `frontend/src/assets/mascot/*`, `frontend/src/features/talks/TalksPage.tsx`, `frontend/src/features/talks/TalksPage.test.tsx`, `frontend/src/features/history/HistoryPage.tsx`, `frontend/src/features/history/history.test.tsx`, `frontend/src/features/contact/ContactPage.tsx`, `frontend/src/features/contact/ContactPage.test.tsx`, `frontend/src/features/home/HomePage.tsx`, `frontend/src/features/home/HomePage.test.tsx`, `frontend/src/features/profile/OrganisersSection.tsx`, `frontend/src/features/profile/OrganisersSection.module.css`, `frontend/src/features/profile/ProfilePage.test.tsx`, `frontend/src/i18n/common.en.ts`
  - done when: unit tests assert the footer logo (alt "WellD", inside the WellD link), a stage photo with alt on Talks/On stage/Contact, D on Not found and no Mascot elsewhere; every file in `assets/stage/` is ≤ 300 KB; lint, unit and build pass.
- [ ] T11: End-to-end and accessibility sweep — refs: AC-1.2, AC-1.3, AC-1.4, AC-2.2, AC-4.2, AC-7.2 — deps: T9, T10
  - touch: `frontend/e2e/*.e2e.ts`
  - done when: e2e covers every page at 375px and 1280px with no horizontal scroll, and an axe colour-contrast audit (`@axe-core/playwright`) passes on every page; `mise run frontend:e2e` is green.
- [ ] T12: All gates green, spec status → done — refs: all — deps: T11
  - touch: `specs/005-sticker-sheet-adoption/*`, `.forge/runs/*`
  - done when: lint (0 warnings), unit, e2e, build and the security floor pass in CI; the owner has confirmed the rights and credits of the three stage photos (AC-5.6), recorded in `qe-report.md`; QE-light PASS; `/wellforge:done 005` closes it.
