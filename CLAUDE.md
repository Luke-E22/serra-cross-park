# CLAUDE.md

Rules for every Claude Code session on this repo, condensed from BRIEF.md. The brief wins any argument this file does not settle. Where docs/INTEGRATION-NOTES.md records a live check that contradicts the brief (the Cal.com event slug, for one), the notes win. Where docs/TERMS-SOURCE.md (the Conservancy's own terms document, supplied 2026-10-12) states an event rule, the document wins over the brief, the brand book and any older copy.

## 1. What this is

The new serracrosspark.com: a static Astro site for Serra Cross Park and Serra Cross Conservancy, a 501(c)(3) nonprofit (Tax ID 20-8615264), replacing a WordPress site. The owner is Luke Erickson (lukeericksonwork@gmail.com); the private repo is github.com/Luke-E22/serra-cross-park (branch `main`) and Netlify deploys it.
Three jobs, in this order: 1. Book weddings and events. 2. Tell the story of the Cross. 3. Raise money to care for the hill. Every page pushes toward one of them.

## 2. Read first

In this order, before changing anything:

1. `BRIEF.md`: the whole brief. Section 9 is the source of facts, except event rules, which come from the next file.
2. `docs/TERMS-SOURCE.md`: the Conservancy's Special Event Terms and Conditions, the source of every event rule (payment, refunds and rescheduling, insurance, time overruns, rentals, alcohol, confetti, public access, water, restrooms, lighting, trash, parking, prohibited activities, liability). The PDF is in `docs/source/` and published from `public/docs/serra-cross-park-terms-and-conditions.pdf`.
3. `CONTENT-TODO.md`: 45 open questions for Luke. The site keeps neutral wording until each is answered. Add to it; never delete an open item.
4. `DESIGN-SYSTEM-CHANGES.md`: every difference between `design-system/` and `src/components/ds/`, each with a re-apply note.
5. `docs/INTEGRATION-NOTES.md`: what Cal.com, Zeffy and Netlify really do, from live checks on 2026-10-09.
6. `docs/BUILD-REPORT.md`: pages, islands, forms, tests, structured data and the Lighthouse numbers.

`CONTENT-INVENTORY.md` is the old site, verbatim. Open it only when you need the old wording.

## 3. Hard rules

**Design system**
- Never edit anything under `design-system/`. It is a read-only snapshot (see `design-system/SNAPSHOT.md`).
- Ported components live in `src/components/ds/` (`index.tsx`, `generated.ts`). Change one only by adding an optional prop; keep markup and class names as they are. Log every change in `DESIGN-SYSTEM-CHANGES.md` with what, why, which component, and an exact re-apply note.
- Site styles go in `src/styles/site.css` and `src/styles/pages/*.css` and read tokens from `design-system/tokens.css`. No Tailwind, no other UI library.

**Facts and content**
- Every fact, link and setting comes from `src/config/site.ts`. Pages and the function import it. Never type a fact inline.
- Facts come from `BRIEF.md` section 9 and, for event rules, `docs/TERMS-SOURCE.md`, and nowhere else. The terms document wins where they disagree. Never invent a fact. Timeline dates stay exactly as written in the brief.
- An unconfirmed fact gets neutral wording, a `[CONFIRM: ...]` marker in a code comment (never in visible text, alt, aria-label or title) and a numbered entry in `CONTENT-TODO.md`. `scripts/prelaunch-check.mjs` lists the markers.
- FAQ text lives in `src/content/faq.ts`, the timeline in `src/content/timeline.ts`, photo alt text and captions in `src/content/photos.ts`.

**Voice** (`design-system/README.md`, Content fundamentals)
- Warm, plain, rooted. Short sentences, one idea each. Concrete detail, no hype.
- Sentence case for headings, labels and buttons; the display styles set the capitals.
- No em dashes (use a period, comma or colon). No exclamation marks. Nothing from the "Not" column of the brand book's table.
- "We" is the Conservancy. "You" is the couple, the family or the visitor.
- Numbers: spell out one to ten in prose ("a two-hour minimum"); figures for prices, times, dates and guest counts ($300, 8 AM, 8 PM, March 31, 1782, 250 people). A time range reads "8 AM to 8 PM" (the booking tile included, since the board's note of 2026-10-14).
- Names: Serra Cross Park (the place), Serra Cross Conservancy (the nonprofit), the Cross (capital C when it means this one), Father Junípero Serra with the accent, Mission San Buenaventura, the Channel Islands, the Thomas Fire.

**Money words**
- A gift or donation is tax-deductible. A site fee is due in full when the booking is submitted and is non-refundable; one change of date or times is free, subject to availability. Nothing on the site mentions a hold on a date.
- The booking page carries the board's sentence of 2026-10-14, as written: "All reservation payments are tax-deductible donations that directly support the beautification, care and preservation of this historical venue." That claim is pending the accountant (CONTENT-TODO item 2): do not repeat it anywhere else, and do not contradict it either. The Terms page, the FAQ and every other surface say only that the fee reserves the date and is non-refundable. Never add "not a donation" or "not tax-deductible" back.
- The nonprofit line, "Serra Cross Conservancy is a 501(c)(3) nonprofit. Tax ID 20-8615264.", appears in the footer of every page and on every donation surface.

**Buttons**
- One `primary` per view, counted in page content outside the header. `give` is only for money. Donate is the only `give` in the header.
- `give` buttons link to `/donate/` or to `PAYMENTS.donateUrl` (the Zeffy fallback). Nowhere else. The site fee is collected with the reservation, so no page carries a "Pay the site fee" button or link (owner's decision, 2026-10-12).

**Layout, shape, motion**
- Alternate `.sc-section` and `.sc-section--alt`. At most one `.sc-section--dark` (navy) per page above the footer.
- Square corners. Borders, not shadows. Status never relies on color alone: pair every color with a mark and words.
- Motion is quiet: no parallax, autoplay or scroll animation. Everything stops under `prefers-reduced-motion`.

**Photos**
- Real park photos only, from `src/assets/photos/`. No stock. Never crop through the Cross; check hero crops at 375 and 1440.
- Archival photos stay small (340px at most in the timeline), captioned and never colorized.
- Alt text says what is in the frame. Every photo goes through `picture()` in `src/lib/images.ts`, which sets `srcset`, `sizes`, `width` and `height`. Lazy below the fold; only the hero is `priority`.
- People photos: a square file in `src/assets/people/`, named in `PEOPLE[].photo` in `site.ts` (Luke Erickson is the worked example). No photo means the initials placeholder.

**Structure and access**
- URLs keep the old paths with trailing slashes (`trailingSlash: 'always'`). Every internal link ends in `/`.
- One `h1` per page. Landmarks, the skip link, the design system's focus ring everywhere. WCAG 2.1 AA. Booking works with a keyboard alone.

**Owner decisions already applied (2026-10-10). Do not undo them.**
- Running text is one step larger than the token scale, set in `src/styles/site.css` (logged in `DESIGN-SYSTEM-CHANGES.md`).
- `FactGrid` sets the words "to" and "or" inside a value in the serif (logged).
- The Home page has no fact grid under the hero. The booking page keeps its fact grid.
- Luke Erickson has a photo on his About card. The park Instagram (`SITE.instagram`) shows in the footer and on the Contact page.
- There are no fixed weekend slots. Events run at any start time, with a two-hour minimum at $300 per hour; setup and breakdown sit inside booked time. Everyone is off the hill by 8 PM, when the gates lock. Never reintroduce the old fixed weekend times or any "blocks" wording, on the site or in the documents.
- The booking flow asks people to agree to the terms and conditions before the Cal.com booker opens, and the fallback inquiry form has a required `terms` checkbox (the hidden Netlify twin in `src/pages/booking/index.astro` carries it too).

**Owner decisions already applied (2026-10-12). Do not undo them.**
- Hours are 8 AM to 8 PM every day (9 AM to 8 PM before this date). The booking tile read "8 to 8" until 2026-10-14; it now reads "8 AM to 8 PM" (board's note: add AM and PM). Any start time, two-hour minimum, setup and breakdown inside booked time.
- The rule "weekend events end by 7:30 PM" is dropped everywhere (CONTENT-TODO item 15, resolved). Guests and equipment are off the hill by 8 PM, when the gates lock.
- Power: on this date the owner said there was none, and the site said so. Superseded on 2026-10-14 by the board's copy notes (see below): there are two 20-amp outlets.
- The terms gate on the booking page shows the agreement's highlights in bold. Since 2026-10-14 they follow the board's copy notes: the park entrance always remains open; no restrooms or lighting on site; all trash and decor must be removed after the event; booked time must include setup and breakdown for you and your vendors. It never says "no power".
- The inquiry form (the fallback when Cal.com cannot load) asks for a start time from a list of hours, 8 AM to 6 PM (the last start that fits a two-hour minimum before 8 PM), labeled "Start time", with a note that bookings are at least two hours.
- The booking page offers two ways in, side by side in the hero: "Book now" (primary, to `#availability`) and "Ask a question" (secondary, to `#questions`, a section near the end of the page with the `ContactForm` island, "Booking an event" preselected, posting to Netlify Forms). The FAQ "Booking questions" section stays.
- The Conservancy's own Special Event Terms and Conditions (`docs/TERMS-SOURCE.md`; PDF in `docs/source/` and `public/docs/`) are the source of event rules and win over the brief and the brand book. The booking flow is: pick a date and time, agree to the terms, send your request, the site fee is collected with the reservation, and the park office emails the confirmation once the payment is processed. There is no hold and no "14 days" anywhere, and no separate "pay the site fee" step, button or link. Payments are non-refundable; one reschedule at no charge, subject to availability, by email to admin@serracrosspark.com. Insurance (a one-day $1 million liability policy, proof emailed seven days before) for any event with catered food, beverages or a reception, not receptions only. Overruns cost $300 per hour. Clients bring and remove their own chairs, tables, tents and decor. Alcohol only through a licensed provider, never self-served. No synthetic confetti or petals. The gates stay open to the public from dawn to dusk and cannot be locked; signs, security or a volunteer at the gate are allowed. No water, no restrooms (portable ones; Friday delivery and Monday pickup for weekend events), no lighting anywhere including the parking lot. Leave the park as found or a one-time trash fee may apply. Parking for 35 vehicles in designated areas inside the gates, at the owner's risk; the old entrance-street, fire-lane, valet and shuttle wording is gone. No smoking, fireworks, open flames, firearms or vehicles on the grass; illegal activity ends the event. The client carries liability and holds the park harmless.
- The phone number that was on the Contact page and in the FAQ is no longer published anywhere (CONTENT-TODO item 20). Emergencies: 911. Everything else: `SITE.email`. `SITE.emergencyPhone` is gone from `src/config/site.ts`; do not add a phone number back without the owner.

**Board copy notes applied (2026-10-14). Do not undo them.**
- A board reviewer's copy notes for the Plan your event page are the content of that page; only the surface was tidied into the brand voice (sentence case, "or" for "and/or"). Where they state a fact, they win over the brief, the terms basics and the owner notes above.
- The page's surface, as the board set it: hero title "Events with a view" (eyebrow "Weddings and events"); the rules section eyebrow "Rates and requirements" with the board's two-sentence intro; three tiles (Guests "Up to 250" people, Hours "8 AM to 8 PM", Rate $300 per hour with a two-hour minimum; no Minimum tile); the board's four rules in the board's order, with "or" for "and/or" and "vacate" kept; the power notice; steps 2 and 3 in the board's words; the calendar section titled "Booking calendar". The terms gate and the fallback form say "Check the box", matching step 2's "checking the box". The fallback inquiry form's Guests field reads "Up to 250 people." with a maximum of 250 (InquiryForm `guestsHelp` and `guestsMax`, logged).
- Capacity is "Up to 250 people" everywhere (FAQ, Terms basics, booking page, Home card). Never "seated", "standing", 300 or 500: the board has not fact-checked those figures (CONTENT-TODO item 3, resolved).
- There is power at the park: two 20-amp outlets, enough for a small sound system. There is no water, no restrooms and no lighting, and bringing any of those is the client's choice, never a requirement (CONTENT-TODO item 41, resolved). Wording: "Two 20-amp outlets. No water, restrooms or lighting."
- Hours stay 8 AM to 8 PM at any start time, two-hour minimum at $300 per hour, the fee due when the booking is submitted, non-refundable, one change of date or times at no charge subject to availability.
- The booking page's "tax-deductible donations" sentence is the board's and stays as written until the accountant rules (CONTENT-TODO item 2). See Money words above for what every other page may say.

## 4. How the site is built

- Astro 7.3, `output: 'static'`, `build.format: 'directory'`, TypeScript. One page per file in `src/pages/`; each imports its own CSS from `src/styles/pages/` at the top of its frontmatter.
- React 18.3 islands only where something is interactive: `AvailabilityCalendar` (`client:visible`, `/booking/`), `ContactForm` (`client:visible`, `/contact/` and, with "Booking an event" preselected, the `#questions` section of `/booking/`), `ZeffyEmbed` (`client:visible`, `/donate/`), `GalleryLightbox` twice (`client:idle`, `/gallery/`). `CalBooker` and `InquiryFallback` load lazily inside the calendar. Everything else is static HTML.
- The header: `SiteHeader` (through `SiteHeaderIsland.tsx` and `PageHero.tsx`) renders statically. `src/scripts/header-menu.ts`, loaded from `BaseLayout.astro`, drives the menu toggle, so no React ships for it.
- `src/layouts/BaseLayout.astro` props: `title`, `description`, `path`, `ogImage`, `ogImageAlt`, `active`, `hero`, `titleSuffix`. It renders the head, canonical, Open Graph, the Search Console tag, site-wide JSON-LD (NGO and TouristAttraction), the skip link, the header on no-hero pages, `<main id="main">` and `SiteFooter`. Pages add their own JSON-LD or meta through `<Fragment slot="head">`.
- Images: `picture()` and `ogImage()` in `src/lib/images.ts`. Photos are registered in `src/content/photos.ts` (file, alt, caption, orientation, archival, uses). To add one: drop the file in `src/assets/photos/`, import it there, add an entry.
- Content: `src/content/faq.ts` (also feeds the FAQPage JSON-LD), `src/content/timeline.ts`, and `src/config/site.ts` (SITE, BOOKING, PAYMENTS, PEOPLE, CREDIT, NAV, FOOTER_COLUMNS).
- Availability: `netlify/functions/availability.mts` fetches Cal.com's public slots API (no key; `CAL_API_KEY` only if Cal.com ever refuses) and answers at `/api/availability` with CDN caching. All status logic is pure in `src/lib/availability.ts` and tested. `?fixture=1` returns a fixture outside production.
- Cal.com facts: username `serra-cross-park`, event slug `reserve` (the brief's `30min` does not exist). As read on 2026-10-09: a 180-minute default with 2h to 5h offered and four fixed slots a day at 8, 11, 2 and 5 Pacific. That must change to match the published rule: a two-hour minimum (default 120 minutes), flexible start times (30-minute steps, or 60-minute steps if the owner wants hourly starts), 8 AM to 8 PM every day (CONTENT-TODO items 11, 38 and 39). `BOOKING.minNoticeDays` is 0; set it to 1 to show today as "Not available online" instead of "Booked, 0 of 4". Booking rules live in Cal.com, never in code.
- Dev bridge: `scripts/dev-availability-plugin.mjs` serves `/api/availability` in `astro dev`. `npm run preview` does not serve it, so the booking page in preview takes the fallback path (Notice, the terms agreement, then the booker). `npx netlify-cli serve --offline` (port 8888) runs the real function on the built site.
- Vite cache: `astro.config.mjs` sets `vite.cacheDir` per npm script (`node_modules/.vite-dev`, `.vite-build`). If an island crashes with "_jsxDEV is not a function": `rm -rf node_modules/.vite*` and restart dev.
- Fonts: EB Garamond is self-hosted from `public/fonts/eb-garamond/` through `src/styles/fonts.css`; `scripts/strip-google-fonts-plugin.mjs` removes the Google Fonts import from `bundle.css` at build time. Strong Glasgow in `design-system/fonts/` is the personal-use demo; the three digit-only `@font-face` rules at the top of `bundle.css` go when the licensed files arrive.
- Forms: Netlify Forms `contact` and `event-inquiry`. Each island form has a static copy in the page HTML with the same `name` and field names. They do not run locally; test on a deploy preview.

## 5. Before you finish any change

Run from the repo root:

```sh
export PATH="$HOME/.local/node/bin:$PATH"
npm run check                        # astro check: 0 errors, 0 warnings
npx tsc --noEmit -p tsconfig.json    # also walks netlify/ and scripts/
npm test                             # vitest: 56 tests pass
npm run build                        # prebuild runs scripts/prelaunch-check.mjs
grep -rn $'\xe2\x80\x94' src                      # em dashes: must print nothing
grep -rnE $'\x21[[:space:]"\'<]|\x21$' src        # exclamation marks in prose: must print nothing
```

- The prelaunch WARN lines (36 on 2026-10-14: placeholder Zeffy URLs, demo fonts, `[CONFIRM` markers, missing people photos) are expected until launch. Any other build output is a bug.
- After content or layout changes, run the per-page `dist/` script from `docs/BUILD-REPORT.md` section 3: one `h1`, the footer line, canonical, one dark section, one primary, no em dash, no exclamation mark, no `[CONFIRM`.
- Open every changed page in a browser at 375 and 1440 (also 768 and 1280 for layout work). Use the production build for anything on `/booking/`: the Cal.com booker iframe is blank in `astro dev` and renders in `npm run preview` or on Netlify.
- Tab through anything you touched. The focus ring must show; status must read without color.
- Keep Lighthouse where it is (mobile, production build, 2026-10-09): performance 93 to 98 on every page except Gallery at 88, accessibility 100 and best practices 100 everywhere, SEO 100 on indexable pages. Details in `docs/BUILD-REPORT.md` section 13.
- When Cal.com or Zeffy settings change, update `docs/INTEGRATION-NOTES.md` in the same change.

## 6. Working on this Mac

- Node 22 lives at `~/.local/node/bin` (no Homebrew, no nvm). Start every shell with `export PATH="$HOME/.local/node/bin:$PATH"`.
- `/usr/bin/git` and `python3` are blocked by an unaccepted Xcode license (`sudo xcodebuild -license` fixes it). Until then, commit with `"/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin/git"` (2.53). Pushing over https from the terminal fails with that binary (no credential helper). Pushes happen in GitHub Desktop, or from the terminal once the license is accepted and `gh auth login` has run. `gh` is installed but not signed in.
- Luke also commits from GitHub Desktop while work is in progress. Check `status` and `log -3` with that git binary before you commit.
- `astro dev` (Astro 7.3.8) detects an AI coding agent and starts the dev server detached, so in a Claude Code session `npm run dev` returns at once. (In Luke's own terminal it runs in the foreground unless he passes `--background`.) Use `npx astro dev status`, `npx astro dev logs` and `npx astro dev stop`. It listens on port 4321, on 127.0.0.1 through the launch entries below.
- Preview in the Browser pane with the `serra-dev` (4321) and `serra-preview` (4322) entries, present in both `~/.claude/launch.json` and the repo's `.claude/launch.json`.
- Dev-only quirk: the Cal.com booker iframe mounts with the right URL but paints blank in `astro dev`. In the production build it opens on the chosen date with its times (`?month=YYYY-MM&date=YYYY-MM-DD` is honored, verified 2026-10-09), so `SHOW_PICK_HINT` in `src/components/booking/CalBooker.tsx` stays `false`.
- `curl "http://127.0.0.1:4321/api/availability?fixture=1"` checks the dev bridge without calling Cal.com.

## 7. Commit style

- Commit at the end of each piece of work, with a message that says what changed and why, in plain sentences. Then give Luke a three-line update.
- Never commit secrets. `.env` is ignored; `.env.example` stays empty. `CAL_API_KEY`, if ever needed, goes in the Netlify UI only.
- The repo stays private while the Strong Glasgow demo files are in `design-system/fonts/`.
- Do not push from the terminal. Tell Luke what to push from GitHub Desktop.
