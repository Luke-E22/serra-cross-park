# Launch checklist

Everything that has to happen before serracrosspark.com switches from WordPress to this site, and the first things to do after. The items from BRIEF.md section 16 come first in each group, then the items the build surfaced. `npm run prelaunch` (also run by `npm run build`) tracks the code-side items; on 2026-10-12 it printed 38 warnings, and the goal is zero apart from any you accept on purpose. Facts about Cal.com and Zeffy as they stood on 2026-10-09 are in docs/INTEGRATION-NOTES.md; the event rules are the Conservancy's terms document, docs/TERMS-SOURCE.md; the full gate is in docs/BUILD-REPORT.md.

## Content and facts

- [ ] Every item in `CONTENT-TODO.md` answered.
  43 items. Each answer lands in `src/config/site.ts`, `src/content/faq.ts`, `src/content/timeline.ts`, `src/content/photos.ts` or the page itself; then delete the matching `[CONFIRM: ...]` comment so the prelaunch check stops listing it.
- [x] Power confirmed (item 41).
  On 2026-10-14 the board's copy notes said there are two 20-amp circuits at the park, with no water, restrooms or lighting, and that bringing any of those is the client's choice. The FAQ, the Terms basics and the booking notice say so. (On 2026-10-12 Luke had said there was no power; the board's note supersedes that.)
- [ ] Terms PDF and terms page in step with the Conservancy's document.
  The Special Event Terms and Conditions (supplied 2026-10-12) are the source of event rules. The text is in `docs/TERMS-SOURCE.md`, the original PDF in `docs/source/`, and the published copy in `public/docs/serra-cross-park-terms-and-conditions.pdf`, linked from the terms page. When the Conservancy revises the document, replace both PDFs, update `TERMS-SOURCE.md`, the terms page and the FAQ, and fix the clause numbering (item 42: there is no 3.5).
- [ ] Tax ID checked against the IRS determination letter (item 12).
  The old Donate page printed 20-861526, eight digits. The site uses 20-8615264 from `SITE.ein` in `src/config/site.ts`, which feeds the footer of every page, the Donate page and the NGO `taxID` in the JSON-LD.
- [ ] Board and staff photos in place, or the initials placeholders signed off.
  Item 8. Drop a square image in `src/assets/people/` and set `photo` on the person in `PEOPLE` in `src/config/site.ts`; `luke-erickson.webp` is the worked example. Officer titles go in `title`. The prelaunch check warns once per person without a photo (seven today).
- [ ] Photo permissions and credits settled (items 33 and 34).
  The West Cooke Photography rainbow photo (`cross-double-rainbow` in `src/content/photos.ts`, credit in its caption), the "-SCP" wedding set with identifiable couples and guests, and the two About photos of unnamed children and adults. Credits and captions live in `src/content/photos.ts`; retire a photo by removing its import and entry there.
- [ ] Larger originals for the archival History photos and the rainbow photo, if they exist (item 35).
  The old site served them at 188 to 720 pixels wide, so they render soft in the timeline figures and the gallery lightbox.
- [ ] Facebook group confirmed as the Conservancy's active page (item 36).
  `SITE.facebook` in `src/config/site.ts` goes in the footer, on the Contact page and in the NGO `sameAs`. The Instagram account (`SITE.instagram`) is already confirmed and sits beside it.
- [ ] Last read of every page on the deploy preview for voice.
  No em dashes, no exclamation marks, sentence case, gifts are tax-deductible. The booking page carries the board's sentence calling reservation payments tax-deductible donations, pending the accountant (item 2); the Terms page and the FAQ make no claim either way, and nothing says "not a donation" or "not tax-deductible". The per-page check in docs/BUILD-REPORT.md section 3 covers the built HTML; this is the human read.

## Cal.com

- [ ] Cal.com: the event's title reads right on the site (its slug is `reserve`; the brief's `30min` does not exist and `BOOKING.calEventSlug` in `src/config/site.ts` already says `reserve`); "Requires confirmation" is on, with unconfirmed bookings still blocking the time, and the park office confirms each reservation once its payment is processed; availability is 8 AM to 8 PM every day with flexible start times and a two-hour minimum; booking questions cover event type, guest count and a required terms checkbox linking to `https://serracrosspark.com/terms-and-conditions/`; after booking, redirect to `https://serracrosspark.com/booking/requested/`; minimum notice and the future limit match `BOOKING`.
  The items below break this one into the settings read from the live event on 2026-10-09 (CONTENT-TODO items 11, 38, 39 and 40, docs/INTEGRATION-NOTES.md).
