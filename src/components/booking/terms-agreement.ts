/**
 * Remembers, for one visit, that the visitor agreed to the terms and conditions before booking.
 * The booking island (AvailabilityCalendar.tsx) keeps the agreement in sessionStorage under
 * TERMS_AGREED_KEY so choosing another day does not ask again; a new tab or a closed window starts
 * clean. The helpers take the store as an argument and swallow its errors (private browsing and
 * blocked storage can throw), so they run without a DOM and are tested in terms-agreement.test.ts.
 */

export const TERMS_AGREED_KEY = 'scp-terms-agreed';
/** The stored value. Anything else, or nothing, reads as not agreed. */
export const TERMS_AGREED_VALUE = 'yes';

/** The part of Storage the helpers use, so a plain object can stand in for sessionStorage in tests. */
export type AgreementStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** window.sessionStorage when it exists and can be touched; null on the server or when access throws. */
export function sessionStore(): AgreementStore | null {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** True when the store holds the agreement. A missing store or a throwing getItem reads as false. */
export function readAgreement(store: AgreementStore | null): boolean {
  if (!store) return false;
  try {
    return store.getItem(TERMS_AGREED_KEY) === TERMS_AGREED_VALUE;
  } catch {
    return false;
  }
}

/** Stores the agreement, or clears it when `agreed` is false. Returns whether the write took. */
export function writeAgreement(store: AgreementStore | null, agreed: boolean): boolean {
  if (!store) return false;
  try {
    if (agreed) store.setItem(TERMS_AGREED_KEY, TERMS_AGREED_VALUE);
    else store.removeItem(TERMS_AGREED_KEY);
    return true;
  } catch {
    return false;
  }
}
