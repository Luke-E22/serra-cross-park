# Build report

Final gate on the Serra Cross Park site, run 2026-10-09 on the full repo with Node 22.17.0, Astro 7.3.8, React 18.3.1. Every command below was run from `/Users/lukemac/serra-cross-park` with `export PATH="$HOME/.local/node/bin:$PATH"`.

## 1. Gate results

| Check | Command | Result |
| --- | --- | --- |
| Types and diagnostics | `npx astro check` | 39 files, 0 errors, 0 warnings, 0 hints |
| Full type check (includes `netlify/**` and `scripts/**`, which astro check may not walk) | `npx tsc --noEmit -p tsconfig.json` | exit 0, no output |
| Unit tests | `npx vitest run` | 4 files, 50 tests, all pass, 184 ms (2026-10-10, after the terms gate: 5 files, 56 tests, all pass) |
| Production build | `npm run build` | 12 pages, complete (11 at the 2026-10-09 gate; `/website-proposal/` came later). The only output besides Astro's progress lines is the prelaunch check's `WARN` lines (section 2; 38 on 2026-10-12). No Vite, React or Astro warnings |
| Prelaunch check | `node scripts/prelaunch-check.mjs` | 38 warnings, exit 0 on 2026-10-12 (section 2; 51 earlier that day, 52 at the 2026-10-09 gate before Luke Erickson's photo was added) |
| Per-page checks on `dist/` | script in section 3 | 12 pages, 0 failures (re-run 2026-10-12) |
| Availability function, fixture and live | section 6 | 200 in both modes, correct cache headers |

`dist/` is 20 MB: 122 WebP renditions, 9 JPEG Open Graph crops (1200 x 630), 5 original JPEGs that no page references (section 10, finding 1), 2 CSS files, 11 JS chunks, 3 TTF fonts, `sitemap-index.xml`, `sitemap-0.xml` (9 URLs; `/booking/requested/`, `/website-proposal/` and `/404` are left out), `robots.txt`, `favicon.svg`.

## 2. Prelaunch warnings, verbatim

```
WARN  PAYMENTS.donateUrl still points at Startup Ventura's Zeffy form (https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura). Replace it with Serra Cross Conservancy's own form.
WARN  PAYMENTS.siteFeeUrl still points at Startup Ventura's Zeffy form (https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura). Replace it with Serra Cross Conservancy's own form.
WARN  Strong Glasgow demo font still in place: design-system/fonts/StrongGlasgow-Bold.ttf (personal use only). License the face from Herofonts and replace it.
WARN  Strong Glasgow demo font still in place: design-system/fonts/StrongGlasgow-Light.ttf (personal use only). License the face from Herofonts and replace it.
WARN  Strong Glasgow demo font still in place: design-system/fonts/StrongGlasgow-Regular.ttf (personal use only). License the face from Herofonts and replace it.
WARN  src/components/PersonCard.astro:28  [CONFIRM: CONTENT-TODO item 8, photos for all eight people and any officer titles]
WARN  src/content/faq.ts:11  [CONFIRM: receipt setup with the accountant]
WARN  src/content/faq.ts:12  [CONFIRM: before naming any vendor or price]
WARN  src/content/faq.ts:14  [CONFIRM: Cal.com reset to a two-hour minimum with flexible start times]
WARN  src/content/timeline.ts:8  [CONFIRM: buyer, price, closing date, Conservancy founding date]
WARN  src/content/timeline.ts:9  [CONFIRM: what E.C.O. stands for, if it should be spelled out]
WARN  src/content/timeline.ts:10  [CONFIRM: the park was named Grant Park in 1918]
WARN  src/content/timeline.ts:11  [CONFIRM: replanting is still active]
WARN  src/pages/about.astro:12  [CONFIRM: item 8, photos for all eight people and any officer titles to show on the cards]
WARN  src/pages/about.astro:13  [CONFIRM: item 22, who bought the Cross and when the Conservancy formed; the page says neither]
WARN  src/pages/about.astro:14  [CONFIRM: item 25, funding wording: "all of our funding" is dropped, gifts are described on their own]
WARN  src/pages/about.astro:15  [CONFIRM: item 29, whether the replanting is still active and whether a current project should be named]
WARN  src/pages/booking/index.astro:27  [CONFIRM: item 5, whether the steps should name Amber Weir or keep "the park office"]
WARN  src/pages/booking/index.astro:28  [CONFIRM: items 11, 38 and 39, Cal.com still offers four fixed 180-minute slots at 8, 11, 2 and 5; it must be set to a two-hour minimum with flexible start times between 8 AM and 8 PM, as the page states, and the booking flow must collect the site fee with each reservation, as the steps now say]
WARN  src/pages/booking/requested.astro:17  [CONFIRM: item 5, whether these steps should name Amber Weir or keep "the park office"]
WARN  src/pages/contact.astro:16  [CONFIRM: item 30, that Brakey Road is still closed to vehicles, and whether to add a route from the north]
WARN  src/pages/contact.astro:17  [CONFIRM: item 36, that the Facebook group is still the Conservancy's active page]
WARN  src/pages/contact.astro:18  [CONFIRM: item 27, whether a second address should get the form notifications; that is set in the Netlify UI, not here]
WARN  src/pages/donate.astro:14  [CONFIRM: item 1, PAYMENTS.donateUrl is still Startup Ventura's placeholder Zeffy form]
WARN  src/pages/donate.astro:15  [CONFIRM: item 12, Tax ID 20-8615264 against the IRS determination letter]
WARN  src/pages/donate.astro:16  [CONFIRM: item 29, whether replanting is still active and whether a current project should be named]
WARN  src/pages/faq.astro:18  [CONFIRM: item 4, the insurance price, insurance vendor and portable restroom vendor before naming any]
WARN  src/pages/gallery.astro:16  [CONFIRM: item 33, permission and credits for the West Cooke rainbow photo and the "-SCP" wedding set]
WARN  src/pages/history.astro:28  [CONFIRM: items 6 and 22, who bought the Cross after the 2003 vote and when; nothing is claimed]
WARN  src/pages/history.astro:29  [CONFIRM: item 29, the replanting is still active; the giving band keeps the brief's wording]
WARN  src/pages/terms-and-conditions.astro:20  [CONFIRM: item 5, whether the terms should name Amber Weir or keep the admin@ address alone]
WARN  No photo for Barbara Asbell (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Jan Schmutte (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Dave Schmutte (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Angie Hecht (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Karen Greenough (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Christy Weir (PEOPLE in src/config/site.ts). The About page shows initials until one is added.
WARN  No photo for Amber Weir (PEOPLE in src/config/site.ts). The About page shows initials until one is added.

Prelaunch check: 38 warnings on 2026-10-12 (51 earlier that day; 52 on 2026-10-09, before Luke Erickson's photo was added). The drop is the [CONFIRM] markers removed on 2026-10-12, when the Conservancy's terms document (docs/TERMS-SOURCE.md) settled insurance scope, parking, public access and the terms themselves, the phone number came off the site, and the separate pay-the-site-fee step was dropped (CONTENT-TODO items 2, 7, 18, 19, 20, 37 and 41). The list above is the output of `node scripts/prelaunch-check.mjs` on 2026-10-12, after those changes.
```

Every `[CONFIRM: ...]` marker is inside a code comment. None reaches the built HTML (section 3). The list shrinks as Luke closes items in `CONTENT-TODO.md`; the Zeffy, font and photo warnings close when the launch checklist items land.

## 3. Per-page checks on dist

Run against every HTML file in `dist/` after a fresh `npm run build`. Checks: exactly one `<h1>`; the footer nonprofit line "Serra Cross Conservancy is a 501(c)(3) nonprofit." and "Tax ID 20-8615264"; a `<link rel="canonical">` on `https://serracrosspark.com/`; an absolute `og:image`; at most one `.sc-section--dark`; at most one `.sc-btn--primary` in page content; no em dash (U+2014) and no exclamation mark in visible text, `alt`, `aria-label`, `title`, `placeholder` or `value`; no `[CONFIRM` anywhere in the file. Result: 12 pages, 0 failures (re-run 2026-10-12 after the terms document landed).

Two calibrations the next person running these checks should know about:

- React's server renderer puts `<!-- -->` between adjacent text nodes, so the footer line is in the HTML as `Tax ID <!-- -->20-8615264<!-- -->.`. Strip HTML comments before matching text, or the Tax ID check fails on every page whose body does not also print the line.
- The design system's `SiteHeader` renders its "Plan your event" button as `primary` on light pages and always as `primary` inside the mobile menu drawer (overlay heroes get `secondary` in the top bar). That is the component's own markup, which the brief says not to change, and only one of those copies is visible at any width. The one-primary rule is about page content, so the check counts primaries outside the `<header class="sc-header">` subtree. Header primaries per page: 2 on light pages, 1 on hero pages.

| Page | h1 | Sections | Dark | Page primary | OG image | JSON-LD | Islands |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 1 | base, alt, base, dark, alt | 1 | Plan your event (hero, `/booking/`) | cross-olive-panorama | NGO, TouristAttraction | PageHero |
| `/about/` | 1 | base, alt, base, alt, base | 0 | none | bench-ocean | NGO, TouristAttraction | SiteHeaderIsland |
| `/booking/` | 1 | base, dark, alt, base, alt, base (since 2026-10-12: rules, how booking works, calendar, question form, gallery, FAQ) | 1 | Book now (hero, `#availability`; "Ask a question" beside it is secondary, to `#questions`) | reception-umbrellas | NGO, TouristAttraction, EventVenue | PageHero, AvailabilityCalendar, ContactForm |
| `/booking/requested/` | 1 | base, alt | 0 | none | reception-lawn | NGO, TouristAttraction | SiteHeaderIsland |
| `/contact/` | 1 | base, alt | 0 | Send message (form submit) | cross-sunset | NGO, TouristAttraction | SiteHeaderIsland, ContactForm |
| `/donate/` | 1 | base, alt, base | 0 | none | burned-shrubs-cross-islands-2017 (top crop) | NGO, TouristAttraction | SiteHeaderIsland, ZeffyEmbed |
| `/faq/` | 1 | base, alt, base, alt, base | 0 | Contact the park office (`/contact/`) | ventura-coastline | NGO, TouristAttraction, FAQPage | SiteHeaderIsland |
| `/gallery/` | 1 | base, alt | 0 | none | coastline-salvia | NGO, TouristAttraction | PageHero, GalleryLightbox x2 |
| `/history/` | 1 | base, alt, base, dark | 1 | none | cross-sunset | NGO, TouristAttraction | PageHero |
| `/terms-and-conditions/` | 1 | base, alt | 0 | none | stone-sphere-cross | NGO, TouristAttraction | SiteHeaderIsland |
| `/website-proposal/` | 1 | base, alt, base, alt, base, alt, base, alt | 0 | one, to lukeerickson.com (`PROPOSAL.contactHref`) | cross-olive-panorama (layout default) | NGO, TouristAttraction | none (static header) |
| `/404` | 1 | base | 0 | Plan your event (`/booking/`) | cross-olive-panorama (layout default) | NGO, TouristAttraction | SiteHeaderIsland |

`give` buttons link only to `/donate/` (header, drawer and the navy bands on Home and History) or to `PAYMENTS.donateUrl` (the Zeffy fallback on `/donate/`). No `give` button goes anywhere else. Since 2026-10-12 no page carries a "Pay the site fee" button or link: the fee is paid in full with the reservation (docs/TERMS-SOURCE.md, 1.1), and `PAYMENTS.siteFeeUrl` is referenced by no page (CONTENT-TODO item 2 decides which payment step collects it). `/404`, `/booking/requested/` and `/website-proposal/` carry `<meta name="robots" content="noindex">` (the proposal adds `nofollow`); the 404 page's canonical is `/`. The sitemap filter in `astro.config.mjs` keeps `/booking/requested/` and `/website-proposal/` out of `sitemap-0.xml`.

The check script used for this gate is reproduced here so it can be re-run (save as `scripts/page-checks.mjs` or run from anywhere with the dist path as the argument):

```js
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const DIST = process.argv[2];
const files = [];
(function walk(d) { for (const e of readdirSync(d)) { const p = join(d, e); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', mdash: '\u2014', copy: '\u00a9' };
const decode = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const count = (re, s) => (s.match(re) ?? []).length;
let failures = 0;
for (const f of files.sort()) {
  const raw = readFileSync(f, 'utf8');
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  const outsideHeader = html.replace(/<header class="sc-header[\s\S]*?<\/header>/g, '');
  const body = html.replace(/^[\s\S]*?<body[^>]*>/i, '').replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ');
  const text = decode(body.replace(/<[^>]+>/g, ' ') + ' ' + [...body.matchAll(/\s(?:alt|aria-label|title|placeholder|value)="([^"]*)"/g)].map((m) => m[1]).join(' '));
  const probs = [];
  if (count(/<h1[\s>]/gi, html) !== 1) probs.push('h1 count');
  if (!/Serra Cross Conservancy is a 501\(c\)\(3\) nonprofit\. Tax ID 20-8615264\./.test(decode(html))) probs.push('footer nonprofit line');
  if (!/<link rel="canonical" href="https:\/\/serracrosspark\.com\//.test(html)) probs.push('canonical');
  if (!/<meta property="og:image" content="https:\/\/serracrosspark\.com\/[^"]+"/.test(html)) probs.push('og:image');
  if (count(/\bsc-section--dark\b/g, html) > 1) probs.push('more than one dark section');
  if (count(/\bsc-btn--primary\b/g, outsideHeader) > 1) probs.push('more than one primary outside the header');
  if (text.includes('\u2014')) probs.push('em dash');
  if (text.includes('!')) probs.push('exclamation mark');
  if (raw.includes('[CONFIRM')) probs.push('[CONFIRM marker');
  console.log('/' + relative(DIST, f), probs.length ? 'FAIL ' + probs.join('; ') : 'ok');
  failures += probs.length;
}
console.log(`${files.length} pages, ${failures} failures`);
```

## 4. Pages built

Twelve routes, all static (eleven at the 2026-10-09 gate; `/website-proposal/`, a private page for the board, came later), `trailingSlash: 'always'`, `build.format: 'directory'`. Titles are "<page> | Serra Cross Park" except Home, which is the full title.

| Route | File | Title | Description |
| --- | --- | --- | --- |
| `/` | `src/pages/index.astro` | Serra Cross Park: weddings and history on the hill above Ventura | A one-acre park around the Cross above Mission San Buenaventura. Book a wedding or event, read the history, and help the Conservancy care for the hill. |
| `/about/` | `src/pages/about.astro` | About the Conservancy | Serra Cross Conservancy is the nonprofit that keeps the Cross where it stands, keeps the park open to everyone, and cares for the hill. Meet the board. |
| `/history/` | `src/pages/history.astro` | History of the Serra Cross | The history of the Cross above Mission San Buenaventura, year by year: from Easter Sunday 1782 to the stone ramparts, the Thomas Fire and the replanting. |
| `/booking/` | `src/pages/booking/index.astro` | Plan your event | Book a wedding or event at Serra Cross Park in Ventura: up to 300 seated guests, $300 per hour, with the ocean and the Channel Islands below. See open dates. |
| `/booking/requested/` | `src/pages/booking/requested.astro` | Booking requested | We have your request for a date at Serra Cross Park. Here is what happens next. (noindex) |
| `/gallery/` | `src/pages/gallery.astro` | Gallery | Photographs of Serra Cross Park: weddings and receptions at the Cross, the dry-stone ramparts, the salvia, and the Channel Islands from the hill above Ventura. |
| `/faq/` | `src/pages/faq.astro` | Frequently asked questions | Plain answers about booking Serra Cross Park, planning the day, and visiting the Cross: rates, hours, guest counts, insurance, power, restrooms and parking. |
| `/contact/` | `src/pages/contact.astro` | Contact and directions | Send a message to the park office, find the mailing address and the Facebook group, and get driving directions to Serra Cross Park from the 101. |
| `/donate/` | `src/pages/donate.astro` | Donate to Serra Cross Conservancy | Give to Serra Cross Conservancy, the nonprofit that cares for Serra Cross Park. Gifts replant the hill after the Thomas Fire and pay for year-round upkeep. |
| `/terms-and-conditions/` | `src/pages/terms-and-conditions.astro` | Terms and conditions | The Conservancy's terms and conditions for every event at Serra Cross Park: reservation and payment, insurance, alcohol, public access, parking, prohibited activities and liability, with the PDF to download. (Since 2026-10-12 the page carries the Conservancy's own Special Event Terms and Conditions, clause by clause, from docs/TERMS-SOURCE.md, with the PDF at /docs/serra-cross-park-terms-and-conditions.pdf.) |
| `/website-proposal/` | `src/pages/website-proposal.astro` | Website proposal | A proposal to the board of Serra Cross Conservancy for the new Serra Cross Park website. (noindex, nofollow; not in the sitemap; no link from the header or footer) |
| `/404` | `src/pages/404.astro` | Page not found | That page is not here. Go to the home page, plan your event, or contact the park office. (noindex) |

