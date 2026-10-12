# Integration notes

Findings from live checks on 2026-10-09. These override the brief where they disagree. Keep this file current when Cal.com or Zeffy settings change. Event rules (payment with the reservation, confirmation once paid, insurance, parking and the rest) come from docs/TERMS-SOURCE.md, the Conservancy's terms document of 2026-10-12.

## Cal.com

**Account and event.** Username `serra-cross-park`. The only public event is `reserve` (title "Private Event / Wedding"). The brief's `30min` slug does not exist: `https://cal.com/serra-cross-park/30min` returns 404. Settings read from the public booking page on 2026-10-09:

| Setting | Value | Launch checklist |
| --- | --- | --- |
| Slug | `reserve` | `BOOKING.calEventSlug` uses it |
| Title | Private Event / Wedding | Shown inside the booker; confirm the wording |
| Length | 180 minutes default, 2h to 5h offered, four fixed slots a day | Must become a two-hour minimum (default 120 minutes) with flexible start times in 30-minute steps; the site states no fixed blocks (CONTENT-TODO 11, 38, 39) |
| Requires confirmation | off | Must be on, with unconfirmed bookings still blocking the slot; the park office confirms once the payment is processed (terms document 1.1, CONTENT-TODO 43) |
| Period type | UNLIMITED (no future limit) | Brief wants a future limit matching `horizonMonths` |
| Success redirect | none | Should be `https://serracrosspark.com/booking/requested/` |

**Public slots API.** No key needed.

```
GET https://api.cal.com/v2/slots?username=serra-cross-park&eventTypeSlug=reserve&start=2026-10-10&end=2026-11-10&timeZone=America/Los_Angeles
cal-api-version: 2024-09-04
```

Response: `{ "status": "success", "data": { "2026-10-10": [{ "start": "2026-10-10T08:00:00.000-07:00" }, ...], ... } }`. Every day in the range returned four slots at 8:00, 11:00, 14:00 and 17:00 Pacific on 2026-10-09. That does not match the published rule (events 8 AM to 8 PM every day, any start time, two-hour minimum, everyone off the hill by 8 PM when the gates lock; the weekend 7:30 PM end was dropped on 2026-10-12) and must change: a 120-minute default, a 30-minute slot interval (or 60 minutes if the owner wants hourly starts) and an 8 AM to 8 PM schedule every day (CONTENT-TODO items 11, 38 and 39). Once it does, the slots API will answer with many more start times per day, and the calendar's "full day" count will learn the new number on its own. Error shapes seen: 404 `{"status":"error","error":{"code":"NotFoundException","message":"Event Type not found"}}` for a wrong slug; 400 for `usernames` with one name or for `username` without `eventTypeSlug`.

**Embed (`@calcom/embed-react` 1.5.x).** `getCalApi({ namespace })` then `cal("ui", {...})`. Documented `ui` options: `theme` ("light" | "dark" | "auto"), `layout` ("month_view" | "week_view" | "column_view"), `hideEventTypeDetails`, `showTimezoneWhenEventDetailsHidden`, `styles`, `cssVarsPerTheme` ({ light: {...}, dark: {...} }), `colorScheme`, `disableAutoScroll`, `useSlotsViewOnSmallScreen`. Documented `cssVarsPerTheme` keys: `cal-brand`, `cal-brand-emphasis`, `cal-brand-text`, `cal-bg`, `cal-bg-emphasis`, `cal-bg-subtle`, `cal-bg-booker`, `cal-border`, `cal-border-emphasis`, `cal-border-booker`, `cal-border-booker-width`, `cal-text-emphasis`, `cal-text-default`, `cal-text-muted`. The brief also names `cal-text`, `cal-text-subtle`, `cal-border-subtle` and `radius`; set both spellings, the embed ignores unknown keys. Prefill goes through the `config` prop (`name`, `email`, `location`, `metadata[...]`); `date` and `month` as query params on `calLink` are not documented, so the booking page must be tested in a real browser (the public page at `/reserve?month=2026-11&date=2026-11-14` does echo the date in its HTML, which is promising). Embed events for `cal("on", { action, callback })`: `linkReady`, `linkFailed` ({ code, msg, data }), `bookerReady`, `bookerViewed`, `bookingSuccessfulV2` ({ uid, title, startTime, endTime, eventTypeId, status, ... }), `eventTypeSelected`, `navigatedToBooker`.

**Booking page query parameters (checked in a real browser, 2026-10-09).** https://cal.com/serra-cross-park/reserve?month=2026-11&date=2026-11-14 opens on November 2026 with the 14th selected and its times listed (8:00 AM, 11:00 AM, 2:00 PM, 5:00 PM), so `month` and `date` are honored by the public page. The embed passes the same query through `calLink`, and it works there too (checked in a real browser on 2026-10-09 against the dev server: picking Saturday, October 24 in the availability calendar mounted the embed at `app.cal.com/serra-cross-park/reserve/embed?month=2026-10&date=2026-10-24&...`, and the booker opened on October 2026 with the 24th selected and 8:00am, 11:00am, 2:00pm and 5:00pm listed). The "Choose <date> in the calendar below" hint in `CalBooker.tsx` is therefore off (`SHOW_PICK_HINT = false`); turn it back on if a Cal.com update stops honoring `date`.

