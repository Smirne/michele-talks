---
spec: 003
status: draft
---

# Design: Organiser feedback (photo, D, organiser kit, talk page CTA, titles, topics)

Spec: `specs/003-organiser-feedback/spec.md` (approved, rigor mvp, no plan.md by design).
Text-only design: no mockups, no visual companion.

Builds on feature 002's talk page and card (note, level and duration ranges, co-hosts, related links, "Quickie", "No longer offered"). 002 is implemented on another branch and is not in this worktree; this design names where each 002 element sits so the two merge without a layout fight (see "Talk card" and "Talk page").

## Flows

Seven flows. AC-4.8 (build validation) and AC-7.2 (resolved by 002) have no UI surface.

### F1. See the speaker on Home (US-1: AC-1.1, AC-1.2)
1. Visitor lands on Home. The intro row shows the speaker's photo from `profile.photo`, with `profile.photoAlt`, in the right-hand column where the D card was.
2. At 375px the photo comes first in the intro row (above the name and short bio), 240px wide, no horizontal scroll.
3. Error exit: photo fails to load: the existing `ProfilePhoto` monogram shows, keeping the alt text.

### F2. D across the site (US-2: AC-2.1 to AC-2.4)
1. Every page: the footer shows D next to the WellD link (decorative image, the link beside it names WellD).
2. Not found page (and unknown talk address): D "searching" is the main image.
3. Each main page shows one extra D at the place given in "D placement" below. A page where D does not fit shows none and is recorded there (result: all five fit; the talk detail page is not a main page and gets none).

### F3. Copy the short bio (US-3: AC-3.1 to AC-3.3)
1. Visitor opens Profile, finds the "For organisers" band below the two-column profile.
2. Activates "Copy bio". Success exit: the bio's exact text (`profile.bioShort`) is on the clipboard; the status line next to the button reads "Bio copied to the clipboard." and a polite live region announces the same text.
3. Error exit: the clipboard API is missing (insecure context, old browser) or `writeText` rejects: the status line reads "Copying failed. Select the text above and copy it yourself." (announced the same way) and the bio text is selected programmatically as a courtesy; it stays selectable by hand either way.
4. Repeating the action re-announces (message is cleared, then set on the next tick).

### F4. Download the photo (US-3: AC-3.4, AC-3.5)
1. In the same band, the visitor activates "Download photo, JPG, 1024 × 1024 px".
2. The browser saves a file named `michele-giacobazzi.jpg` (the `download` attribute sets the name; the link points at the image file, never at a page).
3. Error exit: none in the UI (a plain file link; a broken file is a build/content error, see Gaps).

