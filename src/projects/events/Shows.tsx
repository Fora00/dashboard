import { useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Chip } from '../../components/Chip'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SkeletonList } from '../../components/Skeleton'
import { Snackbar } from '../../components/Snackbar'
import { db } from '../../lib/db'
import { EventCard } from './EventCard'
import { EventsNav } from './EventsNav'
import { dayLabel, relativeTime, romeDate } from './model'
import { filmsOn, type Film } from './screenings'
import { HORIZON_DAYS, showDay, showKind, stageOn, upcomingShows, type ShowKind } from './showList'
import type { EventItem } from './types'
import { useEventsFile } from './useEventsFile'
import { useEventActions } from './useEventActions'
import { DEFAULT_ZONES, ZONES, inZones, zoneOf } from './zones'

const ALL_ZONES = '*'

/** Synopses from some sources end in a cut-off tag: show text only. */
const plain = (s: string) => s.replace(/<[^>]*>?/g, '').trim()

/** The film as one event card: marks and likes attach to its first screening of the day. */
function filmEvent(f: Film): EventItem {
  const text = plain(f.description)
  return { ...f.event, title: f.title, image: f.image, description: text, summary: text.slice(0, 200) }
}

/** Every town a film plays in that day, with its times (the card itself shows the first). */
function Showings({ film }: { film: Film }) {
  return (
    <ul className="space-y-0.5">
      {film.showings.map((s) => (
        <li key={`${s.city}|${s.hall}`} className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium tabular-nums">
            {s.times.length ? s.times.join(' · ') : 'orario da confermare'}
          </span>
          {` · ${s.city}${s.hall !== s.city ? ` (${s.hall})` : ''}`}
        </li>
      ))}
    </ul>
  )
}

const KINDS: [ShowKind | null, string][] = [
  [null, 'Tutto'],
  ['cinema', 'Cinema'],
  ['theatre', 'Teatro'],
  ['concerts', 'Concerti'],
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      {label && (
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </h2>
      )}
      <ul className="space-y-2">{children}</ul>
    </section>
  )
}

