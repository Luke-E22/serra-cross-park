import { describe, expect, it } from 'vitest';
import { toZeffyEmbedPath, toZeffyEmbedUrl } from './ZeffyEmbed';

const SLUG = 'donate-to-startup-ventura';

describe('toZeffyEmbedUrl', () => {
  it('inserts /embed after the language segment', () => {
    expect(toZeffyEmbedUrl(`https://www.zeffy.com/en-US/donation-form/${SLUG}`)).toBe(
      `https://www.zeffy.com/en-US/embed/donation-form/${SLUG}`,
    );
  });

  it('accepts a lowercase language segment', () => {
    expect(toZeffyEmbedUrl(`https://www.zeffy.com/en-us/donation-form/${SLUG}`)).toBe(
      `https://www.zeffy.com/en-us/embed/donation-form/${SLUG}`,
    );
  });

  it('inserts /embed first when there is no language segment', () => {
    expect(toZeffyEmbedUrl(`https://www.zeffy.com/donation-form/${SLUG}`)).toBe(
      `https://www.zeffy.com/embed/donation-form/${SLUG}`,
    );
  });

  it('leaves an embed URL alone, with or without the language segment', () => {
    const withLang = `https://www.zeffy.com/en-US/embed/donation-form/${SLUG}`;
    const withoutLang = `https://www.zeffy.com/embed/donation-form/${SLUG}`;
    expect(toZeffyEmbedUrl(withLang)).toBe(withLang);
    expect(toZeffyEmbedUrl(withoutLang)).toBe(withoutLang);
  });

  it('keeps the query string', () => {
    expect(toZeffyEmbedUrl(`https://www.zeffy.com/en-US/donation-form/${SLUG}?modal=true`)).toBe(
      `https://www.zeffy.com/en-US/embed/donation-form/${SLUG}?modal=true`,
    );
  });

  it('returns anything that is not a URL unchanged', () => {
    expect(toZeffyEmbedUrl('not a url')).toBe('not a url');
  });
});

// Zeffy's script resolves data-form-url against its own origin, so the container needs a path.
describe('toZeffyEmbedPath', () => {
  it('returns the embed path, with and without the language segment', () => {
    expect(toZeffyEmbedPath(`https://www.zeffy.com/en-US/donation-form/${SLUG}`)).toBe(
      `/en-US/embed/donation-form/${SLUG}`,
    );
    expect(toZeffyEmbedPath(`https://www.zeffy.com/donation-form/${SLUG}`)).toBe(`/embed/donation-form/${SLUG}`);
  });

  it('keeps the query string and leaves an embed URL alone', () => {
    expect(toZeffyEmbedPath(`https://www.zeffy.com/en-US/embed/donation-form/${SLUG}?modal=true`)).toBe(
      `/en-US/embed/donation-form/${SLUG}?modal=true`,
    );
  });

  it('starts a non-URL with a slash so the script does not add one in front of a scheme', () => {
    expect(toZeffyEmbedPath('embed/donation-form/x')).toBe('/embed/donation-form/x');
    expect(toZeffyEmbedPath('/embed/donation-form/x')).toBe('/embed/donation-form/x');
  });
});