- [ ] Requires confirmation turned on, with unconfirmed bookings blocking the slot.
  Off today. The booking steps on `/booking/` and `/booking/requested/` promise that the park office confirms the reservation by email once the payment is processed, so a booking must not confirm itself; the slot stays blocked while unconfirmed. The terms document (1.1) says the full payment comes with the reservation form and nothing is confirmed before it is processed (item 43). Cal.com dashboard, event `reserve`, Advanced.
- [ ] Future booking limit set to a rolling 12 months, or `horizonMonths` changed to match.
  Unlimited today. `BOOKING.horizonMonths` is 12 in `src/config/site.ts`; the availability calendar stops there and shows later dates as Not available online, so the two should agree.
- [ ] Success redirect set to `https://serracrosspark.com/booking/requested/`.
  None today. That page says what happens next (the park office emails the confirmation once the payment is processed) and is noindex (`src/pages/booking/requested.astro`); without the redirect visitors stay on Cal.com's own success screen.
- [ ] Event title and description rewritten in the brand voice.
  Today the title is "Private Event / Wedding" and the description has an asterisk, title case and an all-caps warning. Both show inside the booker because `hideEventTypeDetails` is false (`src/components/booking/CalBooker.tsx`). Items 38 and 39.
- [ ] Durations set to a two-hour minimum: default length 2 hours (120 minutes), longer lengths still offered.
  Today the event offers 2, 3, 4 and 5 hours with 3 hours as the default (read 2026-10-09). The site says $300 per hour with a two-hour minimum and no fixed length, so the default must be 2 hours. The availability calendar counts slots for the default length; to count another length set `BOOKING.slotDuration` in minutes. Items 16 and 39.
- [ ] Start times made flexible and the schedule matched to the published hours.
  As read on 2026-10-09, Cal.com offers four fixed 180-minute slots at 8 AM, 11 AM, 2 PM and 5 PM Pacific every day. The site says events run 8 AM to 8 PM every day at any start time, with a two-hour minimum, and everyone is off the hill by 8 PM, when the gates lock (booking page, FAQ, terms and the EventVenue hours in the JSON-LD). In Cal.com: set the event's time-slot interval to 30 minutes (or 60 minutes if Luke wants hourly starts, as the fallback inquiry form offers) and set the availability schedule to 8 AM to 8 PM every day, Saturday and Sunday included. The weekend 7:30 PM end was dropped on 2026-10-12 (item 15), so no weekend exception is needed. Items 11 and 38.
- [ ] Minimum notice set in Cal.com and mirrored in `BOOKING.minNoticeDays`.
  It is 0 in `src/config/site.ts`, so today reads "Booked, 0 of 4" once its last start time has passed. Setting Cal.com to one day or more and `minNoticeDays` to the same number shows those days as Not available online instead.
- [ ] Booking questions set: event type, guest count, and a required "I agree to the terms and conditions" checkbox linking to `https://serracrosspark.com/terms-and-conditions/`.
  The site asks for the agreement before the booker opens and the fallback inquiry form has its own required checkbox, but only a Cal.com question stores the agreement with the booking (item 40). Item 17 asks whether phone number and mailing address should be asked too; the old form asked for both.
- [ ] The 24 existing bookings from the old WordPress calendar entered or blocked in Cal.com (item 13).
  24 approved bookings on 23 dates from Sat Oct 10, 2026 to Sun Apr 16, 2028, listed under Calendar in `CONTENT-INVENTORY.md` as a snapshot from 2026-10-09. Export a fresh list from the WP Booking Calendar plugin at migration time and enter each one; until then the availability calendar shows those dates as Open. Two of them fall outside the published hours (item 14).
