import { useEffect, useRef, useState } from 'react';
import type { IframeHTMLAttributes } from 'react';
import { Button } from './ds';

/**
 * The Zeffy donation form as a React island (client:visible on the Donate page).
 *
 * Server render: the `[data-zeffy-embed]` container Zeffy's script looks for, plus a <noscript>
 * give button for visitors without JavaScript. On mount the island loads Zeffy's embed script
 * once (or reuses it when `window.Zeffy` is already there) and watches the container for the
 * iframe the script injects. If the script fails to load, or no iframe has appeared after
 * TIMEOUT_MS, the container is replaced by the fallback: a give button that opens the form in a
 * new tab, and a plain iframe of the embed URL. The script container and the plain iframe are
 * never in the DOM at the same time, so the form never loads twice.
 *
 * The embed contract (attributes, script URL, postMessage sizing, `window.Zeffy.embed.init()`)
 * is in docs/INTEGRATION-NOTES.md, Zeffy section.
 */

/** Zeffy's embed script, v2. */
export const ZEFFY_SCRIPT_SRC = 'https://www.zeffy.com/embed/v2/zeffy-embed.js';
/** Height reserved for the form until Zeffy reports its own, in px. Zeffy's own fallback uses the same figure. */
const MIN_HEIGHT = 800;
/** How long the script gets to put its iframe in the container before the fallback takes over. */
const TIMEOUT_MS = 8000;

declare global {
  interface Window {
    Zeffy?: { embed?: { init?: () => void } };
  }
}

export interface ZeffyEmbedProps {
  /** The public form URL (PAYMENTS.donateUrl). The embed URL is derived from it with toZeffyEmbedUrl. */
  formUrl: string;
  /** Accessible name for the form region, for example "Donation form". */
  label: string;
}

type Status = 'idle' | 'loading' | 'ready' | 'fallback';

/** A language segment such as "en-US" or "en-us" at the start of a Zeffy path. */
const LANG_SEGMENT = /^[a-z]{2}(-[a-z]{2})?$/i;

/**
 * The embed URL for a Zeffy form: "/embed" goes right after the language segment, or first when
 * there is none. A URL that already has it comes back unchanged, and so does anything that is
 * not a URL at all.
 *
 *   https://www.zeffy.com/en-US/donation-form/<slug> -> https://www.zeffy.com/en-US/embed/donation-form/<slug>
 *   https://www.zeffy.com/donation-form/<slug>       -> https://www.zeffy.com/embed/donation-form/<slug>
 */
export function toZeffyEmbedUrl(formUrl: string): string {
  let url: URL;
  try {
    url = new URL(formUrl);
  } catch {
    return formUrl;
  }
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0];
  const at = first !== undefined && LANG_SEGMENT.test(first) ? 1 : 0;
  if (segments[at] !== 'embed') segments.splice(at, 0, 'embed');
  url.pathname = '/' + segments.join('/');
  return url.href;
}

/**
 * What goes in `data-form-url`. Zeffy's embed script (v2.0.0) treats the attribute as a path: it
 * prepends "/" unless the string already starts with one, then resolves it against
 * https://www.zeffy.com. A full URL there becomes https://www.zeffy.com/https://www.zeffy.com/...
 * and the form 404s inside the iframe (seen in a browser on 2026-10-09). So the container gets the
 * path and query of the embed URL, and only the plain fallback iframe gets the full URL.
 */
export function toZeffyEmbedPath(formUrl: string): string {
  const embedUrl = toZeffyEmbedUrl(formUrl);
  try {
    const url = new URL(embedUrl);
    return url.pathname + url.search;
  } catch {
    return embedUrl.startsWith('/') ? embedUrl : '/' + embedUrl;
  }
}

/**
 * `allowpaymentrequest` is the attribute Zeffy's own iframe carries. React 18 has no DOM mapping
 * for it, but lowercase unknown attributes pass straight through; the cast keeps TypeScript happy.
 */
const PAYMENT_ATTRS = { allow: 'payment', allowpaymentrequest: 'true' } as IframeHTMLAttributes<HTMLIFrameElement>;

const STATUS_TEXT: Record<Status, string> = {
  idle: '',
  loading: 'Loading the donation form.',
  ready: '',
  fallback: 'The form is slow to load here. You can give on Zeffy’s site instead, in a new tab.',
};

function GiveOnZeffy({ href }: { href: string }) {
  return (
    <div className="zeffy__actions">
      <Button variant="give" size="lg" icon="hand-heart" href={href} target="_blank" rel="noopener">
        Give on Zeffy<span className="sc-visually-hidden"> (opens in a new tab)</span>
      </Button>
      {/* The sighted note. The link already says it, so assistive tech skips this copy. */}
      <span className="zeffy__note caption" aria-hidden="true">
        Opens in a new tab.
      </span>
    </div>
  );
}

export default function ZeffyEmbed({ formUrl, label }: ZeffyEmbedProps) {
  const embedUrl = toZeffyEmbedUrl(formUrl);
  const embedPath = toZeffyEmbedPath(formUrl);
  const [status, setStatus] = useState<Status>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let settled = false;
    let timer: number | undefined;
    let observer: MutationObserver | undefined;
    let script: HTMLScriptElement | null = null;

    const hasIframe = () => container.querySelector('iframe') !== null;
    // The script scans for containers when it runs; init() is safe to call again because it
    // skips anything marked data-zeffy-initialized.
    const onLoad = () => window.Zeffy?.embed?.init?.();
    const onError = () => settle('fallback');

    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
    function settle(next: 'ready' | 'fallback') {
      if (settled) return;
      settled = true;
      stop();
      setStatus(next);
    }

    setStatus('loading');

    // Wait for the iframe the script injects. Checked once now in case it is already there.
    observer = new MutationObserver(() => {
      if (hasIframe()) settle('ready');
    });
    observer.observe(container, { childList: true, subtree: true });
    if (hasIframe()) {
      settle('ready');
      return stop;
    }

    timer = window.setTimeout(() => settle(hasIframe() ? 'ready' : 'fallback'), TIMEOUT_MS);

    if (window.Zeffy?.embed?.init) {
      window.Zeffy.embed.init();
    } else {
      script = document.querySelector<HTMLScriptElement>(`script[src="${ZEFFY_SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = ZEFFY_SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
    }

    return stop;
  }, []);

  return (
    <div className="zeffy" role="region" aria-label={label}>
      {/* Always in the DOM so screen readers announce the text when it changes. Empty when idle or ready. */}
      <p className="zeffy__status caption" role="status">
        {STATUS_TEXT[status]}
      </p>

      {status === 'fallback' ? (
        <div className="zeffy__fallback">
          <GiveOnZeffy href={formUrl} />
          <iframe
            className="zeffy__iframe"
            title="Donation form powered by Zeffy"
            src={embedUrl}
            style={{ minHeight: MIN_HEIGHT, width: '100%', border: 0 }}
            {...PAYMENT_ATTRS}
          />
        </div>
      ) : (
        /* The inline min-height reserves the space before the script runs, so the section does not
           jump when it loads. Zeffy's script sets the container's height itself (data-min-height is
           its starting height, then its resized messages set the form's real height), so the
           reservation goes once the iframe is in place and the script owns the size. */
        <div
          ref={containerRef}
          data-zeffy-embed=""
          data-form-url={embedPath}
          data-min-height={String(MIN_HEIGHT)}
          style={status === 'ready' ? undefined : { minHeight: MIN_HEIGHT }}
        />
      )}

      <noscript>
        <GiveOnZeffy href={formUrl} />
      </noscript>
    </div>
  );
}
