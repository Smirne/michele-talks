---
spec: 001
status: draft
---

# Design: Site foundation (content, structure, visual identity)

Spec: `specs/001-site-foundation/spec.md` (approved, rigor mvp, no plan.md by design).
Sketches and screenshots: `specs/001-site-foundation/sketches/` (open `index.html` to compare the five side by side).

Placeholder content throughout is fictional. The speaker is referred to as "the speaker" or "they".

## Flows

Seven flows. US-7 (content files) and the build-failure half of AC-7.2 have no UI surface (see "Gaps and scope notes"). US-9 is cross-cutting and is handled per screen under Accessibility.

### F1. Choose a visual direction (US-1: AC-1.1 to AC-1.5)
Process flow for the owner, not a visitor flow.
1. Owner opens `sketches/index.html` (AC-1.1: five home-page sketches with palette, type, signature).
2. Compares side by side; each pair differs in palette, heading typeface and layout (AC-1.2, table in "Visual direction"); sketches 1, 2, 4 and 5 show D, sketch 3 shows the WellD logo icon (AC-1.3).
3. Owner picks one direction or a mix. Exit: the choice is recorded in this document under "Visual direction" (AC-1.4).
4. After build, owner reviews the real site and confirms it matches (AC-1.5). Exit: confirmation recorded; otherwise iterate.

### F2. Navigate (US-2: AC-2.1 to AC-2.4)
1. Visitor lands on Home (entry: any URL). Header shows Home, Profile, Talks, History, Contact on every page (AC-2.1).
2. Home shows the introduction, a primary call to action to Talks, and a Contact path (header link plus a visible email call to action), both within 800px of the top at 1280x800 (AC-2.3). A dashed, labelled "Reserved: talks graph" block marks the future graph area (AC-2.4).
3. Visitor activates any nav link: the matching page opens, the current link is marked as current page.
4. At 375px the same five links remain reachable without horizontal scroll (AC-9.1). The sketches wrap the links in two rows; no hamburger menu is needed with only five links (decision, avoids a disclosure component and its focus management).
5. Error exit: an address that matches no page shows the Not found page with a "Back to Home" link (AC-2.2).

### F3. Read the profile (US-3: AC-3.1, AC-3.2)
Entry: Profile nav link. The page shows name, photo, bio, topic list (all from content), and a sentence mentioning WellD with a link to www.welld.ch. Success exit: visitor continues to Talks or Contact via the page's closing links (reuses the Home calls to action, no new surface). Error exit: if a content photo fails to load, the alt text and a monogram fallback show (see states).

### F4. Browse talks and open one (US-4: AC-4.1, AC-4.2)
1. Talks page lists every talk with title, short abstract, duration, level, format and language label(s).
2. Visitor activates a talk title: talk detail shows the full abstract and the past appearances where the talk was given.
3. Exits: from an appearance, follow to History; back to Talks via a "All talks" link and the nav. Error exit: unknown talk address shows Not found (the same page as AC-2.2).

### F5. Browse history and resources (US-5: AC-5.1 to AC-5.4)
1. History page: "Upcoming" group first (appearances dated after today), then past appearances newest first (AC-5.2). Each row: event, date, city and country or "online", language label (AC-5.1).
2. A row with slides and/or video shows each resource as a link labelled with type and language, for example "Slides (IT)", "Video (EN)" (AC-5.3).
3. A row linked to a catalogue talk has the talk title as a link to the talk detail (AC-5.4).
4. Empty exits: no upcoming appearances means the "Upcoming" group is omitted entirely, not shown empty (decision, see states).

### F6. Find contact details (US-6: AC-6.1)
Entry: Contact nav link, the Home call to action, or the Profile page. The Contact page shows the email address (a `mailto:` link, also visible as text) and the list of public profile links from content. No form (out of scope).

### F7. Language labels (US-8: AC-8.1 to AC-8.3)
Every talk, appearance and resource shows an "EN" or "IT" label (same `LanguageBadge` everywhere). Interface text is English only; every string comes from one translation set (AC-8.3 is an implementation constraint, no visual surface beyond the labels).

## Screens & states

Content is bundled at build time (spec: no backend at runtime), so there is no network loading state for content. "Loading" below therefore means asset and navigation loading only.

### Shell (header, footer), present on every page
- Header: wordmark "Michele Talks" (link to Home) plus the five nav links; current page marked with `aria-current="page"`. Footer: WellD logo or D and a line linking to www.welld.ch.
- Loading: web fonts use `font-display: swap` with a metrically similar fallback stack, no invisible text.
- Empty: not applicable.
- Error: not applicable (route errors are handled by Not found).
- Home mockup: `sketches/0N-*.html` (pending direction choice).

