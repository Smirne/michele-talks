---
id: 003
slug: organiser-feedback
status: in-progress
rigor: mvp
created: 2026-11-20
approved: 2026-11-20
---

# Organiser feedback: who the speaker is, how to invite, what a talk covers

## Problem
Event organizers are the site's main visitors, and the owner's review of the built site shows
it doesn't yet serve what they come for. Home leads with the WellD mascot instead of the
speaker's face. An organizer who needs a bio and a photo for their programme has to copy text
by hand and screenshot the page. A talk page gives no direct way to invite the speaker with that
talk or to see it delivered, while half of the page stays empty. Long talk titles fill the first
screen of a talk page on desktop and make the Talks list tiring to scan. Talk topics exist in the
content but are shown nowhere, so an organizer can't tell whether a talk fits a track.

## User stories

### US-1: See the speaker on Home
As an event organizer, I want to see the speaker's photo on Home, so that I know at once who the
speaker is.
**Acceptance criteria:**
- AC-1.1: Given Home, when it renders, then the speaker's photo from the profile content is shown
  in the intro section, with its alternative text, where the D card was.
- AC-1.2: Given Home at 375px width, when it renders, then the photo is visible without
  horizontal scrolling.

### US-2: D keeps a place on the site
As the site owner, I want the WellD mascot D to stay visible across the site, so that the WellD
nod isn't lost when my photo takes its place on Home.
**Acceptance criteria:**
- AC-2.1: Given any page, when it renders, then the footer shows D next to the WellD link.
- AC-2.2: Given the Not found page, when it renders, then D is its main image.
- AC-2.3: Given each main page (Home, Profile, Talks, History, Contact), when it renders, then
  it shows one D besides the footer one, at the place design.md gives for that page; a page
  where design.md records that D doesn't fit shows none.
- AC-2.4: Given any D image, when it is inspected, then it has alternative text, or is marked
  decorative when the text next to it already says what it shows.

### US-3: Material for organisers
As an event organizer, I want a bio I can copy, in the language and length my programme needs, and a high-resolution photo I can download,
so that I can put the speaker in my programme without screenshots or retyping.
**Acceptance criteria:**
- AC-3.1: Given the Profile page, when it renders, then it has a section headed "For organisers"
  showing one of the owner's official bios, English short by default.
- AC-3.6: Given that section, when the visitor picks a language (English, Italian) and a length
  (short, extended), then the bio shown is that official version, exactly as in the content; the
  current choice is exposed to assistive technology.
- AC-3.2: Given that section, when the visitor activates "Copy bio", then the exact text of the
  bio shown (paragraphs separated by a blank line) is on the clipboard and a confirmation is
  announced to screen readers and shown visibly.
- AC-3.3: Given the clipboard is unavailable, when "Copy bio" is activated, then the visitor is
  told copying failed and the bio text stays selectable on the page.
- AC-3.4: Given that section, when the visitor activates "Download photo", then the browser
  downloads the largest available photo file named after the speaker (e.g.
  `michele-giacobazzi.jpg`), not a page.
- AC-3.5: Given the download link, when it renders, then it states the file's format and pixel
  size (e.g. "JPG, 1024 × 1024 px").

### US-3b: Official bio text across the site
As the site owner, I want the site to use my official bio, so that every page says the same thing
about me.
**Acceptance criteria:**
- AC-3.7: Given the Profile page, when it renders, then its main bio is the official extended
  English bio, paragraph for paragraph.
- AC-3.8: Given Home, when it renders, then the intro summary is a single paragraph built from
  sentences of the official bio (wording in the content), not the earlier export text.
- AC-3.9: Given the content, when it is validated, then each of the four official bios (EN/IT ×
  short/extended) is present with at least one paragraph, else the build fails naming the field.

### US-4: Invite with a talk, see it delivered
As an event organizer, I want a call to action on each talk page, so that I can invite the
speaker for that talk and watch or read it first.
**Acceptance criteria:**
- AC-4.1: Given a talk page for a talk on offer, when it renders, then it shows "Invite me with
  this talk", which opens an email to the profile's address whose subject contains the talk's
  title.
- AC-4.2: Given a talk marked "no longer offered" (feature 002), when its page renders, then no
  invitation action is shown.
- AC-4.3: Given a talk with at least one appearance that has a video, when its page renders, then
  it links to the video of the most recent such appearance, labelled as a recording with its
  language and event name.
- AC-4.4: Given a talk whose content names a featured recording, when its page renders, then that
  recording is linked instead of the most recent one.
- AC-4.5: Given a talk with at least one appearance that has slides, when its page renders, then
  it links to the slides of the most recent such appearance, labelled as slides with their
  language and event name.
