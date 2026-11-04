// GET /api/availability/times?date=YYYY-MM-DD&minutes=N
//
// The open start times on one day for one event length, for the day panel on /booking/. Visitors
// see them before they agree to the terms; the booker then opens on the time they chose. Nothing
// about who booked: Cal.com only returns open times. Selection and labels live in
// src/lib/day-times.ts; this file checks the query, fetches and answers.
//
//   200 { date, minutes, timeZone, times: [{ start, end, label }], unavailable: [{ start, end, label }] }.
//       `times` are the open starts for `minutes`, earliest first, only on `date` in BOOKING.timeZone;
//       empty means no time of that length is left. `unavailable` are the parts of the park's day
//       where no event of the shortest length fits (owner's request, 2026-11-04), from a second
//       query for that length; empty means the whole day is free.
//   400 { error: 'bad_request' } for a date that is not a real YYYY-MM-DD, or a length that is
//       not in BOOKING.lengths. Cal.com answers any length it is sent, so this is the only check.
//   502 { error: 'availability_unavailable' } when Cal.com fails or takes longer than 8 seconds.
//
// `?fixture=1` returns buildTimesFixture() on deploy previews, branch deploys and local dev, never
// on production; allowsFixture() in src/lib/day-times.ts decides, from context.deploy.context.
// docs/INTEGRATION-NOTES.md has the live checks behind the Cal.com query below.

import type { Config, Context } from '@netlify/functions';
import { BOOKING } from '../../src/config/site.ts';
import { addDays } from '../../src/lib/availability.ts';
import {
  allowsFixture,
  buildTimesFixture,
  eventSlugFor,
  isAllowedLength,
  isCalendarDate,
  selectDayTimes,
  unavailableWindows,
  type DayTime,
  type DayWindow,
  type DayTimesResponse,
  type RangeSlotData,
} from '../../src/lib/day-times.ts';

const CAL_SLOTS_URL = 'https://api.cal.com/v2/slots';
const CAL_API_VERSION = '2024-09-04';
const CAL_TIMEOUT_MS = 8_000;

// A day's times change as people book, so the CDN keeps them for less time than the month grid.
// Netlify keys a function's cached responses on the whole query string, so each date and length
// is cached on its own.
const OK_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=120, stale-while-revalidate=600',
};
const NO_STORE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * The deploy context ("production", "deploy-preview", "branch-deploy", "dev"), or undefined.
 * Netlify passes it on every request as context.deploy.context. The build's CONTEXT variable is
 * not given to functions at runtime (Netlify's docs list only URL, SITE_NAME and SITE_ID), so it
 * is only a second guess here, for runners that set it.
 */
function deployContext(context: Partial<Context> | undefined): string | undefined {
  const fromRequest = context?.deploy?.context;
  if (fromRequest) return fromRequest;
  const fromEnv = typeof Netlify !== 'undefined' ? Netlify.env.get('CONTEXT') : process.env.CONTEXT;
  return fromEnv || undefined;
}

/** `minutes` from the query: up to four digits, or NaN. */
function parseMinutes(raw: string | null): number {
  return raw !== null && /^\d{1,4}$/.test(raw) ? Number(raw) : Number.NaN;
}

/**
 * Cal.com's open slots around `date` for one length, as start and end pairs. Cal.com reads
 * `start` and `end` as whole UTC days, so end=date would stop at 4 PM Pacific (5 PM in summer)
 * and lose the evening. The next day as `end` covers all of `date`; selectDayTimes() then keeps
 * `date` alone and drops the stray evening before and the morning after.
 */
async function fetchDay(date: string, minutes: number): Promise<RangeSlotData> {
  const url = new URL(CAL_SLOTS_URL);
  url.searchParams.set('username', BOOKING.calUsername);
  url.searchParams.set('eventTypeSlug', eventSlugFor(minutes));
  url.searchParams.set('start', date);
  url.searchParams.set('end', addDays(date, 1));
  url.searchParams.set('timeZone', BOOKING.timeZone);
  url.searchParams.set('duration', String(minutes));
  url.searchParams.set('format', 'range');

  const headers: Record<string, string> = { 'cal-api-version': CAL_API_VERSION };
  const key = process.env.CAL_API_KEY;
  if (key) headers.Authorization = `Bearer ${key}`; // never logged or echoed

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(CAL_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Cal.com answered ${res.status} for ${date}`);
  const body = (await res.json()) as { status?: string; data?: RangeSlotData };
  if (body.status !== 'success' || !body.data) throw new Error('Cal.com answered without slot data');
  return body.data;
}

function answer(date: string, minutes: number, times: DayTime[], unavailable: DayWindow[]): DayTimesResponse {
  return { date, minutes, timeZone: BOOKING.timeZone, times, unavailable };
}

/** The shortest length on offer: the windows are where not even this fits. */
const PROBE_MINUTES = Math.min(...BOOKING.lengths);

function windowsFrom(probeTimes: DayTime[], date: string): DayWindow[] {
  return unavailableWindows(probeTimes.map((t) => t.start), date, BOOKING.timeZone, PROBE_MINUTES);
}

export default async (req: Request, context: Context): Promise<Response> => {
  const params = new URL(req.url).searchParams;
  const date = params.get('date') ?? '';
  const minutes = parseMinutes(params.get('minutes'));
  if (!isCalendarDate(date) || !isAllowedLength(minutes)) {
    return json({ error: 'bad_request' }, 400, NO_STORE_HEADERS);
  }

  // Fails closed: on production, or wherever the context is unknown outside a local dev server,
  // ?fixture=1 is ignored and the live times answer.
  if (params.get('fixture') === '1' && allowsFixture(deployContext(context), process.env)) {
    const times = buildTimesFixture(date, minutes, BOOKING.timeZone);
    const unavailable = windowsFrom(buildTimesFixture(date, PROBE_MINUTES, BOOKING.timeZone), date);
    return json(answer(date, minutes, times, unavailable), 200, NO_STORE_HEADERS);
  }

  try {
    // The chosen length and the shortest one, side by side; one query when they are the same.
    const [data, probeData] = await Promise.all([
      fetchDay(date, minutes),
      minutes === PROBE_MINUTES ? null : fetchDay(date, PROBE_MINUTES),
    ]);
    const times = selectDayTimes(data, date, BOOKING.timeZone, minutes);
    const probeTimes = probeData ? selectDayTimes(probeData, date, BOOKING.timeZone, PROBE_MINUTES) : times;
    return json(answer(date, minutes, times, windowsFrom(probeTimes, date)), 200, OK_HEADERS);
  } catch (err) {
    const detail = err instanceof Error ? err.message.slice(0, 200) : 'unknown error';
    return json({ error: 'availability_unavailable', detail }, 502, NO_STORE_HEADERS);
  }
};

export const config: Config = { path: '/api/availability/times' };
