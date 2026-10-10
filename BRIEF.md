# Brief: build the new Serra Cross Park website

You're building a new website for Serra Cross Park (serracrosspark.com) to replace an old WordPress site. Use the Serra Cross Park design system for every visual decision, pull the content and photos from the current site, and ship a static site that deploys to Netlify from GitHub. Work in phases and commit after each one. When a fact is missing, mark it and keep going instead of guessing.

## 1. Context

Serra Cross Park is a one-acre park on the hill above Mission San Buenaventura in Ventura, California, cared for by Serra Cross Conservancy, a 501(c)(3) nonprofit (Tax ID 20-8615264). The site has three jobs, in this order:

1. Book weddings and events.
2. Tell the story of the Cross.
3. Raise money to care for the hill.

Every page pushes toward one of those. The owner of this project is Luke Erickson. Ask him only when you're truly blocked.

## 2. Inputs

**Design system.** `design-system/` in this repo is a snapshot of the Claude Design system at https://claude.ai/artifact/UtB96z9HZjcMmSauYGDafs. Read `design-system/SNAPSHOT.md`, then `design-system/README.md` (the brand book), then every `components/<Name>/README.md` and `preview.html`. If your session has a tool that can read claude.ai artifacts, check the live system for newer files before you start. If `design-system/` is missing, stop and ask Luke for the zip.

**Current site.** https://serracrosspark.com. Pages: `/`, `/about/`, `/history/`, `/calendar/`, `/booking/`, `/gallery/`, `/faq/`, `/contact/`, `/donate/`, `/terms-and-conditions/`. Fetch every page. Pull all body text and every image. WordPress serves resized copies like `photo-1024x683.jpg`; strip the `-WIDTHxHEIGHT` suffix to get the original. Write `CONTENT-INVENTORY.md` (each page's text and images) before you build.

**Booking.** Cal.com account `serra-cross-park`, event type slug `30min`. The booking rules (hours, blocks, minimums) are configured inside Cal.com. Don't re-implement them in code. Luke's embed snippet is in section 7c.

**Payments.** Zeffy. The only link so far is `https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura`. That is Startup Ventura's form, not the Conservancy's. Use it as a placeholder only (sections 6 and 8).

## 3. Decisions already made

- **Stack:** Astro (current stable), static output, TypeScript, React islands through `@astrojs/react`. Use React 18.3 to match the design system if the current `@astrojs/react` supports it, otherwise React 19 (the components only use standard hooks). Hydrate only what is interactive.
- **UI:** the design system's components, ported into the site and rendered by Astro. No other UI library. No Tailwind.
- **Booking:** Cal.com does the booking. You build an availability calendar on top of it that shows each day as Open, Partly booked or Booked, using Cal.com's public slots API through a Netlify Function. Clicking a day opens Cal.com's booker on that date.
- **Forms:** Netlify Forms.
- **Hosting:** private GitHub repo, deployed by Netlify. One Netlify Function for availability.
- **URLs:** keep the old site's paths, with trailing slashes, so search rankings carry over.
- **Navigation:** header links are History, About, FAQ, Contact, plus the Donate button and a "Plan your event" button that goes to `/booking/`. Gallery is not in the header. It lives in the footer, as the last section of Home, and on the booking page.

## 4. Design system rules

The brand book wins every argument. The rules people break most:

- **Voice:** warm, plain, rooted. Short sentences. No em dashes. No exclamation marks. Write sentence case; the display styles set the capitals. "We" is the Conservancy, "you" is the visitor.
- **Money words:** a gift is tax-deductible. A site fee reserves a date, is non-refundable, and is never called tax-deductible or a donation.
- **Buttons:** one `primary` per view. `give` is only for money. Donate is the only `give` button in the header.
- **Layout:** alternate `surface` and `surface-alt` sections. At most one navy section per page above the footer.
- **Shape:** square corners. Borders, not shadows. Status never relies on color alone.
- **Photos:** real park photos only, no stock. Never crop through the Cross. Archival photos stay small, captioned and never colorized. Alt text says what is in the frame.
- **Motion:** quiet. No parallax, autoplay or scroll animation. Respect reduced motion.
- **Nonprofit line:** "501(c)(3)" with Tax ID 20-8615264 in the footer of every page and on every donation surface.