### Home (AC-2.3, AC-2.4)
- Purpose: who the speaker is in two sentences, route to Talks, route to Contact, teaser of upcoming appearances, reserved graph area.
- Key elements: heading, introduction, primary CTA "Browse the talks", secondary CTA with the email address, "Next" list of up to three upcoming appearances (taken from content), reserved block (dashed border, text "Reserved: talks graph, future feature"; `role="img"` with an `aria-label` in the sketches, to be replaced with a plain labelled region when the graph ships).
- Loading: none. Empty: no upcoming appearances means the teaser list is replaced by the most recent past appearances under the heading "Recently". Error: none.
- Sketches: five candidates, `specs/001-site-foundation/sketches/01-backstage.html` to `05-margin-notes.html`.

### Profile (AC-3.1, AC-3.2)
- Key elements: name (h1), photo with fixed aspect ratio, bio paragraphs, topics list, WellD mention with link.
- Loading: photo box reserves its aspect ratio (no layout shift). Empty: a missing optional bio paragraph is simply absent; a missing photo is a build-time content error per AC-7.2 (required field). Error: image load failure shows the alt text over a monogram background.

### Talks list (AC-4.1)
- Key elements: one entry per talk (title as link, abstract, duration, level, format, language badge(s)).
- Loading: none. Empty: zero talks shows "No talks listed yet. Check back soon, or get in touch." with a link to Contact. Error: none.

### Talk detail (AC-4.2)
- Key elements: title (h1), meta (duration, level, format, languages), full abstract, "Where this talk was given" list (event, date, place, resources), link back to Talks.
- Loading: none. Empty: no appearances shows "Not given in public yet." (not an empty heading). Error: unknown address renders Not found.

### History (AC-5.1 to AC-5.4)
- Key elements: "Upcoming" heading plus rows, "Past" heading plus rows. Row: event name, date (machine-readable `<time>`), place or "Online", language badge, talk link when present, resource links "Slides (IT)" / "Video (EN)".
- Loading: none. Empty: no upcoming means no "Upcoming" group (AC-5.2 says "shown in a separate group", silent on empty); no appearances at all shows "No appearances yet." Error: none.

### Contact (AC-6.1)
- Key elements: email as a `mailto:` link, list of profile links (platform name as link text, not icon-only).
- Loading: none. Empty: no profile links means only the email is shown (email is required content). Error: none.

### Not found (AC-2.2)
- Key elements: heading "Page not found", one sentence, link "Back to Home", full header kept so nav still works.
- States: this is the error state. Focus is moved to the h1 on arrival (client-side navigation).

## Component inventory

Library in use: none. `frontend/package.json` has only React 19, Vite 6, TypeScript, Vitest and Testing Library. No UI kit (no Mantine, MUI, Tailwind, shadcn) is installed and `frontend/src/components` and `frontend/src/hooks` are empty; `frontend/src/features/home/HomePage.tsx` is the only page. The stack differs from the WellForge Mantine + Tailwind default, so all components are plain React with CSS custom properties; the plan or tasks stage must decide the styling mechanism (CSS modules vs global CSS) and the router. Reuse ratio: 0 reused, 14 NEW, 1 existing scaffold to rework (15 rows).

| Element | Component | Reuse / NEW |
|---|---|---|
| Page frame | `SiteLayout` (header, main landmark, footer, skip link) | NEW: no layout exists |
| Primary nav | `MainNav` (five links, current-page state) | NEW: nothing exists; one component serves desktop and mobile |
| Home | `HomePage` at `frontend/src/features/home/HomePage.tsx` | EXISTS as scaffold, rework (not a reuse of design) |
| Profile, Talks, TalkDetail, History, Contact pages | one page component each under `features/<name>/` | NEW: one per route |
| Not found page | `NotFoundPage` | NEW: AC-2.2, also used for unknown talk |
| Button / link-button | `ButtonLink` (primary and secondary variants) | NEW: all CTAs are links; no button library |
| Language label | `LanguageBadge` ("EN"/"IT") | NEW: AC-8.1, used on talks, appearances, resources |
| Talk summary row | `TalkCard` | NEW: AC-4.1 |
| Appearance row | `AppearanceRow` | NEW: AC-5.1; reused on Home teaser and Talk detail |
| Resource link | `ResourceLink` ("Slides (IT)") | NEW: AC-5.3; label built from type plus `LanguageBadge` text |
| Page heading block | `PageHeader` (h1 plus optional intro) | NEW: avoids per-page heading drift |
| Reserved graph area | `GraphPlaceholder` | NEW: AC-2.4; replaced when the graph feature lands |
| Photo | `ProfilePhoto` (aspect box, alt text, monogram fallback) | NEW: AC-3.1 |
| Translation set | `t()` over one `en` dictionary | NEW: AC-8.3 (a lookup function, not a UI component) |
| Signature element | per chosen direction (see below) | NEW: pending choice |

