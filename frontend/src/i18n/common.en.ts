export const commonStrings = {
  siteName: 'Michele Talks',
  documentTitle: '{page} | {site}',
  skipLink: 'Skip to content',
  nav: {
    label: 'Main',
    home: 'Home',
    profile: 'Profile',
    talks: 'Talks',
    history: 'On stage',
    contact: 'Contact',
  },
  footer: {
    role: 'CTO and co-founder @',
    profiles: 'Profiles',
    welld: 'WellD',
  },
  mascot: {
    alt: {
      notFound: 'D, the WellD mascot, searching with a magnifying glass',
    },
  },
  stage: {
    alt: {
      talks:
        'The speaker at DevFest Milano 2026, microphone in hand, beside a screen showing the talk agenda',
      history:
        'Cloud Day 2026: two speakers on stage in front of a large screen with the conference title and the talk title',
      contact:
        'A speaker at a Codemotion 2026 working table, wearing a conference lanyard and talking, a laptop covered in stickers beside him',
    },
  },
  notFound: {
    title: 'Page not found',
    body: 'There is nothing at this address. It may have moved, or never existed.',
    back: 'Back to Home',
  },
} as const
