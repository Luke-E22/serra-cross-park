// Tests for the day panel's pure helpers (DayPanel.tsx), the booker's link (CalBooker.tsx) and the
// zone name both name (calendar-grid.ts). They call functions only; nothing renders, so no DOM is
// needed. Expected links are built from src/config/site.ts, so mapping a length to its own Cal.com
// event (BOOKING.eventSlugByLength) does not break them.
import { describe, expect, it } from 'vitest';
import { BOOKING } from '../../config/site';
import { eventSlugFor } from '../../lib/day-times';
import { calLinkFor } from './CalBooker';
import { zoneName } from './calendar-grid';
import {
  formatFee,
  lengthAdjective,
  lengthInWords,
  lengthOptionLabel,
  noTimesMessage,
  parseTimes,
  showingTimesMessage,
  summaryLine,
  timesUrl,
} from './DayPanel';

const ZONE = 'America/Los_Angeles';
const LENGTHS = [120, 180, 240, 300, 360, 420, 480];

describe('formatFee', () => {
  it('writes whole dollars with a thousands comma and no cents', () => {
    expect(formatFee(600)).toBe('$600');
    expect(formatFee(1200)).toBe('$1,200');
    expect(formatFee(2400)).toBe('$2,400');
  });

  it('shows cents only when there are some', () => {
    expect(formatFee(687.5)).toBe('$687.50');
  });
});

describe('lengthOptionLabel', () => {
  it('pairs a length with its site fee', () => {
    expect(lengthOptionLabel(120)).toBe('2 hours, $600');
    expect(lengthOptionLabel(180)).toBe('3 hours, $900');
    expect(lengthOptionLabel(480)).toBe('8 hours, $2,400');
  });

  it('prices every length on offer at the configured rate', () => {
    for (const minutes of BOOKING.lengths) {
      expect(lengthOptionLabel(minutes).endsWith(`, ${formatFee((minutes / 60) * BOOKING.ratePerHour)}`)).toBe(true);
    }
  });
});

describe('noTimesMessage', () => {
  it('names the length in words and suggests a shorter one', () => {
    expect(noTimesMessage(300, LENGTHS)).toBe(
      'No five-hour times are left on this day. Try a shorter length or another date.',
    );
    expect(noTimesMessage(480, LENGTHS)).toBe(
      'No eight-hour times are left on this day. Try a shorter length or another date.',
    );
  });

  it('suggests only another date for the shortest length', () => {
    expect(noTimesMessage(120, LENGTHS)).toBe('No two-hour times are left on this day. Try another date.');
  });
});

describe('length words', () => {
  it('spells out one to ten hours, as the voice asks of prose', () => {
    expect(lengthAdjective(120)).toBe('two-hour');
    expect(lengthAdjective(600)).toBe('ten-hour');
    expect(lengthInWords(60)).toBe('one hour');
    expect(lengthInWords(180)).toBe('three hours');
  });

  it('falls back to figures past ten hours or off the hour', () => {
    expect(lengthAdjective(720)).toBe('12-hour');
    expect(lengthAdjective(150)).toBe('150-minute');
    expect(lengthInWords(720)).toBe('12 hours');
    expect(lengthInWords(150)).toBe('150 minutes');
  });

  it('builds the line screen readers hear once times are shown', () => {
    expect(showingTimesMessage(240)).toBe('Showing start times for four hours.');
  });
});

describe('summaryLine', () => {
  it('reads the day, the range, the length and the fee', () => {
    expect(
      summaryLine('2026-11-07', 180, '2026-11-07T09:00:00.000-08:00', '2026-11-07T12:00:00.000-08:00', ZONE),
    ).toBe('Saturday, November 7, 9 AM to 12 PM. 3 hours, $900 site fee.');
  });

  it('ends at 8 PM for the last two-hour start', () => {
    expect(
      summaryLine('2026-11-07', 120, '2026-11-07T18:00:00.000-08:00', '2026-11-07T20:00:00.000-08:00', ZONE),
    ).toBe('Saturday, November 7, 6 PM to 8 PM. 2 hours, $600 site fee.');
  });
});

