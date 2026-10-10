import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  buildFixture,
  buildResponse,
  clipSlotData,
  countSlots,
  eachDay,
  mergeSlotData,
  monthChunks,
  summarize,
  todayInZone,
  weekdayOf,
  type SlotData,
} from './availability.ts';

// 2026-10-09 is a Friday. Weekends: Oct 10/11, 17/18, 24/25.
const TODAY = '2026-10-09';

/** Fills every day in [start, end] from a per-date table; missing days get no entry. */
function table(entries: Record<string, number>): Record<string, number> {
  return { ...entries };
}

/** Two weeks of a park with three weekend blocks and four weekday slots, Fridays never open. */
function scenario(): Record<string, number> {
  return table({
    // Sat Oct 10 fully open, Sun Oct 11 partly booked, Sat Oct 17 booked, Sun Oct 18 open.
    '2026-10-10': 3,
    '2026-10-11': 2,
    '2026-10-17': 0,
    '2026-10-18': 3,
    // Mon to Thu, four slots each; Thu Oct 15 partly booked.
    '2026-10-12': 4,
    '2026-10-13': 4,
    '2026-10-14': 4,
    '2026-10-15': 1,
    '2026-10-19': 4,
    '2026-10-20': 4,
    '2026-10-21': 4,
    '2026-10-22': 4,
    // No Friday ever has a slot. Oct 24 and 25 have none either: past the last slot.
  });
}

describe('date helpers', () => {
  it('finds today in America/Los_Angeles across the UTC midnight boundary', () => {
    expect(todayInZone('America/Los_Angeles', new Date('2026-10-10T05:30:00Z'))).toBe('2026-10-09');
    expect(todayInZone('America/Los_Angeles', new Date('2026-10-10T07:30:00Z'))).toBe('2026-10-10');
  });

  it('is right on the DST change day', () => {
    expect(todayInZone('America/Los_Angeles', new Date('2026-03-08T10:30:00Z'))).toBe('2026-03-08');
    expect(todayInZone('America/Los_Angeles', new Date('2026-03-08T07:59:00Z'))).toBe('2026-03-07');
  });

  it('weekdayOf is stable and zone-free', () => {
    expect(weekdayOf('2026-10-09')).toBe(5); // Friday
    expect(weekdayOf('2026-11-14')).toBe(6); // Saturday, the brief's example
    expect(weekdayOf('2026-03-08')).toBe(0); // Sunday
    expect(weekdayOf('2026-01-01')).toBe(4);
  });

  it('adds days and months, clamping month ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addMonths('2026-10-09', 12)).toBe('2027-10-09');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonths('2026-11-30', 3)).toBe('2027-02-28');
  });

  it('lists each day with an exclusive end', () => {
    expect(eachDay('2026-10-30', '2026-11-02')).toEqual(['2026-10-30', '2026-10-31', '2026-11-01']);
    expect(eachDay('2026-10-09', '2026-10-09')).toEqual([]);
  });

  it('chunks a horizon into contiguous ranges of about a month', () => {
    const chunks = monthChunks('2026-10-09', '2027-10-10');
    expect(chunks).toHaveLength(12);
    expect(chunks[0]).toEqual({ start: '2026-10-09', end: '2026-11-09' });
    expect(chunks[11]).toEqual({ start: '2027-09-09', end: '2027-10-10' });
    for (let i = 1; i < chunks.length; i++) expect(chunks[i]!.start).toBe(chunks[i - 1]!.end);
    expect(monthChunks('2026-10-09', '2026-10-20')).toEqual([{ start: '2026-10-09', end: '2026-10-20' }]);
  });
});

