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