**Porting the components.** Copy `design-system/components/src/index.tsx` and `generated.ts` into `src/components/ds/`. Replace the `declare const React: any` line with a real React import and keep everything else identical: markup, class names, props. Load `design-system/tokens.css` and then `design-system/components/bundle.css` once, globally, in that order (bundle.css adds digit-only font faces that must come after the full faces). Never edit anything inside `design-system/`. Site styles go in `src/styles/site.css` and use the tokens. If a component truly needs a change, such as `srcset` on `Hero` or `Gallery`, add an optional prop without changing its markup or classes and log it in `DESIGN-SYSTEM-CHANGES.md`.

**Fonts.** The Strong Glasgow files are the demo build, personal use only (see `design-system/fonts/LICENSE-NOTE.md`). Use them for development, keep the repo private, and put the license swap on the launch checklist.

## 5. Pages

Use the components named. Copy comes from the current site, tightened to the brand voice. Facts come from section 9.

**Home `/`**
1. `Hero` (full height, `cross-olive-panorama.jpg`) carrying `SiteHeader` with `overlay`. Primary button "Plan your event" to `/booking/`. Secondary "Our history" to `/history/`.
2. `FactGrid`: guests, hours, rate, setting.
3. Three `FeatureCard`s: Weddings (navy) to `/booking/`, History (green) to `/history/`, Give (ochre) to `/donate/`.
4. Stonework teaser (`SignPanel`, navy) linking to `/about/#stonework`.
5. The page's navy section: the Thomas Fire and the replanting, a `give` button to `/donate/`, and the Tax ID line.
6. Gallery strip of six photos linking to `/gallery/`. The last section before the footer.

**About `/about/`**: who the Conservancy is and what it does: keeps the Cross where it stands, keeps the land an open park for everyone, and improves it over time. Donations pay for insurance, water, electricity, landscaping, litter pickup and improvements, and volunteers do routine care and special projects. Then a navy `SignPanel` "The stonework" (`id="stonework"`), an ochre `SignPanel` "After the Thomas Fire", the board of directors, and a short brick band "Visit the park" linking to `/contact/#directions`.

*Board of directors* (`id="board"`): one card each for Barbara Asbell, Jan Schmutte, Dave Schmutte, Angie Hecht, Karen Greenough, Luke Erickson and Christy Weir, in that order. Then a short "Staff" row with one card: Amber Weir, Reservation Specialist. She isn't a board member, so keep her out of the board grid.

- Each card: a square photo slot, the name as a display `label`, and an optional role line in `body-sm`, `ink-muted`. Amber's reads "Reservation Specialist". Board members get one only if Luke supplies officer titles.
- Photo placeholders: until real photos arrive, fill the slot with `sandstone` and the person's initials in the display face, in navy. No stock photos or silhouettes. The photo or placeholder is decorative (empty `alt`) because the name sits right under it. Adding a photo is one line in `PEOPLE` (section 6).
- Luke's card adds two text links with icons: "LinkedIn" (https://www.linkedin.com/in/luke-erickson) and "Instagram" (https://www.instagram.com/luke_erickson), with accessible names like "Luke Erickson on LinkedIn". The design system's icon set has neither, so add Lucide's `linkedin` and `instagram` from the same version (v0.469.0) to the ported `generated.ts`.
- The design system has no person card. Build one from tokens: square corners, a `line` border, no shadow, four across on desktop and two on mobile. Log the new card and the two icons in `DESIGN-SYSTEM-CHANGES.md`.

**History `/history/`**: `Hero` (tall), a short intro, then `Timeline` with every dated event in section 9. Use `junipero-serra-portrait.jpg`, `archive-mission-church.jpg`, `archive-cross-gathering.jpg`, `thomas-fire-cross.jpg`, and the current site's history and burned-hillside photos where they fit. Close with a giving band.

