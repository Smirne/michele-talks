---
spec: 003
generated: 2026-11-20
synced: 2026-11-20  # re-synced after the Home review amendment (implemented as a T3/T2 follow-up)
---

# Tasks: Organiser feedback

Screens, strings, component inventory and D placement come from `design.md` (same folder):
implement what it says; this file adds only the contracts it leaves open.

## Architecture notes
- Components: content schema + Vite content plugin (two new fields); NEW `Mascot`
  (`frontend/src/components/mascot/`), `TopicTags` (`frontend/src/components/content/`),
  `TalkAside` + `pickTalkResources` (`frontend/src/features/talks/`), `CopyButton` +
  `OrganisersSection` (`frontend/src/features/profile/`); EXTEND `PageHeader` (`mascot` slot,
  `size: 'default' | 'compact'`), `SiteLayout` footer, `ProfilePhoto` (`aspect: '4/5' | '1/1'`,
  default `'4/5'`), `ButtonLink` (optional `download` on the href variant; exported class helper),
  `TalkCard`, `TalkDetailView`, Home, Profile, Talks, History, Contact, Not found.
- Contract — featured recording (AC-4.4, AC-4.8): `talkSchema` gains
  `featuredRecording: httpUrl.optional()`. Cross-check in `validateContent`: the URL must equal the
  `url` of a `type: video` resource of an appearance whose `talk` is this talk's slug, else error
  `{ file: 'talks.yaml', item: <slug>, field: 'featuredRecording', message: 'must be the URL of a
  video of one of this talk's appearances' }`. A malformed URL fails through `httpUrl` with the same
  file/item/field.
- Contract — resource choice (AC-4.3 to AC-4.6): pure function
  `pickTalkResources(talk: Talk, appearances: Appearance[]): { recording?: Pick; slides?: Pick }`,
  `Pick = { url: string; language: 'en' | 'it'; event: string }`. Considers appearances with
  `talk === talk.slug` (any date). recording = the appearance video equal to `featuredRecording`
  when set, else the video of the most recent appearance (by `date`) that has one; slides = the
  slides of the most recent appearance that has them. Ties on `date`: the first in content order.
  Several resources of one type in one appearance: the first. `language` is the resource's
  language, `event` the appearance's `event`.
- Contract — invitation (AC-4.1, AC-4.2): `href = 'mailto:' + profile.email + '?subject=' +
  encodeURIComponent(t('talks.aside.subject', { title }))`. Not rendered when `talk.offered ===
  false`; recording/slides still render then; aside not rendered when nothing is left.
- Contract — photo download (AC-3.4, AC-3.5): `profileSchema` gains `photoDownload: nonEmpty`
  (path relative to `frontend/content/`, like `photo`). The plugin fails the build (`profile.yaml ›
  profile › photoDownload`) when the file is missing or is not a JPEG, reads its pixel size from
  the JPEG SOF marker at build time (small reader in the plugin, no new dependency), imports the
  file so Vite fingerprints it, and exposes `profile.photoDownload` to the app as
  `{ url: string; format: 'JPG'; width: number; height: number }` (the published `Content` type
  changes accordingly; the raw schema keeps the string). Link: `<a href={url}
  download="michele-giacobazzi.jpg">` — the saved name is derived from `profile.name` (kebab-case
  + `.jpg`), not hard-coded.
- Data model: `frontend/content/profile.yaml` gains `photoDownload:
  media/michele-giacobazzi-1024.jpg`; that file is `/Users/michele.giacobazzi/Desktop/wspace/personal/michele-talks/pics/lisbon-fixed.png`
  converted to JPEG (quality 90, no resampling, 1024 × 1024), e.g. `sips -s format jpeg -s
  formatOptions 90`. No talk gets `featuredRecording` yet (the owner sets it later); tests use
  fixtures.
- Mascot artwork: copy the six poses named in design.md from the welld-brand skill library
  (`<skill base>/assets/images/`, path in design.md) into `frontend/src/assets/mascot/`,
  unmodified.
