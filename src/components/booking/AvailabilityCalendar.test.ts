// Tests for the month grid behind the availability calendar. They import only the pure
// helper (calendar-grid.ts), so no React or DOM is needed.
import { describe, expect, it } from 'vitest';
import { monthGrid } from './calendar-grid';

describe('monthGrid', () => {
  it('puts a month that begins on Sunday in the first cell with no leading padding', () => {
    // November 1, 2026 is a Sunday; 30 days fill five rows.
    const weeks = monthGrid('2026-11');
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]).toEqual([
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-07',
    ]);
    expect(weeks[4]).toEqual(['2026-11-29', '2026-11-30', null, null, null, null, null]);
    expect(weeks.flat().filter((d) => d !== null)).toHaveLength(30);
  });

  it('spans six rows for a 31-day month that starts on Saturday', () => {
    // August 1, 2026 is a Saturday, so the first row holds one day and the last row two.
    const weeks = monthGrid('2026-08');
    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]).toEqual([null, null, null, null, null, null, '2026-08-01']);
    expect(weeks[5]).toEqual(['2026-08-30', '2026-08-31', null, null, null, null, null]);
    expect(weeks.flat().filter((d) => d !== null)).toHaveLength(31);
  });

  it('gives February 2028 its leap day', () => {
    // 2028 is a leap year; February 1, 2028 is a Tuesday.
    const weeks = monthGrid('2028-02');
    const days = weeks.flat().filter((d): d is string => d !== null);
    expect(days).toHaveLength(29);
    expect(days[0]).toBe('2028-02-01');
    expect(days[28]).toBe('2028-02-29');
    expect(weeks[0].indexOf('2028-02-01')).toBe(2);
    expect(weeks).toHaveLength(5);
    expect(weeks[4]).toEqual(['2028-02-27', '2028-02-28', '2028-02-29', null, null, null, null]);
  });

  it('zero-pads every date so the keys sort as text', () => {
    const days = monthGrid('2027-03').flat().filter((d): d is string => d !== null);
    expect(days.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
    expect([...days].sort()).toEqual(days);
  });
});