**Plan your event `/booking/`**: section 7.

**Gallery `/gallery/`**: a short `Hero`, then `Gallery` sections (Weddings and events, The park). Follow the Gallery README: mix tall and wide photos in every six and fill each row. Add a small lightbox island: native `<dialog>`, arrow keys between photos, Escape closes, focus returns to the thumbnail, caption shown.

**FAQ `/faq/`**: three `FAQList`s grouped Booking, On the day, Visiting. Every answer starts with the answer. Add `FAQPage` structured data.

**Contact `/contact/`**: the contact form (section 12), email, mailing address, Facebook group, and a brick `SignPanel` "Directions" (`id="directions"`) with the driving directions, a "Get directions" link to Google Maps for the park's coordinates, and a `Notice` that Brakey Road is closed to vehicles. If you embed a map, lazy-load it below the fold.

**Donate `/donate/`**: why give (replanting after the Thomas Fire and year-round upkeep), the Zeffy form (section 8), the Tax ID line, and a line inviting volunteers to the contact form.

**Terms `/terms-and-conditions/`**: the current terms, cleaned up and matched to section 9. Linked from the booking page.

**Booking requested `/booking/requested/`**: where Cal.com sends people after they book (Luke sets that redirect in Cal.com). What happens next, plus a `give` button "Pay the site fee" linking to the site-fee link.

**404**: short, with links to Home, Plan your event and Contact.

**Header:** `SiteHeader` with links History, About, FAQ, Contact; `donateHref="/donate/"`, `bookHref="/booking/"`, `bookLabel="Plan your event"`; `overlay` on pages with a hero; `active` set per page.

**Footer:** `SiteFooter` with two columns, "The park" (About, History, Gallery, FAQ) and "Plan and give" (Plan your event, Donate, Contact, Terms). Pass the Tax ID, email, location and Facebook link from config. Add the credit "Website by Luke Erickson" to the legal row, linking to https://lukeerickson.com. `SiteFooter` has no slot for it, so give the ported component an optional `credit` prop that renders one more `<p>` inside `.sc-footer__legal`, and log it in `DESIGN-SYSTEM-CHANGES.md`.

## 6. Configuration

Every fact, link and setting lives in `src/config/site.ts`, imported by pages and by the function:

```ts
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
  emergencyPhone: '805-258-3153',
};

export const BOOKING = {
  calUsername: 'serra-cross-park',
  calEventSlug: '30min',    // update if Luke renames the Cal.com event
  timeZone: 'America/Los_Angeles',
  horizonMonths: 12,        // how far ahead the calendar shows
  minNoticeDays: 0,         // mirror Cal.com "minimum notice"
  fullDaySlots: null as null | Record<number, number>, // optional: slots in a fully open day, by weekday (0 = Sunday)
  slotDuration: null as null | number,                 // minutes; only if the Cal.com event offers several durations
};

// PLACEHOLDER: these are Startup Ventura's Zeffy form.
// Replace both with Serra Cross Conservancy's own forms before launch.
export const PAYMENTS = {
  donateUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura',
  siteFeeUrl: 'https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura',
};

type Person = { name: string; title?: string; photo?: string; links?: { label: string; href: string }[] };

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
```

Add `scripts/prelaunch-check.mjs` and run it before every build. It prints warnings and never fails the build. Warn when a payment URL still contains `startup-ventura`, the Strong Glasgow demo files are still in place, `calEventSlug` is still `30min`, any `[CONFIRM` marker remains in `src/`, or someone in `PEOPLE` still has no photo.

## 7. Plan your event page and the availability calendar

This page carries the site's first job. Sections, in order:

1. `Hero` (tall, `reception-umbrellas.jpg`). Eyebrow "Weddings and events". A title along the lines of "Married on the hill".
2. **What to know before you book.** Luke wants the rules stated above the calendar. `FactGrid`: Guests 300 (seated, up to 500 standing); Hours 9 to 8 (daily); Rate $300 (per hour, two-hour minimum); Weekends 9 to 12, 1 to 4, 5 to 8. Then a short list: weekend events end by 7:30 PM; guests and equipment are off the hill by 8 PM, when the gates lock; booked time includes setup and breakdown; the grounds stay open to the public; the site fee is non-refundable. Then at most two `Notice`s: no restrooms or water on site, and receptions need a $1 million one-day event insurance policy. Link to the FAQ and the terms.
3. **Availability calendar** (`id="availability"`), with the Cal.com booker below it.
4. **How booking works.** The page's navy section, with `Steps` (tone dark): Pick a date and time. Send your request. We confirm and hold your date for 14 days. Pay the site fee. Get your confirmation letter.
5. **Gallery:** six wedding and event photos, linking to `/gallery/`.
6. **Booking questions:** the FAQ's Booking group, linking to `/faq/`.

### 7a. Availability endpoint: `netlify/functions/availability.mts`

Use the current Netlify Functions API (`export default async (req: Request) => Response` with `config.path = '/api/availability'`).

- Call Cal.com's public slots API from today through `horizonMonths`, in chunks of about a month, in parallel:
  `GET https://api.cal.com/v2/slots?username=serra-cross-park&eventTypeSlug=30min&start=YYYY-MM-DD&end=YYYY-MM-DD&timeZone=America/Los_Angeles`
  with the header `cal-api-version: 2024-09-04`. Add `duration` when `slotDuration` is set. The response maps each date to its open slots: `{ status, data: { "2026-11-14": [{ start }], ... } }`.
- It shouldn't need a key. Test it with `curl` in phase 0. If Cal.com answers 401 or 403, read `process.env.CAL_API_KEY`, send `Authorization: Bearer <key>`, and ask Luke to add that variable in Netlify. Never commit a key.
- Work out "today" in America/Los_Angeles, not UTC.
- Count open slots per date. A fully open day's count is `fullDaySlots[weekday]` when configured; otherwise it's the most slots seen for that weekday anywhere in the horizon. Far-out dates are almost always empty, so this learns the schedule from Cal.com on its own.
- Give each date one status:
  - `past`: before today.
  - `closed`: its weekday never has slots in the horizon.
  - `soon`: inside `minNoticeDays`.
  - `notyet`: after the last date that has any slot.
  - `booked`: zero slots.
  - `partial`: more than zero, fewer than a full day.
  - `open`: a full day.
