# QE report: 001 site-foundation

## QE verdict: PASS (advisory mode, rigor mvp; coverage advisory)   (measured at d1ff387)

Scope: T1-T9, T11. Out of scope: T10 and AC-1.5 (owner), AC-1.1/1.2 (delivered at design). No check was blocked. This pass added no code (nothing to fix or test beyond what exists), so the gate numbers are for the handed-over commit.

## Gates
| Check | Threshold | Actual | Result |
|---|---|---|---|
| Lint (`pnpm lint`, max-warnings 0, incl. jsx-no-literals) | 0 findings | 0 | ✓ |
| Typecheck (`pnpm typecheck`) | 0 errors | 0 | ✓ |
| Unit/component tests (`pnpm test --run`) | all pass | 126/126, 14 files | ✓ |
| Build (`pnpm build`) | passes | passes | ✓ |
| Dependency audit (`pnpm audit --prod`) | no critical | no known vulnerabilities | ✓ |
| Browser checks (`mise run frontend:e2e`) | all pass | 26/26 (chromium) | ✓ |
| Secret scan (gitleaks, `main..HEAD` 18 commits, plus working tree `--no-git`) | 0 leaks | 0 leaks | ✓ |
| SAST-high | 0 | no SAST tool configured; none ran | not run (see Notes) |
| Line coverage | production floor 80% | 87.92% lines, 88.99% branch, 90.47% funcs, 87.92% stmts | ADVISORY (above floor; no gap) |

Coverage note: the 0% rows are `playwright.config.ts`, `e2e/site.e2e.ts`, `App.tsx`, `main.tsx` and the type-only `types.ts`; these are config, entry points and e2e files that unit tests do not execute. `vite-plugins/content.ts` is 80.59% (lines 39-41, 75-85 uncovered).

## AC verification
| AC | Evidence | Result |
|---|---|---|
| AC-1.3 | HomePage.test (D card with alt text, caption links to welld.ch); browser: img "D, the WellD mascot, holding a magnifying glass" with "WellD" link to https://www.welld.ch | ✓ |
| AC-1.4 | design.md records the chosen direction; `styles.test.ts` covers tokens | ✓ |
| AC-2.1 | App.test (5 links, hrefs, one aria-current); e2e nav visible; browser: Home/Profile/Talks/History/Contact each open the matching page | ✓ |
| AC-2.2 | App.test (unknown path, `/talks/does-not-exist`); browser: `/talks/nope` shows h1 "Page not found" | ✓ |
| AC-2.3 | HomePage.test (intro, `/talks` link, contact link + mailto); e2e above-the-fold 1280x800 | ✓ |
| AC-2.4 | HomePage.test; browser: region "Reserved area for the future talks graph" | ✓ |
| AC-3.1 | ProfilePage.test; browser: name, photo (alt "Portrait of Michele Giacobazzi", 800px natural width), bio paragraphs, 6 topics | ✓ |
| AC-3.2 | ProfilePage.test; browser: WellD link in text and footer to https://www.welld.ch | ✓ |
| AC-4.1 | talks.test; browser `/talks`: 5 talks, each with title, summary, "35 minutes", level, format, EN/IT badges | ✓ |
| AC-4.2 | talks.test (upcoming and past groups, shown only when non-empty); browser detail shows Abstract and Past group | ✓ |
| AC-4.3 | talks.test; browser: "Also given as" lists 6 titles, each with an IT/EN badge | ✓ |
| AC-4.4 | validate/plugin tests (hidden removed); e2e hidden address renders "Page not found"; browser: both hidden slugs absent from Home, Talks and History (9 `/talks` links on History, none hidden); `grep` of `dist/` finds neither hidden title nor slug | ✓ |
| AC-5.1 | history.test; browser: event, date, "City, Country", one badge on every row | ✓ |
| AC-5.2 / 5.2b | schedule.test (today is not upcoming, tomorrow is, ordering, empty) and history.test with fixed `now`; browser: "Upcoming" above "Past", past newest first. The site is built from fixed data and upcoming is computed at render | ✓ |
| AC-5.3 | content.test, history.test; browser: "Slides (IT)", "Video (EN)" | ✓ |
| AC-5.4 | history.test (link to `/talks/<slug>`); browser: History rows link to talk details | ✓ |
| AC-5.5 | content.test, history.test; browser: "Presented as ..." shown on rows | ✓ |
| AC-5.6 | content.test, history.test; browser: notes visible, e.g. "Facilitator of a working table." | ✓ |
| AC-5.7 | content.test, history.test; browser: "Event page" link on rows | ✓ |
| AC-6.1 | ContactPage.test; browser: mailto email as link text plus 8 profile links | ✓ |
| AC-7.1 | plugin reads YAML at build; `content.test.ts` "validates unchanged" and "omits hidden"; the rendering pages are data-driven (verified live: content in YAML renders with no page edit) | ✓ (indirect: there is no single test that adds a new item and asserts it renders) |
| AC-7.2 | validate.test (8 error cases, file/item/field) and plugin test (invalid fixture dir throws; fails at start even if nothing imports it) | ✓ |
| AC-8.1 | content.test, talks.test, history.test; browser: badges on talks, appearances and resources; 7 `lang="it"` elements on History | ✓ |
| AC-8.2 | all rendered text English (browser walk of every page) | ✓ |
| AC-8.3 | `i18n/lint.test.ts` (ESLint API flags a JSX literal), `t.test.ts`; `pnpm lint` clean with `react/jsx-no-literals` | ✓ |
| AC-9.1 | e2e reflow at 375x812 on all 8 routes (scrollWidth <= 375, 5 nav links visible); browser: scrollWidth 360 at 375 on History, Talks, Talk detail, Profile, Contact | ✓ |
| AC-9.2 | e2e axe WCAG 2.1 A/AA with 0 violations on all 8 routes | ✓ |
| AC-9.3 | e2e `getAnimations()` empty on all 8 routes under reduce. Check is not vacuous: Home has 1 running animation without reduce and 0 with it | ✓ |
| AC-1.5 / AC-1.1 / AC-1.2 | out of scope for this pass | n/a |