Shared pieces: `src/layouts/BaseLayout.astro` (head, canonical, Open Graph and Twitter card, Google Search Console tag carried over from the old site, font preload, site-wide JSON-LD, skip link, header on no-hero pages, `<main id="main" tabindex="-1">`, `SiteFooter` with the `credit` prop), `src/components/PageHero.tsx` (Hero carrying the overlay header), `src/components/PersonCard.astro` (About page cards), `src/content/photos.ts` (30 photos with alt, caption, orientation and uses), `src/content/faq.ts` (20 questions in three groups), `src/content/timeline.ts` (the History timeline), `src/config/site.ts` (every fact, link and setting), `src/lib/images.ts` (`picture()` for WebP srcsets with explicit dimensions, `ogImage()` for the 1200 x 630 JPEG cards). Page CSS lives in `src/styles/pages/*.css`, one file per page, imported at the top of each page's frontmatter.

Photos: 25 of the 30 registered photos are rendered through `picture()` (122 WebP renditions, every `<img>` with `width`, `height`, `srcset` and `sizes`; heroes `loading="eager"`, `decoding="sync"`, `fetchpriority="high"`; everything else `loading="lazy"`). Nine photos are also cropped to 1200 x 630 JPEG cards.

## 5. Islands and what hydrates them


**Update 2026-10-10.** The header no longer hydrates. `SiteHeaderIsland` and `PageHero` render statically on every page and `src/scripts/header-menu.ts` (inlined once from `BaseLayout.astro`) drives the menu toggle under 1100px, so Home, About, History, FAQ, Terms, the 404 and the booking confirmation page ship no React at all. `GalleryLightbox` hydrates with `client:idle` instead of `client:visible`. The islands that remain: `AvailabilityCalendar` (client:visible, lazy-loads `CalBooker`), `ContactForm` (client:visible), `ZeffyEmbed` (client:visible) and the two `GalleryLightbox` mosaics (client:idle).

