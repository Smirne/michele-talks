const pad = (n: number) => String(n).padStart(2, '0')

/** The visitor's local calendar date as YYYY-MM-DD. */
const localIsoDate = (now: Date): string =>
  `${String(now.getFullYear())}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

/** Upcoming = dated after the visitor's local today (AC-5.2). Computed at render, not build. */
export const isUpcoming = (dateIso: string, now: Date = new Date()): boolean =>
  dateIso > localIsoDate(now)

/** Upcoming soonest first, past newest first. Input is not mutated. */
export const splitAppearances = <T extends { date: string }>(
  appearances: readonly T[],
  now: Date = new Date()
): { upcoming: T[]; past: T[] } => {
  const upcoming = appearances.filter((a) => isUpcoming(a.date, now))
  const past = appearances.filter((a) => !isUpcoming(a.date, now))
  upcoming.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  past.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0))
  return { upcoming, past }
}