describe('Cal.com data', () => {
  // The real response shape from docs/INTEGRATION-NOTES.md.
  const payload = {
    status: 'success',
    data: {
      '2026-10-10': [
        { start: '2026-10-10T08:00:00.000-07:00' },
        { start: '2026-10-10T11:00:00.000-07:00' },
        { start: '2026-10-10T14:00:00.000-07:00' },
        { start: '2026-10-10T17:00:00.000-07:00' },
      ],
      '2026-10-11': [
        { start: '2026-10-11T08:00:00.000-07:00' },
        { start: '2026-10-11T11:00:00.000-07:00' },
        { start: '2026-10-11T14:00:00.000-07:00' },
      ],
      '2026-10-12': [],
    } satisfies SlotData,
  };

  it('counts open slots per date', () => {
    expect(countSlots(payload.data)).toEqual({ '2026-10-10': 4, '2026-10-11': 3, '2026-10-12': 0 });
    expect(countSlots({})).toEqual({});
  });

  it('clips a chunk to its own range, dropping the stray day before and the cut-short end day', () => {
    // Shape seen live on 2026-10-09: start=2026-11-09 returns 2026-11-08 with one 16:00 slot
    // (00:00 UTC), and end=2026-12-09 returns 2026-12-09 with only the two early slots.
    const chunk: SlotData = {
      '2026-11-08': [{ start: '2026-11-08T16:00:00.000-08:00' }],
      '2026-11-09': [
        { start: '2026-11-09T08:00:00.000-08:00' },
        { start: '2026-11-09T11:00:00.000-08:00' },
        { start: '2026-11-09T14:00:00.000-08:00' },
        { start: '2026-11-09T17:00:00.000-08:00' },
      ],
      '2026-12-08': [
        { start: '2026-12-08T08:00:00.000-08:00' },
        { start: '2026-12-08T11:00:00.000-08:00' },
        { start: '2026-12-08T14:00:00.000-08:00' },
        { start: '2026-12-08T17:00:00.000-08:00' },
      ],
      '2026-12-09': [{ start: '2026-12-09T08:00:00.000-08:00' }, { start: '2026-12-09T11:00:00.000-08:00' }],
    };
    const clipped = clipSlotData(chunk, { start: '2026-11-09', end: '2026-12-09' });
    expect(Object.keys(clipped)).toEqual(['2026-11-09', '2026-12-08']);
    expect(countSlots(clipped)).toEqual({ '2026-11-09': 4, '2026-12-08': 4 });
  });

  it('clips then merges two live-shaped chunks to four slots on every day', () => {
    const first: SlotData = {
      '2026-12-08': [
        { start: '2026-12-08T08:00:00.000-08:00' },
        { start: '2026-12-08T11:00:00.000-08:00' },
        { start: '2026-12-08T14:00:00.000-08:00' },
        { start: '2026-12-08T17:00:00.000-08:00' },
      ],
      '2026-12-09': [{ start: '2026-12-09T08:00:00.000-08:00' }, { start: '2026-12-09T11:00:00.000-08:00' }],
    };
    const second: SlotData = {
      '2026-12-08': [{ start: '2026-12-08T16:00:00.000-08:00' }],
      '2026-12-09': [
        { start: '2026-12-09T08:00:00.000-08:00' },
        { start: '2026-12-09T11:00:00.000-08:00' },
        { start: '2026-12-09T14:00:00.000-08:00' },
        { start: '2026-12-09T17:00:00.000-08:00' },
      ],
    };
    const ranges = monthChunks('2026-11-09', '2027-01-09');
    expect(ranges).toEqual([
      { start: '2026-11-09', end: '2026-12-09' },
      { start: '2026-12-09', end: '2027-01-09' },
    ]);
    const merged = mergeSlotData([clipSlotData(first, ranges[0]!), clipSlotData(second, ranges[1]!)]);
    expect(countSlots(merged)).toEqual({ '2026-12-08': 4, '2026-12-09': 4 });
  });

  it('merges chunk payloads and dedupes a boundary day', () => {
    const a: SlotData = { '2026-11-09': [{ start: '2026-11-09T08:00:00.000-08:00' }, { start: '2026-11-09T11:00:00.000-08:00' }] };
    const b: SlotData = {
      '2026-11-09': [{ start: '2026-11-09T11:00:00.000-08:00' }, { start: '2026-11-09T17:00:00.000-08:00' }],
      '2026-11-10': [{ start: '2026-11-10T08:00:00.000-08:00' }],
    };
    const merged = mergeSlotData([a, b]);
    expect(countSlots(merged)).toEqual({ '2026-11-09': 3, '2026-11-10': 1 });
  });
});