Everything else on the site is static HTML rendered from `src/components/ds/` at build time. Seven React islands hydrate, each only where it is interactive:

| Island | Source | Pages | Directive | What it does once hydrated |
| --- | --- | --- | --- | --- |
| `SiteHeaderIsland` | `src/components/SiteHeaderIsland.tsx` | `/about/`, `/booking/requested/`, `/contact/`, `/donate/`, `/faq/`, `/terms-and-conditions/`, `/404` | `client:media="(max-width: 1099px)"` | The header's menu toggle below 1100px. Above that it stays static HTML (the only interactive part is the toggle) |
| `PageHero` | `src/components/PageHero.tsx` | `/`, `/booking/`, `/gallery/`, `/history/` | `client:media="(max-width: 1100px)"` | The overlay header's menu toggle on the hero pages. The query matches `bundle.css`, which shows the toggle at `max-width: 1100px` |
| `AvailabilityCalendar` | `src/components/booking/AvailabilityCalendar.tsx` | `/booking/` | `client:visible` | Fetches `GET /api/availability` (or `?fixture=1` when the page URL has it), draws the Sunday-first month grid (two months side by side from 1100px), roving tabindex with arrows, Home, End, PageUp and PageDown, a polite live region for month changes, a `role="status"` line for the chosen day. Picking an open or partly booked day opens the booking area: first the terms agreement (`TermsGate`, a checkbox whose label links to the terms; the agreement is kept for the visit in sessionStorage, added 2026-10-10), then, once the box is ticked, `CalBooker` (`React.lazy`) under the heading "Book <date>", which takes focus. On a fetch failure it shows the info Notice and the same gate, then `CalBooker` with no date, so booking never depends on the endpoint |
| `CalBooker` (loaded by the calendar, not a page island) | `src/components/booking/CalBooker.tsx` | `/booking/` | lazy chunk | `@calcom/embed-react` with `getCalApi({ namespace: 'reserve' })`, `cal('ui', { theme: 'light', layout: 'month_view', hideEventTypeDetails: false, cssVarsPerTheme })` built from `src/lib/cal-theme.ts`, `calLink` `serra-cross-park/reserve?month=YYYY-MM&date=YYYY-MM-DD`, remounted by `key={date}`. On `linkFailed` or 12 s of silence it renders `InquiryFallback` |
| `InquiryFallback` (inside CalBooker) | `src/components/booking/InquiryFallback.tsx` | `/booking/` | with CalBooker | A link to `https://cal.com/serra-cross-park/reserve`, a required terms checkbox (`TermsCheckbox`, the one the gate uses; an unticked send is stopped with a caution Notice and focus on the box) and the design system's `InquiryForm` with a "Start time" select (`start-time`, every hour from 8 AM to 6 PM, through the `timeField` prop added 2026-10-12) in place of the time-of-day chips, posted to the Netlify form `event-inquiry` with `terms=yes` (section 7); its "Inquiry sent" text comes through the `sentText` prop added 2026-10-12 (the office replies by email about the date and the site fee; the reservation is confirmed once the payment is processed) |
| `ContactForm` | `src/components/ContactForm.tsx` | `/contact/`, `/booking/` (`#questions`) | `client:visible` | The contact form: `Field`s, `ChoiceChips` for "regarding", honeypot, posts to Netlify Forms with `fetch('/')`, shows the "Thank you" state and moves focus to it, caution Notice on error. Before hydration the same form posts natively to `/contact/`. On the booking page (2026-10-12) it renders with "Booking an event" preselected, the title "Send your question" as an h3 and a secondary button, because the hero's "Book now" is that page's primary |
| `ZeffyEmbed` | `src/components/ZeffyEmbed.tsx` | `/donate/` | `client:visible` | Renders Zeffy's `[data-zeffy-embed]` container (plus a `<noscript>` give button), loads `https://www.zeffy.com/embed/v2/zeffy-embed.js` once, watches for the injected iframe. If the script errors or no iframe appears in 8 s, swaps in the fallback: a `give` button to `PAYMENTS.donateUrl` in a new tab and a plain iframe of the embed URL. The script container and the plain iframe are never in the DOM together |
| `GalleryLightbox` (two instances) | `src/components/GalleryLightbox.tsx` | `/gallery/` | `client:visible` | The unchanged `Gallery` followed by a native `<dialog>`. After hydration each photo becomes a button (`role="button"`, `tabIndex 0`, `aria-haspopup="dialog"`, "Open: <caption>") through the component's `imgProps` spread. Dialog shows the largest rendition and caption, Previous and Next (buttons and arrow keys), Close, Escape, body scroll lock, focus returned to the thumbnail |

