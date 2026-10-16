// Questions couples and visitors ask, grouped the way the FAQ page shows them.
// Event rules come from docs/TERMS-SOURCE.md, the Conservancy's own Special Event Terms and
// Conditions (supplied by the owner on 2026-10-12); it wins where BRIEF.md section 9 disagrees.
// The owner's decisions stand where the document is silent: hours 8 AM to 8 PM every day, any
// start time, a two-hour minimum at $300 per hour with setup and breakdown inside booked time.
// The board's copy notes of 2026-10-14 settled capacity (up to 250 people, no seated or standing
// figure) and power (two 20-amp outlets; no water, restrooms or lighting, and bringing any of
// those is the client's choice). Answers are plain strings so the same text can feed FAQList and
// the FAQPage structured data. Every answer starts with the answer.
//
// Open questions (CONTENT-TODO.md) that shaped the wording here:
//   2. The site fee is due when the booking is submitted and is non-refundable, with one free change of
//      date or time (the terms document, 1.1 and 1.2). The board's copy for the booking page calls reservation
//      payments tax-deductible donations; the accountant has not confirmed that, so the FAQ says nothing
//      about donations or tax either way. [CONFIRM: receipt treatment with the accountant]
//   4. Insurance price, insurance vendor and the portable restroom vendor are left out on purpose. [CONFIRM: before naming any vendor or price]
//   7. Resolved 2026-10-12 by the terms document (3.7): 35 vehicles in designated areas inside the gates.
//  11, 38, 39. Cal.com still offers four fixed 180-minute slots at 8, 11, 2 and 5 (read 2026-10-09); the FAQ states the owner's rule of 2026-10-12: any start time between 8 AM and 8 PM, two-hour minimum. [CONFIRM: Cal.com reset to a two-hour minimum with flexible start times]
//  15. Resolved 2026-10-12: the weekend 7:30 PM end is dropped. Events end by 8 PM every day, when the gates lock.
//  18. Resolved 2026-10-12 by the terms document (3.1): the gates stay open to the public from dawn to dusk and cannot be locked.
//  19. Resolved 2026-10-12 by the terms document (2.2): insurance for any event with catered food, beverages or a reception.
//  20. Resolved 2026-10-12: the phone number is no longer published. 911 for emergencies, the office email for everything else.
//  41. Resolved 2026-10-14 by the board's copy notes: there are two 20-amp outlets at the park, so the FAQ says so again.
//  43. The brief described a hold on the date while the fee arrived; the terms document confirms a reservation only once the
//      full payment is processed, so no answer here mentions a hold.

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
    q: 'How do I book?',
    a: 'Pick a date and time on the Plan your event page, agree to the terms and conditions, and send your request. The site fee is collected with your reservation. Once the payment is processed, the park office emails your confirmation.',
    more: { label: 'Plan your event', href: '/booking/' },
  },
  {
    q: 'When do we pay the site fee?',
    a: 'When you submit your booking. The full site fee is due at the time of submission, and your date is not confirmed until the payment has been received and processed. The park office then emails your confirmation.',
  },
  {
    q: 'Is the site fee refundable?',
    a: 'No. Reservation payments are non-refundable, and cancelling the event forfeits the fee. You may change your date or time once at no charge, subject to availability.',
  },
  {
    q: 'Can we change our date?',
    a: 'Yes, once, at no charge and subject to availability. Email admin@serracrosspark.com with the new date or time you have in mind.',
  },
  {
    q: 'What hours can we book?',
    a: '8 AM to 8 PM, 364 days a year. The park is closed every July 4 because of fire danger. Start at any time that suits you, with a two-hour minimum. Everyone is off the hill by 8 PM, when the gates lock.',
  },
  {
    q: 'How many guests can the park hold?',
    a: 'Up to 250 people. Parking inside the gates holds 35 vehicles, so plan how your guests will arrive if you expect more cars than that.',
  },
  {
    q: 'Will we have the park to ourselves?',
    a: 'No. The park stays open to the public from dawn to dusk and the gates cannot be locked, so other people may be in the park during your event. You may put up signs, hire security, station a volunteer at the gate and let visitors know an event is on.',
  },
  {
    q: 'Do we need event insurance?',
    a: 'Yes, if your event has catered food, beverages or a reception. We ask for a one-day $1 million liability policy covering the event, with proof emailed to admin@serracrosspark.com at least seven days before. Your insurance agent can arrange one.',
  },
  {
    q: 'Can we serve alcohol?',
    a: 'Yes, through a licensed provider. A licensed bartender or caterer serves every drink; there is no self-service alcohol. All alcohol laws apply, including age limits, and serving drinks means your event needs the insurance described above.',
  },
];

