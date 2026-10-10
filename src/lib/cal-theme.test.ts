import { describe, expect, it } from 'vitest';
import { CAL_LIGHT_VARS, resolveToken } from './cal-theme';

describe('resolveToken', () => {
  it('returns a plain hex token as is', () => {
    expect(resolveToken('navy')).toBe('#1d2944');
  });

  it('follows one alias: surface is {paper}', () => {
    expect(resolveToken('surface')).toBe('#f4f1ea');
  });

  it('follows an alias to navy: ink is {navy}', () => {
    expect(resolveToken('ink')).toBe('#1d2944');
  });

  it('keeps rgba values whole', () => {
    expect(resolveToken('scrim')).toBe('rgba(18, 26, 46, 0.82)');
  });

  it('throws for a token the file does not have', () => {
    expect(() => resolveToken('not-a-token')).toThrow(/no color token named "not-a-token"/);
  });
});

describe('CAL_LIGHT_VARS', () => {
  const EXPECTED_KEYS = [
    'cal-brand',
    'cal-brand-emphasis',
    'cal-brand-text',
    'cal-text',
    'cal-text-emphasis',
    'cal-text-default',
    'cal-text-subtle',
    'cal-text-muted',
    'cal-bg',
    'cal-bg-booker',
    'cal-bg-subtle',
    'cal-bg-emphasis',
    'cal-border',
    'cal-border-subtle',
    'cal-border-emphasis',
    'cal-border-booker',
    'cal-border-booker-width',
    'radius',
  ];

  it('maps cal-brand to navy', () => {
    expect(CAL_LIGHT_VARS['cal-brand']).toBe('#1d2944');
  });

  it('has every key the brief and Cal.com name, and nothing else', () => {
    expect(Object.keys(CAL_LIGHT_VARS).sort()).toEqual([...EXPECTED_KEYS].sort());
  });

  it('leaves no "{alias}" unresolved', () => {
    for (const [key, value] of Object.entries(CAL_LIGHT_VARS)) {
      expect(value, key).not.toContain('{');
      expect(value, key).not.toContain('}');
    }
  });

  it('holds only hex colors, rgba colors or px lengths', () => {
    const shape = /^(#[0-9a-f]{6}|rgba\([^)]+\)|\d+px)$/;
    for (const [key, value] of Object.entries(CAL_LIGHT_VARS)) {
      expect(value, key).toMatch(shape);
    }
  });

  it('pairs paper text with the navy brand fill', () => {
    expect(CAL_LIGHT_VARS['cal-brand-text']).toBe('#f4f1ea');
    expect(CAL_LIGHT_VARS['cal-brand-emphasis']).toBe('#141d31');
  });

  it('uses the strong line for borders people must see and the soft line for the rest', () => {
    expect(CAL_LIGHT_VARS['cal-border-booker']).toBe('#857d6b');
    expect(CAL_LIGHT_VARS['cal-border-emphasis']).toBe('#857d6b');
    expect(CAL_LIGHT_VARS['cal-border']).toBe('#d6cfbf');
    expect(CAL_LIGHT_VARS['cal-border-subtle']).toBe('#d6cfbf');
  });

  it('keeps square corners and a 1px booker border', () => {
    expect(CAL_LIGHT_VARS.radius).toBe('0px');
    expect(CAL_LIGHT_VARS['cal-border-booker-width']).toBe('1px');
  });
});