Client bundles in `dist/_astro/`: `client.*.js` 134 KB (React DOM), `ds.*.js` 16 KB (the ported components that islands use), `react.*.js` 7 KB, `AvailabilityCalendar.*.js` 13 KB, `CalBooker.*.js` 15 KB (loaded only after a day is picked or in the fallback; the Cal.com embed script itself comes from cal.com at that point), `ContactForm.*.js` 3.6 KB, `GalleryLightbox.*.js` 3 KB, `ZeffyEmbed.*.js` 2.7 KB, `PageHero.*.js` 0.7 KB, `site.*.js` 0.7 KB, `SiteHeaderIsland.*.js` 0.3 KB. Pages without an island that matches (for example `/about/` on a 1280px screen) load no React at all.

## 6. The Netlify function

`netlify/functions/availability.mts`, Netlify Functions 2.0 API: `export default async (req: Request, context: Context) => Response` and `export const config = { path: '/api/availability' }`. `netlify.toml` points `functions` at `netlify/functions`. All logic is in `src/lib/availability.ts` (pure functions, tested); the `.mts` only fetches, merges and answers.

What it does: works out today in `America/Los_Angeles`, splits today through `BOOKING.horizonMonths` (12) into about-a-month chunks, fetches `https://api.cal.com/v2/slots?username=serra-cross-park&eventTypeSlug=reserve&start=…&end=…&timeZone=America/Los_Angeles` for each in parallel with header `cal-api-version: 2024-09-04` (plus `duration` when `BOOKING.slotDuration` is set, and `Authorization: Bearer` only when `CAL_API_KEY` is set in the environment), clips each chunk to its own range (Cal.com reads `start` and `end` as UTC instants, so a chunk carries a stray day before its start and a cut-short last day), merges and dedupes, counts open slots per day, and gives each day one status: `past`, `closed`, `soon`, `notyet`, `booked`, `partial` or `open` (a full day is `fullDaySlots[weekday]` when configured, else the most slots seen for that weekday anywhere in the horizon).