**Durations.** The event page shows "$300.00 per hour with a minimum of two hours" and offers 2h, 3h, 4h and 5h, with 3h selected by default. The slots API without a `duration` parameter answers for the default (180 minutes), which is what the availability calendar counts. The default must become 2 hours to match the published two-hour minimum (CONTENT-TODO item 39); longer lengths can stay on offer. If the Conservancy wants the calendar to reflect another length, set `BOOKING.slotDuration` in minutes. The event description also says "You Must Agree to the Terms and Conditions at Checkout" and "All reservations must include time needed for vendor/client set up, event, and vendor/client break-down". The event has no terms checkbox question yet: the site asks for the agreement before the booker opens, and Cal.com should carry a required "I agree to the terms and conditions" checkbox question linking to https://serracrosspark.com/terms-and-conditions/ so the agreement is stored with each booking (CONTENT-TODO item 40).

**Payment.** The terms document (1.1) says the full payment comes with the reservation form and the reservation is not confirmed until the payment has been received and processed, so the site has no separate pay step and mentions no hold on a date. These notes record no payment step on the `reserve` event as read on 2026-10-09. How the fee is collected with the reservation (a Cal.com payment app, or a Zeffy form) is CONTENT-TODO item 2; the confirmation setting that goes with it is item 43.

## Zeffy

**Placeholder form.** `https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura` is Startup Ventura's form (amounts $500, $1,000, $2,500, $5,000, one-time or yearly). The embed URL `https://www.zeffy.com/en-US/embed/donation-form/donate-to-startup-ventura` loads in a browser; curl gets a Cloudflare 403, so server-side checks are not possible.

**Embed script v2** (`https://www.zeffy.com/embed/v2/zeffy-embed.js`, version 2.0.0, read on 2026-10-09). The script:

- finds `[data-zeffy-embed]:not([data-zeffy-initialized])`, reads `data-form-url` (a PATH such as `/en-US/embed/donation-form/<slug>`: the script prepends `/` when missing and resolves the value against `https://www.zeffy.com`, so a full URL becomes `https://www.zeffy.com/https://www.zeffy.com/...` and the form 404s inside the iframe; seen in the browser on 2026-10-09) and optional `data-min-height` (a number or px), draws a skeleton loader, then injects an `<iframe>` whose src is the form URL plus `embed-version=v2&embedId=<id>` (and `disableExpressCheckout=true` on iPhone), with `allowpaymentrequest` and `allowTransparency`;
- removes every `[data-zeffy-embed-fallback]` element (blanking any iframe inside it first), so a fallback iframe can sit in such a wrapper for no-script visitors;
- listens for `postMessage` from `https://www.zeffy.com` (`zeffy-embed:connected`, `zeffy-embed:resized` with `height`, `zeffy-embed:step-changed`, `zeffy-embed:thank-you-page-shown`, `zeffy-embed:loading`) and sets the container height, so the host page needs no fixed height;
- exposes `window.Zeffy.embed.init()` to scan for new containers (useful after client-side mounting);
- if it never connects, it shows the iframe at 800px after a timeout;
- styles its container inline (`border-radius: 16px`, `outline: 1px solid #e0e0e0` while loading, white background, a 600px centered card): the Donate page overrides the radius and outline color with `!important` in `src/styles/pages/donate.css`;
- calls `scrollIntoView({ behavior: 'smooth' })` on step changes and on the thank-you page, motion our side cannot stop under `prefers-reduced-motion`.

`ZeffyEmbed.tsx` exports `toZeffyEmbedPath(formUrl)` for the attribute and `toZeffyEmbedUrl(formUrl)` (the full URL) for the plain fallback iframe.

Markup that matches the script:

```html
<div data-zeffy-embed data-form-url="/en-US/embed/donation-form/<slug>" data-min-height="800"></div>
<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js" async></script>
```

Site plan: render the container and load the script on the Donate page; if the script fails to load (`onerror`) or never initializes within a few seconds, show the `give` button that opens `PAYMENTS.donateUrl` in a new tab, plus a plain `<iframe>` of the embed URL with `title="Donation form powered by Zeffy"`, `allowpaymentrequest` and a fixed min-height. Do not render the plain iframe and the script container at the same time, or the form loads twice.

## Netlify

- Functions live in `netlify/functions/`; the availability function exports `default async (req: Request, context) => Response` and `config = { path: '/api/availability' }` (Netlify Functions 2.0 API, `.mts` is fine).
- Netlify Forms need the form in the built HTML with `data-netlify="true"` (or `netlify`) and a `form-name` field; JavaScript submissions post `application/x-www-form-urlencoded` to `/`. Forms do not work in local dev; test on a deploy preview. The `event-inquiry` form carries a `terms` checkbox (value `yes`), required in the island and present in the hidden twin on `/booking/`.
- Response caching for the function: `Cache-Control: public, max-age=60` for browsers and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600` for the CDN.
