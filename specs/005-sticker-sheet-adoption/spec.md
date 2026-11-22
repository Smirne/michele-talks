---
id: 005
slug: sticker-sheet-adoption
status: in-progress
rigor: mvp
created: 2026-11-22
approved: 2026-11-22
---

# Sticker Sheet look, designer feedback and stage material

## Problem
The site's look was explored in spike 004 (Sticker Sheet), and the owner's designer colleague
prefers it to the current Programme Board look because it has its own identity. The spike is a
re-skin layered over the old styles, so it can't ship as it is. The designer's review also found
that Home doesn't keep the invitation in reach, that Contact spreads its contacts over several
blocks, and that the WellD mascot D is used where the speaker's own stage photos would say more.
The owner has social cards and stage photos from most appearances that the site doesn't show,
and two meetups (Coffeetech, Crafted Software) that are missing from On stage.

Decisions come from the owner and the designer's feedback in the conversation of 2026-11-21/22:
the owner approved the Home layout ("3 approved"), chose progressive loading over an accordion
for past appearances, asked for the two meetups, and accepted the remaining recommendations
("go with the new plan").

## User stories

### US-1: One consistent Sticker Sheet look
As the site owner, I want the whole site in the Sticker Sheet look, so that it has the identity
my designer chose.
**Acceptance criteria:**
- AC-1.1: Given every page (Home, Profile, Talks, a talk page, On stage, Contact, Not found),
  when it renders, then it uses the Sticker Sheet palette (banana background, ink text, pink
  accent, teal signal), the Dela Gothic One display font and the Figtree body font.
- AC-1.2: Given every page at 375px and at 1280px width, when it renders, then nothing scrolls
  horizontally and no text overlaps another element.
- AC-1.3: Given every text and interactive element, when checked with an automated contrast
  audit, then it meets WCAG AA (4.5:1 body text, 3:1 large text and focus indicators).
- AC-1.4: Given the Programme Board look, when the feature is done, then no page shows any of
  its styles (e.g. the border lines above lists).

### US-2: Invite always in reach on Home
As an event organiser, I want Home to show who the speaker is and what's next, with the
invitation always in reach, so that I can invite without hunting for the button.
**Acceptance criteria:**
- AC-2.1: Given Home at 1280px width, when it renders, then the left column shows, top to
  bottom: the bio introduction, the upcoming appearances, then the "Browse the talks" link; the
  right column shows the invitation block.
- AC-2.2: Given Home at 1280px width, when the visitor scrolls to the bottom of the page, then
  the invitation block stays visible on screen throughout.
- AC-2.3: Given Home at 375px width, when it renders, then the content is one column in the
  same order with the invitation block after the upcoming appearances, and it does not stay
  fixed on screen while scrolling.
- AC-2.4: Given a talk page at 1280px width, when the visitor scrolls, then its invitation
  block stays visible the same way; at 375px it does not stay fixed.

### US-3: Contacts in two boxes
As an event organiser, I want the email set apart from the speaker's profiles, so that I can
pick a channel at a glance.
**Acceptance criteria:**
- AC-3.1: Given Contact at 1280px width, when it renders, then the email address is in one box
  headed "Email" and every profile link is in a second box headed "Elsewhere online", the
  profile links in a single horizontal row.
- AC-3.2: Given Contact at 375px width, when it renders, then the profile links wrap onto as many
  lines as needed, without horizontal scrolling, in the same order.

### US-4: Past appearances load as you scroll
As an event organiser, I want On stage to show upcoming appearances and the recent past
straight away, and more as I scroll, so that the page starts short but the full track record is
there.
**Acceptance criteria:**
- AC-4.1: Given On stage with more past appearances than the first batch, when it renders, then
  every upcoming appearance and the most recent 5 past appearances are shown.
- AC-4.2: Given that page, when the visitor scrolls to the end of the shown past list, then the
  next batch appears, until all past appearances are shown.
- AC-4.3: Given a keyboard or screen-reader user, when more past appearances remain, then a
  "Show more" button loads the next batch, and the number shown/total is announced.
- AC-4.4: Given all past appearances are shown, when the visitor reaches the end of the list,
  then the "Show more" button is gone and the page footer is reachable.
- AC-4.5: Given On stage, when it renders, then no past appearance is hidden behind a
  collapsed section.

### US-5: WellD logo and stage photos instead of D
As the site owner, I want the WellD logo in the footer and my stage photos on the pages, with a
single D left as an easter egg, so that the site is about me speaking and still nods to WellD.
**Acceptance criteria:**
- AC-5.1: Given any page, when it renders, then the footer shows the white WellD logo, linking to
  the WellD website, with alternative text "WellD", instead of the D image.
- AC-5.2: Given Talks, On stage and Contact, when each renders, then it shows one stage photo of
  the speaker where it previously showed D, with alternative text describing it.
