/**
 * The day panel on the booking page, from the board's feedback of 2026-11-03: see a day's open
 * times before agreeing to anything. Picking an open or partly booked day in the availability
 * calendar (AvailabilityCalendar.tsx) opens this panel under the grid, on our own site:
 *
 * - the day as a heading ("Saturday, November 7"), which takes focus after each pick;
 * - "How long is your event?", a select of BOOKING.lengths, each with its site fee at
 *   BOOKING.ratePerHour ("3 hours, $900"), two hours by default;
 * - that day's open start times for the chosen length, as chips with radio semantics, read live
 *   from Cal.com through GET /api/availability/times (the response is typed in src/lib/day-times.ts),
 *   with a note that times are start times, that booked time includes setup and breakdown, and the
 *   zone they are in;
 * - once a time is picked, one summary line ("Saturday, November 7, 9 AM to 12 PM. 3 hours, $900
 *   site fee.") and the secondary button "Continue to book".
 *
 * Continue hands the choice to the calendar, which then shows the terms gate and, once the visitor
 * agrees, the Cal.com booker opened straight on its form for that start (CalBooker.tsx). Changing
 * the length or the time after that calls onReset, so the calendar takes the gate and the booker
 * down until the visitor continues again. A new day clears the time and keeps the length, so a
 * visitor who needs five hours can walk from day to day without choosing it again.
 *
 * Times are cached per date and length in a ref, so switching back is instant, for two minutes
 * (TIMES_MAX_AGE_MS in day-times.ts); a later return loads them again. Each load is aborted when
 * the visitor moves on, so a slow answer never lands on the wrong day or length, and an answer is
 * only used when it names the date and length asked for. When they cannot load, the panel says so
 * and still continues to the booker on the date and the length, with no time. Two polite live regions carry the news: the times status (shown, none left, not loading)
 * and the summary. Both stay in the tree so a change is heard; each line is keyed so a repeat is too.
 *
 * Numbers: labels and the summary use the figures the shared helpers return ("3 hours"); whole
 * sentences spell out one to ten ("No five-hour times"), as the brand voice asks of prose.
 * The pure helpers are exported for day-panel.test.ts. Styles live under "day panel" in
 * availability-calendar.css.
 */
import * as React from 'react';
import { BOOKING } from '../../config/site';
import { feeFor, isAllowedLength, isFreshTimes, lengthLabel, rangeLabel, startsOn } from '../../lib/day-times';
import type { DayTime } from '../../lib/day-times';
import { Button, ChoiceChips, Field } from '../ds';
import type { Choice, FieldOption } from '../ds';
import { formatBookDate, zoneName } from './calendar-grid';
import './availability-calendar.css';

/** What the visitor chose, handed to the calendar on Continue and from there to CalBooker. */
export interface DayChoice {
  /** The day, YYYY-MM-DD. */
  date: string;
  /** The booked length in minutes, one of BOOKING.lengths. */
  minutes: number;
  /** The start as Cal.com lists it, an ISO string with offset; '' when the times could not load. */
  start: string;
  /** The end, likewise; '' when the times could not load. */
  end: string;
}

export interface DayPanelProps {
  /** The picked day, YYYY-MM-DD. */
  date: string;
  /** IANA zone the times are in (BOOKING.timeZone), named in the note under the times. */
  timeZone: string;
  /** Ask the endpoint for fixture times (local dev), as the calendar does for the month. */
  fixture: boolean;
  /** "Continue to book": the calendar shows the terms gate, then the booker. */
  onContinue: (choice: DayChoice) => void;
  /** True while the calendar shows the gate or the booker for the current choice; the button steps aside. */
  continued: boolean;
  /** Called when the length or the time changes after Continue, so the calendar takes the gate and the booker down. */
  onReset?: () => void;
  /** The day heading. The calendar gives it focus after each pick. */
  headingRef?: React.Ref<HTMLHeadingElement>;
}

/** The endpoint that lists one day's open start times for one length. */
export const TIMES_ENDPOINT = '/api/availability/times';

const WHOLE_DOLLARS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const DOLLARS_AND_CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "$600", "$1,200"; cents only if a rate ever makes them ("$687.50"). */
export function formatFee(dollars: number): string {
  return Number.isInteger(dollars) ? WHOLE_DOLLARS.format(dollars) : DOLLARS_AND_CENTS.format(dollars);
}