- AC-4.6: Given a talk with no video or no slides, when its page renders, then the missing link is
  simply absent; with neither, only the invitation is shown.
- AC-4.7: Given a talk page on a desktop-width screen (1280px and wider), when it renders, then
  the invitation and links sit beside the talk's text, not below it; at 375px they appear
  below the title and facts, before the abstract.
- AC-4.8: Given a featured recording that is not one of that talk's appearance videos or has a
  malformed URL, when the content is validated, then the build fails naming the talk and field.

### US-5: Titles that read easily
As an event organizer, I want talk titles that I can scan, so that the list and the talk pages
don't tire me.
**Acceptance criteria:**
- AC-5.1: Given the talk page with the longest title in the content, when it renders at
  1280 × 800, then the title, the talk facts and the invitation action are all visible without
  scrolling.
- AC-5.2: Given the Talks list, when it renders, then talk titles are set in sentence case (as
  written in the content), not all caps, and are not underlined until hovered or focused.
- AC-5.3: Given the Talks list at 1280px width, when it renders, then no talk title needs more
  than two lines.

### US-6: See what a talk is about
As an event organizer matching talks to a track, I want to see each talk's topics, so that I can
tell quickly whether it fits.
**Acceptance criteria:**
- AC-6.1: Given the Talks list, when it renders, then each talk shows its topics from the content
  as tags.
- AC-6.2: Given a talk page, when it renders, then the talk's topics are shown as tags.
- AC-6.3: Given a talk with no topics, when it renders, then no empty topics area is shown.

### US-7: Small fixes
As a visitor, I want labels that mean something where they appear, so that the board doesn't
confuse me.
**Acceptance criteria:**
- AC-7.1: Given Home, when it renders, then the talks section carries no "Now" label nor its dot;
  its label describes the section (wording in design.md).
- AC-7.2 (resolved by feature 002, no work here): the "Talk" format shows on every card only
  because every offered talk is a talk; Lego4Scrum, a workshop, arrives with 002.

## Amendments
- 2026-11-20 (owner, after approval, on supplying the official bios): the "For organisers" block
  offers the four official bios (English and Italian, short and extended) instead of only the
  short English one (AC-3.1, AC-3.2 reworded, AC-3.6 added); Profile uses the extended English
  bio and Home a one-paragraph summary built from the official text (US-3b). Bio text: owner's
  paste of 2026-11-20, verbatim.

## Non-goals
- A topic filter on Talks: tags only now; a filter needs a cleaned-up topic vocabulary first
  (owner, 2026-11-20). Planned for a later feature.
- Tidying or merging the topic wording in the content.
- A featured-slides choice: only the recording can be chosen per talk; slides are always the
  most recent.
- A contact form or prefilled email body beyond the subject: the invitation opens the visitor's
  own mail client.
- A press kit page, multiple photo sizes, or a downloadable bio file.
- Italian interface text: the Italian bios are content; the toggle labels stay English.
- Changes to the History page beyond the D placement.

## Constraints
Recorded as the owner stated them (2026-11-20):
- "Put my photo on the home page and find another place for D. Organisers come to see who the
  speaker is."
- Where D goes: "All of them. 404 is D, D in footer, one extra D in every main page if fits."
- Best link: "Default: latest video + latest slide. I might choose a different best for the video
  (recording, duration, quality..)."
- Topics: "Tags now, filter later."
- "Use a smaller size or sentence case for long titles."
- Photo: "I'd keep the white background one." The owner's best file is
  `pics/lisbon-fixed.png` (1024 × 1024, white background), at the root of the main checkout,
  outside the repo's tracked files: "I'm afraid they're the best I have." It is the source of
  the downloadable photo.
- Bios (owner, 2026-11-20): "short and long bios in ita and eng. For download and for the page.
Adapt to a middle ground if too long. Site default is all english, but the organizer might need
the bio in IT." Clarified the same day: "download" means copy ("Copy is enough", no bio file);
the extended English bio fits Profile as is, so no middle version is written.
- Feature 003 builds on feature 002's talk schema (co-hosts, no longer offered, formats).

## Open questions
- [x] Photo for download: the largest available is 1024 × 1024, below the ~2000px usually
  wanted for print. Accepted; a larger photo can replace the file later without page changes.
  — owner: Michele
- [ ] More D artwork: the repo has one D image; extra poses for the footer, 404 and main pages
  come from the WellD mascot set or reuse the existing one. — owner: designer, with Michele

Accepted as risk at approval (2026-11-20): the D artwork question; design.md settles it.
