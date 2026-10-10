// The board proposal, in one file. Luke: this is the one file to edit for the hidden proposal
// page. Every word on that page, the fee and when it is due come from here, so a change
// made once lands everywhere the page prints it. Strings only, no markup.
//
// The page is read by board members who are not technical, and it may be printed or saved as
// a PDF. It never mentions a previous developer, a previous contract or what the Conservancy
// owes anyone. It makes the case on value and plain facts.
//
// Voice (design-system/README.md): short sentences, sentence case, figures for money, no em
// dashes, no exclamation marks. "The Conservancy" and "the board". "I" is Luke, since this is
// his proposal.
//
// Facts and figures come from README.md, LAUNCH-CHECKLIST.md, CONTENT-INVENTORY.md and
// docs/BUILD-REPORT.md: 20 components, 30 photographs, ten pages, the 14-event timeline,
// Lighthouse accessibility 100 on every page and performance 93 to 98 with Gallery at 88
// (section 13, production build, 2026-10-09), 39 open questions, 24 existing bookings.

/** The one-time fee, in dollars. */
export const FEE = 4000;

/**
 * When the fee is due. One payment of FEE, due when the site goes live. Luke's own term, not a
 * park fact, so it carries no confirm marker and no CONTENT-TODO item. The figure, the paragraphs
 * and the steps on the page follow this value.
 */
export const PAYMENT = { amount: FEE, dueLabel: 'Due when the site goes live' };

