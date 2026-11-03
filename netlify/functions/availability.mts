// GET /api/availability
//
// Summarizes Cal.com's open slots for the next BOOKING.horizonMonths into one status per day
// for the booking calendar. Nothing about who booked: Cal.com only returns open times.
// All the logic lives in src/lib/availability.ts; this file fetches, merges and answers.
// `?fixture=1` returns a deterministic fixture on deploy previews, branch deploys and local dev only.

import type { Config, Context } from '@netlify/functions';
import { BOOKING } from '../../src/config/site.ts';
import {
  addDays,
  addMonths,
  buildFixture,
  buildResponse,
  clipSlotData,
  countSlots,
  mergeSlotData,
  monthChunks,
  todayInZone,
  type SlotData,
} from '../../src/lib/availability.ts';
import { allowsFixture, eventSlugFor } from '../../src/lib/day-times.ts';

const CAL_SLOTS_URL = 'https://api.cal.com/v2/slots';
const CAL_API_VERSION = '2024-09-04';

const OK_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=60',
  'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=300, stale-while-revalidate=3600',
};
const NO_STORE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * The deploy context ("production", "deploy-preview", "branch-deploy", "dev"), or undefined.
 * Netlify passes it on every request as context.deploy.context; functions do not get the build's
 * CONTEXT variable at runtime, which is why the old check let ?fixture=1 through on the live site
 * (found 2026-11-03). Same gate as /api/availability/times: allowsFixture() fails closed.
 */
function deployContext(context: Partial<Context> | undefined): string | undefined {
  const fromRequest = context?.deploy?.context;
  if (fromRequest) return fromRequest;
  const fromEnv = typeof Netlify !== 'undefined' ? Netlify.env.get('CONTEXT') : process.env.CONTEXT;
  return fromEnv || undefined;
}

async function fetchSlots(range: { start: string; end: string }): Promise<SlotData> {
  const url = new URL(CAL_SLOTS_URL);
  // The grid counts open start times for BOOKING.slotDuration (the two-hour minimum since
  // 2026-11-03), on the event that books that length when BOOKING.eventSlugByLength maps one.
  const slug = BOOKING.slotDuration ? eventSlugFor(BOOKING.slotDuration) : BOOKING.calEventSlug;
  url.searchParams.set('username', BOOKING.calUsername);
  url.searchParams.set('eventTypeSlug', slug);
  url.searchParams.set('start', range.start);
  url.searchParams.set('end', range.end);
  url.searchParams.set('timeZone', BOOKING.timeZone);
  if (BOOKING.slotDuration) url.searchParams.set('duration', String(BOOKING.slotDuration));

  const headers: Record<string, string> = { 'cal-api-version': CAL_API_VERSION };
  const key = process.env.CAL_API_KEY;
  if (key) headers.Authorization = `Bearer ${key}`; // never logged or echoed

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Cal.com answered ${res.status} for ${range.start} to ${range.end}`);
  const body = (await res.json()) as { status?: string; data?: SlotData };
  if (body.status !== 'success' || !body.data) throw new Error('Cal.com answered without slot data');
  return clipSlotData(body.data, range);
}

export default async (req: Request, context: Context): Promise<Response> => {
  const today = todayInZone(BOOKING.timeZone);
  const start = today;
  const end = addMonths(today, BOOKING.horizonMonths); // inclusive

  if (new URL(req.url).searchParams.get('fixture') === '1' && allowsFixture(deployContext(context), process.env)) {
    return json(buildFixture(today, BOOKING.horizonMonths, BOOKING.minNoticeDays), 200, NO_STORE_HEADERS);
  }

  try {
    const chunks = await Promise.all(monthChunks(start, addDays(end, 1)).map(fetchSlots));
    const response = buildResponse({
      counts: countSlots(mergeSlotData(chunks)),
      start,
      end,
      today,
      minNoticeDays: BOOKING.minNoticeDays,
      fullDaySlots: BOOKING.fullDaySlots,
      timeZone: BOOKING.timeZone,
    });
    return json(response, 200, OK_HEADERS);
  } catch (err) {
    const detail = err instanceof Error ? err.message.slice(0, 200) : 'unknown error';
    return json({ error: 'availability_unavailable', detail }, 502, NO_STORE_HEADERS);
  }
};

export const config: Config = { path: '/api/availability' };