Response: `{ generatedAt, timeZone, start, end, days: { "YYYY-MM-DD": { status, open, of } } }` with `Cache-Control: public, max-age=60` and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600`. Nothing about who booked. On any Cal.com error: 502 `{ error: 'availability_unavailable', detail }` with `Cache-Control: no-store`; the calendar then falls back to the booker with no date. `?fixture=1` returns a deterministic fixture with `no-store`, everywhere except a Netlify production deploy (`CONTEXT === 'production'`).

How to test it:

1. **Locally, through the dev server.** `npm run dev`, then `curl "http://localhost:4321/api/availability?fixture=1"` and `curl -i "http://localhost:4321/api/availability"`. `scripts/dev-availability-plugin.mjs` (registered in `astro.config.mjs` as a Vite plugin) loads the `.mts` through Vite's SSR loader and answers that path; if it returns 404, the dev server predates the plugin, so stop it and start it again.
2. **Locally, with no server.** Node 22 can run the function as is: `node --experimental-strip-types --no-warnings -e "const m = await import('./netlify/functions/availability.mts'); const r = await m.default(new Request('http://x/api/availability?fixture=1'), {}); console.log(r.status, r.headers.get('cache-control'), Object.keys((await r.json()).days).length)"` (use `--input-type=module`). Drop `?fixture=1` for a live call to Cal.com.
3. **On a deploy preview.** `curl -i https://<preview>.netlify.app/api/availability` and check the status, both cache headers and the JSON shape; `?fixture=1` should also answer on a preview and must return 404-free live data only on production.
4. **With the Netlify CLI,** if installed: `netlify dev` serves the function at the same path.

Observed in this gate (direct call, method 2): fixture mode answered 200, `no-store`, 366 days from 2026-10-09 to 2027-10-09 with 254 open, 44 partial, 38 booked and 30 notyet. The live call answered 200 in 856 ms with both cache headers, 366 days, today `booked 0/4` (its slots have passed) and every other day `open 4/4`. That matches `docs/INTEGRATION-NOTES.md`: Cal.com offered four fixed 180-minute slots a day, every day (that must change to the published rule, a two-hour minimum at any start time from 8 AM to 8 PM; CONTENT-TODO items 11, 38 and 39), and none of the old site's 24 existing bookings are in it yet (item 13). Until they are, the calendar will show those dates as open.

## 7. Forms and field names

Both forms are Netlify Forms. Netlify registers a form from the built HTML, so each one has a hidden static copy with `data-netlify="true"` and `netlify-honeypot="bot-field"`; the islands post the same field names to `/` as `application/x-www-form-urlencoded` with `form-name` included. Forms do not run in local dev; test on a deploy preview with form detection turned on.

**`contact`** (`/contact/`, and since 2026-10-12 the `#questions` section of `/booking/`). Visible form: `src/components/ContactForm.tsx`, rendered as `<form name="contact" method="POST" action="/contact/">` with no `data-netlify` attribute (so Netlify's build step leaves the island's markup alone and hydration matches). Hidden twin in `src/pages/contact.astro`: `<form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>`. The booking page has no twin of its own: Netlify accepts the island's `form-name=contact` post from any page once the form is registered. Fields:

| Name | Type | Notes |
| --- | --- | --- |
| `form-name` | hidden | `contact` |
| `bot-field` | text | honeypot, labelled "Leave this field empty", `tabindex="-1"` |
| `first-name` | text, required | `autocomplete="given-name"` |
| `last-name` | text, required | `autocomplete="family-name"` |
| `email` | email, required | `autocomplete="email"` |
| `regarding` | radio | `Booking an event`, `Giving`, `Volunteering`, `History`, `Something else` (the values are the labels, so the notification reads "regarding: Booking an event"). The island requires a choice before sending; the native no-JavaScript post does not. The booking page preselects `Booking an event` |
| `message` | textarea, required | rows 6 |

Success: the form is replaced by a "Thank you" panel that takes focus. Failure: a caution Notice with the email address. Before hydration the form posts natively to `/contact/` with the same names, which Netlify accepts because the hidden twin registered the form.

**`event-inquiry`** (`/booking/`, only in the Cal.com failure path). Posted by `src/components/booking/InquiryFallback.tsx` from the design system's `InquiryForm`. Hidden twin in `src/pages/booking/index.astro`: `<form name="event-inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>`. Fields: `form-name` (`event-inquiry`), `bot-field`, `name`, `partner`, `email`, `phone`, `eventType`, `date` (date), `guests` (number), `start-time` (a select of hours, `08:00` to `18:00`, labelled 8 AM to 6 PM), `message`, `terms` (checkbox, `yes`). All but `terms` are exactly the names the ported `InquiryForm` posts (it serializes its own `FormData` and hands the pairs to `onSubmit`); `start-time` comes from the `timeField` prop added 2026-10-12 (DESIGN-SYSTEM-CHANGES.md) and replaced the design system's `block` chips, so Netlify re-registers the form with the new field on the next deploy (older submissions keep their `block` value in the Netlify UI); `terms` is added by the island from its required checkbox (2026-10-10), so the twin and the island match.

Netlify setup Luke does in the UI (BRIEF.md section 14): turn on form detection, send notifications for both forms to `admin@serracrosspark.com` (CONTENT-TODO item 27 asks whether a second address should receive them), and send one test submission of each.

## 8. Tests

`npx vitest run`: 5 files, 56 tests, all passing (4 files, 50 tests at the 2026-10-09 gate; the terms agreement added one file on 2026-10-10). `vitest.config.ts` includes `src/**/*.test.ts` and `netlify/**/*.test.ts`; there are no tests under `netlify/` because the function's logic lives in `src/lib/availability.ts`.

