export const contentStrings = {
  language: { en: 'English', it: 'Italian' },
  duration: { one: '{minutes} minute', other: '{minutes} minutes' },
  level: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
  format: {
    talk: 'Talk',
    lightning: 'Lightning talk',
    keynote: 'Keynote',
    workshop: 'Workshop',
    panel: 'Panel',
  },
  appearance: {
    online: 'Online',
    place: '{city}, {country}',
    presentedAs: 'Presented as',
    eventPage: 'Event page',
  },
  resource: {
    slides: 'Slides',
    video: 'Video',
    label: '{type} ({language})',
    ariaLabel: '{type} ({language}), {languageName}',
  },
} as const
