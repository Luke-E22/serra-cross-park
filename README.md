# Serra Cross Park website

## 1. What this is

This is the new serracrosspark.com, a static site that replaces the old WordPress site. It is built with Astro 7.3 and TypeScript, uses React 18.3 islands only where something is interactive, and deploys to Netlify from the private GitHub repo. Every visual decision comes from the Serra Cross Park design system, and every fact comes from one config file.

The site has three jobs, in this order:

1. Book weddings and events (`/booking/`).
2. Tell the story of the Cross (`/history/`).
3. Raise money to care for the hill (`/donate/`).

## 2. Run it locally

Node 22 on this Mac lives at `~/.local/node/bin` (no Homebrew, no nvm). Start every terminal session with this line, or add it to `.zshrc`:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Install dependencies once:

```bash
npm install
```

Start the dev server. It listens on http://localhost:4321 by default (the repo's `.claude/launch.json` runs it with `--port 4321 --host 127.0.0.1`):

```bash
npm run dev
```

In a normal terminal `npm run dev` runs in the foreground and holds the prompt; Ctrl+C stops it. Astro 7.3.8 can also run it detached: pass `--background` (`npm run dev -- --background`), and Astro does this on its own when an AI coding agent such as Claude Code starts it (`astro dev` detects the agent and returns to the prompt at once). A detached server is managed with these three commands.

```bash
npx astro dev status
```

```bash
npx astro dev logs
```

```bash
npx astro dev stop
```

Build the production site into `dist/`. The build runs `scripts/prelaunch-check.mjs` first (the `prebuild` script); it prints warnings and never fails the build.

```bash
npm run build
```

Serve the built site. By default it also uses port 4321, so stop the dev server first or pass another port, for example `npm run preview -- --port 4322`.

```bash
npm run preview
```

Run the unit tests (Vitest 5, 5 files, 56 tests):

```bash
npm test
```

Type-check the Astro files, components and pages:

```bash
npm run check
```

Run the prelaunch check on its own:

```bash
npm run prelaunch
```

Each `WARN` line is something to settle before launch. The check looks for five things: a `PAYMENTS` URL in `src/config/site.ts` that still contains `startup-ventura` (the placeholder Zeffy form), the Strong Glasgow demo font files still in `design-system/fonts/`, `BOOKING.calEventSlug` still set to `30min` (that Cal.com event does not exist), any `[CONFIRM: ...]` marker left in a file under `src/` (printed with file and line), and anyone in `PEOPLE` with no photo. On 2026-10-12 it prints 38 warnings. They go away as the launch checklist is worked through.

Two things to know about dev mode:

- **The Cal.com booker paints blank in `npm run dev`.** The iframe mounts with the right URL but shows nothing. In the production build it renders. Check the booker with `npm run build` then `npm run preview`, or on a Netlify deploy preview. It was verified in a real browser on 2026-10-09: with a day picked, the embed opens on that date with its times listed.
- **`/api/availability` is served differently in each mode.** In `npm run dev`, `scripts/dev-availability-plugin.mjs` (a Vite plugin registered in `astro.config.mjs`) runs the real function from `netlify/functions/availability.mts`. `npm run preview` does not serve it, so the booking page in preview takes the fallback path (a Notice, the terms agreement, then the booker with no date). To see the real function on the built site, use the Netlify CLI (section 9).

If the dev server ever crashes islands with `_jsxDEV is not a function`, a production build has poisoned the dev cache. `astro.config.mjs` already keeps one Vite cache per npm script (`node_modules/.vite-dev`, `node_modules/.vite-build` and so on), so this should not recur. If it does, clear the caches and restart dev:

```bash
rm -rf node_modules/.vite*
```

## 3. Where things live

