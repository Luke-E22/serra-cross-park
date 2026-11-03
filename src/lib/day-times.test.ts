import { describe, expect, it } from 'vitest';
import { BOOKING } from '../config/site.ts';
import {
  allowsFixture,
  buildTimesFixture,
  eventSlugFor,
  isFreshTimes,
  startsOn,
  TIMES_MAX_AGE_MS,
  feeFor,
  formatTimeLabel,
  isAllowedLength,
  isCalendarDate,
  lengthLabel,
  rangeLabel,
  selectDayTimes,
  toUtcSlot,
  toZonedIso,
  type RangeSlotData,
} from './day-times.ts';

const LA = 'America/Los_Angeles';
// 2026-11-07 is a Saturday and 2026-11-04 a Wednesday. Daylight saving time ends in Los Angeles
// at 2 AM on Sunday, 2026-11-01: -07:00 before, -08:00 after. 2026-10-31 is the Saturday before.
// It starts again at 2 AM on Sunday, 2027-03-14, when the clocks jump to 3 AM: -08:00 before,
// -07:00 after. 2027-03-13 is the Saturday before.

describe('time labels', () => {
  it('reads whole hours without minutes and other times with them, AM and PM in capitals', () => {
    expect(formatTimeLabel('2026-11-07T08:00:00.000-08:00', LA)).toBe('8 AM');
    expect(formatTimeLabel('2026-11-07T12:00:00.000-08:00', LA)).toBe('12 PM');
    expect(formatTimeLabel('2026-11-07T13:30:00.000-08:00', LA)).toBe('1:30 PM');
    expect(formatTimeLabel('2026-11-07T20:00:00.000-08:00', LA)).toBe('8 PM');
    expect(formatTimeLabel('2026-11-07T00:00:00.000-08:00', LA)).toBe('12 AM');
  });

  it('reads the clock in the booking zone, whatever offset the time is written with', () => {
    expect(formatTimeLabel('2026-11-07T17:00:00.000Z', LA)).toBe('9 AM');
    expect(formatTimeLabel('2026-11-07T12:00:00.000-05:00', LA)).toBe('9 AM');
    expect(formatTimeLabel('2027-06-12T16:00:00.000Z', LA)).toBe('9 AM'); // summer, -07:00
  });

  it('labels a range with "to"', () => {
    expect(rangeLabel('2026-11-07T09:00:00.000-08:00', '2026-11-07T12:00:00.000-08:00', LA)).toBe('9 AM to 12 PM');
    expect(rangeLabel('2026-11-07T12:30:00.000-08:00', '2026-11-07T14:30:00.000-08:00', LA)).toBe('12:30 PM to 2:30 PM');
  });

  it('refuses a time it cannot read', () => {
    expect(() => formatTimeLabel('soon', LA)).toThrow(RangeError);
    expect(() => toUtcSlot('2026-13-45T99:00')).toThrow(RangeError);
  });
});

describe('toUtcSlot', () => {
  it('writes the slot of the booker link checked on 2026-11-03', () => {
    // https://cal.com/serra-cross-park/reserve?month=2026-11&date=2026-11-07&duration=180&slot=2026-11-07T17:00:00.000Z
    expect(toUtcSlot('2026-11-07T09:00:00.000-08:00')).toBe('2026-11-07T17:00:00.000Z');
  });

  it('follows the offset across the November change', () => {
    expect(toUtcSlot('2026-10-31T09:00:00.000-07:00')).toBe('2026-10-31T16:00:00.000Z');
    expect(toUtcSlot('2026-11-01T09:00:00.000-08:00')).toBe('2026-11-01T17:00:00.000Z');
  });

  it('follows the offset across the March change', () => {
    expect(toUtcSlot('2027-03-13T08:00:00.000-08:00')).toBe('2027-03-13T16:00:00.000Z');
    expect(toUtcSlot('2027-03-14T08:00:00.000-07:00')).toBe('2027-03-14T15:00:00.000Z');
    expect(toUtcSlot('2027-03-14T18:00:00.000-07:00')).toBe('2027-03-15T01:00:00.000Z');
  });

  it('works in summer and leaves a UTC time as it is', () => {
    expect(toUtcSlot('2027-06-12T09:00:00.000-07:00')).toBe('2027-06-12T16:00:00.000Z');
    expect(toUtcSlot('2026-11-07T17:00:00.000Z')).toBe('2026-11-07T17:00:00.000Z');
  });
});

