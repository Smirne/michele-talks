# Decisions — Sticker Sheet look, designer feedback and stage material

Choices the agents made that the spec, plan and tasks did not dictate. Disagree with one?
It is drift: amend the spec/plan and re-sync tasks — do not quietly edit the code.

## T1–T3 · frontend-dev · 2026-11-22
- scope: kept the `!important` lines in `global.css`'s reduced-motion block; AC-1.4 and T2's "no !important" grep apply to the new styles — why: removing them breaks the reduced-motion guarantee — where: `frontend/src/styles/global.css`
- scope: added `styles.invite` to `HomePage.tsx` and edited one `TalkCard` assertion in `content.test.tsx`, both outside the touch lists — why: avoids `nth-child` and keeps tests green — where: `frontend/src/features/home/HomePage.tsx`, `frontend/src/components/content/content.test.tsx`
- default: Home's "Next" rows flattened with `.rows > li` inside Home's own module — why: avoids a sticker inside a sticker, no cross-module class names — where: `frontend/src/features/home/HomePage.module.css`
- default: Home's timetable `.label` elements get `display: none` — why: they duplicate the headings, as the spike did — where: `frontend/src/features/home/HomePage.module.css`
- default: white focus ring on the ink "Invite me" sticker and on footer links — why: the 4px ink ring is invisible on ink — where: `HomePage.module.css`, `SiteLayout.module.css`
- default: organiser bio box uses a banana background inside the white band; the talk-page note is a white bordered sticker — why: the spike had no rule for these — where: `OrganisersSection.module.css`, `TalkDetailPage.module.css`
- assumption: the `--font-mono` token and Space Mono stay for the date, label and meta text, as in the spike — where: `tokens.css`

## T7–T9 · frontend-dev · 2026-11-22
- default: Green Software Italia gets 3 cards (`greensoftwareitalia-2` first, then `greensoftwareitalia`, then the CNCF card) instead of the 2 in AC-7.5 — why: caller instruction; the spec count was out of date — where: `frontend/content/appearances.yaml`, `content/media/cards/green-software-italia-sustainability-month-2026-{1,2,3}.webp`
- default: card files named `<appearance-id>-<n>.webp`, Pillow, longest side ≤800px, quality 85 (all under 60 KB) — where: `frontend/content/media/cards/`
- default: no per-card `alt` in content; every card uses "Social card for <event>" — why: no alt texts given; schema allows `alt` later — where: `frontend/content/appearances.yaml`
- reinterpretation: the `alt` default is applied in `AppearanceRow` rather than in the content layer; `cards[].alt` is optional in `Content` — why: `t()` is not available in the Vite plugin — where: `frontend/src/content/schema.ts`, `AppearanceRow.tsx`
- assumption: two cards of one event share the default alt; the "n of total" counter tells them apart — where: `CardViewer.tsx`
- default: previous/next wrap around; the dialog resets to the first card on open — where: `CardViewer.tsx`
- default: thumbnail sits in the row's right-hand column under the language badge and place, 64px high, sticker border — why: keeps the row layout unchanged without cards (AC-7.4) — where: `CardViewer.module.css`
- default: explicit `keydown` Escape handler besides the native cancel — why: testable in jsdom; focus return via the `close` event — where: `CardViewer.tsx`
- default: the dialog image renders only while open — where: `CardViewer.tsx`
- scope: new strings under `content.card.*` — where: `frontend/src/components/content/strings.en.ts`

## T4–T6 · frontend-dev · 2026-11-22
- scope: edited `TalkDetailPage.module.css` (outside T4 touch): the aside's cell spans both rows and the two-column layout starts at 861px instead of 1280px — why: the aside needs room to stick, sticky from 861px per the contract — where: `frontend/src/features/talks/TalkDetailPage.module.css`
- scope: edited `contact/strings.en.ts` (outside T5 touch): `contact.reach` ("Reach me") replaces `contact.email` and `contact.profiles` — where: `frontend/src/features/contact/strings.en.ts`
- reinterpretation: earlier e2e assertions (Home "Talks" CTA within the 800px fold from 001/003; the 2015 row visible on On stage) edited to match 005 — why: AC-2.1 and AC-4.2 supersede them — where: `frontend/e2e/organiser-feedback.e2e.ts`, `frontend/e2e/site.e2e.ts`
- default: Contact email and profile links are one list, email first in the display font — where: `ContactPage.tsx`
- default: Contact items top-aligned and shrunk (email 20px, links 16px, gap 12px) to fit 8 links in one row at 1280px — where: `ContactPage.module.css`
- default: Home graph placeholder sits inside the board grid, left column, so the invite sticks to the end of the page — where: `HomePage.tsx`, `HomePage.module.css`
- default: easter egg shows whenever there is ≥1 past appearance and all are shown — where: `HistoryPage.tsx`
- default: live region text only when past rows exceed 5 — where: `HistoryPage.tsx`
- default: after "Show more" the first new row `li` gets `tabIndex=-1` and focus, with a focus outline — why: `AppearanceRow` takes no ref — where: `HistoryPage.tsx`, `HistoryPage.module.css`

## T10–T11 · frontend-dev · 2026-11-22
- default: stage photos named `<page>-<event>-2026.webp`, Pillow quality 82 — where: `frontend/src/assets/stage/`
- default: header image slot crops every photo to 3:2 (`object-position` 35% from top), sticker border and 2.5deg tilt, 128px wide on mobile / 240px from 640px — why: the portrait Contact photo would make the header tall — where: `StagePhoto.module.css`, `PageHeader.module.css`
- default: `photos.ts` map holds per-page `src`, so a credit has one place to go — where: `src/components/stage-photo/photos.ts`
- default: neutral alt texts, no name for the person in the Contact and Cloud Day photos, "the speaker" for DevFest — why: could not confirm who is pictured — where: `src/i18n/common.en.ts`
- scope: also removed D from the Home invite and the Profile organisers band (now one column) — why: AC-5.4 "no D elsewhere" — where: `HomePage.tsx`, `OrganisersSection.tsx` and their CSS/tests
- scope: `Mascot` reduced to the `ux-strategy` pose; unused PNGs and `common.mascot.alt.*` strings removed — where: `src/components/mascot/Mascot.tsx`, `src/i18n/common.en.ts`
- default: footer logo 18px high, inline after "CTO and co-founder @" inside the WellD link, replacing the word — where: `SiteLayout.tsx`, `SiteLayout.module.css`
- scope: T11 sweep in a new `e2e/sweep.e2e.ts` — where: `frontend/e2e/sweep.e2e.ts`
- assumption: a pass of axe `color-contrast` is the AC-1.3 criterion; no Sticker Sheet CSS needed a fix — where: `frontend/e2e/sweep.e2e.ts`
