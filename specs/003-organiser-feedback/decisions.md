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
