// The booking page's day panel: the event lengths, the site fee, one day's open start times and
// the words for them. Pure functions only: no fetch and no clock. The day panel island, the
// Netlify Function (netlify/functions/availability-times.mts) and Vitest (day-times.test.ts)
// all run them, so nothing here may touch Node or the DOM.
//
// Times are ISO strings with the zone's offset, the way Cal.com writes them, for example
// "2026-11-07T09:00:00.000-08:00". Labels are built from Intl's formatToParts rather than a whole
// formatted string, so no ":00" and no narrow no-break space (newer ICU puts one before AM and PM)
// reach the page: "9 AM", "12 PM", "1:30 PM".

import { BOOKING } from '../config/site.ts';
import { todayInZone, weekdayOf } from './availability.ts';

/** One open start time on a day. */
export type DayTime = {
  /** When the event starts: ISO with offset, as Cal.com returns it. */
  start: string;
  /** When the event ends: the start plus the chosen length, ISO with offset. */
  end: string;
  /** The start on a clock in the booking zone, for example "8 AM" or "12:30 PM". */
  label: string;
};

/**
 * A stretch of the park's day that no event can use: booked, the hour kept clear on each side of a
 * booking, past the notice period, or a gap too short for the shortest event.
 */
export type DayWindow = {
  /** ISO with offset, as Cal.com writes times. */
  start: string;
  end: string;
  /** "8 AM to 2 PM" on a clock in the booking zone. */
  label: string;
};

/** The body of a 200 from GET /api/availability/times. */
export type DayTimesResponse = {
  /** The day asked for, YYYY-MM-DD in `timeZone`. */
  date: string;
  /** The length asked for, in minutes. */
  minutes: number;
  /** IANA zone of `date` and of the labels: BOOKING.timeZone. */
  timeZone: string;
  /** Open start times on `date` that fit `minutes`, earliest first. Empty when none fit. */
  times: DayTime[];
  /**
   * The parts of the park's day (BOOKING.dayOpens to BOOKING.dayCloses) where no event of the
   * shortest length fits, earliest first, whatever `minutes` is. Empty when the whole day is free.
   */
  unavailable: DayWindow[];
};

/**
 * The `data` object of a Cal.com v2 slots response: date to open slots. The default shape gives
 * `start` alone; `format=range` adds `end`.
 */
export type RangeSlotData = Record<string, { start: string; end?: string }[]>;

/* ---------- lengths and fees ---------- */

/** True when `minutes` is one of the lengths on offer (BOOKING.lengths unless a list is passed). */
export function isAllowedLength(minutes: number, lengths: readonly number[] = BOOKING.lengths): boolean {
  return Number.isInteger(minutes) && lengths.includes(minutes);
}

/**
 * The Cal.com event slug that lists times for a length and books it. A length found in
 * `byLength` (BOOKING.eventSlugByLength) gets its own event; any other length, and every length
 * while the map is null, gets `fallback` (BOOKING.calEventSlug).
 */
export function eventSlugFor(
  minutes: number,
  byLength: Readonly<Record<number, string>> | null = BOOKING.eventSlugByLength,
  fallback: string = BOOKING.calEventSlug,
): string {
  return byLength?.[minutes] || fallback;
}

/** The site fee in dollars for `minutes` of booked time: 180 minutes at $300 an hour is 900. */
export function feeFor(minutes: number, ratePerHour: number = BOOKING.ratePerHour): number {
  return Math.round(((ratePerHour * minutes) / 60) * 100) / 100;
}

/** "2 hours", "8 hours". One hour reads "1 hour"; a length that is not whole hours reads in minutes. */
export function lengthLabel(minutes: number): string {
  if (minutes % 60 !== 0) return `${minutes} minutes`;
  const hours = minutes / 60;
  return hours === 1 ? '1 hour' : `${hours} hours`;
}

/* ---------- dates and times ---------- */

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True for a real calendar date written YYYY-MM-DD: 2028-02-29 is one, 2026-02-29 is not. */
export function isCalendarDate(value: string): boolean {
  const m = YMD.exec(value);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/** Milliseconds since the epoch for an ISO date and time. Throws on anything unreadable. */
function instantOf(iso: string): number {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new RangeError(`Expected an ISO date and time, got "${iso}"`);
  return ms;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

/** One cached formatter per use and zone: building them is the slow part of Intl. */
function formatter(use: 'label' | 'wall', timeZone: string): Intl.DateTimeFormat {
  const key = `${use} ${timeZone}`;
  let f = formatters.get(key);
  if (!f) {
    f =
      use === 'label'
        ? new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true })
        : new Intl.DateTimeFormat('en-US', {
            timeZone,
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
    formatters.set(key, f);
  }
  return f;
}

function partsAt(f: Intl.DateTimeFormat, ms: number): Record<string, string> {
  const got: Record<string, string> = {};
  for (const p of f.formatToParts(new Date(ms))) got[p.type] = p.value;
  return got;
}

interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millis: number;
  /** Minutes the zone is ahead of UTC at that instant: -480 for Pacific standard time. */
  offset: number;
}

/** What a clock in `timeZone` reads at `ms`, and the offset in force then. */
function wallClock(ms: number, timeZone: string): WallClock {
  const p = partsAt(formatter('wall', timeZone), ms);
  const year = Number(p.year);
  const month = Number(p.month);
  const day = Number(p.day);
  const hour = Number(p.hour) % 24; // some engines write midnight as 24, even under h23
  const minute = Number(p.minute);
  const second = Number(p.second);
  const millis = ((ms % 1000) + 1000) % 1000;
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second, millis);
  return { year, month, day, hour, minute, second, millis, offset: Math.round((asUtc - ms) / 60_000) };
}

