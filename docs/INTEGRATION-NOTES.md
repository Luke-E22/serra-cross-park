# Integration notes

Findings from live checks on 2026-10-09. These override the brief where they disagree. Keep this file current when Cal.com or Zeffy settings change.

## Cal.com

**Account and event.** Username `serra-cross-park`. The only public event is `reserve` (title "Private Event / Wedding"). The brief's `30min` slug does not exist: `https://cal.com/serra-cross-park/30min` returns 404. Settings read from the public booking page on 2026-10-09:

| Setting | Value | Launch checklist |
| --- | --- | --- |
| Slug | `reserve` | `BOOKING.calEventSlug` uses it |
| Title | Private Event / Wedding | Shown inside the booker; confirm the wording |
| Length | 180 minutes | Four 3-hour slots a day |
| Requires confirmation | off | Brief wants it on, with unconfirmed bookings still blocking the slot |
| Period type | UNLIMITED (no future limit) | Brief wants a future limit matching `horizonMonths` |
| Success redirect | none | Should be `https://serracrosspark.com/booking/requested/` |

**Public slots API.** No key needed.

```
GET https://api.cal.com/v2/slots?username=serra-cross-park&eventTypeSlug=reserve&start=2026-10-10&end=2026-11-10&timeZone=America/Los_Angeles
cal-api-version: 2024-09-04
```

Response: `{ "status": "success", "data": { "2026-10-10": [{ "start": "2026-10-10T08:00:00.000-07:00" }, ...], ... } }`. Every day in the range currently returns four slots at 8:00, 11:00, 14:00 and 17:00 Pacific. That does not match the published hours (events 9 AM to 8 PM, weekend blocks 9 to 12, 1 to 4, 5 to 8); it is on the content to-do list. Error shapes seen: 404 `{"status":"error","error":{"code":"NotFoundException","message":"Event Type not found"}}` for a wrong slug; 400 for `usernames` with one name or for `username` without `eventTypeSlug`.

**Embed (`@calcom/embed-react` 1.5.x).** `getCalApi({ namespace })` then `cal("ui", {...})`. Documented `ui` options: `theme` ("light" | "dark" | "auto"), `layout` ("month_view" | "week_view" | "column_view"), `hideEventTypeDetails`, `showTimezoneWhenEventDetailsHidden`, `styles`, `cssVarsPerTheme` ({ light: {...}, dark: {...} }), `colorScheme`, `disableAutoScroll`, `useSlotsViewOnSmallScreen`. Documented `cssVarsPerTheme` keys: `cal-brand`, `cal-brand-emphasis`, `cal-brand-text`, `cal-bg`, `cal-bg-emphasis`, `cal-bg-subtle`, `cal-bg-booker`, `cal-border`, `cal-border-emphasis`, `cal-border-booker`, `cal-border-booker-width`, `cal-text-emphasis`, `cal-text-default`, `cal-text-muted`. The brief also names `cal-text`, `cal-text-subtle`, `cal-border-subtle` and `radius`; set both spellings, the embed ignores unknown keys. Prefill goes through the `config` prop (`name`, `email`, `location`, `metadata[...]`); `date` and `month` as query params on `calLink` are not documented, so the booking page must be tested in a real browser (the public page at `/reserve?month=2026-11&date=2026-11-14` does echo the date in its HTML, which is promising). Embed events for `cal("on", { action, callback })`: `linkReady`, `linkFailed` ({ code, msg, data }), `bookerReady`, `bookerViewed`, `bookingSuccessfulV2` ({ uid, title, startTime, endTime, eventTypeId, status, ... }), `eventTypeSelected`, `navigatedToBooker`.

## Zeffy

**Placeholder form.** `https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura` is Startup Ventura's form (amounts $500, $1,000, $2,500, $5,000, one-time or yearly). The embed URL `https://www.zeffy.com/en-US/embed/donation-form/donate-to-startup-ventura` loads in a browser; curl gets a Cloudflare 403, so server-side checks are not possible.

**Embed script v2** (`https://www.zeffy.com/embed/v2/zeffy-embed.js`, version 2.0.0, read on 2026-10-09). The script:

- finds `[data-zeffy-embed]:not([data-zeffy-initialized])`, reads `data-form-url` (the `/embed/...` URL) and optional `data-min-height` (a number or px), draws a skeleton loader, then injects an `<iframe>` whose src is the form URL plus `embed-version=v2&embedId=<id>` (and `disableExpressCheckout=true` on iPhone), with `allowpaymentrequest` and `allowTransparency`;
- removes every `[data-zeffy-embed-fallback]` element (blanking any iframe inside it first), so a fallback iframe can sit in such a wrapper for no-script visitors;
- listens for `postMessage` from `https://www.zeffy.com` (`zeffy-embed:connected`, `zeffy-embed:resized` with `height`, `zeffy-embed:step-changed`, `zeffy-embed:thank-you-page-shown`, `zeffy-embed:loading`) and sets the container height, so the host page needs no fixed height;
- exposes `window.Zeffy.embed.init()` to scan for new containers (useful after client-side mounting);
- if it never connects, it shows the iframe at 800px after a timeout.

Markup that matches the script:

```html
<div data-zeffy-embed data-form-url="https://www.zeffy.com/embed/donation-form/<slug>" data-min-height="800"></div>
<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js" async></script>
```

Site plan: render the container and load the script on the Donate page; if the script fails to load (`onerror`) or never initializes within a few seconds, show the `give` button that opens `PAYMENTS.donateUrl` in a new tab, plus a plain `<iframe>` of the embed URL with `title="Donation form powered by Zeffy"`, `allowpaymentrequest` and a fixed min-height. Do not render the plain iframe and the script container at the same time, or the form loads twice.

## Netlify

- Functions live in `netlify/functions/`; the availability function exports `default async (req: Request, context) => Response` and `config = { path: '/api/availability' }` (Netlify Functions 2.0 API, `.mts` is fine).
- Netlify Forms need the form in the built HTML with `data-netlify="true"` (or `netlify`) and a `form-name` field; JavaScript submissions post `application/x-www-form-urlencoded` to `/`. Forms do not work in local dev; test on a deploy preview.
- Response caching for the function: `Cache-Control: public, max-age=60` for browsers and `Netlify-CDN-Cache-Control: public, durable, s-maxage=300, stale-while-revalidate=3600` for the CDN.