- `src/lib/availability.test.ts` (25 tests). Date helpers: today in America/Los_Angeles across UTC midnight and on the DST change day, `weekdayOf` zone-free, `addDays` and `addMonths` with month-end clamping, `eachDay` exclusive end, `monthChunks` contiguous ranges. Cal.com data: `countSlots`, `clipSlotData` dropping the stray day before a chunk and the cut-short end day, clip-then-merge of two live-shaped chunks to four slots on every day, `mergeSlotData` deduping a boundary day. `summarize`: weekend days with three blocks as open, partial and booked; learning four weekday slots and marking a partly booked one; a weekday closed when it never has slots; `notyet` after the last slot; `past` before today over the whole range; minimum notice at 0 and 2 days; `closed` ahead of `soon`; `fullDaySlots` over the learned maximum; a `fullDaySlots` entry of zero as closed. `buildResponse` envelope and `generatedAt`. `buildFixture`: deterministic, spans the horizon, weekend blocks, weekday slots, the last 30 days empty and the first two days soon.
- `src/lib/cal-theme.test.ts` (12 tests). `resolveToken` returns plain hex, follows one and two aliases, keeps rgba whole, throws for an unknown token. `CAL_LIGHT_VARS`: brand is navy, has every key the brief and Cal.com name and nothing else, no `{alias}` left, only hex, rgba or px values, paper text on the navy fill, strong line for borders people must see, square corners and a 1px booker border.
- `src/components/ZeffyEmbed.test.ts` (9 tests). `toZeffyEmbedUrl` inserts `/embed` after the language segment, accepts a lowercase segment, inserts first when there is none, leaves an embed URL alone, keeps the query, returns a non-URL unchanged. `toZeffyEmbedPath` returns the path with and without the segment, keeps the query, starts a non-URL with a slash.
- `src/components/booking/AvailabilityCalendar.test.ts` (4 tests). `monthGrid`: a month beginning on Sunday has no leading padding, a 31-day month starting on Saturday spans six rows, February 2028 has its leap day, every date is zero-padded.
- `src/components/booking/terms-agreement.test.ts` (6 tests, added 2026-10-10 with the terms agreement). `readAgreement` is false for an empty store and for no store, and true only for the exact value under `scp-terms-agreed`; `writeAgreement` stores and clears it; a store that throws reads as not agreed and the write reports false; `sessionStore()` is null outside a browser.

## 9. Structured data per page

All JSON-LD is `<script type="application/ld+json">` with `<` escaped. `src/layouts/BaseLayout.astro` puts one `@graph` on every page; two pages add a second script through the head slot.

**Every page** (`@graph`):