describe('toZonedIso', () => {
  it('writes an instant the way Cal.com does, winter and summer', () => {
    expect(toZonedIso(Date.parse('2026-11-07T17:00:00.000Z'), LA)).toBe('2026-11-07T09:00:00.000-08:00');
    expect(toZonedIso(Date.parse('2027-06-12T16:00:00.000Z'), LA)).toBe('2027-06-12T09:00:00.000-07:00');
  });

  it('gives each 1:30 AM on 2026-11-01 its own offset', () => {
    expect(toZonedIso(Date.parse('2026-11-01T08:30:00.000Z'), LA)).toBe('2026-11-01T01:30:00.000-07:00');
    expect(toZonedIso(Date.parse('2026-11-01T09:30:00.000Z'), LA)).toBe('2026-11-01T01:30:00.000-08:00');
  });

  it('writes midnight as 00, keeps milliseconds and handles UTC', () => {
    expect(toZonedIso(Date.parse('2026-11-07T08:00:00.250Z'), LA)).toBe('2026-11-07T00:00:00.250-08:00');
    expect(toZonedIso(Date.parse('2026-11-07T08:00:00.000Z'), 'UTC')).toBe('2026-11-07T08:00:00.000+00:00');
  });
});

describe('lengths and fees', () => {
  it('prices the shortest and longest lengths at the hourly rate', () => {
    expect(feeFor(120, 300)).toBe(600);
    expect(feeFor(480, 300)).toBe(2400);
    expect(feeFor(180)).toBe((BOOKING.ratePerHour * 180) / 60);
    expect(feeFor(90, 300)).toBe(450);
  });

  it('names lengths in hours', () => {
    expect(lengthLabel(120)).toBe('2 hours');
    expect(lengthLabel(480)).toBe('8 hours');
    expect(lengthLabel(60)).toBe('1 hour');
    expect(lengthLabel(90)).toBe('90 minutes');
  });

  it('accepts only the lengths on offer', () => {
    for (const minutes of BOOKING.lengths) expect(isAllowedLength(minutes)).toBe(true);
    expect(isAllowedLength(90)).toBe(false);
    expect(isAllowedLength(600)).toBe(false);
    expect(isAllowedLength(120.5)).toBe(false);
    expect(isAllowedLength(Number.NaN)).toBe(false);
    expect(isAllowedLength(90, [90, 120])).toBe(true);
  });

  it('keeps the config in step: lengths shortest first, and the month grid counts the shortest', () => {
    expect([...BOOKING.lengths].sort((a, b) => a - b)).toEqual(BOOKING.lengths);
    expect(BOOKING.slotDuration).toBe(BOOKING.lengths[0]);
  });
});

describe('eventSlugFor', () => {
  const byLength = { 120: 'reserve-2-hours', 180: 'reserve-3-hours' };

  it('books every length on calEventSlug while no map is set', () => {
    expect(eventSlugFor(120, null, 'reserve')).toBe('reserve');
    expect(eventSlugFor(480, null, 'reserve')).toBe('reserve');
  });

  it('uses the map for a mapped length and calEventSlug for the rest', () => {
    expect(eventSlugFor(120, byLength, 'reserve')).toBe('reserve-2-hours');
    expect(eventSlugFor(180, byLength, 'reserve')).toBe('reserve-3-hours');
    expect(eventSlugFor(240, byLength, 'reserve')).toBe('reserve');
  });

  it('reads BOOKING when nothing is passed', () => {
    for (const minutes of BOOKING.lengths) {
      expect(eventSlugFor(minutes)).toBe(BOOKING.eventSlugByLength?.[minutes] || BOOKING.calEventSlug);
    }
  });
});

