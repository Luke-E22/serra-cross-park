/**
 * The availability calendar on the booking page: a month grid of Open, Partly booked and
 * Booked days drawn over GET /api/availability (netlify/functions/availability.mts; the
 * response is typed in src/lib/availability.ts). Picking an open or partly booked day opens the
 * booking area under the grid. Booking never depends on the endpoint: when the fetch fails, the
 * booking area renders at once with no date.
 *
 * Before the Cal.com booker (CalBooker) mounts, on either path, the visitor agrees to the terms
 * and conditions: TermsGate stands where the booker will appear, and ticking its box mounts the
 * booker beneath it. The agreement is kept for the visit in sessionStorage (terms-agreement.ts),
 * so choosing another day shows one line instead of the panel.
 *
 * Dates are 'YYYY-MM-DD' strings and all date math runs through Date.UTC in calendar-grid.ts,
 * never the visitor's local time zone, so every label matches the key it describes.
 *
 * The booking page renders this island with client:visible and passes BOOKING.horizonMonths,
 * BOOKING.timeZone and the park office's email.
 */
import * as React from 'react';
import type { AvailabilityResponse, DaySummary } from '../../lib/availability';
import { Button, Icon, Notice } from '../ds';
import type { Ym, Ymd } from './calendar-grid';
import {
  addMonths,
  clamp,
  compare,
  dayOfMonth,
  dayOfWeek,
  daysInMonth,
  firstOfMonth,
  formatBookDate,
  formatLongDate,
  formatMonth,
  isYmd,
  lastOfMonth,
  monthGrid,
  shiftDays,
  WEEKDAYS,
  ymOf,
  ymd,
} from './calendar-grid';
import { readAgreement, sessionStore, writeAgreement } from './terms-agreement';
import { TermsCheckbox, TermsLink, TermsRules } from './TermsCheckbox';
import './availability-calendar.css';

export { monthGrid } from './calendar-grid';

// The embed code (@calcom/embed-react) loads only after a day is picked, or in the fallback.
const CalBooker = React.lazy(() => import('./CalBooker'));

export interface AvailabilityCalendarProps {
  /** Months ahead the calendar may show. The endpoint's own start and end win when present. */
  horizonMonths: number;
  /** IANA zone the endpoint works in, for example America/Los_Angeles. Named under the legend. */
  timeZone: string;
  /** Ask the endpoint for fixture data (local dev). ?fixture=1 on the page URL does the same. */
  fixture?: boolean;
  /** The park office's email, as a mailto: link or a bare address. */
  emailHref: string;
}

type Phase = 'loading' | 'ready' | 'error';
type DayKind = 'open' | 'partial' | 'booked' | 'na';
type DayMap = Record<string, DaySummary>;

const TWO_UP_QUERY = '(min-width: 1100px)';
const BOOK_HEADING_ID = 'book-heading';

/** The four looks a day can have. Past, closed, soon and notyet all read as not available online. */
function kindOf(day: DaySummary | undefined): DayKind {
  if (!day) return 'na';
  if (day.status === 'open' || day.status === 'partial' || day.status === 'booked') return day.status;
  return 'na';
}

/** Open, partly booked and booked days take clicks and keyboard focus. The rest are inert. */
function isEnabled(day: DaySummary | undefined): boolean {
  return kindOf(day) !== 'na';
}

/** Only open and partly booked days open the booker. */
function isSelectable(day: DaySummary | undefined): boolean {
  const kind = kindOf(day);
  return kind === 'open' || kind === 'partial';
}

/** The button's full name, for example "Saturday, November 14, 2026. Partly booked, 2 of 3 times open." */
function dayLabel(date: Ymd, day: DaySummary | undefined): string {
  const name = formatLongDate(date);
  const kind = kindOf(day);
  if (kind === 'open' && day) return `${name}. Open, ${day.open} ${day.open === 1 ? 'time' : 'times'} available.`;
  if (kind === 'partial' && day) return `${name}. Partly booked, ${day.open} of ${day.of} times open.`;
  if (kind === 'booked') return `${name}. Booked.`;
  return `${name}. Not available online.`;
}

function mailto(href: string): string {
  return /^mailto:/i.test(href) ? href : `mailto:${href}`;
}