- [ ] Booking flow checked on the deploy preview after the settings change.
  Pick a day in the availability calendar: the booker opens on that date with its times (verified 2026-10-09; if a Cal.com update stops honoring `?date=`, set `SHOW_PICK_HINT = true` in `src/components/booking/CalBooker.tsx`). Make one test booking, confirm it lands on `/booking/requested/`, then cancel it in Cal.com. In `astro dev` the booker paints blank; use the preview.
- [ ] `CAL_API_KEY` left unset unless Cal.com starts refusing.
  The public slots API answers without a key (checked 2026-10-09). If it ever returns 401 or 403, add `CAL_API_KEY` under Site configuration, Environment variables in Netlify, never in the repo (`.env.example`).

## Payments

- [x] Serra Cross Conservancy's own Zeffy donation form in `PAYMENTS.donateUrl` (donate-to-serra-cross-park, set 2026-10-12). No `startup-ventura` anywhere.
  `siteFeeUrl` points at the same form but no page links it; the site fee is collected with the reservation (item 43 covers the Cal.com payment step).
- [ ] Reservation payment receipt treatment confirmed with the Conservancy's accountant.
  Item 2. The booking page (`/booking/`) carries the board's sentence of 2026-10-14: "All reservation payments are tax-deductible donations that directly support the beautification, care and preservation of this historical venue." The terms document (1.1, 1.2) and the brand book call the fee a non-refundable payment, so the Terms page and the FAQ make no claim either way. Before launch the accountant confirms whether reservation payments can be receipted as donations; if not, that sentence comes off the booking page. Settle at the same time which form or payment step collects the fee with the reservation (a Zeffy donation form issues a donation receipt; a payment or ticketing form does not).
- [ ] Zeffy form text in the brand voice, set in the Zeffy dashboard.
  Short sentences, sentence case, gifts are tax-deductible; say nothing about the tax treatment of the site fee until the accountant confirms it (item 2). The site cannot change text inside the iframe.
- [ ] Donate page checked on the deploy preview with the real form.
  The embed should resize itself (Zeffy posts `zeffy-embed:resized`) with no white space left in the card. Block `www.zeffy.com` once and confirm the fallback appears: the give button in a new tab plus the plain iframe, never both the script container and the iframe (docs/BUILD-REPORT.md section 12).
- [ ] PayPal decided (item 26).
  The old site's hosted PayPal button took gifts and site fees. Decide whether the account stays open for recurring donors and whether any PayPal link belongs on the new site.

## Fonts

- [ ] Strong Glasgow licensed (desktop and web), files swapped, the three digit rules removed from `bundle.css`.
  The items below are the steps. `design-system/fonts/LICENSE-NOTE.md` has the detail.
- [ ] Strong Glasgow licensed from Herofonts for desktop and web. Luke buys the license himself; the Conservancy pays nothing for it.
  The three files in `design-system/fonts/` are the free demo, personal use only, and they draw an "HF" badge in place of every digit. The repo stays private until this is done.
- [ ] The three demo files replaced with the licensed ones.
  `StrongGlasgow-Light.ttf`, `StrongGlasgow-Regular.ttf` and `StrongGlasgow-Bold.ttf` in `design-system/fonts/`, referenced by the three `@font-face` rules at the top of `design-system/tokens.css`, by `type.fonts[].file` in `design-system/tokens.json`, and by the preload of the Bold file in `src/layouts/BaseLayout.astro` (`type="font/ttf"`). If the licensed names or format differ, update all three places. The prelaunch check warns while files named `StrongGlasgow-*.ttf` exist, so licensed files under the same names leave one accepted warning per file.
- [ ] The three digit-only `@font-face` rules deleted from the top of `design-system/components/bundle.css`.
  They lend Big Shoulders Display digits (`unicode-range: U+0030-0039`, loaded from fonts.gstatic.com) to the display face while the demo is in place. After deleting them, check the figures on the booking page FactGrid and the History timeline in the licensed face. This also removes the last Google Fonts request.