describe('isCalendarDate', () => {
  it('accepts real YYYY-MM-DD dates only', () => {
    expect(isCalendarDate('2026-11-07')).toBe(true);
    expect(isCalendarDate('2028-02-29')).toBe(true);
    expect(isCalendarDate('2026-02-29')).toBe(false);
    expect(isCalendarDate('2026-13-01')).toBe(false);
    expect(isCalendarDate('2026-11-7')).toBe(false);
    expect(isCalendarDate('2026-11-07T00:00')).toBe(false);
    expect(isCalendarDate('')).toBe(false);
  });
});

describe('selectDayTimes', () => {
  // Shapes seen live on 2026-11-03 for start=2026-11-07: Cal.com reads start and end as UTC days,
  // so the evening of 2026-11-06 comes back as a stray key, and end=2026-11-08 adds that morning.

  it('keeps one day of a range payload, drops the stray day before and the day after, keeps Cal.com ends', () => {
    const data: RangeSlotData = {
      '2026-11-06': [
        { start: '2026-11-06T16:00:00.000-08:00', end: '2026-11-06T19:00:00.000-08:00' },
        { start: '2026-11-06T17:00:00.000-08:00', end: '2026-11-06T20:00:00.000-08:00' },
      ],
      '2026-11-07': [
        { start: '2026-11-07T12:00:00.000-08:00', end: '2026-11-07T15:00:00.000-08:00' },
        { start: '2026-11-07T13:00:00.000-08:00', end: '2026-11-07T16:00:00.000-08:00' },
        { start: '2026-11-07T14:00:00.000-08:00', end: '2026-11-07T17:00:00.000-08:00' },
        { start: '2026-11-07T15:00:00.000-08:00', end: '2026-11-07T18:00:00.000-08:00' },
        { start: '2026-11-07T16:00:00.000-08:00', end: '2026-11-07T19:00:00.000-08:00' },
        { start: '2026-11-07T17:00:00.000-08:00', end: '2026-11-07T20:00:00.000-08:00' },
      ],
      '2026-11-08': [
        { start: '2026-11-08T08:00:00.000-08:00', end: '2026-11-08T11:00:00.000-08:00' },
        { start: '2026-11-08T09:00:00.000-08:00', end: '2026-11-08T12:00:00.000-08:00' },
      ],
    };
    const times = selectDayTimes(data, '2026-11-07', LA, 180);
    expect(times.map((t) => t.label)).toEqual(['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']);
    expect(times[0]).toEqual({
      start: '2026-11-07T12:00:00.000-08:00',
      end: '2026-11-07T15:00:00.000-08:00',
      label: '12 PM',
    });
    expect(times.at(-1)?.end).toBe('2026-11-07T20:00:00.000-08:00');
  });

  it('computes each end from the length when Cal.com sends the start alone', () => {
    const data: RangeSlotData = {
      '2026-11-06': [{ start: '2026-11-06T16:00:00.000-08:00' }, { start: '2026-11-06T17:00:00.000-08:00' }],
      '2026-11-07': [{ start: '2026-11-07T12:00:00.000-08:00' }, { start: '2026-11-07T13:00:00.000-08:00' }],
    };
    expect(selectDayTimes(data, '2026-11-07', LA, 180)).toEqual([
      { start: '2026-11-07T12:00:00.000-08:00', end: '2026-11-07T15:00:00.000-08:00', label: '12 PM' },
      { start: '2026-11-07T13:00:00.000-08:00', end: '2026-11-07T16:00:00.000-08:00', label: '1 PM' },
    ]);
  });

  it('writes a computed end with the offset in force at the end', () => {
    // 12:30 AM PDT plus two hours is 1:30 AM PST: the clocks went back at 2 AM.
    const data: RangeSlotData = { '2026-11-01': [{ start: '2026-11-01T00:30:00.000-07:00' }] };
    expect(selectDayTimes(data, '2026-11-01', LA, 120)).toEqual([
      { start: '2026-11-01T00:30:00.000-07:00', end: '2026-11-01T01:30:00.000-08:00', label: '12:30 AM' },
    ]);
  });

  it('sorts, drops repeats of an instant and skips what it cannot read', () => {
    const data = {
      '2026-11-07': [
        { start: '2026-11-07T15:00:00.000-08:00', end: '2026-11-07T14:00:00.000-08:00' },
        { start: '2026-11-07T09:00:00.000-08:00' },
        { start: '2026-11-07T17:00:00.000Z' }, // 9 AM again, written in UTC
        { start: 'soon' },
        { start: 42 },
        null,
      ],
      '2026-11-09': 'not a list',
    } as unknown as RangeSlotData;
    const times = selectDayTimes(data, '2026-11-07', LA, 120);
    expect(times.map((t) => t.start)).toEqual(['2026-11-07T09:00:00.000-08:00', '2026-11-07T15:00:00.000-08:00']);
    // An end that is not after its start is replaced by start plus the length.
    expect(times[1]?.end).toBe('2026-11-07T17:00:00.000-08:00');
  });

  it('keeps 2027-03-14 alone across the March change, and a computed end skips the lost hour', () => {
    const data: RangeSlotData = {
      '2027-03-13': [{ start: '2027-03-13T18:00:00.000-08:00' }],
      '2027-03-14': [
        { start: '2027-03-14T01:00:00.000-08:00' },
        { start: '2027-03-14T08:00:00.000-07:00' },
        { start: '2027-03-14T18:00:00.000-07:00' },
      ],
      '2027-03-15': [{ start: '2027-03-15T08:00:00.000-07:00' }],
    };
    expect(selectDayTimes(data, '2027-03-14', LA, 120)).toEqual([
      // 1 AM PST plus two hours is 4 AM PDT: 2 AM to 3 AM never happens that night.
      { start: '2027-03-14T01:00:00.000-08:00', end: '2027-03-14T04:00:00.000-07:00', label: '1 AM' },
      { start: '2027-03-14T08:00:00.000-07:00', end: '2027-03-14T10:00:00.000-07:00', label: '8 AM' },
      { start: '2027-03-14T18:00:00.000-07:00', end: '2027-03-14T20:00:00.000-07:00', label: '6 PM' },
    ]);
  });

  it('finds a time filed under another key and returns nothing for an empty day', () => {
    const misfiled: RangeSlotData = { '2026-11-08': [{ start: '2026-11-07T10:00:00.000-08:00' }] };
    expect(selectDayTimes(misfiled, '2026-11-07', LA, 120).map((t) => t.label)).toEqual(['10 AM']);
    expect(selectDayTimes({}, '2026-11-07', LA, 120)).toEqual([]);
    expect(selectDayTimes({ '2026-11-07': [] }, '2026-11-07', LA, 120)).toEqual([]);
  });
});