```
design-system/                  read-only snapshot of the Claude Design system (see SNAPSHOT.md). Never edit.
  tokens.css, tokens.json       colors, type, spacing. Loaded globally by BaseLayout.
  components/bundle.css         the components' CSS. Loaded as is, minus the Google Fonts import.
  components/src/               the components' source, ported to src/components/ds/.
  fonts/                        Strong Glasgow demo files (license before launch).
src/
  config/site.ts                every fact, link and setting: SITE, BOOKING, PAYMENTS, PEOPLE, NAV.
  content/faq.ts                the FAQ, grouped. Feeds the FAQ page and its FAQPage structured data.
  content/timeline.ts           the history timeline, entry by entry.
  content/photos.ts             the photo manifest: file, alt, caption, orientation, uses.
  assets/photos/                the 30 park photos, originals, kebab-case names.
  assets/people/                board and staff photos (luke-erickson.webp so far).
  components/ds/                the ported design system (index.tsx, generated.ts). Changes logged in DESIGN-SYSTEM-CHANGES.md.
  components/booking/           AvailabilityCalendar.tsx, CalBooker.tsx, InquiryFallback.tsx, calendar-grid.ts,
                                TermsCheckbox.tsx and terms-agreement.ts (the terms agreement before the booker).
  components/                   ContactForm, ZeffyEmbed, GalleryLightbox, PageHero, PersonCard, SiteHeaderIsland.
  layouts/BaseLayout.astro      head, SEO tags, structured data, footer, global CSS.
  lib/availability.ts           the day-status logic behind the calendar, pure and tested.
  lib/cal-theme.ts              Cal.com embed colors, built from tokens.json.
  lib/images.ts                 picture() and ogImage().
  pages/                        one .astro file per page; booking/index.astro and booking/requested.astro.
  scripts/header-menu.ts        the menu toggle, inlined on every page (no React needed for it).
  styles/site.css               site-level styles from tokens; styles/pages/*.css per page; fonts.css.
netlify/functions/availability.mts   the one serverless function, GET /api/availability.
netlify.toml                    build settings, redirects from the old site, security headers.
scripts/
  prelaunch-check.mjs           the warnings described above.
  dev-availability-plugin.mjs   serves /api/availability in npm run dev.
  strip-google-fonts-plugin.mjs removes bundle.css's Google Fonts @import at build time.
public/                         favicon.svg, robots.txt, self-hosted EB Garamond (fonts/eb-garamond),
                                and docs/serra-cross-park-terms-and-conditions.pdf, the published terms PDF.
docs/                           BUILD-REPORT.md, INTEGRATION-NOTES.md and TERMS-SOURCE.md (the text of the
                                Conservancy's terms document); docs/source/ holds the original PDF.
```

## 4. Edit content and facts

**Facts.** `src/config/site.ts` holds every fact, link and setting: the address, email, Tax ID, map coordinates, Facebook and Instagram links, the booking settings, the payment links, the board and staff, the header links and the footer columns. Change a value there once and it lands on every page and in the availability function. Event rules (payment, refunds, insurance, parking, what is not allowed) come from the Conservancy's own terms document, `docs/TERMS-SOURCE.md`, which wins over the brief where they disagree; no phone number is published on the site (emergencies go to 911, everything else to the office email).

**FAQ.** `src/content/faq.ts`. Three groups: booking, on the day, visiting. Each entry has a question, a plain-text answer that starts with the answer, and an optional link. The same text feeds the FAQ page and its `FAQPage` structured data, so keep answers free of markup.

**History timeline.** `src/content/timeline.ts`. One entry per event: `year` (written exactly as the source gives it), `title` (two to five words), `text` (one to three short sentences), an optional `photo` key from `photos.ts` and an optional `caption`.

**Page copy.** Each page is one file in `src/pages/`. Copy sits in the markup; facts are imported from `site.ts`. The comment at the top of each page says which brief sections and open questions shaped it.