- Contract — official bios (AC-3.1, AC-3.6 to AC-3.9, amendment 2026-11-20): `profileSchema`
  gains `bios: { en: { short: string[]; extended: string[] }; it: { short: string[]; extended:
  string[] } }`, each a non-empty list of non-empty paragraphs (missing/empty fails naming e.g.
  `profile.yaml › profile › bios.it.extended`). `bio` is removed: Profile's main bio renders
  `bios.en.extended`. `bioShort` stays and holds the Home intro summary from design.md's
  amendment. Bio text: the owner's paste, verbatim, in the shared notes file
  `/Users/michele.giacobazzi/Library/Application Support/Claude/side-session-notes/local_d03b01f4-ff92-4a92-bf59-068bbeb8c1e1/owner-official-bios-2026-11-20.md`.
  Copy text = the chosen paragraphs joined with `\n\n`.
- Deferred: topic filter (non-goal), featured slides (non-goal), SVG/@2x D artwork (design.md
  artwork need), owner-chosen featured recordings in content.

- [x] T1: Add featuredRecording and photoDownload to the content model — refs: AC-4.8, AC-3.4, AC-3.5 — deps: none
  - touch: `frontend/src/content/schema.ts`, `frontend/src/content/validate.test.ts`, `frontend/src/content/__fixtures__/*`, `frontend/vite-plugins/content.ts`, `frontend/vite-plugins/content.test.ts`, `frontend/src/vite-env.d.ts`, `frontend/content/profile.yaml`, `frontend/content/media/*`
  - done when: unit tests show (a) a featuredRecording that is not one of the talk's appearance videos and (b) a malformed one each fail naming `talks.yaml › <slug> › featuredRecording`; a missing or non-JPEG photoDownload fails naming `profile.yaml › profile › photoDownload`; loading the real content yields `photoDownload` `{ format: 'JPG', width: 1024, height: 1024 }`; `mise run frontend:build` passes.
- [x] T2: Mascot component, footer D, Not found D and page-header D on Talks, History, Contact — refs: AC-2.1, AC-2.2, AC-2.3, AC-2.4 — deps: none
  - touch: `frontend/src/components/mascot/*`, `frontend/src/assets/mascot/*`, `frontend/src/components/layout/*`, `frontend/src/i18n/common.en.ts`, `frontend/src/features/not-found/*`, `frontend/src/features/history/*`, `frontend/src/features/contact/*`, `frontend/src/features/talks/TalksPage.tsx`, `frontend/src/features/talks/TalksPage.module.css`
  - done when: component tests show the footer D with `alt=""` next to the WellD link on any page, the Not found page's D with its alt text, and one D with its alt text in the header of Talks, History and Contact; `PageHeader` accepts `size="compact"` (used by T6); no horizontal scroll at 375px (existing layout test pattern).
- [x] T9: Official bios in the content model and content — refs: AC-3.7, AC-3.8, AC-3.9 — deps: T1
  - touch: `frontend/src/content/schema.ts`, `frontend/src/content/validate.test.ts`, `frontend/src/content/__fixtures__/*`, `frontend/vite-plugins/content.test.ts`, `frontend/content/profile.yaml`, `frontend/src/features/profile/ProfilePage.tsx`, `frontend/src/features/profile/ProfilePage.test.tsx`, `frontend/src/features/home/HomePage.test.tsx`, `frontend/src/features/contact/ContactPage.test.tsx`
  - done when: validation tests show a missing or empty `bios.<lang>.<length>` fails naming that field; the real content loads with all four bios equal to the owner's text paragraph for paragraph; Profile test shows the main bio is `bios.en.extended`; `profile.yaml` `bioShort` is the Home summary from design.md's amendment; `pnpm typecheck` and tests pass.
- [x] T3: Home photo, contact-row D and "Talks" label — refs: AC-1.1, AC-1.2, AC-2.3, AC-7.1, AC-3.8 — deps: T2, T9
  - touch: `frontend/src/features/home/*`, `frontend/src/components/profile-photo/*`
  - done when: Home test shows the profile photo with `profile.photoAlt` in the intro row and no D card there, a D with its alt text in the contact row, the talks band label "Talks" with no dot and no "Now"; ProfilePhoto test covers `aspect="1/1"`.
