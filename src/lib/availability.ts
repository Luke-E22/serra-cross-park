// Availability logic for the booking calendar. Pure functions only: no fetch, no clock
// unless one is passed in. The Netlify Function (netlify/functions/availability.mts) and
// the dev-server bridge call these; Vitest covers them in availability.test.ts.
//
// Dates are plain "YYYY-MM-DD" strings in the booking time zone, exactly as Cal.com keys
// them. Day arithmetic goes through Date.UTC on the Y-M-D parts, so a machine's local
// zone never shifts a date.

export type DayStatus = 'past' | 'closed' | 'soon' | 'notyet' | 'booked' | 'partial' | 'open';

export interface DaySummary {
  status: DayStatus;
  /** Open slots Cal.com returned for the day. */
  open: number;
  /** Slots in a fully open day of that weekday. 0 when the weekday is closed. */
  of: number;
}

export interface AvailabilityResponse {
  /** ISO timestamp of when the summary was built. */
  generatedAt: string;
  /** IANA zone the dates are in, for example America/Los_Angeles. */
  timeZone: string;
  /** First day in `days` (today in `timeZone`), YYYY-MM-DD. */
  start: string;
  /** Last day in `days`, inclusive, YYYY-MM-DD. */
  end: string;
  days: Record<string, DaySummary>;
}

/** The `data` object of a Cal.com v2 slots response: date to open slots. */
export type SlotData = Record<string, { start: string }[]>;

export interface DateRange {
  start: string;
  /** Exclusive. */
  end: string;
}

export interface SummarizeInput {
  counts: Record<string, number>;
  start: string;
  /** Inclusive. */
  end: string;
  today: string;
  minNoticeDays: number;
  fullDaySlots: Record<number, number> | null;
}

export interface BuildResponseInput extends SummarizeInput {
  timeZone: string;
  /** Defaults to the current time. Pass a fixed value for deterministic output. */
  generatedAt?: string;
}

/* ---------- date helpers ---------- */

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

