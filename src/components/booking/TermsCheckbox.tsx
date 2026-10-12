/**
 * The terms and conditions checkbox the booking flow uses twice: in the agreement gate ahead of the
 * Cal.com booker (AvailabilityCalendar.tsx) and above the fallback inquiry form (InquiryFallback.tsx).
 * One component, so both places carry the same words and the same link. The label wraps the box, so
 * the whole row is the target; the link opens the terms in a new tab and says so to assistive tech;
 * the box is a native checkbox at 24px with a navy accent and the design system's focus ring.
 *
 * TermsRules is the short list both places show above the box: the three rules the owner asked to
 * stand out in bold (2026-10-12), each in <strong>. The words come from BRIEF.md section 9 as amended
 * by the owner's decisions of 2026-10-12: the park stays public, there is no power or restroom on
 * site, and booked time includes setup and breakdown.
 * Styles live under "terms agreement" in availability-calendar.css.
 */
import * as React from 'react';
import './availability-calendar.css';

/** The terms page: an internal route, with the trailing slash every internal link carries. */
export const TERMS_PATH = '/terms-and-conditions/';

/** The three rules every booking agrees to, in the order the owner gave them. */
export const TERMS_RULES: readonly string[] = [
  'The park is always open to the public.',
  'No power or restrooms are available.',
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

/** The three rules in bold, one to a line, with the page's square ochre marks. */
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