**Voice.** The brand book (`design-system/README.md`) wins every argument. Write headings, labels and buttons in sentence case; the display styles set the capitals. Short sentences, one idea each. No em dashes: use a period, a comma or a colon. No exclamation marks. "We" is the Conservancy, "you" is the visitor. Spell out one to ten in prose; use figures for prices, times, dates and guest counts. Money words: a gift or donation is tax-deductible; a site fee is due when the booking is submitted and is non-refundable. The booking page carries the board's sentence of 2026-10-14 calling reservation payments tax-deductible donations, pending the accountant (CONTENT-TODO item 2); the Terms page and the FAQ make no claim either way, so never add "not a donation" or "not tax-deductible" back, and never repeat the tax claim elsewhere until the accountant confirms it. Keep the facts identical everywhere: $300 per hour with a two-hour minimum, 8 AM to 8 PM daily at any start time (no fixed blocks), everyone off the hill by 8 PM when the gates lock, two 20-amp circuits and no water, restrooms or lighting on site, up to 250 people, the site fee due when the booking is submitted and the reservation confirmed by email once the payment is processed (no hold), one free change of date or times by email, insurance for any event with catered food, beverages or a reception, parking for 35 vehicles inside the gates, Tax ID 20-8615264.

**Open questions.** `CONTENT-TODO.md` lists 43 things to confirm, each with where it came from. Where a question shaped the wording, the code carries a `[CONFIRM: item N, ...]` marker in a comment (never in visible text). The prelaunch check prints every marker with its file and line, so the list shrinks as you answer the items and delete the markers.

## 5. Swap or add photos

Site photos:

1. Drop the original in `src/assets/photos/` with a descriptive kebab-case name, for example `ceremony-rose-arch-wedding-party.jpg`.
2. Import it at the top of `src/content/photos.ts` and add an entry to `PHOTOS` with `file`, `image`, `alt` (what is in the frame), `caption` (what and where), `orientation` (`wide`, `tall`, `square` or `banner`), `archival` (true for historical photos), `uses` (where it may appear, for example `gallery-weddings` or `history`) and `source`.
3. In a page, run it through `picture()` from `src/lib/images.ts` and hand the result to the component:

```ts
const p = PHOTOS['ceremony-rose-arch-wedding-party'];
const pic = await picture(p.image, { widths: [400, 752, 1128], sizes: '(min-width: 1200px) 376px, 50vw', alt: p.alt });
```

`picture()` returns `src`, `alt`, `width`, `height` and `imgProps` (a WebP `srcSet`, `sizes`, dimensions and lazy loading). Spread `imgProps` onto the component's `imgProps` prop (`Hero`, `FeatureCard`, `SignPanel`, `Gallery` items and `Timeline` items take it) or onto a plain `<img>`. Pass `priority: true` for the one above-the-fold photo on a page. `ogImage()` makes the 1200 x 630 card image and fails the build if the source is smaller than that, so pick a large photo for it.

Board and staff photos: put a square file of at least 560 px in `src/assets/people/` and set `photo` on the person in `PEOPLE` in `site.ts`. Luke Erickson's entry (`photo: 'luke-erickson.webp'`) is the worked example. Anyone without a photo shows initials, and the prelaunch check says so.

Rules from the brand book: real park photos only, no stock. Never crop through the Cross; use a `position` that keeps it whole. Archival photos stay small (the timeline keeps them to 340 px), captioned, and never colorized. Alt text says what is in the frame.

## 6. Cal.com

**What the site reads.** Account `serra-cross-park`, event slug `reserve` (title "Private Event / Wedding"). The brief's `30min` slug does not exist. The availability function calls Cal.com's public slots API, `https://api.cal.com/v2/slots` with the header `cal-api-version: 2024-09-04`, which answers without a key. The booker is Cal.com's own embed (`@calcom/embed-react`), so the booking rules (hours, start times, minimum length, minimum notice) live in the Cal.com dashboard, never in code.

**`BOOKING` in `src/config/site.ts`.**