describe('timesUrl', () => {
  it('asks for one date and one length', () => {
    expect(timesUrl('2026-11-07', 180)).toBe('/api/availability/times?date=2026-11-07&minutes=180');
  });

  it('adds the fixture flag only when asked', () => {
    expect(timesUrl('2026-11-07', 120, true)).toBe('/api/availability/times?date=2026-11-07&minutes=120&fixture=1');
  });
});

describe('parseTimes', () => {
  const eight = { start: '2026-11-07T08:00:00.000-08:00', end: '2026-11-07T11:00:00.000-08:00', label: '8 AM' };
  const nine = { start: '2026-11-07T09:00:00.000-08:00', end: '2026-11-07T12:00:00.000-08:00', label: '9 AM' };

  it('returns the times earliest first', () => {
    expect(parseTimes({ date: '2026-11-07', minutes: 180, timeZone: ZONE, times: [nine, eight] })).toEqual([eight, nine]);
  });

  it('drops entries it cannot read and keeps only start, end and label', () => {
    const body = { times: [{ ...nine, extra: true }, { start: 'soon', end: nine.end, label: '9 AM' }, { start: nine.start }, null] };
    expect(parseTimes(body)).toEqual([nine]);
  });

  it('accepts an empty list: no time of that length is left', () => {
    expect(parseTimes({ times: [] })).toEqual([]);
  });

  it('throws on any other shape', () => {
    expect(() => parseTimes(null)).toThrow();
    expect(() => parseTimes({ error: 'availability_unavailable' })).toThrow();
    expect(() => parseTimes('[]')).toThrow();
  });
});

describe('calLinkFor', () => {
  const event = `${BOOKING.calUsername}/${BOOKING.calEventSlug}`;

  it('is the bare event with no date, so Cal.com opens on the current month', () => {
    expect(calLinkFor(null)).toBe(event);
  });

  it('opens on the day with a date alone', () => {
    expect(calLinkFor('2026-11-07')).toBe(`${event}?month=2026-11&date=2026-11-07`);
  });

  it('opens straight on the form with a length and a start, as checked in a browser on 2026-11-03', () => {
    expect(calLinkFor('2026-11-07', 180, '2026-11-07T09:00:00.000-08:00')).toBe(
      `${BOOKING.calUsername}/${eventSlugFor(180)}?month=2026-11&date=2026-11-07&duration=180&slot=2026-11-07T17:00:00.000Z`,
    );
  });

  it('writes a summer start in UTC too, even when that is the next day there', () => {
    expect(calLinkFor('2027-07-10', 240, '2027-07-10T17:00:00.000-07:00')).toBe(
      `${BOOKING.calUsername}/${eventSlugFor(240)}?month=2027-07&date=2027-07-10&duration=240&slot=2027-07-11T00:00:00.000Z`,
    );
  });

  it('keeps the day and the length when the times did not load', () => {
    expect(calLinkFor('2026-11-07', 120)).toBe(
      `${BOOKING.calUsername}/${eventSlugFor(120)}?month=2026-11&date=2026-11-07&duration=120`,
    );
  });

  it('leaves out a length the event does not offer, a start it cannot read and a malformed date', () => {
    expect(calLinkFor('2026-11-07', 90, 'soon')).toBe(`${event}?month=2026-11&date=2026-11-07`);
    expect(calLinkFor('Nov 7')).toBe(event);
  });
});

describe('zoneName', () => {
  it('names the booking zone in words', () => {
    expect(zoneName(ZONE)).toBe('Pacific Time');
  });

  it('falls back to the IANA name for a zone Intl does not know', () => {
    expect(zoneName('Mars/Olympus_Mons')).toBe('Mars/Olympus Mons');
  });
});
