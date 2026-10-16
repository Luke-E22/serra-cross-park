/**
 * The terms and conditions checkbox the booking flow uses twice: in the agreement gate ahead of the
 * Cal.com booker (AvailabilityCalendar.tsx) and above the fallback inquiry form (InquiryFallback.tsx).
 * One component, so both places carry the same words and the same link. The label wraps the box, so
 * the whole row is the target; the link opens the terms in a new tab and says so to assistive tech;
 * the box is a native checkbox at 24px with a navy accent and the design system's focus ring.
 *
 * TermsRules is the short list both places show above the box: the four rules the board reviewer
 * asked to stand out in bold (notes of 2026-10-14, applied at the owner's request), each in <strong>.
 * They replace the owner's three rules of 2026-10-12: the park entrance stays open, there are no
 * restrooms or lighting on site (there is power, two 20-amp outlets, so the old "no power" rule is
 * gone), all trash and decor leave with the event, and booked time includes setup and breakdown.
 * Styles live under "terms agreement" in availability-calendar.css.
 */
import * as React from 'react';
import './availability-calendar.css';

/** The terms page: an internal route, with the trailing slash every internal link carries. */
export const TERMS_PATH = '/terms-and-conditions/';

/** The four rules every booking agrees to, in the order the reviewer gave them. */
export const TERMS_RULES: readonly string[] = [
  'The park entrance always remains open.',
  'No restrooms or lighting on site.',
  'All trash and decor must be removed after your event.',
  'Booked time must include setup and breakdown for you and your vendors.',
];

/** "terms and conditions", linked, opening in a new tab. */
export function TermsLink() {
  return (
    <a href={TERMS_PATH} target="_blank" rel="noopener">
      terms and conditions<span className="sc-visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/** The four rules in bold, one to a line, with the page's square ochre marks. */
export function TermsRules({ className }: { className?: string }) {
  return (
    <ul className={['terms-rules', 'body-sm', className].filter(Boolean).join(' ')} role="list">
      {TERMS_RULES.map((rule) => (
        <li key={rule} className="terms-rules__item">
          <strong className="terms-rules__text">{rule}</strong>
        </li>
      ))}
    </ul>
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