/** "2 hours, $600": one option of the length picker. */
export function lengthOptionLabel(minutes: number): string {
  return `${lengthLabel(minutes)}, ${formatFee(feeFor(minutes))}`;
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** The word for a whole number of hours from one to ten, else null. */
function hoursWord(minutes: number): string | null {
  const hours = minutes / 60;
  return Number.isInteger(hours) && hours >= 1 && hours <= 10 ? NUMBER_WORDS[hours] : null;
}

/** "five-hour" inside a sentence; "12-hour" past ten, "150-minute" off the hour. */
export function lengthAdjective(minutes: number): string {
  const word = hoursWord(minutes);
  if (word) return `${word}-hour`;
  return Number.isInteger(minutes / 60) ? `${minutes / 60}-hour` : `${minutes}-minute`;
}

/** "two hours" inside a sentence; the label's figures past ten or off the hour. */
export function lengthInWords(minutes: number): string {
  const word = hoursWord(minutes);
  if (!word) return lengthLabel(minutes);
  return minutes === 60 ? 'one hour' : `${word} hours`;
}

/** No start time fits the length. The shortest length has nothing shorter to suggest. */
export function noTimesMessage(minutes: number, lengths: readonly number[] = BOOKING.lengths): string {
  const shorterExists = lengths.some((length) => length < minutes);
  const next = shorterExists ? 'Try a shorter length or another date.' : 'Try another date.';
  return `No ${lengthAdjective(minutes)} times are left on this day. ${next}`;
}

/** Heard, not seen, once a day's times are on screen. */
export function showingTimesMessage(minutes: number): string {
  return `Showing start times for ${lengthInWords(minutes)}.`;
}

/** "Saturday, November 7, 9 AM to 12 PM. 3 hours, $900 site fee." */
export function summaryLine(date: string, minutes: number, start: string, end: string, timeZone: string): string {
  return `${formatBookDate(date)}, ${rangeLabel(start, end, timeZone)}. ${lengthLabel(minutes)}, ${formatFee(feeFor(minutes))} site fee.`;
}

/** "/api/availability/times?date=2026-11-07&minutes=180", plus "&fixture=1" for fixture times. */
export function timesUrl(date: string, minutes: number, fixture = false): string {
  const params = new URLSearchParams({ date, minutes: String(minutes) });
  if (fixture) params.set('fixture', '1');
  return `${TIMES_ENDPOINT}?${params.toString()}`;
}

function isDayTime(value: unknown): value is DayTime {
  if (!value || typeof value !== 'object') return false;
  const { start, end, label } = value as Record<string, unknown>;
  return (
    typeof start === 'string' &&
    typeof end === 'string' &&
    typeof label === 'string' &&
    label !== '' &&
    !Number.isNaN(Date.parse(start)) &&
    !Number.isNaN(Date.parse(end))
  );
}

/** What the panel asked the endpoint for, so parseTimes can check the answer belongs to it. */
export interface TimesRequest {
  date: string;
  minutes: number;
  timeZone: string;
}

/**
 * The times in an endpoint body, sorted by start, unreadable entries dropped. Throws on any other
 * shape. Given the request, it also throws when the body names another date or length, and drops
 * any time that does not start on the date in the zone, so a stray time never becomes a booker slot.
 */
export function parseTimes(body: unknown, asked?: TimesRequest): DayTime[] {
  const record = body && typeof body === 'object' ? (body as { times?: unknown; date?: unknown; minutes?: unknown }) : null;
  const times = record ? record.times : undefined;
  if (!Array.isArray(times)) throw new Error('times returned an unexpected shape');
  if (asked && (record?.date !== asked.date || record?.minutes !== asked.minutes)) {
    throw new Error('times answered for another date or length');
  }
  return times
    .filter(isDayTime)
    .filter((t) => !asked || startsOn(t.start, asked.date, asked.timeZone))
    .map(({ start, end, label }) => ({ start, end, label }))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

const LENGTH_OPTIONS: FieldOption[] = BOOKING.lengths.map((minutes) => ({
  value: String(minutes),
  label: lengthOptionLabel(minutes),
}));

const NO_TIMES: DayTime[] = [];

type LoadStatus = 'loading' | 'ready' | 'error';

export default function DayPanel({ date, timeZone, fixture, onContinue, continued, onReset, headingRef }: DayPanelProps) {
  const [minutes, setMinutes] = React.useState<number>(BOOKING.lengths[0]);
  // The chosen start, as Cal.com lists it; '' for none.
  const [start, setStart] = React.useState('');
  // A new day clears the time and keeps the length: state that follows a prop, set during render
  // as React recommends, so the old time never shows against the new day.
  const [shownDate, setShownDate] = React.useState(date);
  if (shownDate !== date) {
    setShownDate(date);
    setStart('');
  }
  // Times by date, length and source, with when they were fetched. A failed load is not cached, so
  // coming back to it tries again.
  const cache = React.useRef(new Map<string, { times: DayTime[]; at: number }>());
  // The load in flight or just finished; its key says which date and length it belongs to. Only an
  // error is read from it; times come from the cache.
  const [load, setLoad] = React.useState<{ key: string; status: LoadStatus } | null>(null);
  const headingId = 'day-panel-' + React.useId().replace(/[^a-zA-Z0-9]/g, '');

  const key = `${date}|${minutes}|${fixture ? 'fixture' : 'live'}`;
  // When the visitor arrived at this date and length, set once per arrival during render (state
  // that follows the key). Cached times older than TIMES_MAX_AGE_MS at arrival load again; times
  // already on screen stay put while the visitor stays, so nothing moves under the pointer.
  const [arrival, setArrival] = React.useState(() => ({ key, at: Date.now() }));
  if (arrival.key !== key) setArrival({ key, at: Date.now() });
  const arrivedAt = arrival.at;
  const entry = cache.current.get(key);
  const cached = entry && isFreshTimes(entry.at, arrivedAt) ? entry.times : undefined;
  const status: LoadStatus = cached ? 'ready' : load && load.key === key && load.status === 'error' ? 'error' : 'loading';
  const times = cached ?? NO_TIMES;
  const chosen = times.find((t) => t.start === start) ?? null;

  React.useEffect(() => {
    const found = cache.current.get(key);
    if (found && isFreshTimes(found.at, arrivedAt)) return;
    // Each load is tied to its key and aborted when the visitor moves on, so a slow answer for an
    // earlier date or length can never stand in for the current one.
    const controller = new AbortController();
    setLoad({ key, status: 'loading' });
    fetch(timesUrl(date, minutes, fixture), { signal: controller.signal, headers: { accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`times responded ${res.status}`);
        const list = parseTimes(await res.json(), { date, minutes, timeZone });
        cache.current.set(key, { times: list, at: Date.now() });
        if (!controller.signal.aborted) setLoad({ key, status: 'ready' });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoad({ key, status: 'error' });
      });
    return () => {
      controller.abort();
      // Leaving this date and length forgets how its load went, so a return starts on "Loading
      // times" and never flashes (or announces) an old error for a moment.
      setLoad((prev) => (prev && prev.key === key ? null : prev));
    };
  }, [key, date, minutes, fixture, timeZone, arrivedAt]);

  const zone = React.useMemo(() => zoneName(timeZone), [timeZone]);
  const chips: Choice[] = React.useMemo(() => times.map((t) => ({ value: t.start, label: t.label })), [times]);

  const changeLength = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = Number(event.target.value);
    if (!isAllowedLength(next) || next === minutes) return;
    setMinutes(next);
    setStart('');
    if (continued) onReset?.();
  };

  const changeTime = (value: string) => {
    if (value === start) return;
    setStart(value);
    if (continued) onReset?.();
  };

  const continueWithTime = () => {
    if (chosen) onContinue({ date, minutes, start: chosen.start, end: chosen.end });
  };

  // The times did not load: go on to the booker on this date and length, with no time.
  const continueWithoutTime = () => onContinue({ date, minutes, start: '', end: '' });

  const hasTimes = status === 'ready' && times.length > 0;

  return (
    <section className="day-panel" aria-labelledby={headingId}>
      <h3 id={headingId} className="day-panel__title heading-sm" tabIndex={-1} ref={headingRef}>
        {formatBookDate(date)}
      </h3>

      <Field
        className="day-panel__length"
        type="select"
        name="event-length"
        label="How long is your event?"
        options={LENGTH_OPTIONS}
        value={String(minutes)}
        onChange={changeLength}
      />

      <div className="day-panel__times" aria-busy={status === 'loading'}>
        {/* Always in the tree so each change is announced. The success line is for screen readers. */}
        <div className="day-panel__status" role="status">
          {status === 'loading' && (
            <p key={`${key}|loading`} className="day-panel__loading body-sm">
              Loading times
            </p>
          )}
          {hasTimes && (
            <p key={`${key}|ready`} className="sc-visually-hidden">
              {showingTimesMessage(minutes)}
            </p>
          )}
          {status === 'ready' && times.length === 0 && (
            <p key={`${key}|none`} className="day-panel__message body-sm">
              {noTimesMessage(minutes)}
            </p>
          )}
          {status === 'error' && (
            <p key={`${key}|error`} className="day-panel__message body-sm">
              Times are not loading right now. You can still continue to the booking calendar.
            </p>
          )}
        </div>

        {hasTimes && (
          <>
            <ChoiceChips
              label="Start time"
              name="start-time"
              options={chips}
              value={chosen ? chosen.start : ''}
              onChange={changeTime}
              columns={4}
            />
            <p className="day-panel__note body-sm">
              Times are start times. Booked time includes setup and breakdown. Times are in {zone}.
            </p>
          </>
        )}

        {status === 'error' && !continued && (
          <div className="day-panel__actions">
            <Button variant="secondary" onClick={continueWithoutTime}>
              Continue to book
            </Button>
          </div>
        )}
      </div>

      {/* Always in the tree so the line is announced when it appears; it takes no space while empty. */}
      <div className="day-panel__summary" role="status">
        {chosen && (
          <p key={chosen.start} className="body-sm">
            {summaryLine(date, minutes, chosen.start, chosen.end, timeZone)}
          </p>
        )}
      </div>

      {chosen && !continued && (
        <div className="day-panel__actions">
          <Button variant="secondary" onClick={continueWithTime}>
            Continue to book
          </Button>
        </div>
      )}
    </section>
  );
}