/** "$4,000" from 4000. Figures for money, with a comma every three digits. */
export function usd(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

/** One tile in the facts grid. Same shape as the design system's Fact, so it can be passed straight to FactGrid. */
export interface ProposalFact {
  label: string;
  value: string;
  note?: string;
}

/** One of the four things the fee includes. Rendered as its own block on the page. */
export interface ProposalIncluded {
  title: string;
  text: string;
}

/** A section of the proposal: a heading, one or more paragraphs, then optional bullets. */
export interface ProposalSection {
  /** Stable id for anchors and for the renderer. The section with id "included" repeats INCLUDED as bullets. */
  id: 'summary' | 'built' | 'included' | 'running-costs' | 'not-included' | 'payment';
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

/** One step from approval to launch. Same shape as the design system's Step. */
export interface ProposalStep {
  title: string;
  text: string;
}

export interface Proposal {
  title: string;
  eyebrow: string;
  date: string;
  preparedBy: string;
  preparedFor: string;
  fee: number;
  payment: { amount: number; dueLabel: string };
  included: ProposalIncluded[];
  contactHref: string;
  lede: string;
  facts: ProposalFact[];
  sections: ProposalSection[];
  steps: ProposalStep[];
  closing: string;
}

// The four things the fee includes, in Luke's words made plain. They stand out twice on the
// page: in the facts grid and in their own section. Edit them here and both places follow.
const INCLUDED: ProposalIncluded[] = [
  {
    title: 'Unlimited updates and changes',
    text: 'As many updates or changes to the site as the Conservancy needs, at no extra charge: new wording, new photos, a new page, a changed setting. There is no cap and no hourly rate.',
  },
  {
    title: 'Calendar reservations, fully automated',
    text: "Cal.com set up end to end, so requests, holds, confirmations and the confirmation page run without the office retyping anything. Every booking already on the calendar, 24 as of this proposal, is entered as part of the setup. The calendar runs on Cal.com's free plan; an upgrade for extra features, if the Conservancy ever wants one, is billed separately.",
  },
  {
    title: 'Online payments through Zeffy, Stripe or both',
    text: "Full setup of online payments for donations and site fees, placed on the site and working, with the receipt wording settled with the Conservancy's accountant.",
  },
  {
    title: 'Website hosting for all time',
    text: "The site runs on Netlify's paid Pro plan. I pay for that plan and donate it to the Conservancy in perpetuity, for as long as the site exists. There is no hosting bill to the Conservancy, ever.",
  },
];

export const PROPOSAL: Proposal = {
  title: "The park's new website",
  eyebrow: 'Proposal to the board of Serra Cross Conservancy',
  date: 'October 2026',
  preparedBy: 'Luke Erickson',
  preparedFor: 'the board of Serra Cross Conservancy',
  fee: FEE,
  payment: PAYMENT,
  included: INCLUDED,
  contactHref: 'https://lukeerickson.com',

  lede: `I have built the new serracrosspark.com so the park can take bookings, receive gifts and tell its story with less work for the office and no monthly bills. I am asking the board to approve a one-time fee of ${usd(FEE)}, due when the site goes live. It covers the site, full automation of calendar reservations, full setup of online payments, hosting for all time, and every update the Conservancy needs from here on.`,

  facts: [
    {
      label: 'Fee',
      value: usd(FEE),
      note: 'One time, due when the site goes live. No maintenance fee and no retainer.',
    },
    {
      label: 'Monthly cost',
      value: '$0',
      note: "Hosting on Netlify's paid Pro plan, donated by me in perpetuity. No hosting bill to the Conservancy, ever.",
    },
    {
      label: 'Updates and changes',
      value: 'Unlimited',
      note: 'Content, photos, pages and settings. As many as the Conservancy needs, at no extra charge.',
    },
    {
      label: 'Bookings and payments',
      value: 'Automated',
      note: 'Cal.com reservations run end to end with nothing retyped. Online payments fully set up through Zeffy, Stripe or both.',
    },
  ],

  sections: [
    {
      id: 'summary',
      heading: 'Summary and the ask',
      paragraphs: [
        'The park has three jobs online: book weddings and events, tell the story of the Cross, and raise money to care for the hill. The new site is built around those three jobs, in that order.',
        "Here is what changes for the Conservancy. Couples see which dates are open before they ask. Requests, holds and confirmations run on their own. Gifts arrive without a platform fee. The site looks like the park's own sign, not a template. And there is no hosting bill, no plugin bill and no retainer.",
        `The ask is one fee of ${usd(FEE)}, paid once, when the site goes live. Four things come with it and stay included for as long as the Conservancy wants the site: unlimited updates, automated calendar reservations, online payments fully set up, and hosting at no charge. The rest of this page says what was built, what it costs to run, what the fee does not cover, and how I propose to be paid.`,
      ],
    },
    {
      id: 'built',
      heading: 'What was built',
      paragraphs: ['Everything on this list is built and checked.'],
      bullets: [
        "A design system drawn from the park's own interpretive sign: its colors, the Strong Glasgow and EB Garamond typefaces, 20 components, the logos, and a library of 30 curated park photographs, each with a caption and alt text for screen readers.",
        'Ten pages plus a page for addresses that no longer exist: Home, About with a card for each board and staff member, History with a 14-event timeline, Plan your event, Gallery with a lightbox, FAQ, Contact with directions, Donate, Terms, and a booking confirmation page.',
        "An availability calendar that reads the park's Cal.com schedule live and marks each day open, partly booked or booked, in words and a mark, never color alone. Choosing a day opens the Cal.com booker on that date.",
        'Donations through Zeffy, which charges the nonprofit nothing.',
        'A contact form that reaches the park office, and a booking inquiry form that appears if Cal.com is ever unreachable, so a request is never lost.',
        'Every address from the old site kept or redirected, so search rankings carry over, and structured data that tells search engines about the nonprofit, the park, the venue and the FAQ.',
        'The 501(c)(3) line and the Tax ID on every page.',
        'Accessibility to WCAG 2.1 AA, with a Lighthouse accessibility score of 100 on every page. The availability calendar works with a keyboard alone.',
        'Performance scores of 93 to 98 on every page but one, which scores 88. Built for phones first, and laid out for phone, tablet and desktop screens.',
        'Hand-off documents so anyone can maintain the site after me, a content inventory of the old site, and a list of 39 open questions for the board, each with where it came from.',
      ],
    },
    {
      id: 'included',
      heading: 'What stays included',
      paragraphs: [
        'The one-time fee covers the site described above and four things I want the board to be able to count on. They are not extras and they do not expire. I have written them as plainly as I can.',
      ],
      bullets: INCLUDED.map((item) => `${item.title}. ${item.text}`),
    },
    {
      id: 'running-costs',
      heading: 'What it costs to run',
      paragraphs: [
        'After launch the site has no monthly bill. Each service it runs on, and what it costs the Conservancy, is listed below.',
        'For comparison, the old WordPress site paid for hosting and a booking plugin, and PayPal took a fee from each gift. The email link on its booking page was broken, its contact form delivered to a personal address, and every booking request waited on an email reply from the office.',
      ],
      bullets: [
        "Netlify, which hosts the site, receives the forms and runs the availability calendar: the paid Pro plan, which I pay for and donate in perpetuity. $0 to the Conservancy.",
        "Cal.com, which takes reservations: free plan, $0. If the Conservancy ever wants features that only Cal.com's paid plans offer, that upgrade is billed separately.",
        'Zeffy, which takes donations and site fees: $0 to the Conservancy.',
        'The domain name, serracrosspark.com: the renewal stays with the Conservancy as it is today.',
      ],
    },
    {
      id: 'not-included',
      heading: 'What the fee does not cover',
      paragraphs: ['Three things sit outside the fee, so the board sees the whole picture.'],
      bullets: [
        'The Strong Glasgow font license. The Conservancy buys it from Herofonts before launch, at the price the foundry sets.',
        'New photography. The site uses 30 existing park photographs. Taking new pictures is not part of the fee.',
        'The domain name renewal. serracrosspark.com stays with the Conservancy, renewed as it is today.',
      ],
    },
    {
      id: 'payment',
      heading: 'Payment and timeline',
      paragraphs: [
        `The fee is ${usd(FEE)}, paid once, and it is due when the site goes live on serracrosspark.com. Nothing is due on approval and nothing is due while the work is finished.`,
        `I send one invoice, for ${usd(FEE)}, on launch day. Nothing is billed after that: no monthly fee, no annual fee, no charge for updates. Once the fee is paid, the Conservancy's only ongoing cost for the site is the domain renewal it already pays.`,
        'The four steps below are the timeline, from approval to launch and beyond.',
      ],
    },
  ],

  steps: [
    {
      title: 'Approval',
      text: `The board approves the one-time fee of ${usd(FEE)}, due when the site goes live. Nothing is paid at this step.`,
    },
    {
      title: 'Reservations and payments set up',
      text: "I finish the Cal.com setup end to end: the published hours, approval of each request while the date stays held, the booking questions and terms checkbox, and the confirmation page. I enter every booking already on the old calendar, 24 as of this proposal, so the new calendar is right from the first day. I set up the Conservancy's own Zeffy forms, Stripe, or both, for gifts and for the site fee, confirm the receipt wording with the accountant, and connect them to the Donate and Plan your event pages.",
    },
    {
      title: 'Launch',
      text: `The licensed font files go in and the board's answers to the open questions land on the pages. The old site is backed up and kept running until the switch is confirmed. The domain points at the new site with the Conservancy's email kept working. I check every form, the calendar and every old address on the live domain, submit the site to Google, and follow the first real booking end to end. I send the one invoice, for ${usd(FEE)}.`,
    },
    {
      title: 'Updates on request',
      text: 'From launch on, the Conservancy sends me any change it needs: words, photos, pages or settings. I make it at no extra charge, for as long as the Conservancy wants the site.',
    },
  ],

  closing:
    'To approve, the board votes on the fee and lets me know. The one invoice comes when the site goes live. Questions, changes to these terms and anything about the site come to me, Luke Erickson, through lukeerickson.com.',
};
