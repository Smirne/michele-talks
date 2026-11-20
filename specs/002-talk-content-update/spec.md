---
id: 002
slug: talk-content-update
status: done
rigor: mvp
created: 2026-11-20
approved: 2026-11-20
done: 2026-11-20
---

# Talk content update: merged talks, workshops and the archive

## Problem
The owner's catalogue does not fit the content model from 001. Two talks listed separately
("Flex your Energy" and "From Kubernetes to Kilowatts") are the same talk with different
titles, so the catalogue overstates what is on offer. Some talks don't have one fixed level or
duration: they adapt to the audience, and a workshop runs 6 to 8 hours. A workshop with a
co-facilitator, a talk that is no longer offered but belongs to the history, and a 15-minute
"quickie" format can't be described yet. The owner also sent two new talks and two new
appearances (export update of 2026-11-20) that depend on these.

## User stories

### US-1: One talk instead of two
As an event organizer, I want each talk listed once with all the titles it was given under,
so that I don't mistake one talk for two.
**Acceptance criteria:**
- AC-1.1: Given the content, when the Talks page renders, then "From Kubernetes to Kilowatts:
  Shipping a Platform for Energy Communities" is listed and "Flex your Energy" is not a
  separate talk.
- AC-1.2: Given the Kilowatts talk page, when it renders, then "Also given as" lists "Flex your
  Energy: Building a Cloud-Native Platform for Renewable Energy Communities" and the titles
  previously listed under Flex your Energy, each with its language.
- AC-1.3: Given the appearances previously linked to Flex your Energy (WeAreDevelopers World
  Congress 2026, Green Software Italia meetup), when History renders, then each links to the
  Kilowatts talk and shows the title used at that event.
- AC-1.4: Given the address `/talks/flex-your-energy`, when it is visited, then the Not found
  page renders.

### US-2: Talks that adapt
As an event organizer, I want to see when a talk can be adapted, so that I know it can fit my
slot and my audience.
**Acceptance criteria:**
- AC-2.1: Given a talk with a note, when its page renders, then the note is shown under the
  title, set apart from the abstract; a talk without a note shows nothing there.
- AC-2.2: Given the Kilowatts talk, when its page renders, then the note says that its length
  and technical depth can be adapted to the event.
- AC-2.3: Given a talk whose level is a range, when its card or page renders, then the level
  reads as the range, e.g. "Beginner–Intermediate"; the Kilowatts talk shows
  "Beginner–Intermediate".
- AC-2.4: Given a talk whose duration is a range, when its card or page renders, then the
  duration reads as the range, e.g. "6–8 hours"; Lego4Scrum shows "6–8 hours".
- AC-2.5: Given a duration of 120 minutes or more, when it renders, then it is written in
  hours ("6 hours"); shorter durations stay in minutes ("35 minutes").

### US-3: Workshops with a co-facilitator
As an event organizer, I want to see who co-hosts a workshop and where to read more about it,
so that I know who I'm inviting.
**Acceptance criteria:**
- AC-3.1: Given a talk with co-hosts, when its card or page renders, then it reads "With
  <names>"; Lego4Scrum reads "With Matteo Codogno".
- AC-3.2: Given an appearance with co-hosts, when its History row renders, then the row reads
  "With <names>"; the Voxxed Days Ticino 2025 workshop day row reads "With Matteo Codogno".
- AC-3.3: Given a talk with related links, when its page renders, then each link is shown with
  its label; Lego4Scrum links to its WellD training page.
- AC-3.4: Given the format "quickie", when a talk with it renders, then the format reads
  "Quickie".

### US-4: The archive
As a visitor, I want the history to include talks that are no longer offered, so that the
record is complete without suggesting I can still book them.
**Acceptance criteria:**
- AC-4.1: Given a talk marked as no longer offered, when the Talks page and the Home talk count
  render, then it is not included.
- AC-4.2: Given such a talk, when its History row renders, then it links to the talk's page.
- AC-4.3: Given such a talk's page, when it renders, then it shows the abstract and the
  appearances, and states "No longer offered".
- AC-4.4: Given the content update, when History renders, then it includes Voxxed Days Ticino
  2015 (Lugano, 18 April 2015, "Repetition is Bad, Repetition is Bad", slides) and Voxxed Days
  Ticino 2025 workshop day (Lugano, 16 January 2025, Lego4Scrum, in Italian, session page).

### US-5: Content stays checked
As the site owner, I want the new fields validated like the old ones, so that a mistake fails
the build instead of the page.
**Acceptance criteria:**
- AC-5.1: Given a level range whose first level is above the second, a duration range whose
  minimum exceeds its maximum, an unknown format, an empty co-host name or a related link with
  a malformed URL, when the content is validated, then the build fails naming the file, item
  and field.

## Non-goals
- Redirecting `/talks/flex-your-energy` to the merged talk: the site is not public yet, so no
  external link points to it.
- An "Archive" page of its own: History is the archive.
- Co-host profiles or photos: a name is enough for now.

## Constraints
- Owner decisions (2026-11-20): unlisted page for the archived talk; a highlighted per-talk
  note; co-host on talk and History row; hours from 2 hours up, Lego4Scrum as "6–8 hours"
  ("best version is 8h, but we can fit in 6"); Kilowatts level "Beginner–Intermediate".

## Open questions
- [x] Lego4Scrum languages: assumed English and Italian, like every other talk; given in
  Italian in 2025. — owner: Michele (accepted as an assumption, fix in content if wrong)
- [x] Voxxed Days Ticino 2015: language and slides language assumed English (the export says
  "assumed"). — owner: Michele (accepted as an assumption)