/** "Pacific Time" for America/Los_Angeles. Falls back to the zone's own name. */
function zoneName(timeZone: string): string {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longGeneric' })
      .formatToParts(new Date(0))
      .find((p) => p.type === 'timeZoneName');
    if (part && part.value) return part.value;
  } catch {
    // An unknown zone or an older engine: use the IANA name below.
  }
  return timeZone.replace(/_/g, ' ');
}

/** A square half filled on the diagonal: the Partly booked mark. Decorative; the words carry it. */
function HalfMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
      <path d="M0.5 0.5h11v11h-11z" fill="none" stroke="currentColor" />
      <path d="M11.5 0.5v11h-11z" fill="currentColor" />
    </svg>
  );
}

const LEGEND: ReadonlyArray<{ kind: DayKind; words: string }> = [
  { kind: 'open', words: 'Open' },
  { kind: 'partial', words: 'Partly booked' },
  { kind: 'booked', words: 'Booked' },
  { kind: 'na', words: 'Not available online' },
];

/** Each entry shows a sample day drawn exactly like its cells, beside the words. */
function Legend() {
  return (
    <ul className="avail__legend" aria-label="Legend" role="list">
      {LEGEND.map(({ kind, words }) => (
        <li key={kind} className="avail__legend-item">
          <span className={`avail__swatch avail__swatch--${kind}`} aria-hidden="true">
            <span className="avail__num label">12</span>
            {kind === 'partial' && <HalfMark className="avail__mark" />}
          </span>
          <span className="body-sm">{words}</span>
        </li>
      ))}
    </ul>
  );
}

/** Sun to Sat. Hidden from assistive tech: every day button already says its weekday. */
function WeekdayRow() {
  return (
    <div className="avail__weekdays label" aria-hidden="true">
      {WEEKDAYS.map((w) => (
        <abbr key={w.short} title={w.long}>
          {w.short}
        </abbr>
      ))}
    </div>
  );
}

