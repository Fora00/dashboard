import { HabitLegend } from './HabitLegend'

const RULES: [string, string][] = [
  [
    'Floor',
    'The smallest version of a habit that still counts, on your worst day (journal: date + one line). A floor day counts as done. The floor always runs; anything above it is a bonus.',
  ],
  [
    'Rest days: a check',
    'Rest is neutral, but a lot of it can be avoidance. Before you mark one, the app warns you at the third rest day in a week, at two in a row, or right after an empty day, and offers the floor instead. The Week and Month recap flags habits with many rest days. Ask: am I avoiding something, or do I need a break?',
  ],
  [
    'Several taps a day',
    'A habit set to N taps a day (water, meals) fills as you tap: the dots on the tile show progress and the day is done at N. Fewer taps is progress, not a state. The floor still counts as done on its own.',
  ],
  [
    'Lifeboard of forever wins',
    'The Board tab is SpoonFed’s idea: a graph-paper book where every time you do a habit, however small, one box is coloured and numbered with that habit’s lifetime count. It only goes up: misses, rest days and empty days are never drawn, so nothing is taken away and the book just keeps filling with colour. The bigger the number, the bigger the box, so the book itself grows. Look at it for the mix of colours: which habits you rocked, which you neglected.',
  ],
  [
    'Grace',
    'A habit to avoid can have a grace: how many slips a week are tolerated (for example 2 for “don’t extend phone time”). They are the mirror of a weekly target: a ceiling instead of a minimum. Slips inside the grace do not break the streak or fail the week and show in amber; the next one in the same week counts. The grace resets every Monday. Or set it per day: each tap on the tile is one slip, up to N a day still count as a kept day (within grace), the next that day is a real slip.',
  ],
  [
    'Habits to avoid',
    'A “don’t” habit is kept every day unless you mark a slip: tap its tile when you slip and say why. Like a normal habit it has a floor, here a limit: the most you allow on a bad day (one coffee, before noon). Within it counts as kept (◐); past it is a slip. Streak = kept days. Only days you used the app count (any habit logged), so a stopped log never looks like a perfect streak. One slip is a data point; never twice in a row.',
  ],
  [
    'Rest day vs missed',
    'A rest day is on purpose (tired, sick, away, planned): it is neutral, never a miss, and it does not break a streak. Missed means it did not happen. Both can carry a reason, one tap.',
  ],
  [
    'Two-day rule',
    'Never miss twice. After one empty or missed day the tile offers the floor, quietly, in amber (no red, no counter). After two or more, it offers “Reset the setup”. Daily habits only.',
  ],
  [
    'Times per week',
    'A habit set to N times a week is judged on the week: any days count, the ring fills toward N, and the streak counts weeks that reached it.',
  ],
  [
    'Streaks',
    'Days in a row (weeks for N-a-week habits). The headline is days done: a streak of 0 after 141 done days is still 141 days. Look at streaks on Sunday, not every day.',
  ],
  [
    'Cycle',
    'Every habit is a cycle: start, end (4 weeks), a verdict (up, stay, down, closed). Few forever habits (2–3), the rest are experiments you can close without guilt. More than 3 open and none gets finished. Judge a habit at 8–10 weeks, not at week 3.',
  ],
  [
    'No catch-up, no shame',
    'After a gap you go back to the floor and pick one act for this week. A gap is data about the setup, not a verdict on you.',
  ],
]

/** The rules behind the page, the Spock test and the colour legend. */
export function HabitRules() {
  return (
    <div className="space-y-5 text-sm">
      <section aria-label="Spock test" className="rounded-xl border border-amber-300/60 bg-amber-300/5 p-3">
        <h3 className="font-medium">🖖 The Spock test</h3>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          When I miss, I ask what I would tell a friend, or I read it as data:{' '}
          <em>a systems problem, not a character flaw</em>. Then I redesign the system, not myself.
        </p>
        <p className="mt-2 font-medium">Three lines before I vent, and the fix within ten minutes:</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-slate-600 dark:text-slate-300">
          <li>How do I feel? One word.</li>
          <li>What happened? Facts only. In the app: the reason you tap on a rest day or a miss.</li>
          <li>
            What was the gap in the setup (anchor, energy, plan), and the fix? In the app: “Reset the setup”: move the
            anchor, shrink the floor, or pause the habit.
          </li>
        </ol>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Not every reason to skip is an excuse: sometimes the body needs a rest. Ask: am I avoiding something, or do I
          need a break? If it is a break, take it and keep the floor. The Week and Month views gather the reasons so you
          can read the pattern on Sunday.
        </p>
      </section>

      <section aria-label="Rules">
        <h3 className="mb-2 font-medium">Rules</h3>
        <dl className="space-y-2.5">
          {RULES.map(([term, text]) => (
            <div key={term}>
              <dt className="font-medium">{term}</dt>
              <dd className="text-slate-600 dark:text-slate-300">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Views">
        <h3 className="mb-2 font-medium">Views</h3>
        <ul className="space-y-1 text-slate-600 dark:text-slate-300">
          <li>
            <b>Today</b>: the tiles. Tap = done, hold = floor, rest or missed, ⋯ = one habit’s recap.
          </li>
          <li>
            <b>Week</b> and <b>Month</b>: every habit side by side, counts per state, reasons, and the Spock prompt.
          </li>
          <li>Each habit’s ⋯ sheet: its own calendar, streaks, cycle and settings.</li>
        </ul>
      </section>

      <HabitLegend />
    </div>
  )
}
