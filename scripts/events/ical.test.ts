import { describe, expect, it } from 'vitest'
import { icalDate, parseIcal, unescapeText, unfold } from './ical.ts'

const wrap = (body: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${body}\r\nEND:VCALENDAR\r\n`

describe('unfold / unescapeText', () => {
  it('joins folded lines (CRLF + space or tab)', () => {
    expect(unfold('SUMMARY:Hello\r\n  world\r\n\tagain')).toEqual(['SUMMARY:Hello worldagain'])
  })
  it('unescapes \\n \\, \\; and \\\\', () => {
    expect(unescapeText('a\\nb\\, c\\; d\\\\e\\Nf')).toBe('a\nb, c; d\\e\nf')
  })
})

describe('parseIcal', () => {
  it('reads every VEVENT with properties and parameters', () => {
    const ics = wrap(
      [
        'BEGIN:VEVENT',
        'UID:1',
        'SUMMARY:Serata giochi',
        'DTSTART;TZID=Europe/Rome:20261004T203000',
        'END:VEVENT',
        'BEGIN:VEVENT',
        'UID:2',
        'SUMMARY:Altro',
        'END:VEVENT',
      ].join('\r\n'),
    )
    const events = parseIcal(ics)
    expect(events).toHaveLength(2)
    expect(events[0]?.SUMMARY?.value).toBe('Serata giochi')
    expect(events[0]?.DTSTART?.params.TZID).toBe('Europe/Rome')
    expect(events[1]?.UID?.value).toBe('2')
  })

  it('skips nested components (VALARM) and keeps the first of a repeated property', () => {
    const ics = wrap(
      ['BEGIN:VEVENT', 'SUMMARY:Real', 'BEGIN:VALARM', 'SUMMARY:alarm text', 'END:VALARM', 'SUMMARY:second', 'END:VEVENT'].join('\r\n'),
    )
    const [e] = parseIcal(ics)
    expect(e?.SUMMARY?.value).toBe('Real')
  })

  it('a colon inside a quoted parameter does not end the parameters', () => {
    const [e] = parseIcal(wrap('BEGIN:VEVENT\r\nATTENDEE;CN="Rossi: Mario":mailto:m@x.it\r\nEND:VEVENT'))
    expect(e?.ATTENDEE?.params.CN).toBe('Rossi: Mario')
    expect(e?.ATTENDEE?.value).toBe('mailto:m@x.it')
  })

  it('ignores properties outside a VEVENT and lines without a colon', () => {
    expect(parseIcal(wrap('SUMMARY:outside\r\nnonsense'))).toEqual([])
  })

  it('tolerates LF-only line endings', () => {
    expect(parseIcal('BEGIN:VEVENT\nSUMMARY:x\nEND:VEVENT')).toHaveLength(1)
  })
})

describe('icalDate', () => {
  it('a DATE value is an all-day event at Rome midnight', () => {
    expect(icalDate({ value: '20261004', params: { VALUE: 'DATE' } })).toEqual({
      iso: '2026-10-04T00:00:00+02:00', allDay: true, date: '2026-10-04',
    })
    expect(icalDate({ value: '20261004', params: {} })?.allDay).toBe(true)
  })

  it('UTC date-time converts to Rome, possibly changing the day', () => {
    expect(icalDate({ value: '20261004T183000Z', params: {} })).toEqual({
      iso: '2026-10-04T20:30:00+02:00', allDay: false, date: '2026-10-04',
    })
    expect(icalDate({ value: '20261004T230000Z', params: {} })?.date).toBe('2026-10-05')
  })

  it('floating time is taken as Rome', () => {
    expect(icalDate({ value: '20261104T090000', params: {} })?.iso).toBe('2026-11-04T09:00:00+01:00')
  })

  it('TZID converts from that zone', () => {
    expect(icalDate({ value: '20261004T140000', params: { TZID: 'America/New_York' } })?.iso).toBe('2026-10-04T20:00:00+02:00')
  })

  it('an unknown TZID falls back to Rome instead of throwing', () => {
    expect(icalDate({ value: '20261004T203000', params: { TZID: 'Mars/Olympus' } })?.iso).toBe('2026-10-04T20:30:00+02:00')
  })

  it('null for missing or malformed values', () => {
    expect(icalDate(undefined)).toBeNull()
    expect(icalDate({ value: 'garbage', params: {} })).toBeNull()
    expect(icalDate({ value: 'garbage', params: { VALUE: 'DATE' } })).toBeNull()
  })
})
