---
spec: 001
generated: 2026-11-19
synced: 2026-11-19
---

# Tasks: Site foundation: content, structure and visual identity

## Architecture notes
- **Components:** frontend only. Static SPA built by Vite; no runtime backend
  (`backend/` is untouched, per AGENTS.md). Routing: TanStack Router (stack default),
  code-based route tree, every page lazy-loaded. **No Mantine / Tailwind** (a deliberate
  deviation from the react-ts-vite default): the chosen identity is custom, so styling is
  CSS custom properties (tokens) + CSS Modules per component. ADR candidate: "Custom CSS
  tokens instead of Mantine/Tailwind for a branded static site".
- **Routes:** `/` Home, `/profile`, `/talks`, `/talks/$slug`, `/history`, `/contact`;
  anything else (including an unknown `$slug`) renders `NotFoundPage` (AC-2.2). Document
  title per route: `"<Page> | Michele Talks"`. On route change, focus moves to the page `h1`.
- **Content files** (owner-edited, YAML) in `frontend/content/`:
  - `profile.yaml`: `name`, `photo` (path under `frontend/content/media/`), `photoAlt`,
    `bioShort`, `bio` (string[] paragraphs), `topics` (string[] ≥1), `email`,
    `profiles` (`{ label, url }[]`).
  - `talks.yaml`: list of `{ slug (kebab, unique), title, summary, abstract (string[]),
    durationMinutes (int > 0), level: beginner|intermediate|advanced,
    format: talk|lightning|keynote|workshop|panel, languages: (en|it)[] ≥1, topics: string[],
    alsoGivenAs?: { title, language: en|it }[], hidden?: boolean (default false) }`.
    A hidden talk is dropped from the published content entirely (AC-4.4): not listed, not
    linkable, its `/talks/$slug` is Not found.
  - `appearances.yaml`: list of `{ id (kebab, unique), event, date (YYYY-MM-DD),
    city?, country?, online: boolean, language: en|it (exactly one), talk?: <talk slug>,
    sessionTitle?: string (title used at this event, when it differs), note?: string
    (public, one line), eventUrl?: url (event or session page),
    resources?: { type: slides|video, url, language: en|it }[] }`; either `online: true` or
    both `city` and `country`; `talk` must reference a talk that is not hidden.
  - Real content is already in these files (converted from the owner's export on
    2026-11-19, internal notes removed). Invalid-content cases live as test fixtures, not in
    `frontend/content/`.
- **Content contract:** `frontend/src/content/schema.ts` (zod) +
  `validateContent(raw): { ok: true, content } | { ok: false, errors: ContentError[] }`,
  where `ContentError = { file, item /* slug | id | "profile" */, field /* dotted path */,
  message }`. Cross-file rules: unique `slug`/`id`; `appearance.talk` must match a talk slug.
  `virtual:content` exposes only published content (hidden talks removed).
  A Vite plugin (`frontend/vite-plugins/content.ts`) reads the three YAML files, runs
  `validateContent`, and exposes typed data as `virtual:content`; on `{ ok: false }` it
  throws one error listing every `file › item › field: message`, so `vite build` and the
  dev server fail (AC-7.2). Type of `virtual:content` is `Content` from the schema.
- **Time:** "upcoming" = `appearance.date > today` in the **visitor's local date**, computed
  at render (`isUpcoming(dateIso, now = new Date())`), never at build time (AC-5.2).
  Past sorted newest first; upcoming soonest first.
- **i18n:** one English set composed in `frontend/src/i18n/en.ts` from namespaced string
  modules, each owned by one task so parallel tasks never edit the same file:
  `common` (`frontend/src/i18n/common.en.ts`: shell, nav, not found), `content`
  (`frontend/src/components/content/strings.en.ts`), and one per page
  (`frontend/src/features/<home|profile|contact|talks|history>/strings.en.ts`). T1 creates
  `en.ts` and all of these as empty typed stubs; `t('<namespace>.<key>', vars?)` is typed
  from the composed object.
  `react/jsx-no-literals` (eslint-plugin-react) is enabled for `src/**/*.tsx` except tests,
  so a hard-coded UI string fails `mise run frontend:lint` (AC-8.3). Content strings come
  from YAML and are not dictionary keys. Italian content elements get `lang="it"`.
