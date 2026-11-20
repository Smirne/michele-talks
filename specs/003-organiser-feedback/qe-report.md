# QE-light report: 003 organiser feedback

## QE verdict: FAIL (advisory mode, rigor mvp - coverage advisory)   (measured at 005c964 + T7 e2e commit)

Blocking rows failing: axe WCAG 2.5.3 (2 components), 001 AC-2.3 regression on Home, critical-CVE audit (pre-existing, dev-only).

| Check | Threshold | Actual | Result |
|---|---|---|---|
| mise run lint (backend biome + frontend eslint, incl. e2e) | 0 warnings | 0 | PASS |
| Typecheck (frontend tsc -b) | clean | clean | PASS |
| mise run test | all green | frontend 225/225, backend 1/1 | PASS |
| mise run build | ok | ok (frontend + backend) | PASS |
| Coverage (frontend) | 80% prod floor | 79.93% lines (0.07 under) | ADVISORY |
| e2e (Playwright) | all green | 41 passed, 6 failed (all real defects, see below) | FAIL |
| Secret scan (git grep patterns) | none | none found | PASS |
| `pnpm audit --audit-level critical` | 0 critical | 3 critical, frontend and backend: vitest 2.x (UI server file read) and tinypool (x2); `--prod` audit clean. No dependency changed by 003 (package.json/lockfile untouched in main..HEAD). | FAIL (floor; pre-existing, dev-only) |
| SAST-high | none | not run, no scanner configured locally | BLOCKED |

## Defects
1. Home fails 001 AC-2.3 at 1280x800: Contact details and email buttons end at y=850 (Talks CTA 683 ok). The "Invite" row now sits under the photo row and Talks band. Tests: `site.e2e.ts:116` (existing) and `organiser-feedback.e2e.ts:99`. New since 003 (T3). Screenshot: scratchpad home-1280.png.
2. axe `label-content-name-mismatch` (WCAG 2.5.3, serious) on the "Download photo" link: aria-label "Download photo, JPG, 1024 x 1024 px" does not contain the visible text contiguously (two spans). `frontend/src/features/profile/OrganisersSection.tsx` (ariaLabel via `profile.organisers.downloadAria`). Fails site.e2e Profile and the organiser-band axe test. New since 003 (T4).
3. Same rule on talk-page aside links: aria-label "Recording (EN), English, <event>" inserts "English" into the visible "Recording (EN), <event>". `frontend/src/features/talks/TalkAside.tsx` (`recordingAria`/`slidesAria` in strings.en.ts). Fails axe on /talks/from-kubernetes-to-kilowatts and /talks/repetition-is-bad. Placement check: every talk with a recording or slides link is affected (Kilowatts, Repetition, before-delegating, any with picks). New since 003 (T6). Fix idea: drop the aria-label or make it start with the visible text.
4. (Minor, visual) Talks 1280: longest title wraps with the single word "Team" on line 2 (within the 2-line limit). 375px talk page: topic tags stack one per row, tall; 375px organiser band: mascot sits below the buttons, bottom-left, with a large empty gap above it. Not spec violations.

Environment faults: none.
Blocked: SAST-high (no scanner configured locally; needs the CI SAST job or a local semgrep run).

## AC table
| AC | Evidence | Result |
|---|---|---|
| 1.1 | e2e "Home shows the photo" + HomePage.test; screenshot shows photo where D card was | PASS |
| 1.2 | e2e 375px Home photo inside viewport, scrollWidth <= 375 | PASS |
| 2.1 | e2e footer D on 6 routes (footer img count 1) | PASS |
| 2.2 | NotFoundPage.test.tsx (unit); e2e axe/reflow 404 | PASS (unit) |
| 2.3 | Screenshots: D on Home (invite row), Profile (band), Talks (header); History/Contact covered by unit tests, not eyeballed | PASS (partly observed) |
| 2.4 | e2e: every img has alt attribute on 6 routes; footer D alt="" decorative | PASS |
| 3.1 | e2e band region "For organisers", English/Short default | PASS |
| 3.6 | e2e switches language/length, text changes, Italian box lang="it", radios checked state | PASS |
| 3.2 | e2e Copy bio: clipboard equals shown paragraphs joined by blank line, status text visible | PASS |
| 3.3 | ProfilePage.test (clipboard unavailable path); not run in browser | PASS (unit) |
| 3.4 | e2e: link has download="michele-giacobazzi.jpg", href serves image/jpeg | PASS |
| 3.5 | e2e text "JPG, 1024 x 1024 px"; but accessible name fails axe (defect 2) | PASS (text) / see defect 2 |
| 3.7 | ProfilePage.test + content.test; screenshot shows extended EN bio, 3 paragraphs | PASS |
| 3.8 | HomePage.test; screenshot shows single-paragraph summary | PASS |
| 3.9 | content.test / validate tests (missing bios fail naming field) | PASS |
| 4.1 | talks.test (mailto subject); e2e invite link visible | PASS |
| 4.2 | talks.test (no invite when not offered) | PASS |
| 4.3 | pick-talk-resources.test; screenshot of recording/slides link | PASS |
| 4.4 | pick-talk-resources.test, validate.test | PASS |
| 4.5 | pick-talk-resources.test; screenshot "Slides (EN), DevFest Milano 2026" | PASS |
| 4.6 | talks.test / pick tests | PASS |
| 4.7 | e2e 1280 aside right of abstract; 375 aside after facts, before abstract | PASS |
| 4.8 | validate.test featuredRecording cases | PASS |
| 5.1 | e2e longest title (before-delegating-to-agents) h1, facts, invite bottom <= 800 | PASS |
| 5.2 | Screenshot: sentence case, links underlined? title links not underlined in Talks list | PASS (observed) |
| 5.3 | e2e at 1280 every card title <= 2 lines | PASS |
| 6.1 | e2e/unit + screenshot tags on cards | PASS |
| 6.2 | screenshot + talks.test tags on talk page | PASS |
| 6.3 | content.test TopicTags empty renders nothing | PASS |
| 7.1 | HomePage.test; screenshot label "Talks", no Now dot | PASS |
| 7.2 | resolved by feature 002 (Lego4Scrum shows Workshop) | PASS |
| Axe all pages (T7) | site.e2e: Home, Talks, Workshop, History, Contact, 404, Hidden pass; Profile, Talk detail, No longer offered fail (defects 2, 3) | FAIL |
| 001 AC-2.3 Home CTAs within 800px | Contact CTAs at y=850 | FAIL |

Tests added: `frontend/e2e/organiser-feedback.e2e.ts` (10 tests; 3 fail on real defects, 7 pass). Screenshots (scratchpad): home/profile/talks/talk at 1280 and 375, band-it-ext at both widths, under /private/tmp/claude-501/.../scratchpad/.

owasp-reviewer: not needed (static site, no input handling beyond clipboard and a mailto link).