/** Cinema, theatre and concerts by day: a strip of days, kind and town filters, one card per film or show. */
export function Shows() {
  const { cache, fetchState, now } = useEventsFile()
  const file = cache?.file
  const actions = useEventActions()
  const marksRaw = useLiveQuery(() => db.eventMarks.toArray())
  const interestRows = useLiveQuery(() => db.eventInterest.toArray())
  const marks = useMemo(() => new Map((marksRaw ?? []).map((m) => [m.id, m])), [marksRaw])
  const interest = useMemo(() => new Map((interestRows ?? []).map((r) => [r.id, r.value])), [interestRows])
  // Children's films are listed too (the event list drops them, this page does not).
  const shows = useMemo(
    () => upcomingShows(file?.events ?? [], now).filter((e) => marks.get(e.id)?.state !== 'hidden'),
    [file, now, marks],
  )
  const [kind, setKind] = useState<ShowKind | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  // null = Trento and Rovereto (the default), ALL_ZONES = everywhere, else one zone id.
  const [zone, setZone] = useState<string | null>(null)

  const today = romeDate(now)
  const last = romeDate(now + HORIZON_DAYS * 86_400_000)
  const zoneIds = useMemo(() => (zone === null ? DEFAULT_ZONES : zone === ALL_ZONES ? [] : [zone]), [zone])
  const inZone = useMemo(() => shows.filter((e) => inZones(e, zoneIds)), [shows, zoneIds])
  const ofKind = useMemo(() => (kind ? inZone.filter((e) => showKind(e) === kind) : inZone), [inZone, kind])
  const days = useMemo(
    () => [...new Set(ofKind.map((e) => showDay(e, now)))].filter((d) => d >= today && d <= last).sort(),
    [ofKind, now, today, last],
  )
  // Zones outside the default that have something of this kind (any day).
  const otherZones = useMemo(() => {
    const ofThisKind = kind ? shows.filter((e) => showKind(e) === kind) : shows
    const present = new Set(ofThisKind.map((e) => zoneOf(e)))
    return ZONES.filter((z) => present.has(z.id) && !DEFAULT_ZONES.includes(z.id))
  }, [shows, kind])
  // The chosen day, else the first day that has something.
  const day = picked && days.includes(picked) ? picked : (days[0] ?? today)
  const films = useMemo(
    () =>
      kind === null || kind === 'cinema'
        ? filmsOn(
            inZone.filter((e) => showKind(e) === 'cinema'),
            day,
            now,
            null,
          )
        : [],
    [inZone, kind, day, now],
  )
  const stage = useMemo(
    () => (kind === 'cinema' ? [] : stageOn(inZone, day, now, kind, null)),
    [inZone, kind, day, now],
  )
  const plays = stage.filter((e) => e.category === 'theatre')
  const concerts = stage.filter((e) => e.category === 'concerts')

  const header = (
    <>
      <PageHeader
        emoji="🎭"
        title="Spettacoli"
        subtitle={
          file
            ? `Cinema, teatro e concerti · updated ${relativeTime(file.generatedAt, now)}`
            : 'Cinema, teatro e concerti in Trentino.'
        }
      />
      <EventsNav />
    </>
  )

  if (cache === null) {
    return (
      <div>
        {header}
        <SkeletonList />
      </div>
    )
  }

  if (!file) {
    return (
      <div>
        {header}
        {fetchState === 'loading' ? (
          <SkeletonList />
        ) : (
          <EmptyState
            emoji="🎭"
            title="Programme unavailable"
            hint="Connect once to download it; it then works offline."
          />
        )}
      </div>
    )
  }

  const labelled = kind === null
  // A plain function, not a component: the cards keep their state across renders.
  const card = (event: EventItem, extra?: ReactNode) => (
    <EventCard
      key={event.id}
      event={event}
      saved={marks.get(event.id)?.state === 'saved'}
      going={marks.get(event.id)?.state === 'going'}
      hidden={false}
      now={now}
      onToggleSave={actions.onToggleSave}
      onToggleGoing={actions.onToggleGoing}
      onToggleHide={actions.onToggleHide}
      interest={interest.get(event.id) ?? 0}
      onInterest={actions.onInterest}
      extra={extra}
    />
  )
  return (
    <div>
      {header}
      <div className="-mx-4 mb-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Kind">
        <div className="flex w-max items-center gap-2">
          {KINDS.map(([id, label]) => (
            <Chip key={label} active={kind === id} onClick={() => setKind(id)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {days.length === 0 ? (
        <EmptyState emoji="🎭" title="Nothing scheduled" hint="The programme shows here after the next daily update." />
      ) : (
        <>
          <div className="-mx-4 mb-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Day">
            <div className="flex w-max items-center gap-2">
              {days.map((d) => (
                <Chip key={d} active={d === day} onClick={() => setPicked(d)}>
                  {dayLabel(d, now)}
                </Chip>
              ))}
            </div>
          </div>

          {otherZones.length > 0 && (
            <div className="-mx-4 mb-3 overflow-x-auto px-4 pb-1" role="group" aria-label="Zona">
              <div className="flex w-max items-center gap-2">
                <Chip active={zone === null} onClick={() => setZone(null)}>
                  Trento + Rovereto
                </Chip>
                {otherZones.map((z) => (
                  <Chip key={z.id} active={zone === z.id} onClick={() => setZone(zone === z.id ? null : z.id)}>
                    {z.label}
                  </Chip>
                ))}
                <Chip active={zone === ALL_ZONES} onClick={() => setZone(zone === ALL_ZONES ? null : ALL_ZONES)}>
                  Tutte
                </Chip>
              </div>
            </div>
          )}

          {films.length + stage.length === 0 ? (
            <EmptyState emoji="🎭" title="Nothing here" hint="Nothing on this day here: try another day or zone." />
          ) : (
            <>
              {films.length > 0 && (
                <Section label={labelled ? 'Cinema' : ''}>
                  {films.map((f) => card(filmEvent(f), f.showings.length > 1 ? <Showings film={f} /> : undefined))}
                </Section>
              )}
              {plays.length > 0 && <Section label={labelled ? 'Teatro' : ''}>{plays.map((e) => card(e))}</Section>}
              {concerts.length > 0 && (
                <Section label={labelled ? 'Concerti' : ''}>{concerts.map((e) => card(e))}</Section>
              )}
            </>
          )}
        </>
      )}
      {actions.pendingUndo && <Snackbar label={actions.pendingUndo.label} onUndo={actions.confirmUndo} />}
    </div>
  )
}
