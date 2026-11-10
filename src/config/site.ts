// Every fact, link and setting for the site lives here. Pages and the availability
// function import from this file, so a change made once lands everywhere.

export const SITE = {
  url: 'https://serracrosspark.com',
  name: 'Serra Cross Park',
  org: 'Serra Cross Conservancy',
  ein: '20-8615264',
  email: 'admin@serracrosspark.com',
  mailingAddress: 'P.O. Box 48, Ventura, CA 93002-0048',
  location: 'Grant Park, above City Hall, Ventura, CA 93001',
  geo: { lat: 34.2846018, lng: -119.2962133 },
  facebook: 'https://www.facebook.com/groups/222411215009',
  instagram: 'https://www.instagram.com/serracrosspark/',
};

export const BOOKING = {
  calUsername: 'serra-cross-park',
  // Cal.com event slug. The event at cal.com/serra-cross-park is reserve; the public slots API
  // answers for it without a key (checked 2026-10-09). The brief said 30min; that event does not exist.
  calEventSlug: 'reserve',
  timeZone: 'America/Los_Angeles',
  horizonMonths: 12,        // how far ahead the calendar shows
  minNoticeDays: 0,         // mirror Cal.com "minimum notice"
  fullDaySlots: null as null | Record<number, number>, // optional: slots in a fully open day, by weekday (0 = Sunday)
  // Minutes the month grid counts open start times for (the slots API `duration`). 120 is the
  // two-hour minimum, so a day reads as open while any two-hour start is left. null would count
  // the event's default length instead (180 minutes, read 2026-11-03).
  slotDuration: 120 as null | number,
  // Event lengths in minutes, shortest first: the options under "How long is your event?" and the
  // only lengths /api/availability/times accepts. Keep them equal to the lengths the Cal.com event
  // offers (lengthInMinutesOptions, read 2026-11-03), because the booker's `duration` must be one.
  lengths: [120, 180, 240, 300, 360, 420, 480] as number[],
  // Site fee in dollars per hour of booked time, setup and breakdown included. The day panel shows
  // each length's fee from it (3 hours, $900).
  ratePerHour: 300,
  // The park's booking day, in minutes after midnight in timeZone: 8 AM to 8 PM every day (owner,
  // 2026-10-12). The day panel lists the parts of this day no event can use as "Not available".
  // Cal.com's own hours win for booking; keep these in step with them.
  dayOpens: 8 * 60,
  dayCloses: 20 * 60,
  // One Cal.com event per length, each with its own Cal Pay price at $300 an hour, because Cal.com
  // charges one fixed price per event whatever length is chosen (Cal.com docs and code, checked
  // 2026-11-03). Set up in Cal.com on 2026-11-03: reserve is 2 hours at $600 (Luke), reserve-3h to
  // reserve-8h are 3 to 8 hours at $900 to $2,400, refund policy never. A length in the map lists
  // its times and books on that event, and the month grid counts on the event mapped to
  // slotDuration. A booking on any of them blocks the same hours on all of them. If a price changes,
  // change it on that event in Cal.com and keep ratePerHour here in step.
  eventSlugByLength: {
    120: 'reserve',
    180: 'reserve-3h',
    240: 'reserve-4h',
    300: 'reserve-5h',
    360: 'reserve-6h',
    420: 'reserve-7h',
    480: 'reserve-8h',
  } as null | Record<number, string>,
};

// Outside praise on the hidden weddings page (src/pages/weddings-preview.astro). Both were read on
// 2026-11-09 and come from outside the brief, so they wait on the board's review and a fresh check
// before the page goes public (CONTENT-TODO item 47). Google's panel read 4.8 from 1,134 reviews;
// the page says "more than 1,100" so it stays true as reviews come in. The Visit Ventura words are from
// https://visitventuraca.com/blog/10-unique-wedding-venues-in-ventura/ (updated 2025-04-14).
export const PRAISE = {
  googleRating: '4.8',
  googleReviews: 'more than 1,100',
  visitVentura: 'one of the most beautiful and affordable wedding venues in Ventura',
};

/** The public Cal.com booking page. The fallback link when the embed cannot load. */
export const CAL_BOOKING_PAGE_URL = `https://cal.com/${BOOKING.calUsername}/${BOOKING.calEventSlug}`;

// donateUrl: Serra Cross Conservancy's own Zeffy donation form (from Luke, 2026-10-12), embedded on /donate/.
// siteFeeUrl: no page links it since 2026-10-12. The site fee is paid in full with the reservation
// (docs/TERMS-SOURCE.md, 1.1), so there is no "Pay the site fee" button anywhere; the field waits on
// CONTENT-TODO item 2, which decides whether a Zeffy form or a Cal.com payment step collects the fee.
export const PAYMENTS = {
  donateUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-serra-cross-park',
  siteFeeUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-serra-cross-park',
};

export type Person = { name: string; title?: string; photo?: string; links?: { label: string; href: string }[] };

// Photos: add a square image to src/assets/people/ and set `photo` to its file name.
// No photo means the initials placeholder.
export const PEOPLE: { board: Person[]; staff: Person[] } = {
  board: [
    { name: 'Barbara Asbell' },
    { name: 'Jan Schmutte' },
    { name: 'Dave Schmutte' },
    {
      name: 'Luke Erickson',
      photo: 'luke-erickson.webp',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luke-erickson' },
        { label: 'Instagram', href: 'https://www.instagram.com/luke_erickson' },
      ],
    },
    { name: 'Angie Hecht' },
    { name: 'Karen Greenough' },
    { name: 'Christy Weir' },
  ],
  staff: [{ name: 'Amber Weir', title: 'Reservation Specialist' }],
};

export const CREDIT = { label: 'Website by Luke Erickson', href: 'https://lukeerickson.com' };

export type NavLink = { label: string; href: string };
export type FooterColumn = { title: string; links: NavLink[] };

// Header links, in order. Donate and "Plan your event" are buttons set on SiteHeader
// (donateHref, bookHref, bookLabel), not links here. Gallery is not in the header.
export const NAV: NavLink[] = [
  { label: 'History', href: '/history/' },
  { label: 'About', href: '/about/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];

// Footer link columns, passed to SiteFooter as `columns`.
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'The park',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'History', href: '/history/' },
      { label: 'Gallery', href: '/gallery/' },
      { label: 'FAQ', href: '/faq/' },
    ],
  },
  {
    title: 'Plan and give',
    links: [
      { label: 'Plan your event', href: '/booking/' },
      { label: 'Donate', href: '/donate/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Terms', href: '/terms-and-conditions/' },
    ],
  },
];
