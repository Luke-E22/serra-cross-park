// Tests for the sessionStorage helpers behind the terms agreement gate. They import only the
// pure helper (terms-agreement.ts) and stand a plain object in for the store, so no DOM is needed.
import { describe, expect, it } from 'vitest';
import { readAgreement, sessionStore, TERMS_AGREED_KEY, TERMS_AGREED_VALUE, writeAgreement } from './terms-agreement';
import type { AgreementStore } from './terms-agreement';

function memoryStore(seed: Record<string, string> = {}): AgreementStore & { data: Record<string, string> } {
  const data: Record<string, string> = { ...seed };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

describe('terms agreement', () => {
  it('reads false from an empty store and from no store at all', () => {
    expect(readAgreement(memoryStore())).toBe(false);
    expect(readAgreement(null)).toBe(false);
  });

  it('reads true only for the exact stored value under the one key', () => {
    expect(readAgreement(memoryStore({ [TERMS_AGREED_KEY]: TERMS_AGREED_VALUE }))).toBe(true);
    expect(readAgreement(memoryStore({ [TERMS_AGREED_KEY]: 'true' }))).toBe(false);
    expect(readAgreement(memoryStore({ [TERMS_AGREED_KEY]: '1' }))).toBe(false);
    expect(readAgreement(memoryStore({ 'scp-terms': TERMS_AGREED_VALUE }))).toBe(false);
  });

  it('writes the agreement and clears it again', () => {
    const store = memoryStore();
    expect(writeAgreement(store, true)).toBe(true);
    expect(store.data).toEqual({ [TERMS_AGREED_KEY]: TERMS_AGREED_VALUE });
    expect(readAgreement(store)).toBe(true);
    expect(writeAgreement(store, false)).toBe(true);
    expect(store.data).toEqual({});
    expect(readAgreement(store)).toBe(false);
  });

  it('does nothing without a store', () => {
    expect(writeAgreement(null, true)).toBe(false);
  });

  it('swallows a store that throws, as blocked storage does', () => {
    const broken: AgreementStore = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readAgreement(broken)).toBe(false);
    expect(writeAgreement(broken, true)).toBe(false);
    expect(writeAgreement(broken, false)).toBe(false);
  });

  it('has no session store outside a browser', () => {
    expect(sessionStore()).toBeNull();
  });
});
