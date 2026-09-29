// Volkan TDG (board games / RPG association, Trento). WordPress + The Events
// Calendar; robots.txt allows everything. The site-wide iCal export
// https://volkantdg.it/events/?ical=1 lists the upcoming events (each
// occurrence is its own VEVENT). The calendar is often stale: when nothing
// is scheduled the export is an empty body, which is a valid "0 events".
import { ical } from './ical.ts'

export const volkan = ical({
  id: 'volkan',
  name: 'Volkan TDG',
  feed: 'https://volkantdg.it/events/?ical=1',
  home: 'https://volkantdg.it/',
  city: 'Trento',
  mayBeEmpty: true,
})