const onTheDay: FAQEntry[] = [
  {
    q: 'Is there power?',
    a: 'Yes. There are two 20-amp outlets, enough for a small sound system. There is no water, no restrooms and no lighting, so bring your own if you want them.',
  },
  {
    q: 'Is there lighting?',
    a: 'No. There is no lighting anywhere in the park, including the parking lot. Bring your own if your event runs into the evening, and remember the gates lock at 8 PM.',
  },
  {
    q: 'Do you provide tables, chairs or tents?',
    a: 'No. You bring your own chairs, tables, tents and decor, or rent them, and you remove them by the end of your booked time. The park is not responsible for damage to or loss of your rentals.',
  },
  {
    q: 'Are there restrooms or water?',
    a: 'No, neither. If you want them for your guests and vendors, bring water and rent portable restrooms. For a weekend event, portable restrooms can be delivered on Friday and collected on Monday.',
  },
  {
    q: 'Can we throw confetti or petals?',
    a: 'Only biodegradable or natural ones. Synthetic confetti and petals (plastic, metal or fabric) are not allowed, and leaving them behind brings a cleanup fee.',
  },
  {
    q: 'What do we do with trash?',
    a: 'Take it with you. Leave the park as you found it: all event trash, decor and equipment leave with you by the end of your booked time. If trash is left behind, a one-time removal fee may apply.',
  },
  {
    q: 'Is there somewhere to change?',
    a: 'No. There are no changing rooms at the park, so arrive dressed and ready.',
  },
  {
    q: 'What is not allowed?',
    a: 'Smoking, fireworks, open flames or fire of any kind; firearms or other weapons unless the law allows them; and vehicles on the grass, so keep to the designated parking and loading areas. Any illegal activity, including drug use and underage drinking, ends the event at once.',
  },
  {
    q: 'What happens if we run past our booked time?',
    a: 'You pay $300 for each extra hour. Your booked time covers setup, the event and cleanup, so book enough hours to be packed up and off the hill by the end of it.',
  },
  {
    q: 'When do we have to be off the hill?',
    a: 'By 8 PM. Guests and equipment are off the property by 8 PM, when the gates lock.',
  },
  {
    q: 'Who is responsible if something goes wrong?',
    a: 'You are, as the person booking. You take responsibility for accidents, injuries and damage during your event and hold the park, its volunteers and affiliates harmless. The park is not responsible for injury, damage, theft or loss of personal property, so plan your insurance and any security with that in mind.',
  },
];

const visiting: FAQEntry[] = [
  {
    q: 'Can anyone visit the park?',
    a: 'Yes. Serra Cross Park is open to everyone from dawn to dusk, 364 days a year, and it stays open to the public during events. The park is closed every July 4 because of fire danger. The gates lock at 8 PM.',
  },
  {
    q: 'How do we get to the Cross?',
    a: 'From the 101, exit California Street and turn right. Turn right on Santa Clara Street, then left on Kalorama and follow it up the hill. Turn left on Summit and follow the signs to parking. Brakey Road is closed to vehicles. Full directions and a map are on the Contact page.',
    more: { label: 'Directions and map', href: '/contact/#directions' },
  },
  {
    q: 'Where do we park?',
    a: 'Inside the park gates, in the designated areas, which hold 35 vehicles. Stay off the grass. The park is not responsible for vehicles or anything left in them.',
  },
  {
    q: 'Is the park wheelchair accessible?',
    a: 'Yes. The park has wheelchair access and disabled parking. If you have a question about access for your event, write to admin@serracrosspark.com.',
  },
  {
    q: 'Who do we call in an emergency?',
    a: 'Call 911. For anything else about the park, email admin@serracrosspark.com.',
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