function parts(ymd: string): [number, number, number] {
  const m = YMD.exec(ymd);
  if (!m) throw new RangeError(`Expected YYYY-MM-DD, got "${ymd}"`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function fromUtc(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Today's date in an IANA time zone as YYYY-MM-DD. Never UTC arithmetic. */
export function todayInZone(timeZone: string, now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const got: Record<string, string> = {};
  for (const p of fmt.formatToParts(now)) {
    if (p.type === 'year' || p.type === 'month' || p.type === 'day') got[p.type] = p.value;
  }
  return `${got.year}-${got.month}-${got.day}`;
}

/** `ymd` plus `n` calendar days (negative moves back). */
export function addDays(ymd: string, n: number): string {
  const [y, m, d] = parts(ymd);
  return fromUtc(new Date(Date.UTC(y, m - 1, d + n)));
}

/** `ymd` plus `n` months, clamped to the last day of the target month (Jan 31 + 1 = Feb 28). */
export function addMonths(ymd: string, n: number): string {
  const [y, m, d] = parts(ymd);
  const first = new Date(Date.UTC(y, m - 1 + n, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return fromUtc(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(d, lastDay))));
}

/** Every day from `start` up to, not including, `endExclusive`. */
export function eachDay(start: string, endExclusive: string): string[] {
  const out: string[] = [];
  for (let d = start; d < endExclusive; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Day of the week, 0 = Sunday, from the Y-M-D parts alone. */
export function weekdayOf(ymd: string): number {
  const [y, m, d] = parts(ymd);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Splits [start, endExclusive) into ranges of about a month for parallel fetches.
 * Each range's `end` is the next range's `start`, so no day falls between them.
 * Cal.com reads `end` inclusively (through the end of that day in UTC), so a boundary day
 * can come back in two chunks; mergeSlotData() dedupes it.
 */
export function monthChunks(start: string, endExclusive: string): DateRange[] {
  const chunks: DateRange[] = [];
  let from = start;
  for (let i = 1; from < endExclusive; i++) {
    const next = addMonths(start, i);
    const to = next < endExclusive ? next : endExclusive;
    chunks.push({ start: from, end: to });
    from = to;
  }
  // A tail shorter than a week is not worth its own request; fold it into the previous chunk.
  const last = chunks.at(-1);
  const prev = chunks.at(-2);
  if (last && prev && addDays(last.start, 7) > last.end) {
    prev.end = last.end;
    chunks.pop();
  }
  return chunks;
}

/* ---------- Cal.com data ---------- */

/**
 * Keeps only the dates inside [range.start, range.end). Cal.com reads `start` and `end` as
 * instants at 00:00 UTC, so a chunk comes back with a stray key for the day before its start
 * (one artificial slot at 16:00 Pacific, which is 00:00 UTC) and a last day cut short at UTC
 * midnight. Clipping each chunk to its own range before merging drops both; the full boundary
 * day comes from the chunk that starts on it.
 */
export function clipSlotData(data: SlotData, range: DateRange): SlotData {
  const out: SlotData = {};
  for (const [date, slots] of Object.entries(data)) {
    if (date >= range.start && date < range.end) out[date] = slots;
  }
  return out;
}

/** Unions several slots payloads, deduping slots by their `start` within each date. */
export function mergeSlotData(parts: SlotData[]): SlotData {
  const seen: Record<string, Set<string>> = {};
  const merged: SlotData = {};
  for (const part of parts) {
    for (const [date, slots] of Object.entries(part)) {
      seen[date] ??= new Set();
      merged[date] ??= [];
      for (const slot of slots ?? []) {
        if (seen[date].has(slot.start)) continue;
        seen[date].add(slot.start);
        merged[date].push(slot);
      }
    }
  }
  return merged;
}

/** Open slots per date from a Cal.com slots `data` object. */
export function countSlots(data: SlotData): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [date, slots] of Object.entries(data)) counts[date] = Array.isArray(slots) ? slots.length : 0;
  return counts;
}

/* ---------- status ---------- */

/**
 * One status per day from `start` through `end` (inclusive), following BRIEF.md 7a:
 *   past    before today
 *   closed  the weekday never has slots in the horizon and fullDaySlots gives it none
 *   soon    fewer than minNoticeDays days from today (today is 0 days away)
 *   notyet  after the last date that has any slot
 *   booked  zero slots
 *   partial more than zero, fewer than a full day
 *   open    a full day
 * A full day is fullDaySlots[weekday] when given, else the most slots seen for that weekday
 * anywhere in the horizon.
 */
export function summarize(input: SummarizeInput): Record<string, DaySummary> {
  const { counts, start, end, today, minNoticeDays, fullDaySlots } = input;
  const days = eachDay(start, addDays(end, 1));

  const maxSeen: number[] = [0, 0, 0, 0, 0, 0, 0];
  let lastWithSlots = '';
  for (const date of days) {
    const n = counts[date] ?? 0;
    if (n <= 0) continue;
    const w = weekdayOf(date);
    if (n > maxSeen[w]) maxSeen[w] = n;
    if (date > lastWithSlots) lastWithSlots = date;
  }

  const fullFor = (weekday: number): number => fullDaySlots?.[weekday] ?? maxSeen[weekday];
  const soonUntil = addDays(today, minNoticeDays); // exclusive

  const out: Record<string, DaySummary> = {};
  for (const date of days) {
    const open = Math.max(0, counts[date] ?? 0);
    const of = fullFor(weekdayOf(date));
    let status: DayStatus;
    if (date < today) status = 'past';
    else if (of === 0) status = 'closed';
    else if (date < soonUntil) status = 'soon';
    else if (date > lastWithSlots) status = 'notyet';
    else if (open === 0) status = 'booked';
    else if (open < of) status = 'partial';
    else status = 'open';
    out[date] = { status, open, of };
  }
  return out;
}

/** Runs summarize() and wraps the result in the response envelope. */
export function buildResponse(input: BuildResponseInput): AvailabilityResponse {
  const { timeZone, generatedAt, ...rest } = input;
  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    timeZone,
    start: input.start,
    end: input.end,
    days: summarize(rest),
  };
}

/* ---------- fixture ---------- */

/**
 * A deterministic stand-in for Cal.com, for building the calendar offline (`?fixture=1`).
 * Weekends have three blocks and cycle open, partial, booked; weekdays have four slots and
 * are mostly open with the odd partial or booked day. Every weekday has slots, so nothing is
 * closed. The last 30 days of the horizon have no slots (notyet). With minNoticeDays 2 the
 * first two days are soon.
 */
export function buildFixture(today: string, horizonMonths: number, minNoticeDays = 2): AvailabilityResponse {
  const end = addMonths(today, horizonMonths);
  const days = eachDay(today, addDays(end, 1));
  const firstEmpty = addDays(end, -29); // the last 30 days, end inclusive

  const counts: Record<string, number> = {};
  days.forEach((date, i) => {
    if (date >= firstEmpty) return;
    const w = weekdayOf(date);
    if (w === 0 || w === 6) {
      counts[date] = [3, 2, 0, 3][i % 4]!;
    } else if (i % 17 === 0) {
      counts[date] = 0;
    } else if (i % 11 === 0) {
      counts[date] = i % 2 === 0 ? 2 : 3;
    } else {
      counts[date] = 4;
    }
  });

  const [y, m, d] = parts(today);
  return buildResponse({
    counts,
    start: today,
    end,
    today,
    minNoticeDays,
    fullDaySlots: null,
    timeZone: 'America/Los_Angeles',
    generatedAt: new Date(Date.UTC(y, m - 1, d)).toISOString(),
  });
}
