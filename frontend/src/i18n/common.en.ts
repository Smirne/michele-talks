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
  credit: {
    photo: 'Photo:',
    separator: ' · ',
  },
  stage: {
    alt: {
      talks:
        'Michele Giacobazzi with the other Robot Games finalists on the Devoxx Belgium 2026 stage',
      history:
        'Michele Giacobazzi on stage at Cloud Day 2026, in front of a screen showing his name and the talk title',
      contact:
        'Michele Giacobazzi facilitating a working table at the Codemotion Tech Lead Summit 2026',
    },
  },
  notFound: {
    title: 'Page not found',
    body: 'There is nothing at this address. It may have moved, or never existed.',
    back: 'Back to Home',
  },
} as const
