---
spec: 002
generated: 2026-11-20
synced: 2026-11-20
---

# Tasks: Talk content update: merged talks, workshops and the archive

## Architecture notes
- **Components:** frontend only, same stack and conventions as 001 (`specs/001-site-foundation/tasks.md`
  Architecture notes). No new dependencies, no new routes, no visual-direction change: new
  elements reuse the existing tokens and components.
- **Schema changes** (`frontend/src/content/schema.ts`, talks unless noted):
  - `level`: `Level | [Level, Level]` where `Level = beginner|intermediate|advanced`. A pair
    must be strictly ascending (`[beginner, intermediate]` ok; `[intermediate, beginner]` and
    `[beginner, beginner]` are errors on field `level`).
  - `durationMinutes`: positive int **or** `{ min: int > 0, max: int > 0 }` with `min < max`
    (error on `durationMinutes`).
  - `format`: adds `quickie`.
  - `note?`: non-empty string (one line, public). Shown under the title on the talk page.
  - `coHosts?`: non-empty string[] (≥1). Same field, same rule, on **appearances**.
  - `links?`: `{ label: non-empty, url: http(s) }[]`.
  - `offered`: boolean, default `true`. `offered: false` = "no longer offered" (glossary): kept
    in published content, so its page and appearances work; excluded only from the Talks list
    and the Home talk count. Distinct from `hidden` (not published at all), and an appearance
    may link to it.
- **Display rules** (strings in the owning namespaces, never inline):
  - Level range: the two labels joined with an en dash, "Beginner–Intermediate".
  - Duration: the unit is chosen by the largest value: < 120 → minutes ("35 minutes"),
    ≥ 120 → hours ("6 hours", "1.5 hours" allowed). Range: "6–8 hours", same unit for both
    ends.
  - Format `quickie` → "Quickie".
  - Co-hosts: "With Matteo Codogno"; two → "With A and B"; three+ → "With A, B and C". On
    `TalkCard`, the talk page meta, and the `AppearanceRow`.
  - Talk note: a set-apart block directly under the talk page title (before the abstract),
    styled with existing tokens; absent → nothing rendered.
  - Related links: a short list on the talk page after the abstract, each a link with its
    label (external, `rel="noopener"` like other external links).
  - `offered: false` talk page: shows the statement "No longer offered" near the title.
- **Content** (`frontend/content/*.yaml`), converted from the owner's update of 2026-11-20:
  - Remove talk `flex-your-energy`. On `from-kubernetes-to-kilowatts`: `alsoGivenAs` gains
    "Flex your Energy: Building a Cloud-Native Platform for Renewable Energy Communities" (en),
    "Flex your Energy: come il software sta ridisegnando le Comunità Energetiche Rinnovabili"
    (it) and "SPARklE – Gestione intelligente dell'energia" (it); `topics` gains Energy
    communities, Flexibility markets, Cloud-native architecture; `level:
    [beginner, intermediate]`; `note: Length and technical depth adapt to the event, from an
    overview for energy-sector managers to a deep dive for developers.`
  - Appearances `wearedevelopers-world-congress-2026` (add `sessionTitle` = the Flex your
    Energy English title) and `green-software-italia-sustainability-month-2026` → `talk:
    from-kubernetes-to-kilowatts`.
  - New talk `lego4scrum` (title "Lego4Scrum", workshop, `{min: 360, max: 480}`, beginner,
    languages [en, it], topics Scrum / Agile / Teamwork / Product ownership, `coHosts: [Matteo
    Codogno]`, `links: [{label: Lego4Scrum training at WellD, url:
    https://welld.ch/services/training/lego4scrum}]`). Summary and abstract from the export.
  - New talk `repetition-is-bad` (title "Repetition is Bad, Repetition is Bad", quickie, 15,
    intermediate, languages [en], topics Java / Clean code / Design patterns, `offered: false`).
  - New appearances `voxxed-days-ticino-2015` (Voxxed Days Ticino 2015, 2015-04-18, Lugano,
    Switzerland, en, talk repetition-is-bad, slides en
    https://speakerdeck.com/smirne/repetition-is-bad-repetition-is-bad, note "My first talk,
    at the first edition.") and `voxxed-days-ticino-2025-workshop-day` (Voxxed Days Ticino
    2025 workshop day, 2025-01-16, Lugano, Switzerland, it, talk lego4scrum, `coHosts:
    [Matteo Codogno]`, eventUrl https://sessionize.com/s/matteocodogno/lego4scrum/141346,
    note "Full-day workshop.").
  - Internal "Notes (to check)" from the export are not published beyond the notes above.