/** The quiet placeholder while availability loads: the same cells on surface-alt. */
function SkeletonMonth() {
  return (
    <div className="avail__month avail__month--skeleton" aria-hidden="true">
      <span className="avail__heading avail__heading--skeleton" />
      <WeekdayRow />
      <div className="avail__grid">
        {Array.from({ length: 6 }, (_, w) => (
          <div className="avail__week" key={w}>
            {Array.from({ length: 7 }, (_, d) => (
              <span className="avail__day avail__day--skeleton" key={d} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TermsGateProps {
  agreed: boolean;
  /** True from the tick until the next pick: the panel stays up with the box checked and the booker beneath. */
  fresh: boolean;
  onChange: (checked: boolean) => void;
  panelRef: React.RefObject<HTMLDivElement>;
  titleRef: React.RefObject<HTMLHeadingElement>;
}

/**
 * The agreement before the booker. Until the visitor ticks the box the booker does not mount. Once
 * agreed in an earlier view (sessionStorage, see terms-agreement.ts) the panel is one line. The
 * panel names the four rules in bold (TermsRules) above the box, so no one books without seeing them.
 * The words are the board reviewer's (notes of 2026-10-14), tidied into the brand voice.
 */
function TermsGate({ agreed, fresh, onChange, panelRef, titleRef }: TermsGateProps) {
  if (agreed && !fresh) {
    return (
      <p className="avail__terms-done body-sm">
        <Icon name="check" size={18} />
        <span>
          You agreed to the <TermsLink />.
        </span>
      </p>
    );
  }
  return (
    <div className="avail__terms" ref={panelRef}>
      <h3 className="avail__terms-title heading-sm" tabIndex={-1} ref={titleRef}>
        Before you book
      </h3>
      <p className="avail__terms-text body-sm">
        Reserving a date means agreeing to Serra Cross Park's terms and conditions, which set out every rule. Please read
        them. Check the box to agree and continue with your reservation. Important highlights:
      </p>
      <TermsRules className="avail__terms-rules" />
      <TermsCheckbox checked={agreed} onChange={onChange} />
    </div>
  );
}

interface DayCellProps {
  date: Ymd;
  day: DaySummary | undefined;
  selected: boolean;
  tabbable: boolean;
  onPick: (date: Ymd, day: DaySummary) => void;
  onFocus: (date: Ymd) => void;
}

function DayCell({ date, day, selected, tabbable, onPick, onFocus }: DayCellProps) {
  const kind = kindOf(day);
  const enabled = kind !== 'na';
  const className = ['avail__day', `avail__day--${kind}`, selected ? 'is-selected' : ''].filter(Boolean).join(' ');
  const handleClick = () => {
    if (day && enabled) onPick(date, day);
  };
  return (
    <button
      type="button"
      className={className}
      aria-label={dayLabel(date, day)}
      aria-pressed={isSelectable(day) ? selected : undefined}
      disabled={!enabled}
      aria-disabled={enabled ? undefined : true}
      tabIndex={enabled && tabbable ? 0 : -1}
      data-ymd={date}
      onClick={handleClick}
      onFocus={() => onFocus(date)}
    >
      <span className="avail__num label-lg">{dayOfMonth(date)}</span>
      {kind === 'partial' && <HalfMark className="avail__mark" />}
      {kind === 'partial' && day && (
        <span className="avail__detail caption">
          {day.open} of {day.of} open
        </span>
      )}
      {kind === 'booked' && <span className="avail__detail caption">booked</span>}
      {selected && <Icon name="check" size={16} className="avail__check" />}
    </button>
  );
}

interface MonthViewProps {
  month: Ym;
  days: DayMap;
  selected: Ymd | null;
  /** The one day in this month that sits in the tab order (roving tabindex). */
  tabbable: Ymd | null;
  onPick: (date: Ymd, day: DaySummary) => void;
  onFocus: (date: Ymd) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

function MonthView({ month, days, selected, tabbable, onPick, onFocus, onKeyDown }: MonthViewProps) {
  const headingId = `avail-month-${month}`;
  const weeks = React.useMemo(() => monthGrid(month), [month]);
  return (
    <div className="avail__month">
      <h3 className="avail__heading heading-sm" id={headingId}>
        {formatMonth(month)}
      </h3>
      <WeekdayRow />
      {/* tabIndex -1 lets the grid itself take focus when a month has no day to land on. */}
      <div className="avail__grid" role="group" aria-labelledby={headingId} data-ym={month} tabIndex={-1} onKeyDown={onKeyDown}>
        {weeks.map((week, w) => (
          <div className="avail__week" key={w}>
            {week.map((date, d) =>
              date ? (
                <DayCell
                  key={date}
                  date={date}
                  day={days[date]}
                  selected={selected === date}
                  tabbable={tabbable === date}
                  onPick={onPick}
                  onFocus={onFocus}
                />
              ) : (
                <span className="avail__pad" key={`pad-${d}`} aria-hidden="true" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({ horizonMonths, timeZone, fixture = false, emailHref }: AvailabilityCalendarProps) {
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [data, setData] = React.useState<AvailabilityResponse | null>(null);
  const [viewMonth, setViewMonth] = React.useState<Ym | null>(null);
  const [twoUp, setTwoUp] = React.useState(false);
  const [selected, setSelected] = React.useState<Ymd | null>(null);
  // Counts picks so choosing the same day again still scrolls back to the booker.
  const [pickCount, setPickCount] = React.useState(0);
  // The day that last had keyboard focus; it keeps the tab stop where the visitor left it.
  const [active, setActive] = React.useState<Ymd | null>(null);
  const [bookedPick, setBookedPick] = React.useState<Ymd | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const [focusRequest, setFocusRequest] = React.useState<{ date: Ymd; n: number } | null>(null);
  // Whether the visitor has agreed to the terms. Read from sessionStorage once, lazily: the gate is
  // never in the server markup or the first client render (nothing is picked and the endpoint has
  // not answered yet), so the stored value cannot cause a hydration mismatch.
  const [agreed, setAgreed] = React.useState<boolean>(() => readAgreement(sessionStore()));
  // True from the tick until the next pick: the panel stays up, box checked, booker beneath.
  const [freshAgree, setFreshAgree] = React.useState(false);
  // Counts ticks so the booker heading takes focus each time the box is checked.
  const [agreeCount, setAgreeCount] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const termsRef = React.useRef<HTMLDivElement>(null);
  const termsTitleRef = React.useRef<HTMLHeadingElement>(null);

  // Fetch once on mount. ?fixture=1 on the page URL, or the prop, asks for fixture data.
  React.useEffect(() => {
    const controller = new AbortController();
    let useFixture = fixture;
    try {
      if (new URLSearchParams(window.location.search).get('fixture') === '1') useFixture = true;
    } catch {
      // No usable location: keep the prop.
    }
    const url = `/api/availability${useFixture ? '?fixture=1' : ''}`;
    fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`availability responded ${res.status}`);
        const body = (await res.json()) as Partial<AvailabilityResponse> | null;
        if (!body || typeof body !== 'object' || !isYmd(body.start) || !body.days || typeof body.days !== 'object') {
          throw new Error('availability returned an unexpected shape');
        }
        setData(body as AvailabilityResponse);
        setViewMonth(ymOf(body.start));
        setPhase('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setPhase('error');
      });
    return () => controller.abort();
  }, [fixture]);

  // Two months side by side from 1100px, one below. Kept in state so the keyboard handling
  // and the live region know what is on screen.
  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(TWO_UP_QUERY);
    const apply = () => setTwoUp(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  // The months the calendar may show: from the endpoint's start month to its end month, or
  // horizonMonths ahead when the response carries no usable end.
  const horizon = React.useMemo(() => {
    if (!data) return null;
    const first = ymOf(data.start);
    const fromEnd = isYmd(data.end) ? ymOf(data.end) : null;
    const last = fromEnd && compare(fromEnd, first) >= 0 ? fromEnd : addMonths(first, Math.max(0, Math.floor(horizonMonths)));
    return { first, last, minDay: firstOfMonth(first), maxDay: lastOfMonth(last) };
  }, [data, horizonMonths]);

  const days: DayMap = data ? data.days : {};

  /** True when a second month fits beside `month` inside the horizon. */
  const pairFits = (month: Ym): boolean => !!horizon && twoUp && compare(addMonths(month, 1), horizon.last) <= 0;

  const maxView: Ym | null = horizon
    ? twoUp && compare(horizon.last, horizon.first) > 0
      ? addMonths(horizon.last, -1)
      : horizon.last
    : null;
  const view: Ym | null = horizon && maxView && viewMonth ? clamp(viewMonth, horizon.first, maxView) : viewMonth;
  const visible: Ym[] = view ? (pairFits(view) ? [view, addMonths(view, 1)] : [view]) : [];

  const canPrev = !!(horizon && view) && compare(view, horizon.first) > 0;
  const canNext = !!(view && maxView) && compare(view, maxView) < 0;

  const announce = (month: Ym) => {
    setAnnouncement(
      pairFits(month) ? `Showing ${formatMonth(month)} and ${formatMonth(addMonths(month, 1))}` : `Showing ${formatMonth(month)}`,
    );
  };
  const showMonth = (month: Ym) => {
    setViewMonth(month);
    announce(month);
  };
  const goPrev = () => {
    if (view && canPrev) showMonth(addMonths(view, -1));
  };
  const goNext = () => {
    if (view && canNext) showMonth(addMonths(view, 1));
  };

  /** Shift the view so `month` is on screen, leaving it alone when it already is. */
  const ensureVisible = (month: Ym) => {
    if (!view || !horizon || !maxView) return;
    const lastVisible = visible[visible.length - 1] ?? view;
    if (compare(month, view) >= 0 && compare(month, lastVisible) <= 0) return;
    const target = compare(month, view) < 0 ? month : addMonths(month, pairFits(view) ? -1 : 0);
    showMonth(clamp(target, horizon.first, maxView));
  };

  const pick = (date: Ymd, day: DaySummary) => {
    if (isSelectable(day)) {
      setBookedPick(null);
      setSelected(date);
      setPickCount((n) => n + 1);
      // A new view of the gate: an agreement from before shows as the one line.
      setFreshAgree(false);
    } else if (day.status === 'booked') {
      setBookedPick(date);
    }
  };

  /** The checkbox in the gate. Ticking it mounts the booker; clearing it takes the booker down again. */
  const agree = (checked: boolean) => {
    setAgreed(checked);
    setFreshAgree(checked);
    writeAgreement(sessionStore(), checked);
    if (checked) setAgreeCount((n) => n + 1);
  };

  const noteFocus = (date: Ymd) => setActive(date);

  const enabledAt = (date: Ymd): boolean => isEnabled(days[date]);
  const inHorizon = (date: Ymd): boolean =>
    !!horizon && compare(date, horizon.minDay) >= 0 && compare(date, horizon.maxDay) <= 0;

  /** Step by `step` days until an enabled day turns up inside the horizon; null when none does. */
  const seek = (from: Ymd, step: number): Ymd | null => {
    let cursor = shiftDays(from, step);
    while (inHorizon(cursor)) {
      if (enabledAt(cursor)) return cursor;
      cursor = shiftDays(cursor, step);
    }
    return null;
  };

  /** The first or last enabled day of `from`'s week inside its month; null when there is none before or after `from`. */
  const weekEdge = (from: Ymd, edge: 'start' | 'end'): Ymd | null => {
    const weekday = dayOfWeek(from);
    const month = ymOf(from);
    if (edge === 'start') {
      let cursor = shiftDays(from, -weekday);
      if (compare(cursor, firstOfMonth(month)) < 0) cursor = firstOfMonth(month);
      for (; compare(cursor, from) < 0; cursor = shiftDays(cursor, 1)) if (enabledAt(cursor)) return cursor;
      return null;
    }
    let cursor = shiftDays(from, 6 - weekday);
    if (compare(cursor, lastOfMonth(month)) > 0) cursor = lastOfMonth(month);
    for (; compare(cursor, from) > 0; cursor = shiftDays(cursor, -1)) if (enabledAt(cursor)) return cursor;
    return null;
  };

  /** The same day number `offset` months away (or that month's last day), else the nearest enabled day in that month. */
  const monthJump = (from: Ymd, offset: number): { month: Ym; date: Ymd | null } | null => {
    if (!horizon) return null;
    const month = addMonths(ymOf(from), offset);
    if (compare(month, horizon.first) < 0 || compare(month, horizon.last) > 0) return null;
    const [y, m] = month.split('-').map(Number);
    const wanted = ymd(y, m, Math.min(dayOfMonth(from), daysInMonth(y, m)));
    if (enabledAt(wanted)) return { month, date: wanted };
    for (let c = shiftDays(wanted, 1); ymOf(c) === month; c = shiftDays(c, 1)) if (enabledAt(c)) return { month, date: c };
    for (let c = shiftDays(wanted, -1); ymOf(c) === month; c = shiftDays(c, -1)) if (enabledAt(c)) return { month, date: c };
    return { month, date: null };
  };

  const requestFocus = (date: Ymd) => {
    setActive(date);
    setFocusRequest((prev) => ({ date, n: (prev?.n ?? 0) + 1 }));
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const from = (event.target as HTMLElement).dataset?.ymd;
    if (!from || !isYmd(from) || !horizon) return;
    let next: Ymd | null = null;
    let jump: { month: Ym; date: Ymd | null } | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = seek(from, -1);
        break;
      case 'ArrowRight':
        next = seek(from, 1);
        break;
      case 'ArrowUp':
        next = seek(from, -7);
        break;
      case 'ArrowDown':
        next = seek(from, 7);
        break;
      case 'Home':
        next = weekEdge(from, 'start');
        break;
      case 'End':
        next = weekEdge(from, 'end');
        break;
      case 'PageUp':
        jump = monthJump(from, -1);
        break;
      case 'PageDown':
        jump = monthJump(from, 1);
        break;
      default:
        return; // Enter and Space are the button's own click.
    }
    event.preventDefault();
    if (jump) {
      ensureVisible(jump.month);
      requestFocus(jump.date ?? firstOfMonth(jump.month));
      return;
    }
    if (next) {
      ensureVisible(ymOf(next));
      requestFocus(next);
    }
  };

  // Move focus once the requested day is in the DOM. With no enabled day to land on, the
  // month's grid takes focus instead so the keyboard is not stranded.
  React.useEffect(() => {
    if (!focusRequest || !rootRef.current) return;
    const root = rootRef.current;
    const button = root.querySelector<HTMLButtonElement>(`[data-ymd="${focusRequest.date}"]`);
    if (button && !button.disabled) {
      button.focus();
      return;
    }
    root.querySelector<HTMLElement>(`[data-ym="${ymOf(focusRequest.date)}"]`)?.focus();
  }, [focusRequest]);

  // After a pick: bring the booking area into view and give it focus. Once the visitor has agreed
  // that is the booker's heading; before, the gate stands in its place and its title takes the
  // focus. `agreed` is read here, not depended on: ticking the box has its own effect below and
  // must not scroll the panel away.
  React.useEffect(() => {
    if (!selected || pickCount === 0) return;
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    if (agreed) {
      const heading = headingRef.current;
      if (!heading) return;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    const title = termsTitleRef.current;
    if (!title) return;
    title.focus({ preventScroll: true });
    (termsRef.current ?? title).scrollIntoView({ behavior, block: 'start' });
  }, [selected, pickCount]);

  // Ticking the box mounts the booker. Its heading takes focus so the visitor lands on it; the
  // browser scrolls only as far as it must, so the panel stays in view above.
  React.useEffect(() => {
    if (agreeCount === 0) return;
    headingRef.current?.focus();
  }, [agreeCount]);

  /** One tab stop per month: the day last focused there, else the selected day, else the first enabled day. */
  const tabbableIn = (month: Ym): Ymd | null => {
    if (active && ymOf(active) === month && enabledAt(active)) return active;
    if (selected && ymOf(selected) === month) return selected;
    for (const week of monthGrid(month)) for (const date of week) if (date && enabledAt(date)) return date;
    return null;
  };

  const zone = React.useMemo(() => zoneName(timeZone), [timeZone]);
  const bookingHeading = (text: string) => (
    <h3 id={BOOK_HEADING_ID} className="avail__book-heading heading-sm" tabIndex={-1} ref={headingRef}>
      {text}
    </h3>
  );
  const loadingLine = <p className="avail__loading body-sm">Loading the booking calendar</p>;
  const termsGate = (
    <TermsGate agreed={agreed} fresh={freshAgree} onChange={agree} panelRef={termsRef} titleRef={termsTitleRef} />
  );

  if (phase === 'error') {
    return (
      <div className="avail avail--fallback" ref={rootRef}>
        <Notice tone="info" title="Live availability is not loading right now">
          You can still pick a date below.
        </Notice>
        <div className="avail__book">
          {termsGate}
          {agreed && (
            <>
              {bookingHeading('Book a date')}
              <React.Suspense fallback={loadingLine}>
                <CalBooker date={null} headingId={BOOK_HEADING_ID} />
              </React.Suspense>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="avail" ref={rootRef}>
      <div className="avail__cal">
        <div className="avail__top">
          <div className="avail__key">
            <Legend />
            <p className="avail__zone caption">Dates and times are in {zone}.</p>
          </div>
          <div className="avail__nav">
            <Button
              variant="secondary"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label={canPrev && view ? `Previous month, ${formatMonth(addMonths(view, -1))}` : 'Previous month'}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={goNext}
              disabled={!canNext}
              aria-label={canNext && view ? `Next month, ${formatMonth(addMonths(view, 1))}` : 'Next month'}
            >
              Next
            </Button>
          </div>
        </div>

        {phase === 'loading' ? (
          <>
            <p className="sc-visually-hidden">Loading availability</p>
            <div className="avail__months" aria-busy="true">
              <SkeletonMonth />
              <SkeletonMonth />
            </div>
          </>
        ) : (
          <div className="avail__months">
            {visible.map((month) => (
              <MonthView
                key={month}
                month={month}
                days={days}
                selected={selected}
                tabbable={tabbableIn(month)}
                onPick={pick}
                onFocus={noteFocus}
                onKeyDown={onGridKeyDown}
              />
            ))}
          </div>
        )}

        <div className="sc-visually-hidden" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </div>

      {/* Always in the tree so the line is announced when it appears; it takes no space while empty. */}
      <div className="avail__status body-sm" role="status">
        {bookedPick && (
          <p>
            That date is booked. Try a nearby date or <a href={mailto(emailHref)}>contact the park office</a>.
          </p>
        )}
      </div>

      {selected && (
        <div className="avail__book">
          {termsGate}
          {agreed && (
            <>
              {bookingHeading(`Book ${formatBookDate(selected)}`)}
              <React.Suspense fallback={loadingLine}>
                <CalBooker date={selected} headingId={BOOK_HEADING_ID} />
              </React.Suspense>
            </>
          )}
        </div>
      )}
    </div>
  );
}
