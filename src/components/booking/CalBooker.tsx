/*
 * The Cal.com booker, built with @calcom/embed-react from Luke's snippet (BRIEF.md section 7c).
 *
 * What changed from the snippet: colors come from design-system/tokens.json (src/lib/cal-theme.ts),
 * the calLink carries the day the visitor picked, the container keeps its height so the page does not
 * jump, and the embed only mounts in the browser. When Cal.com reports a failure, or stays silent for
 * READY_TIMEOUT_MS, InquiryFallback takes its place.
 *
 * Event names: the 1.5.3 types know linkReady and linkFailed. Newer embed.js builds also fire
 * bookerReady (docs/INTEGRATION-NOTES.md), which arrives through the "*" listener below.
 */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { BOOKING } from '../../config/site';
import { CAL_LIGHT_VARS } from '../../lib/cal-theme';
import InquiryFallback from './InquiryFallback';

/**
 * Show "Choose <date> in the calendar below" above the embed. The public booking page honors
 * ?month= and ?date= (docs/INTEGRATION-NOTES.md). Checked inside the embed in a real browser on
 * 2026-10-09: picking October 24 opened the booker on October 2026 with the 24th selected and its
 * times listed, so the hint is off. Set it back to true if a Cal.com update stops honoring ?date=.
 */
const SHOW_PICK_HINT = false;

/** How long to wait for Cal.com before falling back. */
const READY_TIMEOUT_MS = 12_000;

/** A chosen day, as the availability calendar sends it. */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

type CalApi = Awaited<ReturnType<typeof getCalApi>>;
type LoadState = 'loading' | 'ready' | 'failed';

/** Same vars for both keys: the design system has one theme, the embed's type wants both. theme is pinned to light. */
const CSS_VARS_PER_THEME = { light: CAL_LIGHT_VARS, dark: CAL_LIGHT_VARS };

/** The query the iframe gets, from Luke's snippet. Stable so the embed's effect does not re-run. */
const EMBED_CONFIG = { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' } as const;

const EMBED_STYLE: CSSProperties = { width: '100%', height: '100%', overflow: 'auto' };

/**
 * The box the embed fills. 720px tall, 560px under 720px wide, so the server-rendered page already
 * holds the room before any script runs. Inline styles cannot carry a media query, so the step is a
 * CSS calculation: (100vw - 719px) * 1000 is at least 1000px from 720px wide up and at most 0 below it.
 */
const BOX_STYLE: CSSProperties = {
  width: '100%',
  minHeight: 'min(720px, max(560px, calc((100vw - 719px) * 1000)))',
  overflow: 'auto',
};

const HINT_STYLE: CSSProperties = { margin: '0 0 var(--space-3)', color: 'var(--ink-muted)' };

export interface CalBookerProps {
  /** The chosen day as YYYY-MM-DD, or null to open on the current month. */
  date: string | null;
  /** id of the heading that names this region, for example "Book Saturday, November 14". */
  headingId?: string;
}

/** `serra-cross-park/reserve`, plus `?month=YYYY-MM&date=YYYY-MM-DD` when a day was picked. */
function calLinkFor(date: string | null): string {
  const base = `${BOOKING.calUsername}/${BOOKING.calEventSlug}`;
  if (!date) return base;
  return `${base}?month=${date.slice(0, 7)}&date=${date}`;
}

/** "November 14" from "2026-11-14". Built in UTC so no time zone shifts the day. */
function formatPickDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function CalBooker({ date, headingId }: CalBookerProps) {
  const day = date && ISO_DAY.test(date) ? date : null;
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<LoadState>('loading');
  const readyRef = useRef(false);

  // The embed exists only in the browser. The server sends the box alone.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    let api: CalApi | null = null;

    const markReady = () => {
      if (cancelled) return;
      readyRef.current = true;
      setState('ready');
    };
    const markFailed = () => {
      if (cancelled) return;
      setState('failed');
    };
    const onLinkFailed = () => markFailed();
    const onLinkReady = () => markReady();
    const onAny = (e: CustomEvent<{ type: string }>) => {
      if (e.detail.type === 'bookerReady') markReady();
    };

    // Silence means the script was blocked or never answered. If getCalApi has resolved, the
    // embed still may be loading slowly; the fallback keeps a link to Cal.com either way.
    const timer = window.setTimeout(() => {
      if (!readyRef.current) markFailed();
    }, READY_TIMEOUT_MS);

    (async () => {
      const cal = await getCalApi({ namespace: BOOKING.calEventSlug });
      if (cancelled) return;
      api = cal;
      cal('ui', {
        theme: 'light',
        cssVarsPerTheme: CSS_VARS_PER_THEME,
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
      cal('on', { action: 'linkFailed', callback: onLinkFailed });
      cal('on', { action: 'linkReady', callback: onLinkReady });
      cal('on', { action: '*', callback: onAny });
    })().catch(markFailed);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (api) {
        api('off', { action: 'linkFailed', callback: onLinkFailed });
        api('off', { action: 'linkReady', callback: onLinkReady });
        api('off', { action: '*', callback: onAny });
      }
    };
  }, [mounted]);

  return (
    <div className="cal-booker" role={headingId ? 'region' : undefined} aria-labelledby={headingId}>
      {state === 'failed' ? (
        <InquiryFallback />
      ) : (
        <>
          {SHOW_PICK_HINT && day && (
            <p className="cal-booker__hint body-sm" style={HINT_STYLE}>
              Choose {formatPickDate(day)} in the calendar below if it is not already selected.
            </p>
          )}
          <div className="cal-booker__embed" style={BOX_STYLE} aria-busy={state === 'loading'}>
            {state === 'loading' && (
              <p className="sc-visually-hidden" role="status">
                Loading the booking calendar.
              </p>
            )}
            {mounted && (
              <Cal
                key={day ?? 'any'}
                namespace={BOOKING.calEventSlug}
                calLink={calLinkFor(day)}
                style={EMBED_STYLE}
                config={EMBED_CONFIG}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
