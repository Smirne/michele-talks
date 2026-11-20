# Decisions — Talk content update: merged talks, workshops and the archive

Choices the agents made that the spec, plan and tasks did not dictate. Disagree with one?
It is drift: amend the spec/plan and re-sync tasks — do not quietly edit the code.

## T1–T3 · frontend-dev · 2026-11-20
- default: the `offered` filter lives in `TalksView` and `HomeView` (the count only), not in the content pipeline — why: History rows and talk pages need `offered: false` talks to stay in published content, as the spec requires — where: `frontend/src/features/talks/TalksPage.tsx`, `frontend/src/features/home/HomePage.tsx`
- default: duration shows hours at 120 minutes or more, rounded to one decimal with a trailing .0 dropped; a range uses hours when its max is ≥ 120 and both ends share the unit, so `{min: 90, max: 150}` reads "1.5–2.5 hours" — why: follows "unit chosen by the largest value" — where: `frontend/src/components/content/format.ts`
- default: the note renders as a `<p>` set apart with a left border on `--mint`, and "No longer offered" as a muted mono line above it, both between the meta line and the abstract — why: reuses existing tokens, no visual-direction change — where: `frontend/src/features/talks/TalkDetailPage.tsx`, `TalkDetailPage.module.css`
- default: related links sit in a "Related links" section after the abstract and before "Also given as" — why: the notes require only "after the abstract" — where: `frontend/src/features/talks/TalkDetailPage.tsx`
- default: appearance co-hosts render as a "With …" line under the session title, styled like it, reset to `lang="en"` inside Italian rows — why: it is interface text — where: `frontend/src/components/content/AppearanceRow.tsx`
- assumption: Lego4Scrum and Repetition is Bad summaries and abstracts were written by the agent — why: the export was not in the repo — where: `frontend/content/talks.yaml` (superseded by the main loop: replaced with the owner's export text, commit 22ed89d)
- scope: `/talks/lego4scrum` and `/talks/repetition-is-bad` added to the e2e `ROUTES` list (a11y, reflow, reduced motion) — why: new page types get the same floor checks — where: `frontend/e2e/site.e2e.ts`
- reinterpretation: `rel="noopener"` applied to the new related links only — why: existing `ResourceLink` and event links do not carry it, so "like other external links" did not match the code — where: `frontend/src/features/talks/TalkDetailPage.tsx`
- default: the duplicate-level-pair and empty co-host rules report on `level` and `coHosts` (an empty name on `coHosts.0`) — why: the notes name the field only — where: `frontend/src/content/schema.ts`