describe('buildTimesFixture', () => {
  it('gives a weekday hourly starts from 8 AM, the last one ending at 8 PM', () => {
    const times = buildTimesFixture('2026-11-04', 120);
    expect(times.map((t) => t.label)).toEqual([
      '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
    ]);
    expect(times[0]).toEqual({
      start: '2026-11-04T08:00:00.000-08:00',
      end: '2026-11-04T10:00:00.000-08:00',
      label: '8 AM',
    });
    expect(times.at(-1)?.end).toBe('2026-11-04T20:00:00.000-08:00');
  });

  it('holds a booking from 11 AM to 1 PM on weekend days, so they come back partly booked', () => {
    expect(buildTimesFixture('2026-11-07', 120).map((t) => t.label)).toEqual([
      '8 AM', '9 AM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
    ]);
  });

  it('shrinks as the length grows, down to no times for 8 hours on a weekend day', () => {
    const lengths = [120, 180, 240, 300, 360, 420, 480];
    expect(lengths.map((m) => buildTimesFixture('2026-11-04', m).length)).toEqual([11, 10, 9, 8, 7, 6, 5]);
    expect(lengths.map((m) => buildTimesFixture('2026-11-07', m).length)).toEqual([8, 6, 4, 3, 2, 1, 0]);
  });

  it('follows the offset across the November change and is deterministic', () => {
    const before = buildTimesFixture('2026-10-31', 120)[0];
    const after = buildTimesFixture('2026-11-01', 120)[0];
    expect(before?.start).toBe('2026-10-31T08:00:00.000-07:00');
    expect(after?.start).toBe('2026-11-01T08:00:00.000-08:00');
    expect(toUtcSlot(before?.start ?? '')).toBe('2026-10-31T15:00:00.000Z');
    expect(toUtcSlot(after?.start ?? '')).toBe('2026-11-01T16:00:00.000Z');
    expect(buildTimesFixture('2026-11-04', 300)).toEqual(buildTimesFixture('2026-11-04', 300));
  });

  it('follows the offset across the March change', () => {
    const before = buildTimesFixture('2027-03-13', 120);
    const after = buildTimesFixture('2027-03-14', 120);
    expect(before[0]?.start).toBe('2027-03-13T08:00:00.000-08:00');
    expect(after[0]?.start).toBe('2027-03-14T08:00:00.000-07:00');
    expect(toUtcSlot(after[0]?.start ?? '')).toBe('2027-03-14T15:00:00.000Z');
    // A Sunday: the 11 AM to 1 PM booking still leaves 8 AM, 9 AM and 1 PM to 6 PM, last ending at 8 PM.
    expect(after.map((t) => t.label)).toEqual(['8 AM', '9 AM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']);
    expect(after.at(-1)?.end).toBe('2027-03-14T20:00:00.000-07:00');
  });

  it('never lists a time off the requested day', () => {
    for (const date of ['2026-11-01', '2026-11-07', '2027-03-14', '2027-06-12']) {
      for (const minutes of BOOKING.lengths) {
        expect(buildTimesFixture(date, minutes).every((t) => startsOn(t.start, date, LA))).toBe(true);
      }
    }
  });
});

