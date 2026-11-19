# Decisions — Site foundation: content, structure and visual identity

Choices the agents made that the spec, plan and tasks did not dictate. Disagree with one?
It is drift: amend the spec/plan and re-sync tasks — do not quietly edit the code.

## T1–T3 · frontend-dev · 2026-11-19
- default: `react/jsx-no-literals` set with `noStrings: true, ignoreProps: true` — why: it flagged `to`/`href` props, and AC-8.3 is about visible text — where: `frontend/eslint.config.js`
- default: fontsource CSS imported from `main.tsx` without the `.css` suffix, not via CSS `@import` — why: Vite cannot resolve the `@import` form given the packages' `exports` map — where: `frontend/src/main.tsx`
- assumption: the zod schema applies stricter validation than the notes spell out (kebab-case slug/id, http(s)-only URLs, real calendar dates, email format) — why: this is what the "malformed" cases need, and the real content passes it — where: `frontend/src/content/schema.ts`
- scope: the plugin also fails if the profile photo file is missing, and runs validation in `buildStart` — why: AC-7.2 says build and dev must fail on invalid content even when nothing imports it — where: `frontend/vite-plugins/content.ts`
- scope: edited `HomePage.tsx` and `home/strings.en.ts` outside T1's touch list — why: the new lint rule rejects the scaffold's hard-coded text — where: `frontend/src/features/home/`
- reinterpretation: `profile.photo` in `virtual:content` is the fingerprinted asset URL, not the YAML path — why: the app needs a URL it can render — where: `frontend/vite-plugins/content.ts`
- default: `vitest.config.ts` includes the content plugin through an `as unknown as Plugin` cast, with a comment — why: vitest 2 types against vite 5 and the project pins must not move — where: `frontend/vitest.config.ts`
- default: focus-to-h1 is owned by `PageHeader` and keyed on title change, with per-router state in a context — why: robust to lazy loading, back/forward and StrictMode, and no focus steal on first load — where: `frontend/src/components/layout/PageHeader.tsx`
- default: stub h1s reuse `common.nav.*` labels, and the stub talk-detail h1 is the talk title from content — why: no new strings until the page tasks — where: `frontend/src/features/*/*Page.tsx`
- default: footer line reads "Michele is CTO and co-founder of WellD" — why: matches the owner's bio; the tasks only said "WellD line + link" — where: `frontend/src/i18n/common.en.ts`
- default: the wordmark link to Home has `aria-current` forced off — why: the spec calls for exactly one current link, and it belongs to the nav — where: `frontend/src/components/layout/SiteLayout.tsx`
- default: the router is a code-based tree with a `createAppRouter({history})` factory — why: tests use memory history — where: `frontend/src/app/router.tsx`
- assumption: the T1 dev dependencies `vitest-axe`, `@playwright/test`, `@axe-core/playwright` and `eslint-plugin-react` are installed as the task lists them, but only `vitest-axe` and `eslint-plugin-react` are used so far — why: Playwright is T9 — where: `frontend/package.json`
- default: no `user-event` dependency added; tests use `fireEvent` — why: it is not in the T1 add list — where: `frontend/src/app/App.test.tsx`

## T4–T6 · frontend-dev · 2026-11-19
- default: `ButtonLink` takes either `to` (typed internal route) or `href` (external/mailto), always renders a real link, with primary/secondary variants only — why: the router is typed and the NOW row needs a white button, which I did with a descendant CSS override instead of a third variant — where: `components/content/ButtonLink.tsx`, `features/home/HomePage.module.css`
- default: `AppearanceRow` renders an `li` (caller supplies the `ul`) and takes an optional `talkTitle`, falling back to `sessionTitle` then `event` — why: it keeps the component free of content imports so fixtures work — where: `components/content/AppearanceRow.tsx`
- default: `lang="it"` goes on the whole Italian row and on Italian-only `TalkCard`s, with English reset on UI parts (badge, resource links, place, meta line) — why: AC-8.1 needs Italian items to carry `lang="it"` without mislabelling interface text — where: `AppearanceRow.tsx`, `TalkCard.tsx`, `LanguageBadge.tsx`, `ResourceLink.tsx`
- default: `ResourceLink` shows "Slides (IT)" with `aria-label="Slides (IT), Italian"` and `hrefLang` — why: design asks for the language spelled out, and the label still contains the visible text — where: `components/content/ResourceLink.tsx`
- default: `isUpcoming` compares ISO date strings against the visitor's local date — why: it is lexicographically correct and matches the "visitor's local date" rule — where: `lib/schedule.ts`
- default: appearance shows "City, Country" whenever both exist, otherwise "Online" — why: the schema allows `online: true` plus a city, and a physical place is more informative — where: `AppearanceRow.tsx`
- default: `TalkCard` is an `article` with an h2, and the title is its only link — why: matches the design's a11y notes — where: `TalkCard.tsx`
- reinterpretation: the Home "time" column holds mono labels (Speaker / NOW / Invite / Next / Later) instead of the sketch's fake clock times — why: fake times would be meaningless content — where: `features/home/strings.en.ts`
- default: the D card lives in the intro row's right column, at most 192px wide — why: it needs to share the first fold with the CTAs, and teal does not compete with the orange NOW row — where: `HomePage.tsx`, `HomePage.module.css`
- default: the Home teaser shows up to 3 upcoming appearances, else "Recently" with the 3 latest past ones, else no section — why: design empty-state rule, extended to the no-appearances case — where: `HomePage.tsx`
- default: HomePage added a "Full history" secondary link to `/history` and shows the talk count in the NOW row ("{count} talks…") — why: the teaser would otherwise be a dead end — where: `features/home/`
- default: `HomeView`/`ProfileView`/`ContactView` hold the props-based component and the routed `*Page` wraps them — why: router typing under `exactOptionalPropertyTypes`, and testability with fixtures — where: `features/{home,profile,contact}`
- default: `GraphPlaceholder` is a `section` with an `aria-label` (a plain labelled region), not `role="img"` — why: design says to replace the sketch's `role="img"` — where: `components/graph-placeholder/GraphPlaceholder.tsx`
- scope: `components/content/test-utils.tsx` (`renderWithRouter`) is exported and reused by later tasks — why: `Link` needs a router in every component test — where: `components/content/test-utils.tsx`
- default: the ProfilePhoto box is 4:5 with `data-aspect="4/5"`, and its fallback is a monogram (first and last initials) with `role="img"` and the alt text as its name — why: the design asks for a reserved ratio and the alt-over-monogram fallback — where: `components/profile-photo/`
- default: the Profile page has a closing WellD sentence in addition to the footer one, plus "Browse the talks" and "Get in touch" CTAs — why: AC-3.2 and the design's closing-links note — where: `features/profile/strings.en.ts`
- assumption: the Contact page has a short intro line ("Write to invite the speaker…") and the email set large in the display font — why: the design only lists elements, and a lone email read as empty — where: `features/contact/`
- scope: the Profile h1 is the speaker's name rather than "Profile", which changes its document title — why: T6's done-when says name (h1) and `PageHeader` is outside its `touch:` list — where: `features/profile/ProfilePage.tsx` (resolved by T11)

