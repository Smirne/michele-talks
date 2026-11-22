---
id: 004
slug: sticker-sheet-reskin
rigor: spike
status: done
created: 2026-11-20
done: 2026-11-20
---

# Re-skin the live site in visual direction 4 "Sticker Sheet"

## Question
How would the real site, with its real content and pages, look in the backup direction 4
"Sticker Sheet" (specs/001-site-foundation/design.md, section 4) instead of the chosen
Programme Board? Enough to judge it on a preview, not to ship.

## Build
- Swap the design token values to the sticker palette: banana, ink, pink, teal, brown.
- Swap the fonts to Dela Gothic One (headings) and Figtree (body), self-hosted via Fontsource.
- Add one spike stylesheet that gives the main blocks the sticker look: white fill, 3px ink border, rounded corners, hard shadow, 1–2° tilt. Also a dotted sheet background, pill nav, and pink for the current link and the primary button.
- Leave layout, components, content and copy untouched.
- Preview it on its own branch (a Vercel preview via a draft PR), never merged.

## Out of scope
- The 12-column tilted collage layout from the sketch. The page structures stay as they are, and only the skin changes.
- Contrast and accessibility tuning beyond a quick check, test updates, and an e2e/axe pass.
- Swapping the D artwork to the teal `ui-1.png` lead sticker.

## Findings
Answered. The real site takes direction 4 with no change to layout, components or content. It
needed a token swap, two Fontsource fonts and one ~170-line stylesheet (`frontend/src/styles/sticker.css`)
that targets CSS-module classes by their local name. Screenshots at 1280 (Home, Talks, a talk
page) and 375 (Home) read clearly as the sketch: banana dotted sheet, tilted white stickers with hard
shadows, a pink current-page pill, a teal Talks band, and Dela Gothic One sentence-case headings.

What it costs:
- Dela Gothic One is wide and heavy. Long titles (the Talks list, the Kilowatts page) take more
  room, and the sticker padding adds height, so three layout checks from 001 and 003 fail: Home CTAs
  no longer end above 800px, one card title runs to 3 lines, and the talk page overflows by a few
  pixels at 375px (tilt and shadow).
- The talk page aside shows a sticker inside a sticker (the aside wrapper and its inner block
  both match). Not fixed.
- 4 unit tests in `styles.test.ts` pin the Programme Board tokens and fonts, so they fail by design.
- The selector-by-substring approach (`[class*='_card_']`) is brittle. A real version would put the
  sticker edge in each module, drop the row-label column the timetable layout needs, and use the
  12-column collage from the sketch for Home.
- Tone: playful. The 001 design notes already flag the risk that formal event organizers read it
  as "too playful". The organiser-facing parts (bio, photo, invite) still read clearly.

Gates (advisory): lint 0 warnings; unit 224/228 (4 token tests); e2e 43/47 (the 4 layout checks above).
Security floor: audit no known vulnerabilities; gitleaks clean (history and spike files).

### Pass 2 (owner feedback: talk page good, Home and the list need a fix)
Direction: Sticker Sheet skin with Programme Board discipline.
- Blocks are flat stickers with no tilt. Only the photo, D, the wordmark and Home's "Browse the
  talks" sticker tilt. Pink is reserved for the current page and the primary button.
- Talk list: flat cards, titles at clamp(20px, 1.9vw, 26px). The longest title fits on 2 lines at 1280.
- Home is a 2-column collage with no timetable labels: intro (text + tilted photo) next to a pink
  "Browse the talks" sticker; "Next" under the intro next to an ink "Invite me" sticker with D. It
  stacks to one column at 860px.
- Talk page: the doubled aside sticker is fixed (only the inner block is a sticker).
- Gates (advisory): lint 0 warnings; unit 224/228 (the same 4 token tests); e2e 47/47 (the fold,
  2-line title and 375px reflow checks now pass). gitleaks clean.
- Left rough: the "Next" row is cramped in the narrower left column (the event title wraps
  over 3 lines); the whole skin still relies on substring selectors.