- [ ] EB Garamond needs nothing.
  Self-hosted from `public/fonts/eb-garamond/` (SIL Open Font License) through `src/styles/fonts.css`; `scripts/strip-google-fonts-plugin.mjs` removes the Google Fonts `@import` from `bundle.css` at build time. After a build, `grep googleapis dist/_astro/*.css` should find nothing.

## Netlify and hosting

- [ ] Repo pushed and the site created in Netlify.
  The private repo already exists at https://github.com/Luke-E22/serra-cross-park (branch `main`); push the final commits from GitHub Desktop. In Netlify: Add new site, Import an existing project, pick the repo. Build settings come from `netlify.toml` (`npm run build`, publish `dist`, functions `netlify/functions`, Node 22).
- [ ] Netlify: form detection on, notifications to admin@serracrosspark.com, a test submission of each form received.
  The next four items are the steps.
- [ ] Form detection turned on, then a redeploy.
  Site configuration, Forms, Enable form detection. Netlify registers forms from the built HTML, so it needs a deploy after the switch. Both forms have hidden static twins: `contact` in `src/pages/contact.astro` and `event-inquiry` in `src/pages/booking/index.astro`.
- [ ] Form notifications set for `contact` and `event-inquiry` to admin@serracrosspark.com.
  Site configuration, Notifications, Form submission notifications. Item 27 asks whether Amber's address should receive them as well.
- [ ] One test submission of each form on a deploy preview, received in the Forms tab and by email.
  `contact` on `/contact/`, once with JavaScript and once with it off (the form then posts natively to `/contact/`). `event-inquiry` appears only when the booker fails: block `app.cal.com` on `/booking/`, pick a day, wait for the fallback form. Netlify Forms do not run locally. Delete the test submissions afterwards.
- [ ] Honeypot checked.
  Both forms carry `netlify-honeypot="bot-field"`. Fill the hidden `bot-field` once on the preview; Netlify should drop that submission silently.
- [ ] The function answers at `/api/availability` on the preview.
  `curl -i https://<preview>.netlify.app/api/availability` should return 200 JSON with `Cache-Control: public, max-age=60` and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600`. `?fixture=1` answers on previews but must not on production. Locally, `npx netlify-cli serve --offline` (port 8888) runs the real function on the built site; `npm run preview` does not serve it, so the booking page there takes the fallback path.
- [ ] Redirects spot-checked, all 301.
  `/calendar/` to `/booking/#availability`, `/weddings/` to `/booking/`, and `/cart/*`, `/checkout/*`, `/shop/*`, `/my-account/*`, `/product/*` to `/donate/` (`netlify.toml`). An unknown path returns the 404 page.
- [ ] Old URLs not in the redirect list decided (item 31).
  `/thank-you` (the booking plugin's thank-you page), `/booking_thanks.shtml` (the old contact form's redirect) and `/home/`. Check whether each exists on the old site and add 301s in `netlify.toml` to `/booking/requested/` or `/contact/` as fits.
- [ ] Security headers present on every response.
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `Permissions-Policy` from `netlify.toml`. No Content-Security-Policy yet, on purpose: Cal.com and Zeffy need room. Add one after launch and test it.
- [ ] Google Search Console verification tag kept (item 32).
  `src/layouts/BaseLayout.astro` carries the old site's `google-site-verification` meta tag so the property stays verified. Keep it, or switch the property to DNS verification before DNS changes.
- [ ] Final `npm run build` with the prelaunch check reading zero warnings except any accepted ones.
  `export PATH="$HOME/.local/node/bin:$PATH"` first. `npm test` (56 tests) and `npm run check` should pass too. If dev islands ever crash with "_jsxDEV is not a function" after a build, `rm -rf node_modules/.vite*` and restart dev.
- [ ] Browser checks from docs/BUILD-REPORT.md section 12 run on the deploy preview.
  The booking flow by keyboard alone, the Zeffy fallback, the gallery lightbox, and every page at 375, 768, 1280 and 1440 pixels wide.
