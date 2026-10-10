/*
 * Cal.com embed colors, built from design-system/tokens.json at build time.
 *
 * The booker runs in an iframe on app.cal.com, so the page's CSS variables cannot reach it.
 * Cal.com takes plain color strings through cal("ui", { cssVarsPerTheme }), so this module reads the
 * tokens file directly, follows every "{alias}" to its hex or rgba value, and exports the finished map.
 *
 * The design system has one theme ("light"); it is the first and only entry in tokens.color.themes.
 * Keys follow Cal.com's documented list plus the spellings the brief names; the embed ignores keys it
 * does not know (docs/INTEGRATION-NOTES.md, Cal.com section).
 *
 * The JSON import works because Astro's base tsconfig sets resolveJsonModule and Vite bundles JSON natively.
 */
import tokens from '../../design-system/tokens.json';

type NamedValue = { name: string; value: string };

const COLOR_TOKENS: readonly NamedValue[] = tokens.color.tokens;
const RADIUS_TOKENS: readonly NamedValue[] = tokens.radius.tokens;

const COLOR_BY_NAME: ReadonlyMap<string, string> = new Map(COLOR_TOKENS.map((t) => [t.name, t.value]));

/** "{paper}" inside a token value points at another token. */
const ALIAS = /\{([^{}]+)\}/g;

/**
 * The resolved value of a color token: a hex or rgba string with no "{alias}" left in it.
 * Throws for a name the tokens file does not have, and for an alias loop, so a bad token fails the
 * build instead of shipping "{navy}" to Cal.com.
 */
export function resolveToken(name: string, trail: readonly string[] = []): string {
  const raw = COLOR_BY_NAME.get(name);
  if (raw === undefined) {
    throw new Error(`cal-theme: no color token named "${name}" in design-system/tokens.json`);
  }
  if (trail.includes(name)) {
    throw new Error(`cal-theme: color token alias loop: ${[...trail, name].join(' > ')}`);
  }
  const next = [...trail, name];
  return raw.replace(ALIAS, (_match: string, alias: string) => resolveToken(alias.trim(), next));
}

function radiusToken(name: string): string {
  const found = RADIUS_TOKENS.find((t) => t.name === name);
  if (!found) throw new Error(`cal-theme: no radius token named "${name}" in design-system/tokens.json`);
  return found.value;
}

/** The booker's own hairline. No token: the brand book draws 1px borders everywhere. */
const BOOKER_BORDER_WIDTH = '1px';

/**
 * cssVarsPerTheme.light for cal("ui", ...). Navy brand, paper text on it, ink text on raised paper,
 * line and line-strong borders, square corners.
 */
export const CAL_LIGHT_VARS: Record<string, string> = {
  'cal-brand': resolveToken('navy'),
  'cal-brand-emphasis': resolveToken('navy-deep'),
  'cal-brand-text': resolveToken('paper'),

  'cal-text': resolveToken('ink'),
  'cal-text-emphasis': resolveToken('ink'),
  'cal-text-default': resolveToken('ink'),
  'cal-text-subtle': resolveToken('ink-muted'),
  'cal-text-muted': resolveToken('ink-muted'),

  'cal-bg': resolveToken('surface-raised'),
  'cal-bg-booker': resolveToken('surface-raised'),
  'cal-bg-subtle': resolveToken('surface-alt'),
  'cal-bg-emphasis': resolveToken('sandstone'),

  'cal-border': resolveToken('line'),
  'cal-border-subtle': resolveToken('line'),
  'cal-border-emphasis': resolveToken('line-strong'),
  'cal-border-booker': resolveToken('line-strong'),
  'cal-border-booker-width': BOOKER_BORDER_WIDTH,

  radius: radiusToken('radius-none'),
};