- AC-5.3: Given Not found, when it renders, then D (the magnifying-glass pose) is its image.
- AC-5.4: Given any page other than Not found, when it renders, then no D image appears.
- AC-5.5: Given any photo shown, when its file is checked, then it is no larger than 300 KB.
- AC-5.6: Given each photo shown, when the owner reviews it before release, then the owner has
  confirmed the right to publish it; a photo credit is shown next to it where the owner gives one.

### US-6: An easter egg for the early days
As the site owner, I want a quiet link to my previous on-stage experience, so that curious
visitors find where it all started.
**Acceptance criteria:**
- AC-6.1: Given On stage with all past appearances shown, when the visitor reaches the end of
  the list, then a single small line reads "Before 2015: my previous on-stage experience" and
  links to http://batteri.altervista.org, opening in a new tab.
- AC-6.2: Given that link, when checked, then it meets the same contrast and focus rules as any
  other link (AC-1.3) — it is quiet through size and placement, not through low contrast.

### US-7: Social cards on appearances
As an event organiser, I want to see the card an event made for the speaker's appearance, so
that I recognise the event and see the speaker was a billed speaker.
**Acceptance criteria:**
- AC-7.1: Given an appearance with a social card, when its row renders on On stage or in Home's
  upcoming list, then a small thumbnail of the card is shown in the row, with alternative text
  naming the event.
- AC-7.2: Given that thumbnail, when the visitor activates it, then the card opens at full size
  and can be closed with the Escape key or a visible close control, returning focus to the
  thumbnail.
- AC-7.3: Given an appearance with more than one card, when its row renders, then one card is the
  thumbnail and the full-size view lets the visitor see the others.
- AC-7.4: Given an appearance without a card, when its row renders, then the row shows no
  placeholder image and keeps its layout.
- AC-7.5: Given the cards in the owner's pics.zip of 2026-11-22, when the feature is done, then
  each is attached to its appearance: Voxxed Days Ticino 2025 workshop day, JUG Milano 2026,
  DevFest Milano 2026 (2), ContainerDay 2026 (2), Green Software Italia meetup (2), Codemotion
  Tech Lead Summit, Cloud Day 2026 (2), Better Software 2026, Coffeetech, Crafted Software.

### US-8: Two missing meetups
As the site owner, I want my Coffeetech and Crafted Software meetups on On stage, so that the
track record is complete.
**Acceptance criteria:**
- AC-8.1: Given On stage, when it renders, then it lists "Coffeetech" on 2025-11-14 in Genova,
  Italy, in Italian, with session title "Filiere energetiche rinnovabili: il progetto SPARklE per
  le Comunità di Energia Aggregate", co-host Roberto Catanzariti, the note "A domain talk on
  renewable energy communities and flexibility, with little technical content.", and no link
  to a catalogue talk.
- AC-8.2: Given On stage, when it renders, then it lists "Crafted Software meetup — TCP Night:
  Lightning talks" on 2025-11-27 in Milan, Italy, in Italian, with session title "SPARklE –
  Gestione intelligente dell'energia", the note "A very early, lightning-talk version of this
  talk.", and a link to the talk "From Kubernetes to Kilowatts".

## Non-goals
- Per-page link previews (a social card as the image when a page is shared) — needs each page
  pre-rendered, which the site doesn't do; a separate piece of work.
- New talks, a talk graph or a topic filter — open items from earlier specs, not this one.
- A sticky invitation on mobile — rejected: it takes too much of a small screen.
- Changing the content of bios, talks or existing appearances, apart from attaching cards.
- Redesigning the WellD logo or the D mascot; both are used as supplied.

## Constraints
- The spike 004 styles must not ship as an override layer: the owner's call is to "promote" the
  spike, i.e. make the look the site's real styles (from the spike's findings).
- Easter egg URL, verbatim from the owner: "http://batteri.altervista.org".

## Open questions
None. Resolved by the owner on 2026-11-22:
- Stage photos: Talks — DevFest Milano 2026 on stage (DSC06263); On stage — Cloud Day 2026 on
  stage; Contact — Codemotion 2026 portrait. Credits are shown where the owner gives one (AC-5.6).
- Past appearances load in batches of 5 (AC-4.1, AC-4.2).
- Crafted Software links to "From Kubernetes to Kilowatts" (a very early version of it);
  Coffeetech has no talk link: it was a longer, domain-side session, like AEIT 2026 without DANTE.

## Amendments
- 2026-11-23 (owner, on the built PR): Contact goes back to two boxes — email, then profiles
  (US-3 rewritten). WeAreDevelopers and AI4Dev are removed from the profile links. The first Contact
  photo did not show the owner; it is replaced by the Codemotion working-table shot he picked
  (0501-NF202411, cropped on him), and the Cloud Day photo is cropped on him (left speaker).
