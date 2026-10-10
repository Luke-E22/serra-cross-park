import * as React from 'react';
import type { Choice } from './ds';
import { Button, ChoiceChips, Field, Icon, Notice } from './ds';
import { SITE } from '../config/site';

/** The Netlify form name. The hidden static copy in src/pages/contact.astro must use the same one. */
export const CONTACT_FORM_NAME = 'contact';

/**
 * What a message is about. The values are the readable labels, so the Netlify notification
 * reads "regarding: Booking an event" without a lookup. contact.astro reuses this list for
 * the hidden static copy of the form, so the field names and values match at build time.
 */
export const REGARDING_OPTIONS: Choice[] = [
  { value: 'Booking an event', label: 'Booking an event' },
  { value: 'Giving', label: 'Giving' },
  { value: 'Volunteering', label: 'Volunteering' },
  { value: 'History', label: 'History' },
  { value: 'Something else', label: 'Something else' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The contact form, a Netlify form named "contact". Hydrated with client:visible from
 * src/pages/contact.astro. Netlify registers the form from the hidden static copy on that
 * page (this form carries no data-netlify attribute, so Netlify's build step leaves its
 * markup alone and hydration matches). The submit posts the fields to "/" as
 * application/x-www-form-urlencoded with form-name included, which is how Netlify Forms
 * accept a JavaScript submission. Before hydration the form still posts natively to /contact/.
 */
export default function ContactForm() {
  const [status, setStatus] = React.useState<Status>('idle');
  // Controlled, starting empty, so no chip is checked until the visitor picks one.
  const [regarding, setRegarding] = React.useState('');
  const [regardingMissing, setRegardingMissing] = React.useState(false);
  const sentRef = React.useRef<HTMLDivElement>(null);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const honeypotId = `contact-bot-${uid}`;

  // The confirmation replaces the form, so focus moves to it and the status is read out.
  React.useEffect(() => {
    if (status === 'sent') sentRef.current?.focus();
  }, [status]);

  const pickRegarding = (value: string) => {
    setRegarding(value);
    setRegardingMissing(false);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    // The browser checks the required fields before this runs. The chips carry no required
    // attribute, so check them here, say what to do, and send focus to the first chip.
    if (!regarding) {
      setRegardingMissing(true);
      form.querySelector<HTMLInputElement>('input[name="regarding"]')?.focus();
      return;
    }

    setStatus('sending');
    const pairs: string[][] = [];
    new FormData(form).forEach((value, key) => pairs.push([key, String(value)]));
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(pairs).toString(),
      });
      if (!response.ok) throw new Error(`Netlify Forms answered ${response.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="sc-form sc-form--sent contact-form__sent" role="status" tabIndex={-1} ref={sentRef}>
        <p className="sc-form__done label">
          <Icon name="check" size={22} />
          Message sent
        </p>
        <h2 className="heading">Thank you</h2>
        <p className="body">
          We read every message and will reply from <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form
      className="sc-form contact-form"
      name={CONTACT_FORM_NAME}
      method="POST"
      action="/contact/"
      onSubmit={submit}
      aria-busy={sending || undefined}
    >
      <div>
        <h2 className="sc-form__title heading">Send a message</h2>
        {/* Every field is required, so the form says so once instead of marking each one. */}
        <p className="contact-form__required body-sm">All fields are required.</p>
      </div>
      <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />

      {/* Honeypot. Visually hidden, hidden from assistive tech and out of the tab order; Netlify drops any submission that fills it. */}
      <p className="sc-visually-hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Leave this field empty</label>
        <input id={honeypotId} name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="sc-form__grid">
        <Field label="First name" name="first-name" autoComplete="given-name" />
        <Field label="Last name" name="last-name" autoComplete="family-name" />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />

      <div className="contact-form__regarding">
        <ChoiceChips label="Regarding" name="regarding" options={REGARDING_OPTIONS} value={regarding} onChange={pickRegarding} />
        {regardingMissing && (
          <p className="sc-field__error body-sm contact-form__error" role="alert">
            <Icon name="circle-alert" size={18} />
            <span>Choose what your message is about.</span>
          </p>
        )}
      </div>

      <Field
        label="Message"
        name="message"
        type="textarea"
        rows={6}
        help="For a booking question, include the date you have in mind."
      />

      {status === 'error' && (
        <div role="alert">
          <Notice tone="caution" icon="circle-alert" title="The message did not send">
            <p>
              Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> instead.
            </p>
          </Notice>
        </div>
      )}

      <div className="sc-form__footer">
        <Button type="submit" variant="primary" size="lg" icon="arrow-right" disabled={sending}>
          {sending ? 'Sending' : 'Send message'}
        </Button>
        <p className="body-sm sc-form__note">We read every message and reply by email.</p>
      </div>
    </form>
  );
}
