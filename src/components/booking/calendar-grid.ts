/**
 * Pure calendar helpers for the availability island. No React and no local time zone:
 * every date is a 'YYYY-MM-DD' string, every month a 'YYYY-MM' string, and every
 * calculation runs through Date.UTC, so the grid and its labels always agree with the keys
 * that /api/availability returns (see src/lib/availability.ts). The Vitest test beside this
 * file covers monthGrid and imports nothing else.
 */

/** A month as 'YYYY-MM'. */
export type Ym = string;
/** A date as 'YYYY-MM-DD'. */
export type Ymd = string;

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function isYmd(value: unknown): value is Ymd {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function ymd(year: number, month: number, day: number): Ymd {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function ym(year: number, month: number): Ym {
  return `${year}-${pad2(month)}`;
}

/** Year, month (1 to 12) and day (1 when the value is only a month). */
function parts(value: Ym | Ymd): [number, number, number] {
  const [y, m, d] = value.split('-').map(Number);
  return [y, m, d || 1];
}

/** Midnight UTC on that date, for getUTCDay() and for Intl formatting in the UTC zone. */
export function utcDate(value: Ym | Ymd): Date {
  const [y, m, d] = parts(value);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(date: Date): Ymd {
  return ymd(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function daysInMonth(year: number, month: number): number {
  // Day 0 of the following month is the last day of this one.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function ymOf(date: Ymd): Ym {
  return date.slice(0, 7);
}

export function dayOfMonth(date: Ymd): number {
  return Number(date.slice(8, 10));
}

/** 0 is Sunday, 6 is Saturday. */
export function dayOfWeek(date: Ymd): number {
  return utcDate(date).getUTCDay();
}

export function firstOfMonth(month: Ym): Ymd {
  return `${month}-01`;
}

export function lastOfMonth(month: Ym): Ymd {
  const [y, m] = parts(month);
  return ymd(y, m, daysInMonth(y, m));
}

export function addMonths(month: Ym, count: number): Ym {
  const [y, m] = parts(month);
  const shifted = new Date(Date.UTC(y, m - 1 + count, 1));
  return ym(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1);
}

export function shiftDays(date: Ymd, count: number): Ymd {
  const [y, m, d] = parts(date);
  return fromUtc(new Date(Date.UTC(y, m - 1, d + count)));
}

/** Zero-padded ISO strings of one shape sort as text, so a plain comparison orders them. */
export function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function clamp(value: string, low: string, high: string): string {
  if (compare(value, low) < 0) return low;
  if (compare(value, high) > 0) return high;
  return value;
}

/**
 * The weeks of a month, Sunday first. Each week has seven cells: a 'YYYY-MM-DD' string, or
 * null padding before the first day and after the last, so every row is full.
 */
export function monthGrid(month: Ym): (Ymd | null)[][] {
  const [y, m] = parts(month);
  const lead = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const total = daysInMonth(y, m);
  const cells: (Ymd | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(ymd(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Ymd | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const WEEKDAYS: ReadonlyArray<{ short: string; long: string }> = [
  { short: 'Sun', long: 'Sunday' },
  { short: 'Mon', long: 'Monday' },
  { short: 'Tue', long: 'Tuesday' },
  { short: 'Wed', long: 'Wednesday' },
  { short: 'Thu', long: 'Thursday' },
  { short: 'Fri', long: 'Friday' },
  { short: 'Sat', long: 'Saturday' },
];

// Each formatter reads a UTC midnight instant in the UTC zone, so the words always name the
// same day as the key, whatever the visitor's own time zone.
const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' });
const LONG_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const BOOK_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

/** "November 2026" */
export function formatMonth(month: Ym): string {
  return MONTH_FORMAT.format(utcDate(month));
}

/** "Saturday, November 14, 2026" */
export function formatLongDate(date: Ymd): string {
  return LONG_DATE_FORMAT.format(utcDate(date));
}

/** "Saturday, November 14" */
export function formatBookDate(date: Ymd): string {
  return BOOK_DATE_FORMAT.format(utcDate(date));
}
