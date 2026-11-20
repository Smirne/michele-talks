# Decisions — Organiser feedback

Choices the agents made that the spec, plan and tasks did not dictate. Disagree with one?
It is drift: amend the spec/plan and re-sync tasks — do not quietly edit the code.

## T1, T2, T5 · frontend-dev · 2026-11-20
- scope: edited `ContactPage.test.tsx`, `HomePage.test.tsx` and `ProfilePage.test.tsx` (one fixture line each) outside T1's touch list — why: the new required `photoDownload` on the published `Profile` breaks `tsc` in those fixtures — where: `frontend/src/features/{contact,home,profile}/*Page.test.tsx`
- reinterpretation: `Profile` is the published type (resolved `photoDownload`) and `RawProfile` is the schema type — why: consumers import `Profile` and tasks.md says the published `Content` type changes — where: `frontend/src/content/schema.ts`
- assumption: the "six poses" are `software-development`, `software-development-1`, `software-development-3`, `mobile-development`, `technical-analysis` and `ui`, with `ux-strategy` already present — why: those are the files design.md's placement table names — where: `frontend/src/assets/mascot/`
- default: `Mascot` props are `pose`, `alt` and `className`, with empty alt meaning decorative and size fixed at 360×200 — why: all brand poses are 360×200 and sizing is done by CSS at each placement — where: `frontend/src/components/mascot/Mascot.tsx`
- default: `PageHeader` reads `var(--title-size-page, clamp(28px, 3.6vw, 48px))` — why: T5 adds the token, and the fallback keeps T2 correct before it lands — where: `frontend/src/components/layout/PageHeader.module.css`
- default: Alt strings live in `commonStrings` under `common.mascot.alt.*`, including `homeContact` and `organisers`, which T3 and T4 will use — why: matches design.md's key table — where: `frontend/src/i18n/common.en.ts`
- default: added a new Talks test file and a Not found CSS module and test — why: stay clear of T6's `talks.test.tsx` and keep the Not found layout in a module — where: `frontend/src/features/talks/TalksPage.test.tsx`, `frontend/src/features/not-found/`
- default: bad-JPEG and missing-file fixtures are new directories (`bad-photo-download`, `missing-photo-download`) and the valid fixtures get a real 16×16 JPEG — why: the existing `ada.jpg` fixture is a text file — where: `frontend/src/content/__fixtures__/`

## T9, T3, T4, T6 · frontend-dev · 2026-11-20
- scope: added `frontend/src/components/content/button-class.ts` (exports `buttonClassName` and the `ButtonVariant` type), outside T4's `touch:` list, and exported `buttonClassName` from `content/index.ts` — why: `CopyButton` has to share the button look, and exporting it from `ButtonLink.tsx` triggered the react-refresh lint rule — where: `frontend/src/components/content/`
- reinterpretation: the talk head block is a `<div>`, not a `<header>` — why: with `<header>` the app-shell test found a second `banner` landmark, and the page must keep exactly one — where: `TalkDetailPage.tsx`
- default: `TalkDetailView` takes an optional `email` prop, defaulting to `defaultContent.profile.email` — why: the mailto address is `profile.email`, and tests need to inject it — where: `TalkDetailPage.tsx`
- default: the download link's `aria-label` is `{download}, {fileInfo}` (new string `profile.organisers.downloadAria`), with the visible text as two spans — why: design.md wants the name "Download photo, JPG, 1024 × 1024 px", and plain concatenation of the spans would drop the comma — where: `OrganisersSection.tsx`, `profile/strings.en.ts`
- default: the Profile band is `<section aria-labelledby>` (region "For organisers") and the bio box keeps the id `short-bio` from design.md even when it shows Italian or extended text — why: the id was the design's anchor and nothing else references it — where: `OrganisersSection.tsx`
- default: Mascot D in the organiser band and Home contact row uses CSS-sized `max-width` 220px (240px stacked at ≤820px) with a 2px ink border on Home — why: design.md's sizes; band D has no border since design.md gives none — where: `OrganisersSection.module.css`, `HomePage.module.css`
- assumption: a status-line "clear then set" re-announce is done by clearing on click, before the async clipboard call, rather than with a timer — why: the clipboard promise already separates the two renders — where: `CopyButton.tsx`, `OrganisersSection.tsx`
- assumption: the real-content bio test checks counts, first and last paragraphs and distinctive phrases rather than loading the notes file — why: that file is outside the repo, so a test cannot depend on it; the content itself was generated from it verbatim — where: `frontend/vite-plugins/content.test.ts`
- default: removed the old D-card test from `HomePage.test.tsx` — why: the feature it covered (D card with a WellD caption in the intro row) no longer exists — where: `HomePage.test.tsx`