- Return `{ generatedAt, timeZone, start, end, days: { "YYYY-MM-DD": { status, open, of } } }`. Nothing about who booked. Cal.com only returns open times anyway.
- Cache: `Cache-Control: public, max-age=60` and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600`. A slightly stale day can't cause a double booking, because the Cal.com booker always checks live.
- On any Cal.com error, return 502 with a short JSON error. The page falls back (7d).
- Keep the status logic in a pure function (`src/lib/availability.ts`) and test it with Vitest: weekend days with three blocks, partly booked days, booked days, closed weekdays, minimum notice, the end of the booking window, and the Pacific time zone boundary.
- Add a fixture mode (`?fixture=1`, local dev only) so the calendar can be built and checked without Cal.com.

### 7b. Calendar island: `src/components/booking/AvailabilityCalendar.tsx`

- A month grid, Sunday first, with previous and next month buttons, limited to the horizon. One month on mobile; two side by side from 1100px if it fits cleanly.
- Legend: Open, Partly booked, Booked, Not available online (that last one covers past, closed, soon and notyet).
- Status reads without color. Pair every color with a mark and with words. For example: open is a plain day on `surface-raised` with a `line-strong` border; partly booked adds a half-filled marker and "2 of 3 open" where there's room; booked is `sandstone` with the date struck through; not available is muted and inert. The selected day is navy with paper text and the check icon, like a checked `ChoiceChip`. Build it from tokens in `site.css`.
- Each day is a button at least 48px square with a full accessible name, for example "Saturday, November 14, 2026. Partly booked, 2 of 3 times open." Arrow keys move between days (roving tabindex), Home and End jump within the week, Page Up and Page Down change month, Enter or Space selects. Announce month changes in a polite live region.
- Choosing an open or partly booked day mounts the booker (7c) directly below, scrolls it into view and moves focus to its heading ("Book Saturday, November 14"). Choosing a booked day shows one line instead: "That date is booked. Try a nearby date or contact the park office."
- Show a quiet skeleton grid while loading. Hydrate with `client:visible`.

### 7c. Booker: `src/components/booking/CalBooker.tsx`

Built with `@calcom/embed-react` from Luke's Cal.com snippet:

```tsx
// Luke's snippet from Cal.com, for reference
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function MyApp() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"theme":"light","cssVarsPerTheme":{"light":{"cal-brand":"#Faeeaa"},"dark":{"cal-brand":"#7E3B36"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  return <Cal namespace="30min"
    calLink="serra-cross-park/30min"
    style={{width:"100%",height:"100%",overflow:"scroll"}}
    config={{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}}
  />;
};
```

Keep the namespace, the month layout, the small-screen slots view, the light theme and `hideEventTypeDetails: false`. Change four things:

1. **Colors from tokens.** `#FAEEAA` isn't in the design system, and light text on it fails contrast. Build `cssVarsPerTheme.light` from `design-system/tokens.json` at build time, resolving aliases (CSS variables don't cross into the iframe): `cal-brand` navy, `cal-brand-emphasis` navy-deep, `cal-brand-text` paper, `cal-text` and `cal-text-emphasis` ink, `cal-text-subtle` ink-muted, `cal-bg` surface-raised, `cal-bg-subtle` surface-alt, `cal-bg-emphasis` sandstone, `cal-border` and `cal-border-subtle` line, `cal-border-emphasis` and `cal-border-booker` line-strong, `cal-border-booker-width` 1px, `radius` 0px. Drop the dark theme; the design system has one theme. Look at the rendered booker in a real browser and fix any text pair under 4.5:1.
2. **calLink from config plus the chosen date:** `` `${calUsername}/${calEventSlug}?month=YYYY-MM&date=YYYY-MM-DD` ``. Remount the embed when the date changes (`key={date}`). Confirm in a real browser that the booker opens on that date. If `date` is ignored, keep `month` and show a line above the booker: "Choose November 14 in the calendar below." Record what worked in the README.
3. **Container:** `width: 100%`, a min-height that keeps the page from jumping, and `overflow: auto` instead of `scroll`.
4. **Load on demand:** only after a day is picked (or in the fallback below).

### 7d. Fallbacks

- If `/api/availability` fails, show a `Notice` ("Live availability isn't loading right now. You can still pick a date below.") and render the booker right away with no date. Booking must never depend on our endpoint.
- If the Cal.com script can't load (blocked or offline), show a link to the Cal.com booking page built from config (`https://cal.com/serra-cross-park/30min`) and the design system's `InquiryForm`, wired to a Netlify form named `event-inquiry`.

## 8. Payments (Zeffy)

- **Donate page:** embed the Zeffy form using Zeffy's script embed with its iframe fallback, pointed at the form in `PAYMENTS.donateUrl`. Zeffy's embed path is `/embed/donation-form/<slug>` (optionally with a language prefix such as `en-us`) and its script is `https://www.zeffy.com/embed/v2/zeffy-embed.js`. Check Zeffy's help center for the current snippet. If the embed can't load, show a `give` button that opens the link.
- **Don't use the design system's `GivingForm`.** Zeffy can't receive an amount chosen on our page, so people would pick their amount twice. Zeffy's form handles amounts.
- **Site fee:** a `give` button "Pay the site fee" on `/booking/requested/` and next to the booking steps, linking to `PAYMENTS.siteFeeUrl`.
- Every other `give` button links to `/donate/`.

## 9. Facts (source of truth)

Use these exactly. They come from the design system's brand book and the current site. Where the two disagreed, the brand book won, and the conflict is listed for Luke below.

| Topic | Use this |
| --- | --- |
| Organization | Serra Cross Conservancy, a grassroots 501(c)(3) nonprofit, Tax ID 20-8615264 |
| The park | One acre on the hill above Mission San Buenaventura, in Grant Park, Ventura. Views of the Pacific and the Channel Islands. |
| Rate | $300 per hour, two-hour minimum. Booked time includes vendor and client setup and breakdown. |
| Site fee | Reserves the date. Non-refundable. Not tax-deductible. |
| Hours | Events 9 AM to 8 PM, daily, year-round |
| Weekend blocks | 9 to 12, 1 to 4, 5 to 8. Weekend events end by 7:30 PM. |
| Closing | Guests and equipment off the property by 8 PM. Gates lock at 8 PM. |
| Capacity | Up to 300 seated or 500 standing |
| Holds | The park office confirms your date and holds it for 14 days while the site fee arrives, then sends a confirmation letter. |
| Public access | The grounds stay open to the public during every event. |
| Power | Two 20-amp circuits at the base of the Cross, enough for a small sound system |
| Restrooms and water | None on site. Rent portable restrooms. Bring water. |
| Lighting | The park isn't lit. Evening events bring their own lighting. |
| Seating | Not provided. Rent from a rental company. |
| Changing rooms | None |
| Trash | Cans on site, but all event trash leaves with you. |
| Alcohol | Allowed with event insurance and a licensed caterer. No self-service alcohol. |
| Insurance | Receptions need a $1 million one-day special event policy. |
| Parking | Along one side of the entrance street, keeping the fire lane open. Valet suggested for more than 100 guests. Shuttles are yours to arrange. |
| Accessibility | Wheelchair access and disabled parking |
| Emergencies | 911. Other: 805-258-3153 |
| Directions | From the 101, exit California Street and turn right. Head north on California toward City Hall. In front of City Hall, turn right on Poli Street and follow it several blocks. Turn left on Kalorama, then left on Summit, and follow the signs to parking. Brakey Road is closed to vehicles. |
| Contact | admin@serracrosspark.com. Serra Cross Conservancy, P.O. Box 48, Ventura, CA 93002-0048. Facebook group. |

**History timeline.** Keep dates exactly as written.

- **March 31, 1782, Easter Sunday:** Father Junípero Serra founds Mission San Buenaventura and plants a wooden cross on the beach south of the present church. It is the ninth mission he founded, and his last. He stays three weeks, then leaves for Santa Barbara.
- **Soon after:** a large wooden cross goes up on the hill above the Mission, a landmark for travelers.
- **1860s:** the original cross, worn down by the weather, is replaced.
- **November 5, 1875:** the second cross blows down in a storm. The hill goes almost 40 years without one.
- **September 9, 1912, Admission Day:** members of the E.C.O. Club, a women's service organization, raise a new wooden cross at the current site.
- **1918:** Kenneth and Tonie Grant give 107 hillside acres to the City of San Buenaventura. It becomes Grant Park.
- **Around 1920:** the first roads to the Cross are built.
- **March 31, 1932:** for the 150th anniversary Mass, a circular stone pedestal and a concrete path are built.
- **1941:** the city replaces the 1912 cross with the one that stands today.
- **Spring 2003:** a threatened lawsuit over city ownership of the Cross, on church and state grounds.
- **July 31, 2003:** the City Council votes to sell the Cross and an acre around it to the highest bidder.
- **January 2010:** stoneworkers from around the world build the ramparts in ten days, led by a family from Japan that has built castle walls for eight generations, using stone from an Ojai quarry. Dry-stone walling: no mortar, held by gravity. The Stone Foundation brought "rock knockers" from several states to learn the method. A hand-carved stone sphere sits on one rampart.
- **December 5, 2017:** the Thomas Fire burns much of the park. Firefighters save the Cross.
- **After the fire:** Pete Dufau of Dufau Landscape in Ventura donates and installs part of the new landscaping. Volunteers keep replanting.

**Start `CONTENT-TODO.md` with these open questions.** Use neutral wording on the site until Luke answers.

1. Payment links: both point at Startup Ventura's Zeffy form. Need Serra Cross Conservancy's own donation form and a site-fee form.
2. Site fee receipts: the old site called the fee a "non-refundable donation"; the brand book says it isn't tax-deductible. A Zeffy donation form issues a donation receipt. Confirm the setup with the Conservancy's accountant.
3. Capacity: the old FAQ says 250 to 300; the booking page and terms say 300 seated or 500 standing. The site uses 300 and 500.
4. Dated details: the old FAQ quotes about $175 for event insurance, suggests wedsafe.com, and names JW Enterprises (1-800-350-3331) for portable restrooms. Confirm before publishing any of them.
5. Booking contact: Amber Weir is the Reservation Specialist and now appears on the About page. Should the booking steps and terms name her, or keep "the park office"?
6. 2003: who bought the Cross and when the sale closed. The old site doesn't say.
7. Parking: the old FAQ says "email us." Any numbers to publish?
8. Board: photos for all eight people on the About page, and any officer titles (chair, treasurer) to show.
9. Location line "Grant Park, above City Hall, Ventura, CA 93001" comes from the design system. Confirm.
10. "Admission Day" is spelled "Admissions Day" on the old site. Corrected here.

## 10. Photos

- Start with `design-system/assets/Photography/` (20 photos, named and described in its README). Add every photo from the current site that isn't a duplicate. Look at each one; skip blurry, tiny or near-duplicate shots.
- Keep originals in `src/assets/photos/` with descriptive kebab-case names. Render with Astro's `<Image>` or `<Picture>`: AVIF and WebP, responsive widths, lazy below the fold, explicit dimensions so nothing shifts.
- Write alt text for every photo (the old site has none). Captions say what and where.
- Logos come from `design-system/assets/Logos/`. `design-system/assets/Ornaments/dotted-o-ochre.svg` makes a good SVG favicon. Make a 1200x630 Open Graph image for each page from a park photo.

## 11. SEO, structured data, redirects

- A unique title and meta description per page. Canonical URLs. `@astrojs/sitemap` and `robots.txt`. `trailingSlash: 'always'` and `build.format: 'directory'`.
- JSON-LD: the Conservancy as an `NGO` with its Tax ID, the park as a `TouristAttraction` with geo coordinates, an `EventVenue` on the booking page, `FAQPage` on the FAQ page.
- Redirects in `netlify.toml` (all 301): `/calendar/` to `/booking/#availability`, `/weddings/` to `/booking/`, and the old WooCommerce paths (`/cart/*`, `/checkout/*`, `/shop/*`, `/my-account/*`, `/product/*`) to `/donate/`.

## 12. Forms (Netlify Forms)

- Contact form named `contact`: first name, last name, email, regarding (Booking an event, Giving, Volunteering, History, Something else), message. Built from `Field`, plus `ChoiceChips` for "regarding" if it fits. Include a honeypot field and a success state in the brand voice.
- Fallback inquiry form named `event-inquiry` (7d).
- Netlify detects forms in the built HTML. For forms inside React islands, also render a hidden static copy (same `name`, same field names, `data-netlify="true"`) and submit from the island with `fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })`, including `form-name`. Test on a deploy preview; Netlify Forms don't run locally.

## 13. Quality bar

- WCAG 2.1 AA. Booking works start to finish with a keyboard alone. The design system's focus ring is visible everywhere. Landmarks, a skip link, one `h1` per page.
- Lighthouse on mobile for every page: Accessibility 100, SEO 100, Best Practices 95 or better, Performance 90 or better. Note any points the Cal.com or Zeffy embeds cost and why.
- Check every page at 375, 768, 1280 and 1440px wide.
- Search the copy: no em dashes, no exclamation marks, nothing from the "Not" column of the brand book's voice table.
- `npm run build` finishes clean apart from the prelaunch warnings. Vitest passes.

## 14. Repo, GitHub and Netlify

```
design-system/              snapshot from Claude Design (vendor, read-only)
src/
  components/ds/            ported design system components
  components/booking/       AvailabilityCalendar.tsx, CalBooker.tsx
  components/               site pieces (ZeffyEmbed, GalleryLightbox, forms)
  config/site.ts            facts, links, booking and payment settings
  lib/availability.ts       status logic, with tests
  layouts/BaseLayout.astro  head, SEO, header, footer, global styles
  pages/                    index, about, history, booking, booking/requested, gallery,
                            faq, contact, donate, terms-and-conditions, 404
  styles/site.css
  assets/photos/
netlify/functions/availability.mts
scripts/prelaunch-check.mjs
netlify.toml
```

- `netlify.toml`: build `npm run build`, publish `dist`, the current Node LTS that Astro supports (also in `.nvmrc`), the redirects, and basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Skip a strict Content Security Policy for now; Cal.com, Zeffy and Google Fonts need room. Add one later and test it.
- Git: commit at the end of each phase with clear messages. If `gh` is signed in, create a private repo named `serra-cross-park` and push. Otherwise ask Luke for the repo URL.
- Netlify: don't try to sign in. Put the steps in the README for Luke: add a new site from Git, pick the repo (build settings come from `netlify.toml`), turn on form detection under Forms, send form notifications to admin@serracrosspark.com, and add `CAL_API_KEY` only if phase 0 showed it's needed.

## 15. How to work

Work in phases. Commit at the end of each, then give Luke a three-line update.

0. **Read and inventory.** The design system, the current site, `CONTENT-INVENTORY.md`, `CONTENT-TODO.md`. `curl` the Cal.com slots endpoint and report what came back.
1. **Scaffold.** Astro and React, the ported components, tokens, base layout, header and footer, `site.ts`, the prelaunch check. Home renders with real components.
2. **Pages.** Home, About, History, Gallery, FAQ, Contact, Donate, Terms and 404, with real content and photos.
3. **Booking.** The function, the status logic and its tests, the calendar, the booker, the fallbacks, the requested page.
4. **Forms, SEO and redirects,** structured data, Open Graph images.
5. **Polish and hand-off.** The accessibility and performance pass. Then write `README.md` (run it locally, edit content and facts, swap photos, change Cal.com or Zeffy settings, deploy), `LAUNCH-CHECKLIST.md`, `CLAUDE.md` (the rules in this brief that future sessions must follow), and `DESIGN-SYSTEM-CHANGES.md`.

Don't stop for small questions. Mark `[CONFIRM: ...]`, log it in `CONTENT-TODO.md`, and keep going. Stop and ask only when you're blocked: no design system folder, no repo access, or a Cal.com API that refuses without a key.

## 16. Launch checklist (write it into `LAUNCH-CHECKLIST.md`)

- [ ] Serra Cross Conservancy's own Zeffy donation and site-fee forms in `PAYMENTS`. No `startup-ventura` anywhere.
- [ ] Site-fee receipt setup confirmed with the Conservancy's accountant.
- [ ] Strong Glasgow licensed (desktop and web), files swapped, the three digit rules removed from `bundle.css`.
- [ ] Cal.com: the event's title reads right on the site (its slug is still `30min`); "Requires confirmation" is on, with unconfirmed bookings still blocking the slot; booking questions cover event type, guest count and a terms checkbox linking to `/terms-and-conditions/`; after booking, redirect to `https://serracrosspark.com/booking/requested/`; minimum notice and the future limit match `BOOKING`.
- [ ] Every item in `CONTENT-TODO.md` answered.
- [ ] Board and staff photos in place, or the initials placeholders signed off.
- [ ] Netlify: form detection on, notifications to admin@serracrosspark.com, a test submission of each form received.
- [ ] Domain: add serracrosspark.com in Netlify. Before switching DNS, copy the MX and TXT records so admin@serracrosspark.com keeps working. Back up the WordPress site first and keep it running until DNS has switched.
- [ ] After launch: submit the sitemap in Google Search Console and spot-check the old URLs.
