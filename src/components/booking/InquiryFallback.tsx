/*
 * The fallback when the Cal.com script cannot load (blocked, offline, or a 12-second silence).
 * BRIEF.md section 7d: a link to the Cal.com booking page built from config, and the design system's
 * InquiryForm wired to a Netlify form named "event-inquiry".
 *
 * Netlify Forms only sees forms in the built HTML, so the booking page renders a hidden static twin:
 *   <form name="event-inquiry" data-netlify="true" netlify-honeypot="bot-field" hidden>
 * with inputs named form-name, bot-field, name, partner, email, phone, eventType, date, guests, block
 * and message. This island posts the same field names to "/" as application/x-www-form-urlencoded.
 */
import { useState } from 'react';
import { Button, InquiryForm, Notice } from '../ds';
import { CAL_BOOKING_PAGE_URL, SITE } from '../../config/site';

/** The Netlify form name. The hidden static form on the booking page must use the same one. */
export const INQUIRY_FORM_NAME = 'event-inquiry';

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

  // InquiryForm calls onSubmit, then shows its own confirmation right away. The post runs after
  // that; if it fails, the caution notice below tells the visitor and offers email instead.
  const handleSubmit = (data: Record<string, string>) => {
    setSend('sending');
    postInquiry(data)
      .then(() => setSend('sent'))
      .catch(() => setSend('error'));
  };

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent('Event inquiry')}`;

  return (
    <div className="inquiry-fallback" style={{ display: 'grid', gap: 'var(--space-6)' }}>
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

      <InquiryForm onSubmit={handleSubmit} sent={send === 'sent'} />
    </div>
  );
}
