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
  emergencyPhone: '805-258-3153',
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
  slotDuration: null as null | number,                 // minutes; only if the Cal.com event offers several durations
};

/** The public Cal.com booking page. The fallback link when the embed cannot load. */
export const CAL_BOOKING_PAGE_URL = `https://cal.com/${BOOKING.calUsername}/${BOOKING.calEventSlug}`;

// PLACEHOLDER: these are Startup Ventura's Zeffy form.
// Replace both with Serra Cross Conservancy's own forms before launch.
export const PAYMENTS = {
  donateUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura',
  siteFeeUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura',
};

export type Person = { name: string; title?: string; photo?: string; links?: { label: string; href: string }[] };

// Photos: add a square image to src/assets/people/ and set `photo` to its file name.
// No photo means the initials placeholder.
export const PEOPLE: { board: Person[]; staff: Person[] } = {
  board: [
    { name: 'Barbara Asbell' },
    { name: 'Jan Schmutte' },
    { name: 'Dave Schmutte' },
    { name: 'Angie Hecht' },
    { name: 'Karen Greenough' },
    {
      name: 'Luke Erickson',
      photo: 'luke-erickson.webp',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luke-erickson' },
        { label: 'Instagram', href: 'https://www.instagram.com/luke_erickson' },
      ],
    },
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
