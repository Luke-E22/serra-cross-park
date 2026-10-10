/**
 * The terms and conditions checkbox the booking flow uses twice: in the agreement gate ahead of the
 * Cal.com booker (AvailabilityCalendar.tsx) and above the fallback inquiry form (InquiryFallback.tsx).
 * One component, so both places carry the same words and the same link. The label wraps the box, so
 * the whole row is the target; the link opens the terms in a new tab and says so to assistive tech;
 * the box is a native checkbox at 24px with a navy accent and the design system's focus ring.
 * Styles live under "terms agreement" in availability-calendar.css.
 */
import * as React from 'react';
import './availability-calendar.css';

/** The terms page: an internal route, with the trailing slash every internal link carries. */
export const TERMS_PATH = '/terms-and-conditions/';

/** "terms and conditions", linked, opening in a new tab. */
export function TermsLink() {
  return (
    <a href={TERMS_PATH} target="_blank" rel="noopener">
      terms and conditions<span className="sc-visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

export interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Mark the box required. */
  required?: boolean;
  /** True while the visitor has tried to send without ticking the box. */
  invalid?: boolean;
  /** id of the text that explains `invalid`. */
  describedBy?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
}

export function TermsCheckbox({ checked, onChange, required, invalid, describedBy, inputRef, className }: TermsCheckboxProps) {
  return (
    <label className={['terms-check', 'body-sm', className].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        className="terms-check__box"
        name="terms"
        value="yes"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        ref={inputRef}
      />
      <span className="terms-check__text">
        I have read and agree to the <TermsLink />
      </span>
    </label>
  );
}