- `NGO` `@id https://serracrosspark.com#org`: name Serra Cross Conservancy, url, email `admin@serracrosspark.com`, `taxID` 20-8615264, `nonprofitStatus` Nonprofit501c3, PostalAddress (PO Box 48, Ventura, CA 93002-0048, US), `sameAs` the Facebook group.
- `TouristAttraction` `@id https://serracrosspark.com#park`: name Serra Cross Park, url, description, `geo` 34.2846018, -119.2962133, address Ventura CA US, `isAccessibleForFree` true, `publicAccess` true, `image` (that page's Open Graph image), `maintainer` the NGO by id.

**`/booking/`** adds `EventVenue` `@id https://serracrosspark.com#venue`: url `/booking/`, description (up to 300 seated or 500 standing), image (the hero's OG crop), address, geo, `maximumAttendeeCapacity` 500, `publicAccess` true, `isAccessibleForFree` true, `amenityFeature` wheelchair access and disabled parking, `openingHoursSpecification` Monday to Sunday 08:00 to 20:00 (09:00 until the hours changed on 2026-10-12), `containedInPlace` the park by id, `maintainer` the NGO by id.

**`/faq/`** adds `FAQPage` `@id https://serracrosspark.com/faq/#faq`, name "Frequently asked questions about Serra Cross Park", `mainEntity` of 20 `Question` items with `acceptedAnswer` text, generated from `src/content/faq.ts` so the data always matches the visible answers.

Validate on the deploy preview with Google's Rich Results Test and the Schema Markup Validator; the FAQPage and the EventVenue hours are the two most likely to draw a warning.

## 10. Design-system changes

`design-system/` is the read-only vendor snapshot (`design-system/SNAPSHOT.md` records artifact version 1791592653-9a7f). `src/components/ds/index.tsx` and `generated.ts` are the port. Every difference is logged in `DESIGN-SYSTEM-CHANGES.md` with exact re-apply steps; the summary:

1. **Real React import.** `declare const React: any` becomes `import * as React from 'react'`; `ReactNode` becomes `React.ReactNode`. Two type-only fixes that came with it: `Field`'s `inputMode` cast and `GivingForm`'s typed `tabs` array. No markup, class or prop changes.
2. **`linkedin` and `instagram` icons** added to `ICONS` in `generated.ts` (Lucide v0.469.0, same version as the set) and to the `IconName` union, for Luke Erickson's card on the About page.
3. **`SiteFooter` `credit` prop** (`{ label, href }`): renders one more `<p><a>` as the last child of `.sc-footer__legal`, for "Website by Luke Erickson". Markup is identical without it.
4. **`imgProps` on `Hero`, `FeatureCard`, `SignPanel`, `Gallery` items and `Timeline` items** (`React.ImgHTMLAttributes<HTMLImageElement>`, spread last onto the existing `<img>`), so pages can pass `srcSet`, `sizes`, `width`, `height`, `loading`, `decoding`, `fetchpriority` and `style` from `picture()` without touching markup or class names.
5. **`Hero` wrapper is a `<div>`, not a `<section>`** (accessibility): a `<header>` inside `<section>` is not a banner landmark. Class names and styling are unchanged. It takes full effect only once the hero also sits outside `<main>`, which is the BaseLayout slot change under finding 2 below.

Site-level overrides in `src/styles/site.css` (listed so a snapshot refresh checks them): `.sc-sign__figure img, .sc-tl__figure img { height: auto }` so the `height` attribute does not fight the figure's aspect ratio; the footer stacks to one column under 1100px because the email link cannot wrap between 901px and about 1105px.

Site components and islands built around unchanged components, not ported: `PersonCard.astro` (About cards from tokens), the availability calendar (`src/components/booking/availability-calendar.css` from tokens), `GalleryLightbox.tsx` (wraps `Gallery`; its page CSS in `src/styles/pages/gallery.css` draws an inset focus ring with `:has(img:focus-visible)`, makes captions click-through, spans cells on mobile, and mirrors `arrow-right` for the Previous button since the set has no `arrow-left`).

Noted and left alone in the ds port: `Notice` renders `<aside>`; the footer Contact `<ul>` and the header link lists use `list-style: none` without `role="list"`; `ChoiceChips` accepts no extra props, so the contact form's "Regarding" error is announced with `role="alert"` rather than tied to the fieldset; `InquiryForm` flips to its own "Thank you" synchronously inside its submit handler and only reads `sent` as an initial value, so on a failed post the visitor sees the confirmation first and then the caution Notice above it (a clean fix is an optional prop change in the port, logged under Planned territory, not made).

## 11. Findings from this gate

Nothing blocks a deploy preview. In order of weight:

1. **Five original JPEGs ride along in `dist/_astro/` (about 5.5 MB) that no page references.** `burned-debris-hillside-2017` (2690 x 1887, 2.5 MB), `burned-sign-posts-2017` (2583 x 3304, 2 MB), `burned-rampart-steps-2017` (1792 x 1195, 0.9 MB), `restoration-plan` (700 x 310) and `save-the-cross-poster-children` (270 x 188). Cause, confirmed in Astro 7.3.8's `assets/build/generate.js`: Vite emits the original of every imported image, and Astro deletes an original afterwards only if it went through the image service (`getImage`) and was never referenced raw. These five are imported by `src/content/photos.ts`, which every page imports, but no page renders them (no WebP renditions exist for them), so they are never transformed and never deleted. Visitors never download them; they only add to deploy size and upload time. Remedy, one of: remove the five entries and imports from `src/content/photos.ts` (the files can stay in `src/assets/photos/`, since an unimported file is not emitted); or render them somewhere through `picture()`, for example the three 2017 fire photos on the History page's fire section and `restoration-plan` on Donate, which also uses photos the brief asked for. `photos.ts` was outside this gate's files, so it was not changed. The earlier `stone-rampart-corner` leak another agent reported is gone.
2. **On the four hero pages the site header sits inside `<main>`, so there is no `banner` landmark** (`/`, `/booking/`, `/gallery/`, `/history/`; the seven light pages are fine). The ds `Hero` already renders a `<div>` (change 5 above); what remains is the BaseLayout change the accessibility pass asked for: a named slot (`<slot name="hero" />`) between the skip link and `<main>`, with the four pages passing `slot="hero"` on `<PageHero>`. `src/layouts/BaseLayout.astro` is a protected file in the agent tasks, so this is the orchestrator's call. The skip link itself is present and first in the body on every page.
3. **`README.md`, `LAUNCH-CHECKLIST.md` and `CLAUDE.md` do not exist yet** (BRIEF.md phase 5 and section 16). The Cal.com `?date=` result the README was meant to record lives in `docs/INTEGRATION-NOTES.md` for now. The launch checklist in BRIEF section 16 should also pick up CONTENT-TODO item 13 (enter the 24 existing bookings in Cal.com before launch) and item 31 (301s for `/thank-you`, `/booking_thanks.shtml` and `/home/`), neither of which is in `netlify.toml` yet.
4. **`srcSet` is emitted in camelCase in the static HTML** on every photo that goes through the ported components (`srcSet="…"`), because React 18's server renderer writes unknown-to-it attribute names as given, and `srcSet` is not in its mapping table (`tabIndex` and `crossOrigin` are). Browsers parse attribute names case-insensitively, so every `srcset` works, and `fetchpriority` is already passed lowercase for the same reason. If a validator complains, `src/lib/images.ts` can return the key as `srcset` with a cast. Astro's own `<Image>` output (the one lowercase `srcset` on `/about/` and `/history/`) is unaffected.
5. **Check calibration**, recorded in section 3: strip HTML comments before matching the footer text, and count primaries outside `<header class="sc-header">`.
6. **The live availability data is all-open.** Cal.com has four slots every day and none of the existing bookings, so until CONTENT-TODO items 11, 13 and 38 are closed the calendar shows every future day as Open 4 of 4 and the legend's "Partly booked" and "Booked" states only appear in fixture mode.

## 12. To check in a real browser

Collected from the stage agents' unresolved items, deduplicated and grouped. Everything here needs a browser, a deploy preview or a human; none of it could be settled from the build.

**Booking page and Cal.com**

- Pick a day in the availability calendar and confirm the embed opens on that date with its times listed (checked once against the dev server on 2026-10-09; re-check on the deploy preview). If a Cal.com update stops honoring `?date=`, set `SHOW_PICK_HINT = true` in `src/components/booking/CalBooker.tsx`.
- Inside the booker: text contrast with `CAL_LIGHT_VARS` (every pair at 4.5:1 or better), the iframe's title (Cal.com's markup), and the event title and description wording (CONTENT-TODO item 39: asterisk, title case and an all-caps warning, changed in the Cal.com dashboard, not in this repo).
- The failure path: block `app.cal.com` (or go offline) and confirm the `linkFailed` or 12-second timeout shows `InquiryFallback` with the Cal.com link and the inquiry form, and that a submission reaches Netlify Forms as `event-inquiry`. On a failed post the ds `InquiryForm` shows its "Thank you" before the caution Notice appears above it (section 10).
- Keyboard run end to end: arrows across a month edge, PageUp and PageDown onto a month that is off screen, focus landing on the group when a month has no enabled day, Enter and Space selecting, the live region reading "Showing November 2026", the booked-date status line, VoiceOver announcing the legend as a list.
- Reduced motion: the scroll to the booker uses `behavior: 'auto'` under `prefers-reduced-motion` (verified by reading the code only). Browsers without `@container` show the day mark only, never the detail words (same).
- The booker's responsive min-height is an inline `min(720px, max(560px, calc((100vw - 719px) * 1000)))`; confirm no jump at 719, 720 and 721px.
- `bookerReady` is caught through the `'*'` wildcard listener because `@calcom/embed-core` 1.5.3 does not type it; confirm the ready state clears the loading state on the preview.

**Donate page and Zeffy**

- The fallback branch (script error or 8 s with no iframe) was covered by code review and the SSR markup only. Block `www.zeffy.com` on a deploy preview and confirm the give button and plain iframe appear, and that the script container and the iframe are never both present.
- Container height: in the one browser test Zeffy left the container at its 800px starting height for the 12 s observed. Watch the preview with the Conservancy's real form for a `zeffy-embed:resized` message, and whether white space remains inside the card.
- Whether Zeffy's injected iframe carries a `title`, and Zeffy's own `scrollIntoView({ behavior: 'smooth' })` on step changes under `prefers-reduced-motion` (Zeffy's code; cannot be changed from our side).
- The Zeffy form text itself is in the Zeffy dashboard and needs the brand voice applied there.

**Forms on a deploy preview (Netlify Forms do not run locally)**

- A JavaScript submission of `contact` and of `event-inquiry`, received and notified at `admin@serracrosspark.com`.
- A native no-JavaScript POST of the contact form (`action=/contact/`, `form-name=contact`) accepted, including with no "regarding" radio chosen.
- The `bot-field` honeypot: a filled honeypot is dropped silently.

**Gallery and lightbox**

- Focus return after Escape in Safari and Firefox; the `:has()` inset focus ring in Firefox (121 and later); dialog scrolling at 200% zoom on a 375px viewport; a screen reader run of the open, Previous, Next and Close flow (the markup follows the native `<dialog>` pattern with `aria-label`, a live region and visible button text, but it was not tested with a screen reader).
- `cross-double-rainbow.jpg` is a 720px original, so the lightbox shows it soft on large screens until a bigger file arrives (CONTENT-TODO item 35). The hero photo (`coastline-salvia`) also appears in the park mosaic, so one photo shows twice on the page.

**Layout at every width**

- Every page at 375, 768, 1280 and 1440px, and at 200% zoom (text-only zoom too), for clipping, including the ds header's fixed `--header-height`. Pages whose agents could not screenshot every width: Donate (768, 1280, 1440), Booking (1440), Terms and Requested (all four), Contact (directions panel at 1280 and 1440, and the phone layout, verified by DOM measurement only), About (verified on a scratch build, not the shared dev server).
- Above 1200px the footer's email link extends 5px past its 198px column into the footer's padding; invisible today, but a refreshed `bundle.css` could let footer links wrap and change that.
- `ChoiceChips` labels on the contact form wrap to two lines at desktop widths with the design-system default grid; pass `columns={3}` if a tidier grid is preferred.
- Desktop hero geometry on History: the lower half of the Cross sits behind the title's scrim at 680px tall; the Cross is whole at every width checked, which is the hard rule.
- The timeline's "After the fire" banner photo (`volunteers-replanting`, 1800 x 460) renders thin at the component's 340px figure; kept because it is the only photo that shows replanting. The three archival originals (205 to 255px wide) are stretched to the 340px figure; CONTENT-TODO item 35 asks for larger scans.
- Dev-server only, not in the build: the header went missing below 1100px on no-hero pages in a stale dev session (a hydration crash in `SiteHeaderIsland` against a stale Vite bundle). A restart cleared it; the production build was never affected. Watch for it once after any dependency change.

**Lighthouse and landmarks**

- Lighthouse mobile on every page of the deployed site (targets: Accessibility 100, SEO 100, Best Practices 95, Performance 90). Expect the Cal.com and Zeffy iframes to cost Performance and Best Practices points on `/booking/` and `/donate/`, as BRIEF section 13 anticipates. Not run in any stage.
- Banner landmark and skip link on the four hero pages after the BaseLayout hero slot lands (finding 2).

**Content and facts (Luke, not a browser)**

- `CONTENT-TODO.md` items the pages write around: 2 (how the site fee is receipted and which payment step collects it with the reservation), 4, 5, 8, 11 and 38 (Cal.com slots versus published hours, confirmation on, future limit, success redirect to `/booking/requested/`), 12 (Tax ID against the IRS letter), 13 (existing bookings into Cal.com), 22, 24, 27, 29, 30, 33, 35, 36, 39, 41, 43. Items 7, 15, 18, 19, 20 and 37 were resolved on 2026-10-12 by the Conservancy's terms document and the owner's decisions. Since that date no page carries a "Pay the site fee" surface: the fee is paid in full with the reservation (docs/TERMS-SOURCE.md, 1.1), so the 501(c)(3) line appears in the footer and on `/donate/` only, and the brief's "every donation surface" question no longer arises.


## 13. Lighthouse (mobile, production build, 2026-10-09)

Run with Lighthouse 13.5 in headless Chrome against `npm run preview` (the production build on 127.0.0.1:4322), mobile form factor, after the font and header changes. `/booking/` and `/donate/` were measured without the Cal.com and Zeffy iframes mounted above the fold.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| / | 93 | 100 | 100 | 100 |
| /about/ | 94 | 100 | 100 | 100 |
| /history/ | 96 | 100 | 100 | 100 |
| /booking/ | 96 | 100 | 100 | 100 |
| /booking/requested/ | 97 | 100 | 100 | 66 (noindex on purpose) |
| /gallery/ | 88 | 100 | 100 | 100 |
| /faq/ | 98 | 100 | 100 | 100 |
| /contact/ | 94 | 100 | 100 | 100 |
| /donate/ | 96 | 100 | 100 | 100 |
| /terms-and-conditions/ | 98 | 100 | 100 | 100 |
| /404.html | 98 | 100 | 100 | 66 (noindex on purpose) |

What moved the numbers: self-hosting EB Garamond and stripping the render-blocking Google Fonts import (about 0.9 s of render delay on every page), WebP quality 75 with tighter srcset widths, and driving the header menu with a small script instead of hydrating React (Home went from 81 to 93; most pages now ship no JavaScript framework at all). The two 66s are the `is-crawlable` audit on pages that carry `noindex` by design. Gallery sits at 88 because its short hero photo is the largest contentful paint on a page that also loads two mosaics; the remaining savings Lighthouse lists are a few kilobytes per image. On Netlify, with HTTP/2 and the CDN, expect slightly better numbers than the local preview; the Cal.com and Zeffy iframes will cost Performance and Best Practices points on their pages once they load, as BRIEF.md section 13 anticipates (Zeffy also fails the back-forward cache audit because its iframe keeps a connection open).