### F5. Invite with a talk, see it delivered (US-4: AC-4.1 to AC-4.7, US-5: AC-5.1)
1. Visitor opens a talk page from the Talks list, History or Home.
2. At 1280px and wider the aside sits to the right of the title, facts and abstract. At 375px it sits below the title and facts, before the abstract.
3. "Invite me with this talk" opens the visitor's mail client addressed to `profile.email` with the subject "Speaker invitation: <talk title>" (no body).
4. "Recording (EN), <event>" opens the featured recording (the talk's chosen one, else the most recent appearance video). "Slides (EN), <event>" opens the most recent appearance's slides.
5. Absent states: no video: the recording row is absent; no slides: the slides row is absent; neither: only the invitation shows. Talk "no longer offered": no invitation; recording and slides still show if they exist (decision: they are archive value and AC-4.2 only forbids the invitation); if nothing is left the aside is not rendered and the page is one column at every width.

### F6. Scan the talk list (US-5: AC-5.2, AC-5.3, US-6: AC-6.1, AC-6.3)
1. Talks page: each card shows its title in sentence case, no underline until hover or keyboard focus, at most two lines at 1280px, then summary, facts, and topic tags.
2. Absent state: a talk with no topics shows no tag row and no gap.

### F7. Home talks band label (US-7: AC-7.1)
The orange band keeps its colour, position and heading; only the "● Now" label and its dot go. New label: "Talks".

## Screens & states

Content is bundled at build time, so there is no network loading state. "Loading" means asset loading only; every image below has width and height so nothing shifts.

### Shell footer (AC-2.1, AC-2.4)
- Layout: one row, `D (64 × 64) | "I'm CTO and co-founder of" WellD-link`. 375px: same row, the text wraps beside D.
- D image: pose `software-development.png` (D's head in a laptop frame), shown in a 64 × 64 box with `object-fit: cover` (centre crop keeps the head and the frame), 2px ink border. `alt=""` (decorative): the adjacent WellD link already names it.
- States: image fails to load: nothing breaks, the link remains. Empty/error: not applicable.

### Home (AC-1.1, AC-1.2, AC-2.3, AC-7.1)
- Intro row (label "Speaker" | name + short bio + languages | photo). The grid column that held the D card (220px) becomes 240px for the photo. The photo reuses `ProfilePhoto` with a 1:1 ratio (the source file is square, a 4:5 crop would cut the sides), 4px ink border as on Profile.
- Talks band (orange): label text "Talks", no dot (`.dot` rule and any animation for it removed; the `.now` class is renamed to a neutral name such as `.featured`). Everything else unchanged.
- Contact row (label "Invite" | text + two CTAs | D): the third column holds D `mobile-development.png` (D holding a phone), 220 × 122, 2px ink border. Alt: "D, the WellD mascot, holding a phone".
- 375px: the grid is one column (existing behaviour). Intro: photo first (240px, left-aligned), then label, name, bio. Contact row: D after the two CTAs, max 240px wide.
- Risk to verify: spec 001 AC-2.3 (Talks CTA and email CTA within 800px at 1280 × 800). A 240px photo makes the intro row about 65px taller than the D card did. If the email CTA falls below 800px, shrink the photo column to 200px; do not drop the photo.
- Empty/error: no photo load = monogram. No upcoming = existing "Recently" fallback.

### Profile (AC-3.1 to AC-3.5, AC-2.3)
- Existing two-column layout (photo | bio, topics, WellD sentence, closing CTAs) is unchanged.
- New full-width band below it, a board row with a 4px ink top rule: heading `h2` "For organisers", then:
  1. Intro line: "Use this bio and photo in your programme."
  2. The short bio in a `<p id="short-bio">` (plain text, selectable, max 68ch, white fill, 2px ink border so it reads as copy material).
  3. Action row: `Copy bio` (a `<button type="button">`, primary look) and `Download photo` (a link, secondary look) with the file facts "JPG, 1024 × 1024 px" inside the same link, on a second line in mono 13px.
  4. Status line under the actions: `<p role="status">`, always in the DOM, empty until used.
  5. Right column: D `software-development-3.png` (D with a documents icon), 220 × 122. Alt: "D, the WellD mascot, with a documents icon".
- 375px: single column: heading, intro, bio, the two buttons stacked full width (each at least 44px tall), status, then D (max 240px).
- States: copied (status "Bio copied to the clipboard."), clipboard failure (status "Copying failed. Select the text above and copy it yourself." plus the bio selected), idle (status empty, no reserved box beyond one line of height to avoid shift).

### Talks list (AC-5.2, AC-5.3, AC-6.1, AC-6.3, AC-2.3)
- Page header carries D `technical-analysis.png` (D with a code bubble) at the right of the big heading: 240 × 133 at 1280px, 128 × 71 at 375px (it stays beside "TALKS": the word is about 130px wide at 48px). Alt: "D, the WellD mascot, with a code speech bubble".
- Talk card, top to bottom (see "Talk card" for 002 elements):
  1. Title (`h2`, link).
  2. Summary.
  3. Facts row (duration, level, format, language badges).
  4. 002 "With <names>" line, when co-hosts exist.
  5. Topic tags, when topics exist.
- Empty (no talks): unchanged ("No talks listed yet..."). The D in the header still shows.

### Talk card (AC-5.2, AC-5.3, AC-6.1, AC-6.3; 002 elements)
- Title style: new token `--title-size-card: clamp(24px, 2.4vw, 32px)`, `text-transform: none` (sentence case exactly as written in the content), weight 800, line-height 1.1. At 1280px that is about 31px; the longest title (98 characters, "Before Delegating to Agents: ADRs and Spec-Driven Development as the Foundation for AI in the Team") needs about 1,160px in this condensed face, so it takes two lines in the 1,152px column. No line clamp, never truncate; a test at 1280px guards AC-5.3.
- Link: `text-decoration: none`; `underline` on `:hover` and `:focus-visible` (the existing 3px signal focus ring stays). The title is the only link of the card.
- 002 placement: duration and level ranges and "Quickie" format text replace the values inside the facts row (same slots, no new elements); the co-host line "With <names>" is its own line directly under the facts row (mono, muted, 14px); the note, related links and "No longer offered" do not appear on the card (002 puts the note and links on the page; archived talks are not listed).
- Topic tags: see `TopicTags`. Order as in the content, no cap (about 4 per talk).

### Talk page (AC-4.1 to AC-4.7, AC-5.1, AC-6.2, AC-6.3; 002 elements)
Three blocks in the DOM, in this order, so reading order, tab order and the 375px layout agree:
1. **Head block** (`header`): title `h1`; 002 "No longer offered" status chip (only for archived talks, above the facts); facts bar (duration, level, format, language badges; 002 "With <names>" as a last item or line); topic tags.
2. **Aside** (`<aside aria-label="Invitation and links">`): see "Talk aside".
3. **Body**: 002 note (highlighted box, set apart from the abstract), abstract, 002 related links ("read more" list, after the abstract), "Also given as", appearances (Upcoming, Past), "All talks" back link.

Page title style: new token `--title-size-page: clamp(28px, 3.6vw, 48px)`, sentence case, weight 800, line-height 1.1 (the 112px uppercase heading stays on the other pages through `PageHeader`'s default; the talk page passes `size="compact"`). At 1280px: about 46px; the longest title wraps to 3 lines in the 750px left column (about 145px tall).

Layout:
- 1280px and wider (`@media (min-width: 1280px)`): CSS grid `minmax(0, 1fr) 340px`, gap 48px, areas "head aside" / "body aside"; aside top-aligned with the title. Height check at 1280 × 800 for the longest title: header 80 + main padding 48 + title 145 + facts about 60 + topics about 40 puts the facts, tags and the aside (starting at y = 128) all inside 800px. The invite button is at about y = 160. AC-5.1 holds with the 002 note and abstract below the fold.
- Below 1280px (including 375px): one column in the DOM order above: head, aside (full width, max 480px at tablet), body. At 375px the invite button lands about 300 to 420px from the top for a three-line title, so it is on the first screen; the 002 note follows the aside (it is still under the title and set apart from the abstract, satisfying 002 AC-2.1).
- Archived talk with no links: no aside; head and body fill the width (single column at all widths).

States:
- Absent topics: no tag row, no heading, no gap (AC-6.3).
- Absent note, co-hosts, links, also-given-as: nothing rendered (002 rules).
- Aside states in "Talk aside".
- Unknown address: Not found page (unchanged).

### Talk aside (AC-4.1 to AC-4.6)
- Box: white fill, 3px ink border, 24px padding, no radius; reads as a "session card" in the Programme Board language.
- Content, top to bottom:
  1. Primary button-link "Invite me with this talk": `mailto:<email>?subject=<encodeURIComponent("Speaker invitation: " + title)>` (so spaces are `%20`; no body).
  2. Hint, muted mono 13px: "Opens your email app with the talk title as the subject."
  3. Divider (2px ink), then a short list of links, each its own line:
     - "Recording (EN), <event>"
     - "Slides (EN), <event>"
     The language text is the appearance language of the chosen resource, the event is the appearance's `event`. Both links use `hrefLang` and the same mono 14px link style as `ResourceLink`; the accessible name is "Recording (EN), English, <event>" (the `ResourceLink` pattern with the event appended).
- Source rules: recording = the talk's featured recording when content names one (matched to that talk's appearance video to get language and event), else the video of the most recent appearance that has one; slides = the slides of the most recent appearance that has them. Both are derived, not typed in the aside.
- States: both present (full); only video; only slides; neither (button and hint only); archived with links (list only, no button, no hint, no divider); archived with none (aside absent).

### History (AC-2.3 only)
- No change beyond D: `ui.png` (teal; D holding a round chart) in the page header, same sizes as Talks. Alt: "D, the WellD mascot, holding a pie chart" (check the pose when implementing and reword if it reads differently).

### Contact (AC-2.3 only)
- D `software-development-1.png` (D presenting an open laptop) in the page header, same sizes as Talks. Alt: "D, the WellD mascot, holding an open laptop".

### Not found (AC-2.2, AC-2.4)
- Existing h1 "Page not found", sentence, "Back to Home" link, in the left column; D `ux-strategy.png` (D searching with a magnifying glass) is the main image in the right column at 360 × 200 (native size; it is the only element besides the text). Alt: "D, the WellD mascot, searching with a magnifying glass" (informative, because it reinforces the message).
- 375px: image below the link, full width up to 360px. This page is the error state for unknown talk addresses too.

## D artwork and placement (AC-2.1 to AC-2.4)

Source: the owner confirmed the `anthropic-skills:welld-brand` skill holds D artwork. Library: `<skill base>/assets/images/`, where `<skill base>` is `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a6d12180-f257-44af-9bc1-679cc218f054/69ca05bc-dc48-4616-b2a9-f45bfb1c67e5/skills/welld-brand` (20 PNGs, 360 × 200, no SVG sources in the package). The file already in the repo, `frontend/src/assets/mascot/ux-strategy.png`, is byte-identical to the skill's `ux-strategy.png` (checked), which confirms the provenance.

Rules applied from the skill: reuse existing artwork first (no generation, no edits, no recolouring; D is never redrawn); pick the teal and violet variants only. The red variant is excluded because the Programme Board's signal orange (#b43a08) is a red-family accent, and the brand rule forbids two competing reds.

| Placement | Pose file (source path under `<skill base>/assets/images/`) | Variant | Copy to repo as |
|---|---|---|---|
| Footer (every page) | `software-development.png` | violet | `frontend/src/assets/mascot/software-development.png` |
| Not found, main image | `ux-strategy.png` | teal | exists: `frontend/src/assets/mascot/ux-strategy.png` |
| Home, contact row | `mobile-development.png` | violet | `frontend/src/assets/mascot/mobile-development.png` |
| Profile, "For organisers" band | `software-development-3.png` | violet | `frontend/src/assets/mascot/software-development-3.png` |
| Talks, page header | `technical-analysis.png` | violet | `frontend/src/assets/mascot/technical-analysis.png` |
| History, page header | `ui.png` | teal | `frontend/src/assets/mascot/ui.png` |
| Contact, page header | `software-development-1.png` | violet | `frontend/src/assets/mascot/software-development-1.png` |

Six new files, one existing, about 60 KB in all. Files are copied unmodified; names kept as in the skill (they already satisfy its `a-z 0-9 . _ -` rule).

Page-by-page fit (AC-2.3):

| Page | D? | Place | Why it fits / why not |
|---|---|---|---|
| Home | yes | contact row, third column | the column is free once the photo takes the intro row |
| Profile | yes | "For organisers" band, right column | the documents pose matches the copy and download material |
| Talks | yes | page header, right of the heading | the code-bubble pose matches the subject |
| History | yes | page header, right of the heading | header space is free; no list row is displaced |
| Contact | yes | page header, right of the heading | laptop pose suits "write to me" |
| Talk detail (not a main page) | no | none | the aside is the focus of that page |

No main page is recorded as "D does not fit".

Alt text (AC-2.4): footer is decorative (`alt=""`) because the WellD link beside it says what it stands for. Every other D has a short alt text naming what it shows (strings below), because no adjacent text describes the pose. If the owner prefers quieter pages, a placement can be made decorative only by adding a visible caption that says the same thing; do not mark one decorative without it.

Artwork needs (not blocking): the package has only 360 × 200 PNGs, so on 2x screens each D is slightly soft; request SVG or `@2x` versions of the seven poses from the WellD brand set when available. The 404 image is held to its native 360 × 200 for that reason. No extra pose has to be generated.

## Component inventory

Library in use: none. Plain React 19 with CSS modules and the tokens in `frontend/src/styles/tokens.css` (no Mantine, Tailwind or MUI in `frontend/package.json`). Router: TanStack Router. Strings: `t()` over `strings.en.ts` files. The 001 design system ("Programme Board + D card") wins; no Visual direction section.

| Element | Component | Reuse / NEW |
|---|---|---|
| Home photo, Profile photo | `ProfilePhoto` (`frontend/src/components/profile-photo/ProfilePhoto.tsx`) | EXTEND: optional `aspect` prop (`'4/5'` default, `'1/1'` for Home) |
| Header with heading | `PageHeader` (`frontend/src/components/layout/PageHeader.tsx`) | EXTEND: optional `mascot` slot and `size="compact"` |
| Footer | `SiteLayout` footer (`frontend/src/components/layout/SiteLayout.tsx`) | EXTEND: D beside the link |
| Buttons and link-buttons | `ButtonLink` (`frontend/src/components/content/ButtonLink.tsx`) | EXTEND: optional `download` (href variant only) and an exported class helper so `CopyButton` shares the look |
| Talk card | `TalkCard` (`frontend/src/components/content/TalkCard.tsx`) | EXTEND: title style, hover-only underline, `TopicTags` |
| Language labels | `LanguageBadge` | REUSE |
| Resource links style | `ResourceLink` pattern | REUSE (pattern mirrored in the aside, not the component: its label has no event) |
| Talk page | `TalkDetailView` (`frontend/src/features/talks/TalkDetailPage.tsx`) | EXTEND: grid with head, aside, body |
| Home, Profile, Not found, History, Contact pages | existing page components | EXTEND (modify) |
| Appearance rows | `AppearanceRow` | REUSE, untouched |
| Mascot image | `Mascot` (`frontend/src/components/mascot/`): typed pose name to imported asset, size, alt text or decorative | NEW: seven placements, one per surface; a registry keeps alt strings and file names in one place |
| Topic tags | `TopicTags` (`frontend/src/components/content/`) | NEW: used by card and talk page; nothing in the repo renders chips |
| Invite and links box | `TalkAside` (`frontend/src/features/talks/`) | NEW: no existing component builds a mailto subject or picks the latest video and slides |
| Copy action | `CopyButton` (`frontend/src/features/profile/`) | NEW: the only real `<button>` and the only clipboard and live-region logic in the app; `ButtonLink` is links only by design |
| Organiser band | `OrganisersSection` (`frontend/src/features/profile/`) | NEW: composes the heading, bio, `CopyButton`, download link and D; single use, so kept inside the profile feature |

Counts: 10 reused or extended (REUSE 3 incl. the pattern, EXTEND 7) to 5 NEW. Ratio 10 : 5.

Token additions in `tokens.css` (no hex outside it): `--title-size-card`, `--title-size-page`, `--tag-bg: var(--white)`, `--tag-ink: var(--ink)`, `--tag-border: var(--ink)`, `--tag-size: 13px`.

`TopicTags` spec: `<ul role="list" aria-label="Topics">`, each `<li>` a chip: mono 13px, white fill, 1px ink border, ink text, padding 2px 8px, `overflow-wrap: anywhere`, row gap 8px. Chips are not links and have no hover state (nothing about them is clickable until the later filter feature). Renders nothing when the array is empty.

`Mascot` spec: props `pose` (union of the seven names), `width`, `height`, optional `decorative`. Alt strings come from `t()`; `width` and `height` attributes always set.

## New UI strings (all through `strings.en.ts` and `t()`)

| Key | English |
|---|---|
| `home.talks.label` (was "Now") | `Talks` |
| `home.dCard.*` | removed |
| `common.mascot.alt.notFound` | `D, the WellD mascot, searching with a magnifying glass` |
| `common.mascot.alt.homeContact` | `D, the WellD mascot, holding a phone` |
| `common.mascot.alt.organisers` | `D, the WellD mascot, with a documents icon` |
| `common.mascot.alt.talks` | `D, the WellD mascot, with a code speech bubble` |
| `common.mascot.alt.history` | `D, the WellD mascot, holding a pie chart` |
| `common.mascot.alt.contact` | `D, the WellD mascot, holding an open laptop` |
| footer D | decorative, no string |
| `profile.organisers.title` | `For organisers` |
| `profile.organisers.intro` | `Use this bio and photo in your programme.` |
| `profile.organisers.copy` | `Copy bio` |
| `profile.organisers.copied` | `Bio copied to the clipboard.` |
| `profile.organisers.copyFailed` | `Copying failed. Select the text above and copy it yourself.` |
| `profile.organisers.download` | `Download photo` |
| `profile.organisers.fileInfo` | `{format}, {width} × {height} px` (renders "JPG, 1024 × 1024 px") |
| `talks.aside.label` | `Invitation and links` |
| `talks.aside.invite` | `Invite me with this talk` |
| `talks.aside.hint` | `Opens your email app with the talk title as the subject.` |
| `talks.aside.subject` | `Speaker invitation: {title}` |
| `talks.aside.recording` | `Recording ({language}), {event}` |
| `talks.aside.slides` | `Slides ({language}), {event}` |
| `talks.aside.recordingAria` | `Recording ({language}), {languageName}, {event}` |
| `talks.aside.slidesAria` | `Slides ({language}), {languageName}, {event}` |
| `content.topics.label` | `Topics` (list's accessible name) |

Not new (owned by 002): note, "With <names>", "No longer offered", "Quickie", related-links heading and labels.

Photo download file: convert the owner's best file `/Users/michele.giacobazzi/Desktop/wspace/personal/michele-talks/pics/lisbon-fixed.png` (1024 × 1024 PNG, 1.1 MB, outside the repo's tracked files and absent from this worktree) to JPEG, quality 90, sRGB, white background kept, 1024 × 1024 (no resampling), and store it as `frontend/content/media/michele-giacobazzi-1024.jpg` (about 0.2 to 0.4 MB expected). The served name is whatever the bundler gives; the saved name is set by `download="michele-giacobazzi.jpg"`. Format text: "JPG" with the real pixel size read from the file at build (never typed by hand), shown as "JPG, 1024 × 1024 px". The profile content gains one field for this file (for example `photoDownload`); the 800px `michele-giacobazzi.jpg` stays the on-page photo.

## Accessibility

- **Copy live region (hotspot).** `<p role="status">` sits in the DOM from first render, empty; text is set on activation, so screen readers announce it politely. The same text is visible next to the button (no visual-only or audio-only signal). The button's own name does not change (no double announcement). Repeats re-announce (clear, then set). Failure text is a sentence, not colour: ink text on mint (13.4:1) with a 4px signal left rule as extra emphasis only.
- **Clipboard failure.** Bio is a plain paragraph (no `user-select: none`); on failure it is also selected with the Selection API, so Ctrl or Cmd+C works at once.
- **Download link semantics (hotspot).** A real `<a href download>`, so the role is link and the file is not a page; its accessible name includes the format and size ("Download photo, JPG, 1024 × 1024 px"), satisfying AC-3.5 for screen reader users too. At least 44px tall.
- **Invite and links.** Native links. The mailto link's name is its visible text; the hint is plain text after it (not `aria-describedby`, so it is read in order). `aside` has an accessible name. Each resource link's aria-label starts with its visible text. Focus order follows the DOM: title, facts, tags, aside, note, abstract; at 1280px the aside is visually to the right but comes before the abstract in reading and tab order, matching 375px.
- **Talk title and heading levels.** Talk page: one `h1` (title). Aside has no heading (landmark name instead); body sections keep `h2`. Card titles stay `h2`. Sentence case needs `text-transform: none` on those headings only; other headings keep uppercase.
- **Hover-only underline.** Underline appears on `:hover` and `:focus-visible` together with the existing 3px signal focus ring, so keyboard users get both; the title remains distinguishable as a link by position and colour contrast (ink on mint 13.4:1) and the card is the sole link in the heading.
- **Tags.** Text ink on white 15.6:1 (minimum 4.5:1 for 13px text). Border 1px is decorative; the text carries the meaning. List semantics are kept (`role="list"`, labelled "Topics") because `list-style: none` removes them in Safari. Chips are not focusable and not styled as interactive.
- **Alt text.** See "D artwork": footer `alt=""`; every other D has a descriptive alt. The profile photo uses `profile.photoAlt` ("Portrait of Michele Giacobazzi") on Home and Profile; on Profile both the photo and the band's D are present, the band's alt is distinct.
- **Not found.** Focus moves to the h1 on arrival (existing behaviour); the D image is not focusable.
- **Reduced motion.** The dot's pulse goes away with the dot; no new animation is introduced.
- **Targets and reflow.** Copy and download controls 44px minimum height; at 375px they stack full width; no horizontal scroll on any page (images use `max-width: 100%` with fixed aspect).
- **Contrast of the aside.** Muted hint #3f5a4c on white: about 7.5:1; button ink-on-mint and hover ink-on-white pairs are the existing ones.

## Acceptance criteria to screen element

| AC | Satisfied by |
|---|---|
| AC-1.1 | Home intro row, right column: `ProfilePhoto` (`profile.photo`, `profile.photoAlt`) in place of the D card |
| AC-1.2 | Home at 375px: photo first, 240px wide, stacks in one column |
| AC-2.1 | Footer D (`software-development.png`) beside the WellD link, every page |
| AC-2.2 | Not found page: `ux-strategy.png` as the main image |
| AC-2.3 | "D artwork and placement" table: Home contact row, Profile organiser band, Talks, History and Contact page headers; no page recorded as not fitting |
| AC-2.4 | Footer D decorative; all other D have alt strings (`common.mascot.alt.*`) |
| AC-3.1 | Profile "For organisers" band (`h2`) with `profile.bioShort` in `#short-bio` |
| AC-3.2 | `CopyButton` + `role="status"` line reading "Bio copied to the clipboard." |
| AC-3.3 | `CopyButton` failure branch: "Copying failed. Select the text above and copy it yourself."; bio stays selectable |
| AC-3.4 | "Download photo" link with `download="michele-giacobazzi.jpg"` to the 1024px JPG |
| AC-3.5 | File info "JPG, 1024 × 1024 px" inside the download link |
| AC-4.1 | Talk aside: "Invite me with this talk" mailto, subject "Speaker invitation: <title>" |
| AC-4.2 | Talk aside: button and hint omitted when the talk is no longer offered |
| AC-4.3 | Talk aside: "Recording (EN), <event>" from the most recent appearance with a video |
| AC-4.4 | Talk aside: the featured recording replaces the default; language and event from its appearance |
| AC-4.5 | Talk aside: "Slides (EN), <event>" from the most recent appearance with slides |
| AC-4.6 | Talk aside: missing rows are absent; neither means only the invite; aside absent when nothing is left (archived) |
| AC-4.7 | Talk page grid: aside right of head and body at 1280px+; below head, above body at 375px |
| AC-4.8 | No UI surface (build validation); see Gaps |
| AC-5.1 | Talk page 1280 × 800: compact title (about 145px, 3 lines for the longest), facts bar, aside with invite all above y = 800 |
| AC-5.2 | Talk card title: sentence case, underline on hover and focus only |
| AC-5.3 | Talk card title token `--title-size-card` (about 31px at 1280px): the longest title takes two lines |
| AC-6.1 | `TopicTags` on every talk card |
| AC-6.2 | `TopicTags` in the talk page head block |
| AC-6.3 | `TopicTags` renders nothing for an empty list (no heading, no gap) |
| AC-7.1 | Home orange band label "Talks", dot removed |
| AC-7.2 | No work here (002); the "Talk" format text on cards is unchanged |

## Gaps, flags and scope notes

- **Added UI no AC asks for (kept small):** the hint under the invite button; the recording and slides links on archived talks; the band intro line on Profile; `size="compact"` page titles on the talk page only. Each can be cut without breaking an AC.
- **No UI surface:** AC-4.8, AC-7.2.
- **Photo source is outside the repo.** `pics/lisbon-fixed.png` lives at the main checkout root and is not in this worktree; the implementer copies it from the absolute path above. The spec says "photo file named after the speaker (e.g. `.jpg`)" but the owner's source is a PNG: the design converts to JPEG; the spec does not say so.
- **No content field exists for the download file** and nothing checks that its pixel size matches the label; a field and a build-time size read are needed, with no AC covering them.
- **Featured recording field** has no name in the spec; the design assumes a per-talk field holding the video URL, validated against that talk's appearance videos (AC-4.8).
- **"Most recent" ties** (two appearances on the same date) are not defined; suggest content order as the tie-break.
- **002 dependency:** 003 builds on 002's schema and card/page, but 002 is not in this worktree (its fields `note`, `coHosts`, `links`, ranges, "no longer offered" are absent from `frontend/src/content/schema.ts`; only a `hidden` flag exists). Implement 003 on top of merged 002, or expect conflicts in `TalkCard`, `TalkDetailPage`, `AppearanceRow` and the schema.
- **Spec 001 AC-2.3 risk:** the taller Home photo may push the email CTA below 800px at 1280 × 800 (mitigation in the Home section).
- **AC-2.4 wording:** "decorative when the text next to it says what it shows" is true only for the footer; the design therefore gives alt text everywhere else rather than stretching the exception.
- **Spec open question** about D artwork is settled here: the skill's library supplies all seven poses, no generation needed.