describe('summarize', () => {
  const base = { start: TODAY, end: '2026-10-25', today: TODAY, minNoticeDays: 0, fullDaySlots: null };

  it('gives weekend days with three blocks open, partial and booked', () => {
    const days = summarize({ ...base, counts: scenario() });
    expect(days['2026-10-10']).toEqual({ status: 'open', open: 3, of: 3 });
    expect(days['2026-10-11']).toEqual({ status: 'partial', open: 2, of: 3 });
    expect(days['2026-10-17']).toEqual({ status: 'booked', open: 0, of: 3 });
    expect(days['2026-10-18']).toEqual({ status: 'open', open: 3, of: 3 });
  });

  it('learns four slots for weekdays and marks a partly booked one', () => {
    const days = summarize({ ...base, counts: scenario() });
    expect(days['2026-10-12']).toEqual({ status: 'open', open: 4, of: 4 });
    expect(days['2026-10-15']).toEqual({ status: 'partial', open: 1, of: 4 });
  });

  it('closes a weekday that never has slots anywhere in the horizon', () => {
    const days = summarize({ ...base, counts: scenario() });
    expect(days['2026-10-09']).toEqual({ status: 'closed', open: 0, of: 0 });
    expect(days['2026-10-16']).toEqual({ status: 'closed', open: 0, of: 0 });
    expect(days['2026-10-23']).toEqual({ status: 'closed', open: 0, of: 0 });
  });

  it('marks days after the last slot as notyet', () => {
    const days = summarize({ ...base, counts: scenario() });
    expect(days['2026-10-24']).toEqual({ status: 'notyet', open: 0, of: 3 });
    expect(days['2026-10-25']).toEqual({ status: 'notyet', open: 0, of: 3 });
  });

  it('marks days before today as past and covers the whole range', () => {
    const days = summarize({ ...base, start: '2026-10-07', counts: scenario() });
    expect(days['2026-10-07']?.status).toBe('past');
    expect(days['2026-10-08']?.status).toBe('past');
    expect(Object.keys(days)).toHaveLength(19);
    expect(Object.keys(days)[0]).toBe('2026-10-07');
    expect(Object.keys(days).at(-1)).toBe('2026-10-25');
  });

  it('applies minimum notice: 0 days leaves today open, 2 days covers today and tomorrow', () => {
    const counts = table({ '2026-10-12': 4, '2026-10-13': 4, '2026-10-14': 4, '2026-10-15': 4, '2026-10-16': 4 });
    const monday = { ...base, start: '2026-10-12', end: '2026-10-16', today: '2026-10-12', counts };

    const none = summarize({ ...monday, minNoticeDays: 0 });
    expect(none['2026-10-12']?.status).toBe('open');

    const two = summarize({ ...monday, minNoticeDays: 2 });
    expect(two['2026-10-12']).toEqual({ status: 'soon', open: 4, of: 4 });
    expect(two['2026-10-13']).toEqual({ status: 'soon', open: 4, of: 4 });
    expect(two['2026-10-14']?.status).toBe('open');
  });

  it('keeps closed ahead of soon', () => {
    const days = summarize({ ...base, counts: scenario(), minNoticeDays: 2 });
    expect(days['2026-10-09']?.status).toBe('closed'); // Friday, today
    expect(days['2026-10-10']?.status).toBe('soon');
    expect(days['2026-10-11']?.status).toBe('partial');
  });

  it('uses fullDaySlots over the learned maximum', () => {
    const counts = table({ '2026-10-10': 2, '2026-10-11': 2, '2026-10-12': 4, '2026-10-13': 4 });
    const learned = summarize({ ...base, end: '2026-10-16', counts });
    expect(learned['2026-10-10']).toEqual({ status: 'open', open: 2, of: 2 });

    const fixed = summarize({ ...base, end: '2026-10-16', counts, fullDaySlots: { 0: 3, 6: 3, 5: 4 } });
    expect(fixed['2026-10-10']).toEqual({ status: 'partial', open: 2, of: 3 });
    expect(fixed['2026-10-11']).toEqual({ status: 'partial', open: 2, of: 3 });
    // Monday has no entry, so the learned four applies.
    expect(fixed['2026-10-12']).toEqual({ status: 'open', open: 4, of: 4 });
    // Friday is given four slots, so with none seen it is booked, not closed.
    expect(fixed['2026-10-09']).toEqual({ status: 'booked', open: 0, of: 4 });
  });

  it('treats a fullDaySlots entry of zero as closed', () => {
    const counts = table({ '2026-10-10': 3, '2026-10-11': 3, '2026-10-12': 4 });
    const days = summarize({ ...base, end: '2026-10-12', counts, fullDaySlots: { 0: 0, 6: 3, 1: 4 } });
    expect(days['2026-10-11']).toEqual({ status: 'closed', open: 3, of: 0 });
    expect(days['2026-10-10']?.status).toBe('open');
  });
});

