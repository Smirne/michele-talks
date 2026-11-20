# QE-light report: 002 talk-content-update

## QE verdict: PASS (advisory mode, rigor mvp, coverage advisory)   (measured at 9f0d3e1)

| Check | Threshold | Actual | Result |
|---|---|---|---|
| AC coverage (US-1..US-5, 19 ACs) | all verified by executed check | all 19 verified: unit/component tests (166 pass) + e2e (37 pass) + manual render at 1280/375 | PASS |
| Lint (`pnpm lint`, max-warnings 0) | 0 | 0 findings (`mise run frontend:lint` skipped as up to date, so ran pnpm directly) | PASS |
| Typecheck (`tsc -b --noEmit`) | 0 errors | 0 | PASS |
| Build (`pnpm build`) | succeeds | succeeds | PASS |
| Unit/component tests | all pass | 14 files, 166 tests pass | PASS |
| Line coverage | advisory (prod floor 80%) | 84.87% lines, 89.83% branches, 90.9% funcs; above production floor | ADVISORY |
| e2e (`mise run frontend:e2e`) | all pass | 37/37 | PASS |
| Dependency audit (`pnpm audit --prod`) | no critical | no known vulnerabilities | PASS |
| Secret scan (gitleaks, 39 commits) | 0 leaks | no leaks | PASS |
| Visual pass 1280px and 375px | designed pages correct, no overflow | all checked pages correct; no horizontal overflow on any at 375 | PASS |

## Visual observations (AC checks by eye)
- Kilowatts: note block under meta row, set apart by a left rule and bold text (AC-2.1/2.2); "Beginner–Intermediate" (AC-2.3); "Also given as" includes the three new titles with languages (AC-1.2); History appearances show "Presented as Flex your Energy..." for WeAreDevelopers (AC-1.3).
- Lego4Scrum: "6–8 hours", "With Matteo Codogno" in meta, "Related links > Lego4Scrum training at WellD", appearance row "With Matteo Codogno" (AC-2.4, 3.1-3.3).
- Repetition is Bad: "Quickie", "No longer offered" near title, abstract and the 2015 appearance (AC-3.4, 4.3).
- /talks: Kilowatts and Lego4Scrum listed, no Repetition is Bad, no Flex your Energy (AC-1.1, 4.1). Home says "5 talks" (4 existing + Lego4Scrum, archived excluded).
- /history: both Voxxed Days Ticino rows present; 2015 row links to /talks/repetition-is-bad, 2025 row links to /talks/lego4scrum (AC-4.2, 4.4).
- /talks/flex-your-energy: "Page not found" (AC-1.4).
- Screenshots: `.playwright-mcp/qe-*.png` (gitignored, local only).

Defects: none.

Minor, non-blocking notes (not defects):
- "No longer offered" renders in a low-emphasis mono grey; it reads clearly but is quieter than the note block. Owner call at preview.
- AC-2.5 hour formatting (e.g. "1.5 hours") covered by unit tests only, no real content uses it.
- The Playwright console log showed 404/500 entries from an unrelated stale dev server on :5173 from earlier use; the preview build on :4180 loaded cleanly.

Environment faults: none. `mise run frontend:lint`/`build` skip when sources are up to date; the direct pnpm commands were run to be sure.
Blocked: none. Tests added: none (existing coverage sufficient).
owasp-reviewer: not needed (static content, no new input handling, auth or dependencies; external links use rel=noopener).
