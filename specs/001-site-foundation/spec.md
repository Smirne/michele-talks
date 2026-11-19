---
id: 001
slug: site-foundation
status: in-progress
rigor: mvp
created: 2026-11-19
approved: 2026-11-19
---

# Site foundation: content, structure and visual identity

## Problem
Michele speaks at conferences and meetups but has no single place that shows who they are as a
speaker, which talks they can give, and where they have already spoken. Event organizers deciding
whether to invite them have to piece this together from scattered slides, videos and social
profiles, and attendees who saw a talk can't easily find its slides or recording. Some talks
and resources are in Italian and others in English, which makes things harder to find.
Before any of the richer features (the creative talks graph, a working contact form) can be
built, the site needs its basic structure, a content model for talks and appearances, and a
visual identity of its own.

## User stories

### US-1: Choose a visual direction
As the site owner, I want to compare several distinct visual directions and pick one, so
that the site has a personal identity that doesn't look standard or obviously AI-generated.
**Acceptance criteria:**
- AC-1.1: Given the feature is in progress, when the visual proposals are presented, then
  there are 5 sketches, each showing the home page with its palette, typography and
  signature element.
- AC-1.2: Given the 5 sketches, when they are compared side by side, then no two share the
  same combination of palette, heading typeface and layout structure.
- AC-1.3: Given the sketches, when the owner reviews them, then at least one of them
  includes the WellD mascot "D" or another visible graphical link to WellD.
- AC-1.4: Given the owner has picked a direction (or a mix), when the choice is recorded,
  then the feature's documentation names the chosen direction and lists its palette,
  typefaces, layout principles and signature element.
- AC-1.5: Given the site is built in the chosen direction, when the owner reviews it, then
  the owner explicitly confirms it matches the chosen direction.

### US-2: Navigate the site
As a visitor, I want a clear structure with Home, Profile, Talks, History and Contact, so
that I can reach any part of the site quickly.
**Acceptance criteria:**
- AC-2.1: Given any page of the site, when the visitor looks at the navigation, then links to
  Home, Profile, Talks, History and Contact are present, and each opens the matching page.
- AC-2.2: Given an address that matches no page, when the visitor opens it, then a "not
  found" page is shown with a link back to Home.
- AC-2.3: Given the Home page, when it is viewed, then it shows a short introduction, at
  least one way to reach the Talks catalogue, and a way to reach Contact without scrolling
  on a 1280×800 viewport.
- AC-2.4: Given the Home page, when it is viewed, then it has a marked area reserved for the
  future talks graph.

### US-3: Read the speaker profile
As an event organizer, I want to see who the speaker is, so that I can judge whether the speaker fits
my event.
**Acceptance criteria:**
- AC-3.1: Given the Profile page, when it is viewed, then it shows the speaker's name,
  photo, a bio and the list of topics they speak about, all taken from the content files.
- AC-3.2: Given the Profile page, when it is viewed, then it mentions WellD with a link to
  www.welld.ch.

### US-4: Browse the talks catalogue
As an event organizer, I want to see the talks on offer, so that I can pick one for my event.
**Acceptance criteria:**
- AC-4.1: Given the Talks page, when it is viewed, then every talk in the content files that
  is not marked hidden is listed, and each shows its title, a short abstract, duration, audience level, format and the
  language(s) it can be given in.
- AC-4.2: Given a talk in the list, when the visitor opens it, then a detail view shows the
  full abstract, its upcoming appearances, and the past appearances where that talk was
  given (each group shown only if it has entries).

- AC-4.3: Given a talk that has been given under other titles, when its detail view is
  opened, then those titles are listed as "Also given as", each with its language.
- AC-4.4: Given a talk marked hidden in the content files, when the visitor browses the site,
  then it appears nowhere: not in Talks, not on Home, and its address shows "not found".

### US-5: Browse the talk history
As an attendee or organizer, I want to see where the speaker has spoken, with slides and
recordings, so that I can catch up on a talk or check the speaker's track record.
**Acceptance criteria:**
- AC-5.1: Given the History page, when it is viewed, then every appearance in the content
  files is listed with event name, date, location (city and country, or "online"), and
  the language it was (or will be) given in. Every appearance has exactly one language.
- AC-5.2: Given the History page, when it is viewed, then appearances dated after the
  visitor's current date (checked when the page is viewed, not when the site was built) are
  shown in a separate "Upcoming" group above past ones; past ones are ordered newest first.
- AC-5.2b: Given no appearance is dated after the visitor's current date, when the History
  page is viewed, then no "Upcoming" group is shown.
- AC-5.3: Given an appearance with slides and/or a video link, when it is viewed, then each
  resource is shown as a link labelled with its type and language.
- AC-5.4: Given an appearance linked to a talk in the catalogue, when the visitor follows the
  link, then the matching talk detail opens.