- **Visual direction (design.md, chosen 3 Programme Board + D card):** tokens
  `--mint #E3F1E7`, `--ink #10281F`, `--signal #B43A08`, `--muted #3F5A4C`,
  `--white #FFFFFF`; Big Shoulders Display 900 (headings, uppercase), Public Sans (body),
  Space Mono (times, metadata, nav, labels); 8px spacing scale; focus ring 3px `--signal`.
  Fonts self-hosted via `@fontsource/*` (no CDN). D card: one official mascot PNG copied
  from `specs/001-site-foundation/sketches/welld-assets/mascot/` unmodified, teal or red
  variant per design.md "Chosen: D card".
- **Checks:** unit/component tests with Vitest + Testing Library (+ `vitest-axe` for
  structural a11y). Browser checks (contrast, 375px reflow, reduced motion, above-the-fold)
  with Playwright + `@axe-core/playwright` against `vite preview`, as `mise run frontend:e2e`.
- **Deferred:** e2e in CI (the shared quality workflow is centrally owned; e2e stays a local
  gate for now); hosting/deploy and SPA fallback config; pre-rendering/SEO; the talks graph;
  the Italian bio (kept out until the Italian UI exists); dark mode.

## Tasks

AC-1.1 and AC-1.2 were delivered and checked at the design stage (`sketches/`, design.md
"Comparison"); AC-1.4 is recorded in design.md and is implemented by T1 (tokens). No
further task is needed for AC-1.1/AC-1.2.

- [x] T1: [frontend] Add dependencies, design tokens, self-hosted fonts and the i18n set — refs: AC-1.4, AC-8.2, AC-8.3, AC-9.3 — deps: none
  - touch: `frontend/package.json`, `frontend/pnpm-lock.yaml`, `frontend/eslint.config.js`, `frontend/src/styles/*`, `frontend/src/i18n/*`, `frontend/src/components/content/strings.en.ts`, `frontend/src/features/*/strings.en.ts`, `frontend/src/main.tsx`, `frontend/index.html`
  - adds: `@tanstack/react-router`, `zod`, `yaml`, `@fontsource/big-shoulders-display`, `@fontsource/public-sans`, `@fontsource/space-mono`; dev: `eslint-plugin-react`, `vitest-axe`, `@playwright/test`, `@axe-core/playwright`
  - done when: `tokens.css` defines exactly the design.md palette/fonts/spacing; a global rule disables animation and transitions under `prefers-reduced-motion: reduce`; `t()` has a unit test (key lookup, variable interpolation, unknown key is a type error); a unit test runs ESLint's Node API with the project config on a `.tsx` snippet containing a JSX string literal and gets a `react/jsx-no-literals` error; `<html lang="en">`; `mise run frontend:build`, `frontend:lint`, `frontend:test` pass; `pnpm audit --prod` clean.