- **Deferred:** a redirect for `/talks/flex-your-energy`; a separate Archive page; co-host
  profiles (spec non-goals).

## Tasks

- [x] T1: [frontend] Extend the content schema and validation — refs: AC-5.1, AC-2.3, AC-2.4, AC-3.4, AC-4.1 — deps: none
  - touch: `frontend/src/content/**`, `frontend/vite-plugins/*`
  - done when: unit tests show `validateContent` accepts each new shape (level pair, duration
    range, `quickie`, `note`, talk and appearance `coHosts`, `links`, `offered: false`) and
    rejects, naming file › item › field: a descending or equal level pair, a duration range
    with `min >= max`, an unknown format, an empty co-host name, a related link with a
    malformed URL; a test shows an appearance may link to an `offered: false` talk and that
    such a talk stays in published content; the real content still validates; existing
    validation tests pass.

- [x] T2: [frontend] Render the new fields — refs: AC-2.1, AC-2.3, AC-2.4, AC-2.5, AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-4.1, AC-4.2, AC-4.3 — deps: T1
  - touch: `frontend/src/components/content/*`, `frontend/src/features/talks/*`, `frontend/src/features/history/*`, `frontend/src/features/home/*`, `frontend/src/lib/*`
  - done when: component tests with fixtures show: level range "Beginner–Intermediate" on card
    and page; durations "35 minutes", "2 hours", "6 hours", "6–8 hours"; "Quickie"; "With
    Matteo Codogno" (and the two- and three-name forms) on card, page and History row; the talk
    note under the title and nothing when absent; related links with their labels; an
    `offered: false` talk absent from the Talks list and the Home count, present via its
    History row link, its page saying "No longer offered"; lint (incl. no JSX literals),
    typecheck and existing tests pass.

- [ ] T3: [frontend] Content update — refs: AC-1.1, AC-1.2, AC-1.3, AC-1.4, AC-2.2, AC-2.3, AC-2.4, AC-3.1, AC-3.2, AC-3.3, AC-4.4 — deps: T1, T2
  - touch: `frontend/content/*.yaml`, `frontend/e2e/*`
  - done when: the YAML matches the Content section of the Architecture notes; `mise run
    frontend:build` passes; an e2e check (Playwright, against the build) shows
    `/talks/flex-your-energy` renders Not found, the Kilowatts page shows the note,
    "Beginner–Intermediate" and the Flex your Energy title under "Also given as", the
    Lego4Scrum page shows "6–8 hours" and "With Matteo Codogno", the History page lists both
    Voxxed Days Ticino rows and the 2015 one links to the "Repetition is Bad" page, which says
    "No longer offered"; `mise run frontend:e2e` passes in full.

- [ ] T4: Close — refs: all — deps: T3
  - touch: `specs/002-talk-content-update/*`
  - done when: `mise run frontend:lint`, `frontend:test`, `frontend:build`, `frontend:e2e`
    pass, CI is green on PR #2, QE-light verdict PASS, owner checks the preview, status → done
    via `/wellforge:done`.

## Coverage

| AC | Tasks |
|---|---|
| AC-1.1 to AC-1.4 | T3 |
| AC-2.1 | T2 |
| AC-2.2 | T3 |
| AC-2.3, AC-2.4 | T1, T2, T3 |
| AC-2.5 | T2 |
| AC-3.1, AC-3.2, AC-3.3 | T2, T3 |
| AC-3.4 | T1, T2 |
| AC-4.1 | T1, T2 |
| AC-4.2, AC-4.3 | T2 |
| AC-4.4 | T3 |
| AC-5.1 | T1 |