describe('startsOn', () => {
  it('reads the day on a clock in the zone, whatever offset the time is written with', () => {
    expect(startsOn('2026-11-07T09:00:00.000-08:00', '2026-11-07', LA)).toBe(true);
    // 7 PM on November 6 in Los Angeles, written in UTC on the 7th.
    expect(startsOn('2026-11-07T03:00:00.000Z', '2026-11-07', LA)).toBe(false);
    expect(startsOn('2026-11-07T03:00:00.000Z', '2026-11-06', LA)).toBe(true);
    // 7 PM on March 14 in Los Angeles, just after the change, written in UTC on the 15th.
    expect(startsOn('2027-03-15T02:00:00.000Z', '2027-03-14', LA)).toBe(true);
    expect(startsOn('2026-11-01T00:30:00.000-07:00', '2026-11-01', LA)).toBe(true);
    expect(startsOn('soon', '2026-11-07', LA)).toBe(false);
  });
});

describe('isFreshTimes', () => {
  it('trusts times for two minutes after they were fetched, then asks again', () => {
    const fetched = Date.parse('2026-11-03T20:00:00.000Z');
    expect(TIMES_MAX_AGE_MS).toBe(120_000);
    expect(isFreshTimes(fetched, fetched)).toBe(true);
    expect(isFreshTimes(fetched, fetched + TIMES_MAX_AGE_MS)).toBe(true);
    expect(isFreshTimes(fetched, fetched + TIMES_MAX_AGE_MS + 1)).toBe(false);
  });

  it('counts times fetched after the visitor arrived as fresh', () => {
    expect(isFreshTimes(2_000, 1_000)).toBe(true);
  });
});

describe('allowsFixture', () => {
  it('never answers with fixture data on production', () => {
    expect(allowsFixture('production', {})).toBe(false);
    expect(allowsFixture('production', { NETLIFY_DEV: 'true', NODE_ENV: 'development' })).toBe(false);
  });

  it('answers with it on previews, branch deploys and netlify dev', () => {
    expect(allowsFixture('deploy-preview')).toBe(true);
    expect(allowsFixture('branch-deploy')).toBe(true);
    expect(allowsFixture('dev')).toBe(true);
  });

  it('fails closed with no deploy context, except on a local dev server', () => {
    // A Netlify function sees no CONTEXT variable at runtime and often no NODE_ENV either.
    expect(allowsFixture(undefined, {})).toBe(false);
    expect(allowsFixture(undefined, { NODE_ENV: 'production' })).toBe(false);
    expect(allowsFixture('', {})).toBe(false);
    expect(allowsFixture(undefined, { NETLIFY_DEV: 'true' })).toBe(true);
    expect(allowsFixture(undefined, { NODE_ENV: 'development' })).toBe(true);
  });
});