- [x] T2: [frontend] Content model, validation and publishing — refs: AC-7.1, AC-7.2, AC-5.1, AC-3.1, AC-4.4 — deps: T1
  - touch: `frontend/src/content/**`, `frontend/vite-plugins/*`, `frontend/vite.config.ts`, `frontend/vitest.config.ts`, `frontend/src/vite-env.d.ts`, `frontend/tsconfig.node.json`
  - done when: unit tests show `validateContent` returns an error naming file, item and field for each of: missing required field, unknown language, malformed date, appearance with `talk` pointing to a missing slug, duplicate slug, appearance with neither `online` nor city+country, appearance whose `talk` is hidden, malformed `eventUrl`; a plugin test loading an invalid fixture directory throws with that item and field in the message; a test shows hidden talks are absent from the published content; the real content in `frontend/content/` validates unchanged (adding a field it needs is drift: report it, don't edit content to fit); `mise run frontend:build` passes.

- [x] T3: [frontend] App shell, router, navigation and Not found — refs: AC-2.1, AC-2.2, AC-8.2 — deps: T1
  - touch: `frontend/src/App.tsx`, `frontend/src/app/*`, `frontend/src/components/layout/*`, `frontend/src/features/*/index.ts`, `frontend/src/features/*/*Page.tsx`, `frontend/src/features/not-found/*`, `frontend/src/i18n/common.en.ts`
  - creates a stub page per route (h1 only) so later tasks fill them; `SiteLayout` (skip link, `header`/`nav aria-label="Main"`/`main`/`footer` with WellD line + link), `MainNav` (5 links, `aria-current="page"`), `PageHeader`, per-route document title, focus-to-h1 on navigation.
  - done when: component tests render each route and assert the five nav links with the correct `href`s and exactly one `aria-current="page"`; an unknown path and `/talks/does-not-exist` render "Page not found" with a link to `/`; the skip link targets `main`; activating a nav link moves focus to the new page's `h1` and sets the document title to `"<Page> | Michele Talks"`; `vitest-axe` reports no violations on each route; lint (incl. no JSX literals) passes.

- [x] T4: [frontend] Shared content components and schedule logic — refs: AC-8.1, AC-5.2, AC-5.2b, AC-5.3, AC-5.5, AC-5.6, AC-5.7 — deps: T1, T2
  - touch: `frontend/src/components/content/*`, `frontend/src/lib/schedule*`
  - `LanguageBadge`, `ButtonLink` (primary/secondary), `TalkCard`, `AppearanceRow`, `ResourceLink` ("Slides (IT)"), `isUpcoming`, `splitAppearances(appearances, now)` → `{ upcoming (soonest first), past (newest first) }`.
  - done when: unit tests for `isUpcoming`/`splitAppearances` with a fixed `now` cover today (not upcoming), tomorrow (upcoming), ordering of both groups and the empty-upcoming case; component tests show every badge renders "EN"/"IT" text, Italian items carry `lang="it"`, a resource renders as a link labelled with type and language, an appearance with `talk` links to `/talks/<slug>`; `AppearanceRow` shows `sessionTitle` when present (next to the catalogue talk link), the `note` text, and `eventUrl` as a link; none of the three renders when absent.

- [x] T5: [frontend] Home page with Programme Board layout, D card and graph placeholder — refs: AC-2.3, AC-2.4, AC-1.3 — deps: T3, T4
  - touch: `frontend/src/features/home/*`, `frontend/src/components/graph-placeholder/*`, `frontend/src/assets/mascot/*`
  - done when: component test asserts the intro, a link to `/talks`, a Contact path (link to `/contact` and the `mailto:`), the "Next" list (≤3 upcoming, or "Recently" fallback with a fixed `now`), a labelled reserved graph region, and a D card image with alt text whose caption links to `https://www.welld.ch`; the scaffold `HomePage.test.tsx` is updated, not deleted.

- [x] T6: [frontend] Profile and Contact pages — refs: AC-3.1, AC-3.2, AC-6.1 — deps: T3, T4
  - touch: `frontend/src/features/profile/*`, `frontend/src/features/contact/*`, `frontend/src/components/profile-photo/*`
  - done when: component tests render from test fixtures and assert name (h1), photo with content alt text and fixed aspect ratio, all bio paragraphs, every topic, a "WellD" link to `https://www.welld.ch`; Contact shows the email as a `mailto:` link with the address as text and one text link per profile; the photo `onError` fallback shows the monogram.

- [ ] T7: [frontend] Talks catalogue and talk detail — refs: AC-4.1, AC-4.2, AC-4.3, AC-8.1 — deps: T3, T4
  - touch: `frontend/src/features/talks/*`
  - done when: component tests show every content talk with title (link), summary, duration written out ("45 minutes"), level, format and language badge(s); the detail of a talk with appearances on both sides of a fixed `now` shows full abstract, an upcoming group and a past group; "Also given as" lists each alternative title with its language badge (absent when there are none); a talk with no appearances shows neither group heading and "Not given in public yet."; zero talks shows the empty message with a Contact link.

- [ ] T8: [frontend] History page — refs: AC-5.1, AC-5.2, AC-5.2b, AC-5.3, AC-5.4, AC-5.5, AC-5.6, AC-5.7, AC-8.1 — deps: T3, T4
  - touch: `frontend/src/features/history/*`
  - done when: component tests with a fixed `now` show every appearance with event, `<time datetime>` date, "City, Country" or "Online", and one language badge; "Upcoming" (h2) above "Past" (h2), past newest first; no "Upcoming" heading when nothing is upcoming; resource links labelled with type and language; an appearance with `talk` links to its detail; no appearances shows "No appearances yet."

- [ ] T9: [frontend] Browser checks: accessibility, reflow, motion, above the fold — refs: AC-2.1, AC-2.3, AC-4.4, AC-9.1, AC-9.2, AC-9.3 — deps: T5, T6, T7, T8
  - touch: `frontend/e2e/*`, `frontend/playwright.config.ts`, `frontend/mise.toml`, `frontend/tsconfig.node.json`, `frontend/eslint.config.js`
  - done when: `mise run frontend:e2e` (Playwright against `vite preview`, Chromium) passes and checks, for every route plus a 404, one talk detail and the address of a hidden talk (must render Not found, AC-4.4): axe WCAG 2.1 A/AA has zero violations (incl. colour contrast); at 375×812 `document.documentElement.scrollWidth <= 375` and all five nav links are visible; at 1280×800 the Talks CTA and the Contact path on Home have `boundingBox().y + height <= 800`; with `reducedMotion: 'reduce'` no element has a running CSS animation (`document.getAnimations()` is empty).

- [ ] T11: [frontend] Separate the page headline from the document title; Home headline per design — refs: AC-1.5, AC-2.3 — deps: T5, T6
  - touch: `frontend/src/components/layout/PageHeader*`, `frontend/src/features/home/*`, `frontend/src/features/profile/*`, `frontend/src/app/App.test.tsx`
  - `PageHeader` takes an optional `documentTitle` (defaults to the h1 text). Home's h1 is the Programme Board headline "On the programme" (design.md, sketch 03) with document title "Michele Talks"; Profile keeps the speaker's name as h1 with document title "Profile | Michele Talks".
  - done when: tests assert Home h1 text "On the programme" and `document.title === "Michele Talks"`, Profile h1 is the speaker's name and `document.title === "Profile | Michele Talks"`; every other route's title stays `"<Page> | Michele Talks"`; focus-to-h1 tests still pass.

- [ ] T10: Owner review and close — refs: AC-1.5 — deps: T9, T11
  - touch: `specs/001-site-foundation/*`
  - done when: the owner has reviewed the running site against design.md "Chosen direction" and their confirmation is recorded in design.md (or the iteration requested is turned into tasks); `mise run build`, `mise run test`, `mise run lint`, `mise run frontend:e2e` all pass and CI is green on the PR; QE-light verdict PASS; spec status → done via `/wellforge:done`.

## Coverage

| AC | Tasks |
|---|---|
| AC-1.1, AC-1.2 | design stage (done) |
| AC-1.3 | T5 |
| AC-1.4 | design.md (recorded) + T1 |
| AC-1.5 | T10, T11 |
| AC-2.1 | T3, T9 |
| AC-2.2 | T3 |
| AC-2.3 | T5, T9 |
| AC-2.4 | T5 |
| AC-3.1 | T2, T6 |
| AC-3.2 | T6 |
| AC-4.1 | T7 |
| AC-4.2 | T7 |
| AC-4.3 | T7 |
| AC-4.4 | T2, T9 |
| AC-5.1 | T2, T8 |
| AC-5.2, AC-5.2b | T4, T8 |
| AC-5.3 | T4, T8 |
| AC-5.4 | T8 |
| AC-5.5, AC-5.6, AC-5.7 | T4, T8 |
| AC-6.1 | T6 |
| AC-7.1, AC-7.2 | T2 |
| AC-8.1 | T4, T7, T8 |
| AC-8.2 | T1, T3 |
| AC-8.3 | T1 |
| AC-9.1, AC-9.2 | T9 |
| AC-9.3 | T1, T9 |