## T7, T8, T11 · frontend-dev · 2026-11-20
- scope: edited `frontend/src/app/TalkDetailRoute.tsx` (outside T7's touch list) to pass `slug` rather than `title` — why: the detail view needs the whole talk and its appearances, and `title` alone could not identify a talk — where: `app/TalkDetailRoute.tsx`
- default: `TalksView`, `TalkDetailView` and `HistoryView` take content as props with an optional `now`, and `*Page` wraps them over `virtual:content` — why: same pattern as T5/T6, makes fixtures and a fixed `now` possible — where: `features/talks`, `features/history`
- default: talk detail shows meta (duration, level, format, badges), "Abstract", optional "Also given as", then "Upcoming" and "Past" h2 groups (only those with entries), then "Not given in public yet." or a "All talks" back link — why: design.md and AC-4.2/4.3 — where: `features/talks/TalkDetailPage.tsx`
- default: "Also given as" items put the title in `lang` of its own language, next to a `LanguageBadge` — why: AC-4.3 and the Italian `lang` rule — where: `TalkDetailPage.tsx`
- default: talk-detail appearance rows reuse `AppearanceRow` unchanged, so each shows a link to the same talk — why: `components/content` is out of scope — where: `TalkDetailPage.tsx`
- default: the empty Talks message reads "No talks listed yet. Check back soon, or get in touch." with "get in touch" as the Contact link — why: design.md wording, with the link on the phrase — where: `features/talks/strings.en.ts`
- default: History and the talk detail use the Home board's heavy rules and mono h2 headings, with `AppearanceRow` as the board row — why: the "reuse the board's row grid" brief — where: `*.module.css`
- reinterpretation: `PageHeader.documentTitle` is the full title (not the page part), and the focus-to-h1 tracker keys on it — why: Home's title is the bare site name, and the h1 is no longer unique per route — where: `components/layout/PageHeader.tsx`
- assumption: Home headline text is a new `home.headline` string rather than reusing a `common` key — why: it is page copy from design.md/sketch 03 — where: `features/home/strings.en.ts`

## T9 · frontend-dev · 2026-11-20
- scope: added a `frontend:e2e` task to the ROOT `mise.toml`, outside the touch list — why: the done-when command `mise run frontend:e2e` does not resolve without it, because root mise only sees subdirectory tasks through delegation entries — where: `mise.toml`
- default: e2e files are named `*.e2e.ts`, and the Playwright `testMatch` is `**/*.e2e.ts` — why: keeps them out of Vitest's default include without editing `vitest.config.ts` — where: `frontend/playwright.config.ts`
- default: preview port 4179 with `--strictPort` and `reuseExistingServer: false` — why: avoids clashing with dev (5173) and vite's default preview port (4173), and guarantees the tests hit the fresh build — where: `frontend/playwright.config.ts`
- assumption: the 404 path is `/no-such-page`, and the 404, hidden-talk and talk-detail routes get the same axe, reflow and motion checks as the main routes — why: the brief asked for every route plus a 404 — where: `frontend/e2e/site.e2e.ts`
- default: added `"DOM"` to `lib` in `tsconfig.node.json` so `document` typechecks inside `page.evaluate` — why: the node config only had ES2023 — where: `frontend/tsconfig.node.json`
- assumption: the "Contact path" on Home is the first link in `<main>` whose name matches /contact/i — why: no more specific hook was inspected — where: `frontend/e2e/site.e2e.ts`