- AC-5.5: Given an appearance where the talk ran under a different title, when it is shown,
  then the title used at that event is shown alongside the link to the catalogue talk.
- AC-5.6: Given an appearance with a public note in the content files (e.g. "Video selection,
  virtual stage", "Facilitator, working table"), when it is shown, then the note is visible.
- AC-5.7: Given an appearance with an event or session page link, when it is shown, then the
  link is visible and opens that page.

### US-6: Find contact details
As an event organizer, I want to know how to reach the speaker, so that I can send an invitation.
**Acceptance criteria:**
- AC-6.1: Given the Contact page, when it is viewed, then it shows an email address and links
  to the speaker's public profiles (taken from the content files).

### US-7: Maintain content without touching the pages
As the site owner, I want profile, talks, history and contacts kept in structured content
files, so that I can add a talk or an appearance without editing page code.
**Acceptance criteria:**
- AC-7.1: Given a new talk or appearance added only to the content files, when the site is
  rebuilt, then it appears on the corresponding page(s).
- AC-7.2: Given a content item missing a required field or with an invalid value (e.g. an
  unknown language, a bad date, an appearance pointing to a talk that doesn't exist), when
  the site is built, then the build fails with a message naming the item and the field.

### US-8: Language now and later
As a visitor, I want to know which language a talk or resource is in, and the owner wants the
site ready for a second interface language, so that Italian content doesn't surprise anyone
and a translation can be added later.
**Acceptance criteria:**
- AC-8.1: Given any talk, appearance or resource, when it is shown, then its language is
  displayed as a label (e.g. "EN", "IT").
- AC-8.2: Given the site, when it is viewed, then all interface text is in English.
- AC-8.3: Given the interface text (navigation, headings, labels, button text), when the
  pages are inspected, then every such string comes from a single English translation set,
  and none is written directly in a page.

### US-9: Works for everyone, on any screen
As a visitor on a phone or using assistive technology, I want the site to work for me, so
that I'm not excluded.
**Acceptance criteria:**
- AC-9.1: Given any page at 375px width, when it is viewed, then there is no horizontal
  scrolling and all navigation is reachable.
- AC-9.2: Given any page, when it is checked with an automated accessibility scan, then there
  are no WCAG 2.1 AA violations, including colour contrast.
- AC-9.3: Given a visitor with "reduce motion" enabled, when they browse the site, then no
  decorative animation plays.

## Amendments
- 2026-11-19 (after approval, during design, by the owner): "upcoming" uses the visitor's
  current date (AC-5.2, AC-5.2b); a talk's detail lists upcoming appearances too (AC-4.2);
  an appearance has exactly one language (AC-5.1, a wording fix). Empty-state behaviour
  follows design.md.
- 2026-11-19 (owner, on delivering the real content): talks not yet delivered are hidden
  (AC-4.1, AC-4.4); appearances without a catalogue talk are listed with their role as a note;
  other titles are shown on the talk and on the appearance (AC-4.3, AC-5.5); appearances can
  show a public note and an event page link (AC-5.6, AC-5.7).

## Non-goals
- The creative talks graph itself: this feature only reserves its place (AC-2.4).
- Italian (or any second) interface language: only readiness for it (AC-8.3).
- Hosting, deployment and a custom domain.
- Analytics, cookie banners, a blog or newsletter.
- Filtering or searching talks and history (by language, topic or year).

Out of the product's scope altogether (not planned for any later feature):
- A contact form that sends messages: Contact shows details and links only.
- An admin UI or CMS: content is edited as files in the repository.

## Constraints
Recorded as the owner stated them:
- "English with i18n. Some video/slides and conferences are in italian though."
- "Custom visual identity, but must be creative, non-standard and non-evidently AI produced."
- "I was thinking starting from a template and enhancing, but I'm open to proposal."
- "It could be inspired to the new welld site (published yesterday at www.welld.ch)."
- "Personal, with WellD nod and potentially some graphical connection (eg: having D, our new
  mascotte somewhere)."
- Visual proposals: 5 quick sketches.
- Content: the owner provides the real content (bio, talks, appearances, contacts).
- "I'd remove this from scope altogether [contact form, admin area or CMS]. Maybe we can make
  it without a backend?" The site works without any server-side component at runtime.
- WellD visuals: "I'm one of the owner at WellD, I think I'm allowed to" use the mascot "D"
  and other WellD visual elements.

## Open questions
- [x] Real content delivered on 2026-11-19 (export with bio, photo, topics, talks,
  appearances, contacts). Still pending from the owner: the Cloud Day video link (Improove
  Play, not published yet). — owner: Michele

Accepted as risk at approval (2026-11-19): the open content question. The site is built and
verified on placeholder content until the real content is delivered.