## Visual direction

Surface-class gate: greenfield project, first UI, and the surface (a speaker's identity) is itself the product, so **Full direction** applies. The spec pins the axes: custom, non-standard, not obviously AI-produced, WellD nod, at most one candidate close to the WellD brand.

**Chosen direction (owner, 2026-11-19, AC-1.4): 3 Programme Board + a D card.** Owner's ranking: 3, then 4, then 2. **Backup: 4 Sticker Sheet**, kept in case 3 doesn't hold up once built. The chosen direction is: palette, typefaces, layout and signature as in section 3 below, plus one D illustration card placed in the Programme Board grid (see "Chosen: D card" below). AC-1.5 (owner confirms the built site matches) is still open. Ratios are WCAG contrast ratios computed from the hex values. Rendered pairs in all five sketches were also checked in the browser: no text under 4.5:1 (3:1 for large text).

Fonts: the sketches load fonts from Google Fonts for convenience. In the real build, deliver them self-hosted (`@fontsource/*` or local `woff2`); no CDN link at runtime. All faces named are open-licence (OFL or Ubuntu Font Licence) and available in Fontsource.

### Comparison (AC-1.2)

| # | Name | Palette family | Heading face | Layout structure |
|---|---|---|---|---|
| 1 | Backstage | near-black + red + teal | Ubuntu | floating pill nav, split hero, two panels |
| 2 | Slide Deck | cobalt + lemon | Unbounded | vertical left rail + 16:9 slide + filmstrip |
| 3 | Programme Board | mint + forest + burnt orange | Big Shoulders Display | top tab nav + full-width timetable rows |
| 4 | Sticker Sheet | banana yellow + ink + pink + teal | Dela Gothic One | 12-column tilted collage |
| 5 | Margin Notes | slate-blue paper + berry | Fraunces | 8/4 column manuscript with margin notes |

No two share palette, heading face or layout.

### 1. Backstage (closest to WellD) - `sketches/01-backstage.html`
- Idea: the home page as a lit stage; D under a spotlight, a "running order" of upcoming talks.
- Palette: `bg #141218`, `surface #23242A`, `text #F8F9FA` (17.6:1 on bg, 14.7:1 on surface), `muted #B5B8C4` (9.4:1 on bg), `red #E50339` for fills only (white on red 4.8:1; red on bg 3.9:1, so never used as text), `red-soft #FF5C7F` for red text (6.3:1 on bg, 5.2:1 on surface), `teal #03A59A` (6.1:1 on bg, 5.1:1 on surface). Outline `#464957` is decorative only (1.7:1 on surface, never the sole carrier of a boundary that matters).
- Type: Ubuntu 300/500/700 headings (weight contrast inside one headline, as WellD does), Noto Serif body.
- Layout: floating rounded nav, split hero (text left, stage card right), panels below.
- Signature: D on a spotlit stage card with a red curtain strip.
- WellD: D (`mascot/training.png`) large in the hero; logo in the footer. Deliberately the closest to the WellD brand; the others avoid its palette.

### 2. Slide Deck - `sketches/02-slide-deck.html`
- Idea: the site is a presentation; pages are slides, nav is the slide rail, contact lives in "speaker notes".
- Palette: `cobalt #2132E0` (page, white text 8.1:1), `lemon #FFE45C` (slide, 6.4:1 on cobalt), `ink #0B0F3B` (14.4:1 on lemon, 18.3:1 on white), `notes #EAF0FF` (ink 16.1:1, cobalt on notes 7.1:1), `soft #D4D9FA` (5.8:1 on cobalt).
- Type: Unbounded 800 headings (wide, loud, used only for headlines), Hanken Grotesk body.
- Layout: fixed left rail with numbered links (becomes a top row at 900px and below), one large slide per page, filmstrip of next items.
- Signature: the lemon title slide with hard offset shadow and slide counter.
- WellD: D (`software-development-1.png`, violet, presenting from a laptop) inside the slide; logo in the rail.

### 3. Programme Board - `sketches/03-programme-board.html`
- Idea: the home page is a conference timetable; the Talks call to action is the "NOW" row. Talks and History pages can reuse the same row grid.
- Palette: `mint #E3F1E7`, `forest #10281F` (13.4:1 on mint, 15.6:1 on white), `signal #B43A08` (5.1:1 on mint, 5.9:1 on white; white on signal 5.9:1), `muted #3F5A4C` (6.5:1 on mint), `white #FFFFFF`.
- Type: Big Shoulders Display 900 uppercase headings, Public Sans body, Space Mono for times and metadata.
- Layout: tab-style nav at top, giant heading, full-width rows (time, session, place) separated by heavy rules.
- Signature: the orange NOW row bleeding past the page margins.
- WellD: the logo icon (the D head mark) in the footer only; the lightest nod. Can be strengthened by adding a D card, see recommendation.

### 4. Sticker Sheet - `sketches/04-sticker-sheet.html`
- Idea: a tilted collage of die-cut stickers on a dotted sheet; personal and playful.
- Palette: `banana #FFD93B` (ink 13.6:1), `ink #16110F` (18.7:1 on white), `pink #FF5C93` (ink on pink 6.4:1), `teal #0B7A72` (white on teal 5.2:1), `brown #4A3F00` for small captions on banana (7.6:1) and on white (10.5:1).
- Type: Dela Gothic One headings (single heavy weight), Figtree body.
- Layout: 12-column grid, each block rotated 1 to 2 degrees; collapses to one column at 860px.
- Signature: white-bordered, hard-shadow sticker edge on every block.
- WellD: D (`ui-1.png`, teal) as the lead sticker, logo in footer. Highest risk of reading as "too playful" for formal event organizers.

### 5. Margin Notes - `sketches/05-margin-notes.html`
- Idea: a manuscript page with highlighted phrases annotated in the margin; calm and text-first, the most distant from a developer-portfolio look.
- Palette: `slate #DCE3EA` (page), `paper #F4F7FA`, `ink #0F1A24` (16.4:1 on paper), `berry #A3124F` (7.1:1 on paper, 5.9:1 on slate; white on berry 7.6:1), `muted #3E4C5A` (8.2:1 on paper).
- Type: Fraunces 500 (optical size 144) headings, Source Sans 3 body, IBM Plex Mono for notes and nav.
- Layout: 8/4 split, statement left, margin notes right with dashed leader lines; stacks to one column at 900px.
- Signature: margin annotations with dashed leader lines.
- WellD: D (`problem-identification-1.png`, glasses) as the "reviewer" margin note; colour logo in footer.

### Recommendation (not a decision)
Base on **3 Programme Board** and borrow the D card treatment from 1 or 4. The site's content (talks with duration and level, appearances with dates and places, upcoming versus past) is schedule-shaped, so one row layout serves Home, Talks and History and gives the future graph a clear contrast. Its signature is unlike a developer portfolio, and the WellD link can be raised by adding a D card in the NOW row. If the owner wants warmth over rigour, mix 3's layout with 4's yellow and D sticker.

### Chosen: D card
The D card is added to direction 3 without changing its palette or layout. It is a session-like row or tile in the timetable grid carrying one official D illustration, unmodified (never redrawn). Of the official variants, teal or red clash least with the mint/forest/burnt-orange palette; pick the variant whose card doesn't compete with the orange NOW row (the WellD brand rule: avoid two competing reds). Its caption or label names WellD and links to www.welld.ch. Exact placement (in or next to the NOW row, or as its own "Guest: D" row) is settled at implementation and checked by the owner under AC-1.5.

### Token and implementation notes (for the chosen direction)
Implement as CSS custom properties on `:root` (colours, font families, spacing scale on the 8px grid used by WellD, radii); no hex literals inside components. Honour `prefers-reduced-motion: reduce` with a global rule that removes decorative animation (the sketches demonstrate it with one decorative animation each: pulsing dot, filmstrip nudge, blinking NOW dot, sticker wiggle, underline draw).

## Accessibility

Applies to all five directions; the sketches already demonstrate each point.

### Global (AC-9.1, AC-9.2, AC-9.3)
- Landmarks: `header` with `nav aria-label="Main"`, one `main`, `footer`. A "Skip to content" link is the first focusable element (not in the sketches, add in build).
- Focus: a visible 3px focus ring in a colour passing 3:1 against the adjacent background in the chosen palette (the sketches define one per palette); never remove outlines.
- Contrast: every pair in the chosen palette must be at or above 4.5:1 (3:1 for 24px+ or 18.66px bold+ text and UI boundaries). Check and record the ratios when the direction is chosen (done above for the candidates).
- Colour is never the only signal: current page uses `aria-current="page"` plus a visual change in shape or weight; language is text ("EN"), not colour.
- Motion: decorative animation off under `prefers-reduced-motion: reduce`; no autoplay motion that conveys information.
- Target size: nav links and CTAs at least 44px tall at 375px (sketches use padding to reach this on CTAs; confirm nav links when built).
- Reflow: no horizontal scroll at 375px (verified for all five sketches: no element extends past the viewport). Test at 320px too (WCAG 1.4.10).
- Language: `<html lang="en">`; content items in Italian carry `lang="it"` on the element (talk titles and abstracts in Italian) so screen readers pronounce them correctly, in addition to the visible "IT" label.
- Document title updates per page ("Talks | Michele Talks").

### Home
- Keyboard: tab order is nav, primary CTA, email CTA, teaser links, then footer. Reserved graph block is not focusable.
- The reserved block has an accessible name; when the graph ships it becomes a labelled region with its own text alternative (not designed here).

### Profile
- Photo has meaningful alt text from content (for example "Portrait of Michele Giacobazzi"). The WellD link text is the name "WellD", not "click here".

### Talks list and Talk detail
- Each talk title is a link and is the only link in the card (no whole-card click target conflicting with inner links).
- Headings: h1 page title, h2 per talk. Duration is written out ("45 minutes"), not an icon.
- On route change (client-side), move focus to the page h1 and announce the new title.

### History
- Group headings "Upcoming" and "Past" are h2s; rows are a list. Dates use `<time datetime>`.
- Resource links read as "Slides, Italian" (visible "Slides (IT)" plus `lang` or an `aria-label` that spells out the language).

### Contact
- Email is a `mailto:` link with the address as its text. Profile links are text links with the platform name; external links are announced as opening in the same tab (no `target="_blank"` unless noted visually).

### Not found
- On arrival, focus goes to the h1; the "Back to Home" link is the first interactive element after the header.

## Gaps and scope notes

Gaps in the spec (reported, not designed around):
1. AC-5.1 says each appearance shows "language(s) it can be given in"; that wording belongs to talks, an appearance has the language it was given in. The design shows the language the appearance was held in. Clarify the wording.
2. AC-5.2 "dated after today" on a static site: the Upcoming grouping is fixed at build time and goes stale until the next rebuild. The spec does not say whether grouping should be computed at build time or in the browser. This changes the UI behaviour (a past event could still show as upcoming) and is a plan decision.
3. AC-3.1 requires a photo but no photo asset exists; the sketches use no photo. Needs a placeholder image in the build.
4. AC-4.2 lists "past appearances" only; it is silent about upcoming appearances of the same talk. Design shows past ones only, per the spec.
5. AC-2.2 covers an address that matches no page. An unknown talk address (valid pattern, no such talk) is not specified; the design shows the same Not found page.
6. Empty states (no upcoming, no talks, no appearances) are not specified; decisions are given under Screens & states and should be confirmed.
7. `AGENTS.md` still describes the product as having "a creative talks graph and a contact form" and a Hono backend, which contradicts the approved spec (no contact form, no backend at runtime). Documentation drift, owner of AGENTS.md should reconcile.
8. No router or UI library is installed. The Not found behaviour and focus-on-navigation rules assume a client router; the plan or tasks stage must choose one.

ACs with no UI surface: AC-1.4 and AC-1.5 (owner process, recorded in this document), AC-7.1, AC-7.2 (content and build), AC-8.3 (implementation constraint). Cross-cutting rather than screen-specific: AC-9.2, AC-9.3.

Scope notes (UI added that no AC asks for): the Not found treatment of an unknown talk, the Home "Next" teaser list, the footer WellD line, and the skip link. The teaser and footer are part of the Home brief and AC-3.2/AC-1.3 intent; none adds a new page.

Dark mode: not requested and not designed. Each direction ships one colour scheme.

### Gap resolutions (owner, 2026-11-19)
1. "Upcoming" uses the visitor's current date, not build time: spec AC-5.2 amended.
2. Talk detail lists upcoming appearances too: spec AC-4.2 amended.
3. Empty-state decisions in this document are accepted as written.
4. An appearance always has exactly one language: spec AC-5.1 wording fixed.
5. AGENTS.md updated: static site, no contact form or backend features.
6. Photo and real content: coming from the owner; placeholder until then.