## Keyboard pass (Chromium, dev server http://localhost:5173)
- Tab order on Home: Skip link, wordmark, Home, Profile, Talks, History, Contact, WellD (the D card caption link in main), Open the talks, Contact details, email, next-appearance link. Every stop shows a 3px solid rgb(180,58,8) (`--signal`) outline.
- Skip link: first Tab stop, becomes visible at (16,16) 179x40, Enter sets `#main` and moves focus to `<main>`.
- Nav link (Talks, via Enter): focus lands on the new page's h1 ("Talks"), `document.title` is "Talks | Michele Talks". The next Tab moves to the first talk title link.
- `/history` title "History | Michele Talks"; `/talks/nope` and the hidden talk address show "Page not found | Michele Talks".
- Console: no errors or warnings (React DevTools info only).

## Defects
None at blocking level.

Observations (non-blocking, not defects against any AC):
1. After the skip link is activated, `<main>` receives focus with `outline: none`. Focus is programmatically placed on a non-interactive container, so no ring is expected; flagged for owner awareness only.
2. AC-7.1 has indirect evidence only (see table).

## Environment faults
None.

## Notes
- SAST-high: the repo has no SAST tool wired (no semgrep or CodeQL config found in the project's mise tasks). Per the brief this row would block if findings existed; nothing ran, so nothing is claimed. Recommend the caller confirm whether the central CI gate runs SAST on the PR.
- Secret scan used gitleaks 8.x at /opt/homebrew/bin/gitleaks; betterleaks and trufflehog are not installed.
- Verdict note: all blocking rows that could run (lint, typecheck, secret scan) are green. The SAST row did not run because no tool is configured, not because a tool failed; at mvp this is recorded, not blocking.

## Recommendations
- An owasp-reviewer pass is not required: the feature is a static SPA with no auth, no input handling, no uploads, no backend. The only new dependencies are zod, yaml, TanStack Router and fontsource packages; `pnpm audit --prod` is clean.