/** The instant a clock in `timeZone` reads `minuteOfDay` minutes past midnight on `date`. */
function instantAt(date: string, minuteOfDay: number, timeZone: string): number {
  const [y, mo, d] = date.split('-').map(Number) as [number, number, number];
  const wall = Date.UTC(y, mo - 1, d, 0, minuteOfDay);
  // Read the offset at a first guess, then again at the corrected instant. The second reading
  // settles the hours next to a daylight saving change.
  const guess = wall - wallClock(wall, timeZone).offset * 60_000;
  return wall - wallClock(guess, timeZone).offset * 60_000;
}

/**
 * An instant written the way Cal.com writes times: the clock in `timeZone`, then the offset in
 * force at that instant. 1:30 AM on 2026-11-01 happens twice in Los Angeles, first at -07:00 and
 * then at -08:00, and each instant keeps its own.
 */
export function toZonedIso(ms: number, timeZone: string): string {
  const w = wallClock(ms, timeZone);
  const sign = w.offset < 0 ? '-' : '+';
  const abs = Math.abs(w.offset);
  const day = `${pad(w.year, 4)}-${pad(w.month)}-${pad(w.day)}`;
  const time = `${pad(w.hour)}:${pad(w.minute)}:${pad(w.second)}.${pad(w.millis, 3)}`;
  return `${day}T${time}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** "9 AM", "12 PM", "1:30 PM": the time `iso` shows on a clock in `timeZone`. */
export function formatTimeLabel(iso: string, timeZone: string): string {
  const p = partsAt(formatter('label', timeZone), instantOf(iso));
  const minute = p.minute === '00' ? '' : `:${p.minute}`;
  return `${p.hour}${minute} ${(p.dayPeriod ?? '').toUpperCase()}`;
}

/** "9 AM to 12 PM": an event from `startIso` to `endIso` on a clock in `timeZone`. */
export function rangeLabel(startIso: string, endIso: string, timeZone: string): string {
  return `${formatTimeLabel(startIso, timeZone)} to ${formatTimeLabel(endIso, timeZone)}`;
}

/**
 * The same instant in UTC with milliseconds and Z, the form the booker's `slot` query parameter
 * takes: "2026-11-07T09:00:00.000-08:00" becomes "2026-11-07T17:00:00.000Z".
 */
export function toUtcSlot(iso: string): string {
  return new Date(instantOf(iso)).toISOString();
}

/**
 * True when `iso` starts on `date` (YYYY-MM-DD) on a clock in `timeZone`, whatever offset it is
 * written with. False for anything unreadable. The endpoint keeps only these, and the day panel
 * checks them again, so no time from the evening before or the morning after reaches a day.
 */
export function startsOn(iso: string, date: string, timeZone: string): boolean {
  const at = Date.parse(iso);
  return !Number.isNaN(at) && todayInZone(timeZone, new Date(at)) === date;
}

/* ---------- unavailable windows ---------- */

/**
 * The parts of `date` between `opens` and `closes` (minutes after midnight in `timeZone`) that no
 * event can use, from the open start times of a `probeMinutes` event (the shortest length). Each
 * start frees the stretch from it to its end; what no start frees is not available. Cal.com only
 * publishes open times, never bookings, so this is as close to "what is booked" as the public API
 * goes. A window is wider than the booking inside it: every event has 60-minute buffers before and
 * after (read 2026-11-04), and the probe's own buffers add to the booking's, so a paid booking from
 * 3 PM to 5 PM on 2026-11-28 read as "1 PM to 8 PM" (no two-hour event fits after it by 8 PM).
 */
export function unavailableWindows(
  starts: readonly string[],
  date: string,
  timeZone: string,
  probeMinutes: number,
  opens: number = BOOKING.dayOpens,
  closes: number = BOOKING.dayCloses,
): DayWindow[] {
  const dayStart = instantAt(date, opens, timeZone);
  const dayEnd = instantAt(date, closes, timeZone);
  if (!(dayEnd > dayStart)) return [];
  const free = starts
    .map((iso) => Date.parse(iso))
    .filter((at) => !Number.isNaN(at))
    .map((at) => [Math.max(at, dayStart), Math.min(at + probeMinutes * 60_000, dayEnd)] as const)
    .filter(([from, to]) => to > from)
    .sort((a, b) => a[0] - b[0]);

  const windows: DayWindow[] = [];
  const add = (from: number, to: number) => {
    if (to <= from) return;
    const start = toZonedIso(from, timeZone);
    const end = toZonedIso(to, timeZone);
    windows.push({ start, end, label: rangeLabel(start, end, timeZone) });
  };
  let cursor = dayStart;
  for (const [from, to] of free) {
    add(cursor, from);
    if (to > cursor) cursor = to;
  }
  add(cursor, dayEnd);
  return windows;
}

/* ---------- freshness and fixtures ---------- */

/**
 * How long the day panel trusts times it fetched. A visitor who comes back to a date and length
 * later than this sees them loaded again, so the booker is only handed a start the endpoint listed
 * shortly before (its CDN cache adds up to a few minutes of its own).
 */
export const TIMES_MAX_AGE_MS = 2 * 60_000;

/** True while times fetched at `fetchedAt` are still good for a visitor who arrived at `arrivedAt`. */
export function isFreshTimes(fetchedAt: number, arrivedAt: number, maxAgeMs: number = TIMES_MAX_AGE_MS): boolean {
  return arrivedAt - fetchedAt <= maxAgeMs;
}

/**
 * Whether `?fixture=1` may answer with fixture data. It fails closed: a known deploy context
 * decides (anything but "production"), and with none, only a local dev server may. Netlify does
 * not give functions the build's CONTEXT variable at runtime (only URL, SITE_NAME and SITE_ID), so
 * the functions read the context from the request's `context.deploy.context` instead.
 */
export function allowsFixture(
  deployContext: string | undefined,
  env: { NETLIFY_DEV?: string; NODE_ENV?: string } = {},
): boolean {
  if (deployContext) return deployContext !== 'production';
  return Boolean(env.NETLIFY_DEV) || env.NODE_ENV === 'development';
}

/* ---------- Cal.com data ---------- */

/**
 * One day's open start times from a Cal.com slots `data` object, in either shape. Cal.com reads
 * `start` and `end` as whole UTC days, so a query for one Pacific day also returns the evening
 * before (a stray key for the previous date) and, with `end` set to the next day, that morning.
 * This keeps only the slots that start on `date` on a clock in `timeZone`, whatever key they came
 * under. It fills in `end` as the start plus `minutes` when Cal.com sends none (or one that is
 * not after the start), drops repeats of the same instant and anything unreadable, sorts by start
 * and labels each time.
 */
export function selectDayTimes(data: RangeSlotData, date: string, timeZone: string, minutes: number): DayTime[] {
  const picked = new Map<number, DayTime>();
  for (const slots of Object.values(data ?? {})) {
    if (!Array.isArray(slots)) continue;
    for (const slot of slots) {
      const start = slot?.start;
      if (typeof start !== 'string') continue;
      const at = Date.parse(start);
      if (Number.isNaN(at) || picked.has(at)) continue;
      if (!startsOn(start, date, timeZone)) continue; // the date `at` falls on in the zone
      const end =
        typeof slot.end === 'string' && Date.parse(slot.end) > at
          ? slot.end
          : toZonedIso(at + minutes * 60_000, timeZone);
      picked.set(at, { start, end, label: formatTimeLabel(start, timeZone) });
    }
  }
  return [...picked.entries()].sort(([a], [b]) => a - b).map(([, time]) => time);
}

/* ---------- fixture ---------- */

/** The fixture's day, like the live event: hourly starts from 8 AM, every event over by 8 PM. */
const FIXTURE_FIRST_START = 8 * 60;
const FIXTURE_CLOSE = 20 * 60;
/** The fixture's weekend booking, 11 AM to 1 PM, so Saturdays and Sundays come back partly booked. */
const FIXTURE_WEEKEND_BOOKING = { from: 11 * 60, to: 13 * 60 };

/**
 * A deterministic stand-in for Cal.com, for building the day panel offline (`?fixture=1`).
 * Every day starts on the hour from 8 AM for as long as the event still ends by 8 PM. Saturdays
 * and Sundays also hold a booking from 11 AM to 1 PM, so fewer times fit there and an 8-hour
 * event fits none (the "no times left" state). A longer length always leaves fewer times. The
 * times go through selectDayTimes() in Cal.com's default shape (start alone), the same path live
 * data takes.
 */
export function buildTimesFixture(date: string, minutes: number, timeZone: string = BOOKING.timeZone): DayTime[] {
  const weekday = weekdayOf(date);
  const weekend = weekday === 0 || weekday === 6;
  const slots: { start: string }[] = [];
  for (let from = FIXTURE_FIRST_START; from + minutes <= FIXTURE_CLOSE; from += 60) {
    const clashes = weekend && from < FIXTURE_WEEKEND_BOOKING.to && from + minutes > FIXTURE_WEEKEND_BOOKING.from;
    if (!clashes) slots.push({ start: toZonedIso(instantAt(date, from, timeZone), timeZone) });
  }
  return selectDayTimes({ [date]: slots }, date, timeZone, minutes);
}
