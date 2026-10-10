// Questions couples and visitors ask, grouped the way the FAQ page shows them.
// Facts come from BRIEF.md section 9. Answers are plain strings so the same text can feed
// FAQList and the FAQPage structured data. Every answer starts with the answer.
//
// Open questions (CONTENT-TODO.md) that shaped the wording here:
//   2. Site fee receipts: the fee is stated as non-refundable and not tax-deductible, per the brief. [CONFIRM: receipt setup with the accountant]
//   4. Insurance price, insurance vendor and the portable restroom vendor are left out on purpose. [CONFIRM: before naming any vendor or price]
//   7. Parking: no car count is published. [CONFIRM: a number to publish]
//  11, 38, 39. Cal.com still offers four fixed 180-minute slots at 8, 11, 2 and 5 (read 2026-10-09); the FAQ states the owner's rule of 2026-10-10: any start time between 9 AM and 8 PM, two-hour minimum. [CONFIRM: Cal.com reset to a two-hour minimum with flexible start times]
//  18. Public access: the brief's wording (open during every event) is used; the old FAQ said daylight hours. [CONFIRM: visitor hours]
//  19. Insurance scope: the reception rule only; nothing is said about other event types. [CONFIRM: rule for ceremonies, picnics, memorials]
//  20. 805-258-3153 is labeled only as the number for non-emergencies. [CONFIRM: whose phone and how to label it]

export interface FAQEntry {
  /** The question, in the visitor's words. */
  q: string;
  /** The answer, starting with the answer. Plain text, no markup. */
  a: string;
  /** Optional follow-on link for pages that want to render one under the answer. */
  more?: { label: string; href: string };
}

export type FAQGroupId = 'booking' | 'on-the-day' | 'visiting';

export interface FAQGroup {
  id: FAQGroupId;
  title: string;
  items: FAQEntry[];
}

const booking: FAQEntry[] = [
  {
    q: 'How much does it cost to hold an event at the park?',
    a: '$300 per hour, with a two-hour minimum. Booked time includes setup and breakdown for you and your vendors, so count both when you choose your hours.',
  },
  {
    q: 'Is the site fee refundable?',
    a: 'No. The site fee reserves your date once the park office confirms it. It is non-refundable and not tax-deductible.',
  },
  {
    q: 'How do I book, and how long will you hold my date?',
    a: 'Pick a date on the Plan your event page, agree to the terms and conditions, then choose your time and send your request. The park office confirms your date and holds it for 14 days while the site fee arrives, then sends your confirmation letter.',
    more: { label: 'Plan your event', href: '/booking/' },
  },
  {
    q: 'What hours can we book?',
    a: '9 AM to 8 PM, every day of the year. Start at any time that suits you, with a two-hour minimum. Weekend events end by 7:30 PM, and everyone is off the hill by 8 PM, when the gates lock.',
  },
  {
    q: 'How many guests can the park hold?',
    a: 'Up to 300 seated or 500 standing. If you expect more than 100 guests, we suggest a valet service for parking.',
  },
  {
    q: 'Will we have the park to ourselves?',
    a: 'No. The grounds stay open to the public during every event. Visitors may walk through while your event is on.',
  },
  {
    q: 'Do we need event insurance?',
    a: 'Yes, for receptions. We ask for a $1 million one-day special event policy. Your insurance agent can arrange one.',
  },
  {
    q: 'Can we serve alcohol?',
    a: 'Yes, with event insurance and a licensed caterer. The caterer serves every drink. No self-service alcohol.',
  },
];

const onTheDay: FAQEntry[] = [
  {
    q: 'Is there power for music or a microphone?',
    a: 'Yes, a little. Two 20-amp circuits at the base of the Cross run a small sound system. Tell your DJ or band so they plan for it.',
  },
  {
    q: 'Is the park lit at night?',
    a: 'No. The park is not lit, so evening events bring their own lighting. Remember the gates lock at 8 PM.',
  },
  {
    q: 'Do you provide tables and chairs?',
    a: 'No. Rent seating and tables from a rental company, and plan delivery and pickup inside your booked time.',
  },
  {
    q: 'Are there restrooms or water?',
    a: 'No, neither. Rent portable restrooms and bring water for your guests and vendors.',
  },
  {
    q: 'What do we do with trash?',
    a: 'Take it with you. There are trash cans on site, but all event trash leaves with you when the event ends.',
  },
  {
    q: 'Is there somewhere to change?',
    a: 'No. There are no changing rooms at the park, so arrive dressed and ready.',
  },
  {
    q: 'When do we have to be off the hill?',
    a: 'By 8 PM. Guests and equipment are off the property by 8 PM, when the gates lock. Weekend events end by 7:30 PM.',
  },
];

const visiting: FAQEntry[] = [
  {
    q: 'Can anyone visit the park?',
    a: 'Yes. Serra Cross Park is an open park for everyone, and the grounds stay open to the public during events. The gates lock at 8 PM.',
  },
  {
    q: 'How do we get to the Cross?',
    a: 'From the 101, exit California Street and turn right, then head north toward City Hall. In front of City Hall, turn right on Poli Street and follow it several blocks. Turn left on Kalorama, then left on Summit, and follow the signs to parking. Brakey Road is closed to vehicles. Full directions and a map are on the Contact page.',
    more: { label: 'Directions and map', href: '/contact/#directions' },
  },
  {
    q: 'Where do we park?',
    a: 'Along one side of the street into the park. Keep the fire lane open. For more than 100 guests we suggest a valet service, and any shuttle is yours to arrange.',
  },
  {
    q: 'Is the park wheelchair accessible?',
    a: 'Yes. The park has wheelchair access and disabled parking. If you have a question about access for your event, write to admin@serracrosspark.com.',
  },
  {
    q: 'Who do we call in an emergency?',
    a: '911. For anything else about the park, call 805-258-3153.',
  },
];

/** The three FAQ groups by name, for pages that show one group (the booking page shows `booking`). */
export const FAQ: { booking: FAQEntry[]; onTheDay: FAQEntry[]; visiting: FAQEntry[] } = {
  booking,
  onTheDay,
  visiting,
};

/** The groups in page order, with ids for section anchors and titles for section headings. */
export const FAQ_GROUPS: FAQGroup[] = [
  { id: 'booking', title: 'Booking', items: FAQ.booking },
  { id: 'on-the-day', title: 'On the day', items: FAQ.onTheDay },
  { id: 'visiting', title: 'Visiting', items: FAQ.visiting },
];