describe('buildResponse', () => {
  it('wraps the summary in the envelope', () => {
    const res = buildResponse({
      counts: scenario(),
      start: TODAY,
      end: '2026-10-25',
      today: TODAY,
      minNoticeDays: 0,
      fullDaySlots: null,
      timeZone: 'America/Los_Angeles',
      generatedAt: '2026-10-09T15:00:00.000Z',
    });
    expect(res.generatedAt).toBe('2026-10-09T15:00:00.000Z');
    expect(res.timeZone).toBe('America/Los_Angeles');
    expect(res.start).toBe(TODAY);
    expect(res.end).toBe('2026-10-25');
    expect(Object.keys(res.days)).toHaveLength(17);
    expect(res.days['2026-10-10']?.status).toBe('open');
  });

  it('stamps generatedAt with a parseable time when none is given', () => {
    const res = buildResponse({ counts: {}, start: TODAY, end: TODAY, today: TODAY, minNoticeDays: 0, fullDaySlots: null, timeZone: 'UTC' });
    expect(Number.isNaN(Date.parse(res.generatedAt))).toBe(false);
  });
});

describe('buildFixture', () => {
  const fixture = buildFixture(TODAY, 12, 2);
  const dates = Object.keys(fixture.days);
  const statuses = (filter: (d: string) => boolean) => new Set(dates.filter(filter).map((d) => fixture.days[d]!.status));

  it('is deterministic and spans the horizon', () => {
    expect(buildFixture(TODAY, 12, 2)).toEqual(fixture);
    expect(fixture.start).toBe(TODAY);
    expect(fixture.end).toBe('2027-10-09');
    expect(dates[0]).toBe(TODAY);
    expect(dates.at(-1)).toBe('2027-10-09');
    expect(dates).toHaveLength(366);
    expect(fixture.generatedAt).toBe('2026-10-09T00:00:00.000Z');
  });

  it('gives weekends three blocks with open, partial and booked days', () => {
    const weekend = statuses((d) => [0, 6].includes(weekdayOf(d)) && fixture.days[d]!.status !== 'notyet' && fixture.days[d]!.status !== 'soon');
    expect(weekend).toEqual(new Set(['open', 'partial', 'booked']));
    for (const d of dates) if ([0, 6].includes(weekdayOf(d))) expect(fixture.days[d]!.of).toBe(3);
  });

  it('gives weekdays four slots, mostly open, and never closes one', () => {
    const weekdayDates = dates.filter((d) => ![0, 6].includes(weekdayOf(d)));
    for (const d of weekdayDates) expect(fixture.days[d]!.of).toBe(4);
    const open = weekdayDates.filter((d) => fixture.days[d]!.status === 'open').length;
    expect(open).toBeGreaterThan(weekdayDates.length * 0.6);
    expect(statuses(() => true).has('closed')).toBe(false);
    expect(statuses(() => true).has('past')).toBe(false);
  });

  it('leaves the last 30 days empty and the first two days soon', () => {
    const lastThirty = dates.slice(-30);
    for (const d of lastThirty) expect(fixture.days[d]!.status).toBe('notyet');
    expect(fixture.days[dates[dates.length - 31]!]!.status).not.toBe('notyet');
    expect(fixture.days[TODAY]!.status).toBe('soon');
    expect(fixture.days['2026-10-10']!.status).toBe('soon');
    expect(fixture.days['2026-10-11']!.status).not.toBe('soon');
    expect(buildFixture(TODAY, 12, 0).days[TODAY]!.status).not.toBe('soon');
  });
});
