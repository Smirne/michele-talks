# QE report — 005 sticker-sheet-adoption

## QE verdict: PASS (advisory mode, rigor mvp — coverage advisory)        (measured at adaf6eb)

Blocked checks: none. AC-5.6 is pending by design (T12 release review).

| Check | Threshold | Actual | Result |
|---|---|---|---|
| Lint (`eslint --max-warnings 0`, run directly; mise had cached it) | 0 warnings | 0 | ✓ |
| Typecheck (`tsc -b --noEmit`) | clean | clean | ✓ |
| Unit tests (vitest) | all pass | 246/246, 21 files | ✓ |
| Build (`mise run frontend:build`) | succeeds | succeeds | ✓ |
| E2E (`mise run frontend:e2e`) | green | 76/76 | ✓ |
| Secret scan (gitleaks, full history) | 0 leaks | 96 commits, 0 leaks | ✓ |
| `pnpm audit --audit-level=critical` | no critical | no known vulnerabilities | ✓ |
| Coverage | production floor 80% | not measured (no coverage provider configured) | ADVISORY |
| AC-1.1..1.4 look, reflow, contrast | all | sweep.e2e: every page at 375 + 1280, axe color-contrast, no h-scroll; no `!important`/`[class*=` outside global.css reduced-motion | ✓ |
| AC-2.1..2.4 sticky invite | all | sticker-sheet.e2e (1280 in viewport at bottom, Home + talk page; 375 not fixed, after upcoming); visual check Home 1280 | ✓ |
| AC-3.1/3.2 Contact row | all | e2e + screenshot at 375 wraps in order | ✓ |
| AC-4.1..4.5, AC-6.1/6.2 On stage | all | manual: 13 past, "Showing 5 of 13" live region, Show more button, scroll loads all, button gone, egg link http://batteri.altervista.org/ target=_blank rel=noopener noreferrer, at 375 and 1280 | ✓ |
| AC-5.1 footer logo | alt "WellD" in link | present on every page checked (Home, Talks, Contact, On stage, Not found) | ✓ |
| AC-5.2/5.3/5.4 photos and D | photo on Talks/On stage/Contact; D only on Not found | confirmed by img inventory at both widths; Home has no D | ✓ |
| AC-5.5 photo size | ≤ 300 KB | stage photos 72 KB max; cards 60 KB max | ✓ |
| AC-5.6 photo rights and credits | owner confirms | PENDING, T12 release review (not a defect) | pending |
| AC-7.1..7.4 cards | all | thumbnails with alt "Social card for <event>"; dialog opens by Enter on thumbnail (focus on Close), Escape closes, focus returns to a button; unit tests cover prev/next and no-card rows | ✓ |
| AC-7.5 cards attached | listed events | Green Software Italia has 3 cards vs 2 in spec (decision logged, spec text stale) | ✓ (note) |
| AC-8.1/8.2 meetups | content | covered by unit tests (green); not re-read in the UI | ✓ |

Evidence: screenshots in the session scratchpad under
/private/tmp/claude-501/-Users-michele-giacobazzi-Desktop-wspace-personal-michele-talks/f9273b74-4e4d-41a8-ae73-a1a2f7d99de1/scratchpad/ (home-1280.png, contact-375.png, dialog-*.png and others).

Defects: none.

Notes (non-blocking):
1. Spec bug: AC-7.5 says Green Software Italia has 2 cards; content has 3 (decisions.md). Amend the spec text.
2. On stage lists 6 card images in the DOM with naturalWidth 0 (lazy loading, below the fold at check time); expected, not a defect.
3. Easter egg and card thumbnails not run with a screen reader; keyboard path verified only.
4. Coverage provider is not installed, so a coverage number could not be produced.

Environment faults: none.

Tests added: none (existing e2e and unit suites cover the ACs).

owasp-reviewer: not needed (static site, no auth, input or new runtime dependencies; one external link carries rel=noopener noreferrer).
