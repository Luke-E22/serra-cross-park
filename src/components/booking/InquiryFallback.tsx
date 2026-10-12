/*
 * The fallback when the Cal.com script cannot load (blocked, offline, or a 12-second silence).
 * BRIEF.md section 7d: a link to the Cal.com booking page built from config, and the design system's
 * InquiryForm wired to a Netlify form named "event-inquiry".
 *
 * Netlify Forms only sees forms in the built HTML, so the booking page renders a hidden static twin:
 *   <form name="event-inquiry" data-netlify="true" netlify-honeypot="bot-field" hidden>
 * with inputs named form-name, bot-field, name, partner, email, phone, eventType, date, guests, start-time,
 * message and terms. This island posts the same field names to "/" as application/x-www-form-urlencoded.
 *
 * The visitor agrees to the terms before sending: a required checkbox above the form (TermsCheckbox.tsx),
 * with the same words, the same three rules and the same link as the gate ahead of the booker. The ported
 * InquiryForm owns its form element and its submit button, and shows its confirmation as soon as its own
 * submit handler runs, so the check happens ahead of that handler: onSubmitCapture on the wrapper stops an
 * unticked send, shows a caution notice and puts focus on the box. A ticked send posts terms=yes with the
 * rest of the fields.
 *
 * Start time: since 2026-10-12 events run 8 AM to 8 PM every day, any start time, two-hour minimum, with
 * setup and breakdown inside booked time. The form asks for a start hour in a select (the InquiryForm's
 * timeField prop, logged in DESIGN-SYSTEM-CHANGES.md): every hour from 8 AM to 6 PM, the last start that
 * fits two hours before the gates lock. The posted field is "start-time" with a 24-hour value like "14:00".
 *
 * Sent view: the site fee is paid in full with the reservation and the reservation is confirmed once the
 * payment is processed (docs/TERMS-SOURCE.md, 1.1), so the confirmation text comes from here through the
 * InquiryForm's sentText prop (logged in DESIGN-SYSTEM-CHANGES.md). The component's own sentence states
 * the rule the brief had, which the terms document replaced.
 */
import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, InquiryForm, Notice } from '../ds';
import type { FieldOption } from '../ds';
import { CAL_BOOKING_PAGE_URL, SITE } from '../../config/site';
import { TermsCheckbox, TermsRules } from './TermsCheckbox';

/** The Netlify form name. The hidden static form on the booking page must use the same one. */
export const INQUIRY_FORM_NAME = 'event-inquiry';

/** The hill opens at 8 AM and the gates lock at 8 PM; the last start that fits a two-hour minimum is 6 PM. */
const FIRST_START_HOUR = 8;
const LAST_START_HOUR = 18;

/** "8 AM", "12 PM", "6 PM": figures for times, as the brand voice asks. */
function hourLabel(hour: number): string {
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** Every start hour on offer, 8 AM through 6 PM, as { value: '08:00', label: '8 AM' }. */
export const START_TIMES: FieldOption[] = Array.from({ length: LAST_START_HOUR - FIRST_START_HOUR + 1 }, (_, i) => {
  const hour = FIRST_START_HOUR + i;
  return { value: `${String(hour).padStart(2, '0')}:00`, label: hourLabel(hour) };
});

type SendState = 'idle' | 'sending' | 'sent' | 'error';

/** Posts one inquiry to Netlify Forms. Resolves on a 2xx answer, throws otherwise. */
async function postInquiry(data: Record<string, string>): Promise<void> {
  const body = new URLSearchParams({ 'form-name': INQUIRY_FORM_NAME, ...data }).toString();
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Netlify Forms answered ${res.status}`);
}

export default function InquiryFallback() {
  const [send, setSend] = useState<SendState>('idle');
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const boxRef = useRef<HTMLInputElement>(null);
  const errorId = 'inquiry-terms-error-' + useId().replace(/[^a-zA-Z0-9]/g, '');

  /** An unticked send: say why and put the visitor on the box. */
  const refuse = () => {
    setTermsError(true);
    boxRef.current?.focus();
  };

  // Runs in the capture phase, before the InquiryForm's own submit handler. With the box empty the
  // submit stops here, so the form stays open with everything typed in it.
  const guardSubmit = (e: FormEvent<HTMLDivElement>) => {
    if (agreed) return;
    e.preventDefault();
    e.stopPropagation();
    refuse();
  };

  // InquiryForm calls onSubmit, then shows its own confirmation right away. The post runs after
  // that; if it fails, the caution notice below tells the visitor and offers email instead.
  const handleSubmit = (data: Record<string, string>) => {
    if (!agreed) {
      // guardSubmit stops an unticked send before this runs; this keeps the post honest if it ever did not.
      refuse();
      return;
    }
    setSend('sending');
    postInquiry({ ...data, terms: 'yes' })
      .then(() => setSend('sent'))
      .catch(() => setSend('error'));
  };

  const agree = (checked: boolean) => {
    setAgreed(checked);
    if (checked) setTermsError(false);
  };

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent('Event inquiry')}`;

  return (
    <div className="inquiry-fallback" style={{ display: 'grid', gap: 'var(--space-6)' }} onSubmitCapture={guardSubmit}>
      <Notice tone="info" title="The booking calendar did not load">
        <p>You can book on Cal.com or send us your details and we will reply.</p>
      </Notice>

      <div
        className="inquiry-fallback__actions"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3) var(--space-5)' }}
      >
        <Button variant="secondary" href={CAL_BOOKING_PAGE_URL} icon="arrow-up-right" target="_blank" rel="noopener">
          Open the booking page<span className="sc-visually-hidden"> (opens in a new tab)</span>
        </Button>
        {/* The sighted note. The link already says it, so assistive tech skips this copy. */}
        <span className="caption" style={{ color: 'var(--ink-muted)' }} aria-hidden="true">
          Opens in a new tab.
        </span>
      </div>

      {send === 'error' && (
        <div className="inquiry-fallback__alert" role="alert">
          <Notice tone="caution" title="Your inquiry did not send">
            <p>
              The message did not reach us. Email the park office at <a href={mailto}>{SITE.email}</a> and we will
              reply.
            </p>
          </Notice>
        </div>
      )}

      {/* The agreement sits above the form because the form element and its button are the component's. */}
      {send === 'idle' && (
        <div className="inquiry-fallback__terms" style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <TermsRules />
          <TermsCheckbox
            checked={agreed}
            onChange={agree}
            required
            invalid={termsError}
            describedBy={termsError ? errorId : undefined}
            inputRef={boxRef}
          />
          {termsError && (
            <div id={errorId} role="alert">
              <Notice tone="caution" title="One thing before you send">
                <p>Tick the box to agree to the terms before sending.</p>
              </Notice>
            </div>
          )}
        </div>
      )}

      <InquiryForm
        onSubmit={handleSubmit}
        sent={send === 'sent'}
        sentText="The park office will reply by email about your date and the site fee. Your reservation is confirmed once the payment is processed."
        dateHelp="Bookings are at least two hours, any start time between 8 AM and 8 PM."
        timeField={{
          name: 'start-time',
          label: 'Start time',
          options: START_TIMES,
          help: 'Bookings are at least two hours. The hill closes at 8 PM.',
        }}
      />
    </div>
  );
}