- [ ] Lighthouse run on the deploy preview, mobile, every page.
  The last run on the production build (2026-10-09) scored performance 93 to 98 on every page except Gallery at 88, accessibility 100 and best practices 100 everywhere, and SEO 100 on every indexable page (66 on the two noindex pages). Details and reasons in docs/BUILD-REPORT.md section 13. Expect the Cal.com and Zeffy iframes to cost points on `/booking/` and `/donate/` once they mount.

## Domain and launch day

- [ ] Domain: add serracrosspark.com in Netlify. Before switching DNS, copy the MX and TXT records so admin@serracrosspark.com keeps working. Back up the WordPress site first and keep it running until DNS has switched.
  The items below are the order.
- [ ] WordPress backed up in full, kept off the old server.
  Files and database, plus a fresh export of the booking plugin's approved bookings (item 13) and the wp-content/uploads folder with the original photos.
- [ ] Every DNS record copied before anything changes.
  At the current DNS host, record MX, TXT (SPF, DKIM, DMARC, any verification records), CNAME and A records. Mail for admin@serracrosspark.com depends on the MX and TXT records.
- [ ] serracrosspark.com and www added in Netlify, apex as the primary domain.
  Domain management, Add a domain. Every canonical URL and the sitemap use `https://serracrosspark.com/` with no www, so www should redirect to the apex. Let Netlify issue the certificate and force HTTPS.
- [ ] Existing bookings in Cal.com and the Zeffy, Cal.com and font items above all done.
  The availability calendar and the payment buttons go live the moment DNS switches; the WordPress calendar stops taking requests at the same time.
- [ ] DNS switched, then confirmed.
  Either move the name servers to Netlify DNS and recreate the copied records there, or keep DNS where it is and point the A or CNAME records at Netlify. Then check `https://serracrosspark.com/` serves the new site with a valid certificate, a message to admin@serracrosspark.com arrives, the redirects work on the real domain, and `/api/availability` answers.
- [ ] WordPress left running until DNS has propagated and the checks above pass.
  Nothing on the old host is deleted on launch day.

## After launch

- [ ] After launch: submit the sitemap in Google Search Console and spot-check the old URLs.
- [ ] Sitemap submitted: `https://serracrosspark.com/sitemap-index.xml`.
  Search Console, Sitemaps. `public/robots.txt` already points at it. The property stays verified through the meta tag in `src/layouts/BaseLayout.astro`.
- [ ] Old URLs spot-checked on the live domain.
  The ten old pages, `/calendar/`, `/weddings/`, `/shop/` and whatever item 31 added should each answer 200 or 301, never 404. Watch Search Console's Pages report for a few weeks.
- [ ] Lighthouse rerun on the deployed site, mobile, every page.
  Compare with the 2026-10-09 numbers in docs/BUILD-REPORT.md section 13.
- [ ] Structured data validated on the live site.
  Google's Rich Results Test on `/faq/` (FAQPage) and `/booking/` (EventVenue), and the Schema Markup Validator on the home page (NGO and TouristAttraction).
- [ ] First real booking request followed end to end.
  The Cal.com notification arrives, the slot stays blocked while unconfirmed, the visitor lands on `/booking/requested/`, the site fee is collected with the reservation and receipted with the agreed wording, and the office's confirmation email goes out once the payment is processed.
- [ ] Form submissions watched for spam in the first weeks.
  The honeypot is the only filter. If spam gets through, turn on Netlify's extra spam filtering for the form.
- [ ] WordPress decommissioned.
  Once traffic to the old host has stopped and the backup is confirmed readable: close the Formspree form that pointed at the old contact page, settle PayPal (item 26), then cancel the WordPress hosting. Check first that nothing else, such as email or DNS, is served from that host.
- [ ] Content-Security-Policy added to `netlify.toml` and tested with the Cal.com booker and the Zeffy form on a deploy preview.
- [ ] docs/INTEGRATION-NOTES.md and `CONTENT-TODO.md` brought up to date.
  Record the final Cal.com and Zeffy settings and close the answered items so the next person starts from the live state.