- [x] T4: "For organisers" band on Profile (bio choice, copy bio, download photo, D) — refs: AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.5, AC-3.6, AC-2.3 — deps: T1, T2, T9
  - touch: `frontend/src/features/profile/*`, `frontend/src/components/content/ButtonLink.tsx`, `frontend/src/components/content/ButtonLink.module.css`
  - done when: Profile tests show the "For organisers" heading with `bios.en.short` by default; picking Italian + Extended (radio groups "Language", "Length") shows `bios.it.extended` in a box with `lang="it"`; clicking "Copy bio" with a mocked clipboard writes exactly the shown version's paragraphs joined by a blank line and the `role="status"` region reads "Bio copied to the clipboard."; with a rejecting/absent clipboard it reads the failure text and the bio is selected; the download link has `download="michele-giacobazzi.jpg"`, an href to the fingerprinted JPEG and the text "JPG, 1024 × 1024 px"; the band's D has its alt text.
- [x] T5: Talk card titles and topic tags on the Talks list — refs: AC-5.2, AC-5.3, AC-6.1, AC-6.3 — deps: none
  - touch: `frontend/src/components/content/TalkCard.tsx`, `frontend/src/components/content/TalkCard.module.css`, `frontend/src/components/content/TopicTags*`, `frontend/src/components/content/index.ts`, `frontend/src/components/content/strings.en.ts`, `frontend/src/components/content/content.test.tsx`, `frontend/src/styles/tokens.css`, `frontend/src/styles/styles.test.ts`
  - done when: tests show each card's topics as a list labelled "Topics" in content order, no list for a talk with no topics, and the title link rendered with its content text; CSS: card title `text-transform: none`, underline only on `:hover`/`:focus-visible`, new tokens from design.md in `tokens.css`.
- [x] T6: Talk page aside (invite, recording, slides), compact title, topics, two-column layout — refs: AC-4.1, AC-4.2, AC-4.3, AC-4.4, AC-4.5, AC-4.6, AC-4.7, AC-5.1, AC-6.2, AC-6.3 — deps: T1, T2, T5
  - touch: `frontend/src/features/talks/TalkDetailPage.tsx`, `frontend/src/features/talks/TalkDetailPage.module.css`, `frontend/src/features/talks/TalkAside*`, `frontend/src/features/talks/pick-talk-resources*`, `frontend/src/features/talks/strings.en.ts`, `frontend/src/features/talks/talks.test.tsx`
  - done when: unit tests of `pickTalkResources` cover latest video, featured override, latest slides, date tie (content order), none; page tests show the mailto href with the encoded subject "Speaker invitation: <title>", no invite on an `offered: false` talk, absent rows when video/slides are missing, topic tags in the head block, and the aside before the abstract in DOM order.
- [x] T7: End-to-end checks for layout, fit and accessibility — refs: AC-1.2, AC-4.7, AC-5.1, AC-5.3, AC-2.1 — deps: T3, T4, T5, T6
  - touch: `frontend/e2e/*`
  - done when: Playwright passes: at 1280 × 800 the longest-title talk page shows title, facts and the invite button above y = 800 and the aside to the right of the abstract; at 375px the aside is below the facts and above the abstract, and Home shows the photo with no horizontal scroll; at 1280px every Talks card title is at most two lines; axe scan of Home, Profile, Talks, a talk page, History, Contact and Not found reports no WCAG 2.1 AA violations; 001 AC-2.3 (Home CTAs within 800px) still holds.
- [x] T8: All gates green, QE-light verdict, spec status → done — refs: all — deps: T7
  - touch: `specs/003-organiser-feedback/*`
  - done when: `mise run lint`, `mise run test`, `mise run build` and the e2e suite pass; QE-light PASS recorded in `qe-report.md`; `/wellforge:done 003-organiser-feedback` closes the feature.

Coverage: T9 (added on re-sync) serves AC-3.7 to AC-3.9; T3 and T4 depend on it because it
changes `profile.yaml` and the profile fixtures they use. AC-7.2 needs no task (resolved by feature 002). Overlaps resolved: T2 and T6 both use
`PageHeader` (T6 depends on T2); T5 adds tokens and `TopicTags` that T6 uses (T6 depends on T5);
T1 and T4 meet on `profile.photoDownload` (T4 depends on T1). T2, T5 and T1 touch disjoint files
and can run in parallel.