- `calUsername` and `calEventSlug`: the account and event. `CAL_BOOKING_PAGE_URL` (https://cal.com/serra-cross-park/reserve) is built from them for the fallback link.
- `timeZone`: `America/Los_Angeles`. "Today" is worked out in this zone.
- `horizonMonths` (12): how far ahead the calendar shows and how far the function fetches.
- `minNoticeDays` (0): days inside this window show "Not available online". With 0, today reads "Booked, 0 of 4" after its last start time has passed. Set 1 to show "Not available online" instead, mirroring Cal.com's minimum notice.
- `fullDaySlots` (null): how many slots make a fully open day, by weekday (0 is Sunday). Leave null and the function learns it: a full day is the most slots seen for that weekday anywhere in the horizon. Set it only if a weekday is often fully booked across the whole year.
- `slotDuration` (null): minutes, sent as `duration` to the slots API. On 2026-10-09 the `reserve` event offered 2, 3, 4 and 5 hours with 3 hours as the default, and the API answers for the default when nothing is sent. The default must become 2 hours to match the published two-hour minimum (CONTENT-TODO item 39). Set this only if the calendar should count a different length.

**How the calendar works.** `/api/availability` fetches the horizon in about-a-month chunks, counts open slots per day and gives each day one status: past, closed, soon, notyet, booked, partial or open. Nothing about who booked; Cal.com only returns open times. Responses are cached 60 seconds in the browser and 5 minutes on Netlify's CDN; a slightly stale day cannot cause a double booking because the booker always checks live. As read on 2026-10-09, Cal.com offers four fixed 180-minute slots a day at 8, 11, 2 and 5 Pacific, every day, so the calendar shows every day as open until the dashboard is set to the published rule (8 AM to 8 PM, any start time, two-hour minimum) and the existing bookings are entered.

**The booker's date.** Picking a day mounts the embed with `calLink` set to `serra-cross-park/reserve?month=YYYY-MM&date=YYYY-MM-DD`. Verified in a real browser on 2026-10-09: the booker opens on that month with that day selected and its times listed. So `SHOW_PICK_HINT` in `src/components/booking/CalBooker.tsx` stays `false`. If a Cal.com update stops honoring `date`, set it to `true` and the page shows "Choose <date> in the calendar below if it is not already selected." above the embed.

**Fallbacks.** Booking never depends on our endpoint.

- If `/api/availability` fails, the page shows a Notice ("Live availability is not loading right now") and renders the terms agreement at once; ticking the box mounts the booker with no date.
- If the Cal.com script fails or stays silent for 12 seconds, `InquiryFallback` takes its place: a link to the public booking page, a required terms checkbox and the design system's inquiry form, posted to the Netlify form `event-inquiry` with `terms=yes`.
- Without JavaScript, a Notice links to the public booking page and the park office email.

**`CAL_API_KEY`.** Not needed today. Only if Cal.com starts refusing anonymous slot requests with 401 or 403: create an API key in Cal.com, add `CAL_API_KEY` as an environment variable in the Netlify UI (Site configuration, Environment variables), and redeploy. The function then sends it as a bearer token. Never put it in the repo; `.env.example` shows the variable with an empty value.

**Dashboard settings still to change.** Turn "Requires confirmation" on so a booking never confirms itself: the slot stays blocked while unconfirmed, and the park office confirms the reservation by email once its payment is processed (the terms document, clause 1.1; CONTENT-TODO item 43). Set a future limit that matches `horizonMonths`. Set the success redirect to https://serracrosspark.com/booking/requested/. Add booking questions (event type, guest count, a required "I agree to the terms and conditions" checkbox linking to https://serracrosspark.com/terms-and-conditions/, so the agreement is stored with each booking). Make the availability match the published rule: 8 AM to 8 PM every day, any start time (30-minute steps, or 60-minute steps if Luke wants hourly starts), a two-hour minimum with 2 hours as the default length; the four fixed 180-minute slots at 8, 11, 2 and 5 go, and no weekend exception is needed since the 7:30 PM end was dropped on 2026-10-12. Enter or block the 24 approved bookings from the old WordPress calendar (through April 2028), or the new calendar shows those dates as open. Confirm the event title and description wording inside the booker. The full list is in `LAUNCH-CHECKLIST.md`; the settings as read on 2026-10-09 are in `docs/INTEGRATION-NOTES.md`.

## 7. Zeffy

**`PAYMENTS` in `src/config/site.ts`.** `donateUrl` is the form embedded on `/donate/`. `siteFeeUrl` is the site-fee payment form. Since 2026-10-12 the fee is collected with the reservation (the Conservancy's terms document, clause 1.1), so no page shows a "Pay the site fee" button; which form or payment step collects the fee with the reservation is CONTENT-TODO item 2. Paste the public form URL in each (`https://www.zeffy.com/en-US/donation-form/<slug>`); the embed path is derived from it.

**The embed.** `src/components/ZeffyEmbed.tsx` renders Zeffy's `[data-zeffy-embed]` container with `data-form-url` set to the embed path (`/en-US/embed/donation-form/<slug>`, a path and not a full URL, or the form 404s inside the iframe), loads `https://www.zeffy.com/embed/v2/zeffy-embed.js`, and lets the script inject and size its iframe. Zeffy's form handles the amounts, so the design system's `GivingForm` is not used.

**The fallback.** If the script fails to load, or no iframe appears within 8 seconds, the container is replaced by a `give` button ("Give on Zeffy", new tab) and a plain iframe of the embed URL. Without JavaScript, the give button shows alone.

**The placeholder warning.** `PAYMENTS` now holds the Conservancy's own form, `donate-to-serra-cross-park` (set 2026-10-12), so this warning no longer fires. It returns if a URL containing `startup-ventura` is ever pasted back in. The prelaunch check warns while any `PAYMENTS` URL contains `startup-ventura`. Replace both with Serra Cross Conservancy's own donation form and site-fee form before launch, and confirm the receipt treatment of reservation payments with the Conservancy's accountant (a Zeffy donation form issues a donation receipt; whether the fee may be receipted as a donation is CONTENT-TODO item 2). Details in `docs/INTEGRATION-NOTES.md`.

## 8. Deploy

**GitHub.** The private repo already exists: https://github.com/Luke-E22/serra-cross-park (remote `origin`, branch `main`; the history runs from the Phase 0 scaffold to the owner feedback commit of 2026-10-10). Commit and push from GitHub Desktop. The terminal git on this Mac (`/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin/git`) can commit but cannot push over https, because it has no credential helper. `/usr/bin/git` works again once the Xcode license is accepted:

```bash
sudo xcodebuild -license
```

**Netlify.** The next step.

1. In Netlify, add a new site from Git and pick `Luke-E22/serra-cross-park`. The build settings come from `netlify.toml`: command `npm run build`, publish `dist`, functions `netlify/functions`, Node 22. Leave the fields as Netlify fills them.
2. Under Site configuration, Forms, turn on form detection. The two forms are `contact` and `event-inquiry`.
3. Under Site configuration, Notifications, Form submission notifications, send submissions of both forms to admin@serracrosspark.com.
4. Add `CAL_API_KEY` under Environment variables only if Cal.com starts refusing anonymous requests (section 6).
5. On the first deploy preview, check: a test submission of each form arrives; `/booking/` loads the live calendar, picking a day opens the booker on that date, and `/api/availability` answers JSON with the two cache headers; `/donate/` shows the Zeffy form; `/calendar/` redirects to `/booking/#availability` and `/shop/anything` to `/donate/`.
6. Domain. Add serracrosspark.com under Domain management. Before changing DNS, copy the current MX and TXT records into Netlify DNS (or keep DNS where it is and point an A or CNAME record at Netlify) so admin@serracrosspark.com keeps working.
7. Back up the WordPress site and keep it running until DNS has switched and the new site answers on the domain.
8. After launch, submit `https://serracrosspark.com/sitemap-index.xml` in Google Search Console (the old site's verification tag is carried in `BaseLayout.astro`, so the property stays verified) and spot-check the old URLs.

## 9. Tests and checks

**Vitest.** `npm test` runs five files, 56 tests, in well under a second.

- `src/lib/availability.test.ts` (25): date helpers across UTC midnight and DST, chunking, clipping and merging Cal.com data, every day status (the fixture's weekend and weekday slot counts, learned weekday counts, closed weekdays, minimum notice, the end of the window, the past), the response envelope and the fixture.
- `src/lib/cal-theme.test.ts` (12): token aliases resolve to plain colors, the embed gets every key the brief and Cal.com name, paper text on navy, square corners.
- `src/components/ZeffyEmbed.test.ts` (9): the embed URL and embed path derived from a form URL, with and without a language segment.
- `src/components/booking/AvailabilityCalendar.test.ts` (4): the month grid (padding, six-row months, leap day, zero-padded dates).
- `src/components/booking/terms-agreement.test.ts` (6): the sessionStorage helpers behind the terms agreement (an empty or missing store, the exact stored value, write and clear, a store that throws, no store outside a browser).

**Type check.** `npm run check` runs `astro check`. For the function and scripts too:

```bash
npx tsc --noEmit -p tsconfig.json
```

**Lighthouse.** Build, serve the built site on 4322, then run Lighthouse (the CLI defaults to the mobile form factor) against each page:

```bash
npx lighthouse http://127.0.0.1:4322/ --chrome-flags="--headless" --output html --output-path ./lighthouse-home.html
```

Final run on the production build, 2026-10-09: performance 93 to 98 on every page except Gallery at 88; accessibility 100 and best practices 100 everywhere; SEO 100 on every indexable page and 66 on the two `noindex` pages (`/booking/requested/` and `/404`), by design. The table, the reasons and what moved the numbers are in `docs/BUILD-REPORT.md` section 13. Expect the Cal.com and Zeffy iframes to cost a few points on their pages once they load.

**Netlify CLI.** To run the real function, the redirects and the headers on the built site, build first and then:

```bash
npx netlify-cli serve --offline
```

It serves on http://localhost:8888. Verified on 2026-10-09: `/api/availability` answers JSON with `Cache-Control: public, max-age=60` and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600`; the redirects answer 301; the security headers are present; an unknown path answers 404. Netlify Forms do not run locally; test them on a deploy preview.

## 10. Documents

- `BRIEF.md`: the build brief. Pages, configuration, the booking design, facts, quality bar, repo and launch rules. For event rules, the terms document below wins.
- `docs/TERMS-SOURCE.md`: the text of the Conservancy's Special Event Terms and Conditions (supplied 2026-10-12), the source of every event rule on the site. The PDF itself is in `docs/source/` and published from `public/docs/serra-cross-park-terms-and-conditions.pdf`.
- `CONTENT-INVENTORY.md`: the old WordPress site, page by page, verbatim, with every image.
- `CONTENT-TODO.md`: 45 open questions for Luke, each with where it came from.
- `DESIGN-SYSTEM-CHANGES.md`: every difference between `design-system/` and `src/components/ds/`, and how to re-apply each one when the snapshot is refreshed.
- `LAUNCH-CHECKLIST.md`: what has to happen before DNS switches.
- `CLAUDE.md`: the rules future coding sessions must follow in this repo.
- `docs/BUILD-REPORT.md`: pages, islands, forms, structured data, tests, the function, Lighthouse.
- `docs/INTEGRATION-NOTES.md`: Cal.com and Zeffy as they were found on 2026-10-09, and the Netlify details.
- `design-system/SNAPSHOT.md` and `design-system/README.md`: where the snapshot came from, and the brand book.
- `.env.example`: the one environment variable, with the rule for it.
