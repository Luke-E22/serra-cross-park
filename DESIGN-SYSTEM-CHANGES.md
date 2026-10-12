# Design system changes

`src/components/ds/` is a port of `design-system/components/src/` (`index.tsx` and `generated.ts`) with the changes listed below. The snapshot in `design-system/` is the vendor copy from Claude Design and is never edited: the site loads its `tokens.css` and `components/bundle.css` as they are, and every difference between the snapshot's source and the ported files is logged here. Each entry says what changed, why, which component it touches, and how to apply it again when the snapshot is refreshed.

## Refreshing the snapshot

1. Replace the files under `design-system/` and update the table in `design-system/SNAPSHOT.md`.
2. Copy `design-system/components/src/index.tsx` and `design-system/components/src/generated.ts` over the two files in `src/components/ds/`.
3. Re-apply every entry below, in order. Each one is an exact-text edit. When you are done, `diff -u design-system/components/src/index.tsx src/components/ds/index.tsx` should show only these changes, and the same for `generated.ts`.
4. Check with `export PATH="$HOME/.local/node/bin:$PATH"; npx tsc --noEmit -p tsconfig.json` and `npm run build`.

## Changes

### 2026-10-09: real React import

- **What:** `declare const React: any;` becomes `import * as React from 'react';` and `type ReactNode = any;` becomes `type ReactNode = React.ReactNode;`. Everything else is unchanged: markup, class names, props, defaults, the `h = React.createElement` alias and the JSX.
- **Why:** in the design system React is a page global (`window.React`) that the demo page loads. In the site React 18.3.1 is a module dependency bundled by Astro through `@astrojs/react`, so the file has to import it. `React.ReactNode` matches the published `design-system/components/index.d.ts` and gives pages real types for `children`, `actions`, `intro`, `text` and `a`.
- **Component:** the whole file.
- **Two type-only fixes that come with it.** Once React is typed, TypeScript checks the JSX against `@types/react`, which exposed two latent errors in the source. Neither changes runtime behaviour, a prop type or the markup.
  - `Field`: the JSX attribute `inputMode={inputMode}` becomes `inputMode={inputMode as React.InputHTMLAttributes<HTMLInputElement>['inputMode']}`. The prop stays `inputMode?: string`, as declared in `index.d.ts`.
  - `GivingForm`: `const tabs = [` becomes `const tabs: { id: 'gift' | 'fee'; label: string }[] = [`, so `setTab(t.id)` accepts the id. Before, the array literal inferred `id: string`.
- **Re-apply:** replace the two lines that follow `import { ICONS, O_PATH, O_WIDTH } from './generated';`, then make the two edits above. Skip either fix if the refreshed source no longer needs it.

### 2026-10-09: linkedin and instagram icons

- **What:** two entries added at the end of the `ICONS` map in `generated.ts`, and `| 'linkedin' | 'instagram'` appended to the last line of the `IconName` union in `index.tsx`.
- **Why:** Luke Erickson's board card on the About page links to LinkedIn and Instagram, with an icon beside each word (BRIEF.md section 5). The design system's 28-icon set has neither.
- **Component:** `Icon` (`generated.ts` and the `IconName` type).
- **Source:** Lucide v0.469.0 (ISC), the same version as the rest of the set. Fetched from `https://unpkg.com/lucide-static@0.469.0/icons/linkedin.svg` and `https://unpkg.com/lucide-static@0.469.0/icons/instagram.svg` on 2026-10-09. Only the inner elements are kept: the license comment, the outer `<svg>` tag and its attributes are dropped, and ` />` becomes `/>` to match the existing strings.
- **Re-apply:** add a comma after the `"landmark"` entry and append these two lines before the closing `};`:

  ```
   "linkedin": "<path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z\"/><rect width=\"4\" height=\"12\" x=\"2\" y=\"9\"/><circle cx=\"4\" cy=\"4\" r=\"2\"/>",
   "instagram": "<rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/><line x1=\"17.5\" x2=\"17.51\" y1=\"6.5\" y2=\"6.5\"/>"
  ```

  Then change `| 'facebook' | 'hand-heart' | 'landmark';` to `| 'facebook' | 'hand-heart' | 'landmark' | 'linkedin' | 'instagram';`. If the refreshed icon set already includes them, skip this entry.

### 2026-10-09: SiteFooter credit

- **What:** a new `export interface FooterCredit { label: string; href: string }` after `FooterColumn`, and an optional `credit?: FooterCredit` on `SiteFooterProps`. When `credit` is set the footer renders one more `<p><a href={credit.href}>{credit.label}</a></p>` as the last child of the existing `.sc-footer__legal` element. Without it the markup is identical to the design system's.
- **Why:** the brief puts the credit "Website by Luke Erickson", linking to https://lukeerickson.com, in the legal row (BRIEF.md section 5, Footer). The component had no slot for it. Pages pass `CREDIT` from `src/config/site.ts`.
- **Component:** `SiteFooter`.
- **Note:** `bundle.css` gives `.sc-footer__legal p:last-child` a `margin-left: auto`, so with a credit the credit sits at the right edge and the copyright line sits next to the Tax ID line. If a different order is wanted, adjust it in `src/styles/site.css`, not in the component. `.sc-footer a` already styles the link in `ink-on-dark` with an underline on hover.
- **Re-apply:** insert the `FooterCredit` interface after the `FooterColumn` line, add `; credit?: FooterCredit` at the end of `SiteFooterProps`, add `, credit` after `facebookHref = '...'` in the destructured props, and insert `{credit && <p><a href={credit.href}>{credit.label}</a></p>}` on the line after `<p>© {year} Serra Cross Conservancy</p>`.

### 2026-10-09: imgProps on Hero, FeatureCard, SignPanel, Gallery items and Timeline items

- **What:** one shared type, `export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;`, defined right after `const h = React.createElement;`. `HeroProps`, `FeatureCardProps` and `SignPanelProps` gain `imgProps?: ImgProps`. `GalleryImage` and `TimelineItem` gain `imgProps?: ImgProps` per item. Each is spread onto the existing `<img>` after its current attributes: `{...imgProps}` in Hero, FeatureCard and SignPanel, `{...im.imgProps}` in Gallery, `{...it.imgProps}` in Timeline. `className`, `src`, `alt`, `style` and `loading` stay exactly as they were.
- **Why:** the brief renders photos with responsive widths, AVIF and WebP, explicit dimensions, lazy loading below the fold and a high fetch priority on the hero (BRIEF.md section 10). The components took only `src` and `alt`. With `imgProps`, pages pass `srcSet`, `sizes`, `width`, `height`, `loading`, `decoding` and `fetchPriority` from Astro's image pipeline without touching the markup or class names.
- **Component:** `Hero`, `FeatureCard`, `SignPanel`, `Gallery`, `Timeline`.
- **How it behaves:** because `imgProps` is spread last, anything in it wins over the component's own attribute. So `imgProps.loading` replaces the `loading="lazy"` on FeatureCard, Gallery and Timeline images, and `imgProps.style` on Hero replaces the `objectPosition` style. Use the `focal` prop for the hero's object position rather than a style. React 18.3.1 has no DOM mapping for `fetchPriority` (React 19 added one): the attribute still reaches the HTML, since attribute names are case-insensitive, but React logs a warning in development. To stay quiet, pass it lowercase with a cast, `{ fetchpriority: 'high' } as ImgProps`; React passes lowercase unknown attributes through without comment.
- **Re-apply:** add the `ImgProps` line after the `h` alias; add `imgProps?: ImgProps;` as the last member of `HeroProps`, `SignPanelProps` and `FeatureCardProps` and `; imgProps?: ImgProps` to the one-line `TimelineItem` and `GalleryImage` interfaces; add `, imgProps` as the last destructured prop of `Hero`, `SignPanel` and `FeatureCard`; then add the spread to the five `<img>` elements, after their last attribute and before ` />`.

### 2026-10-09: Hero wrapper is a div, not a section (accessibility)

- **What:** in `Hero`, the outer `<section className={cx('sc-hero', ...)}>` becomes `<div className={cx('sc-hero', ...)}>`, and its closing tag matches. Class names, children, props and defaults are unchanged; `bundle.css` selects the hero by class only, so nothing is restyled.
- **Why:** the WCAG review (BRIEF.md section 13). `Hero` carries the overlay `SiteHeader`, whose `<header>` is the site's banner landmark. HTML maps a `<header>` to `banner` only when it is not inside `article`, `aside`, `main`, `nav` or `section`; inside the hero's `<section>` it was a plain group, so the four hero pages (Home, Plan your event, Gallery, History) had no banner landmark for screen reader users. An unnamed `<section>` has no role of its own, so the swap is neutral for assistive tech and for the layout.
- **Component:** `Hero`.
- **Takes effect with:** the hero also has to sit outside `<main>`, which is a layout change: `src/layouts/BaseLayout.astro` renders a named slot (`<slot name="hero" />`) between the skip link and `<main>`, and the hero pages pass `slot="hero"` on `<PageHero>`. Until then the `<header>` still sits inside `<main>` on those pages and the skip link lands before it. That change is listed in the review's report for the orchestrator, because BaseLayout is not the review's file.
- **Re-apply:** in `Hero`, change the opening `<section className={cx('sc-hero', 'sc-hero--' + height, 'sc-hero--' + align)}>` to `<div ...>` with the same `className`, and the matching `</section>` before `);` to `</div>`.

## Planned

- **About page person card.** Built in site code from the tokens in `src/styles/site.css`: square corners, a `line` border, no shadow, four across on desktop and two on mobile, a `sandstone` square with navy initials until a photo arrives. A site addition, not a design system change, so it is noted here only so the two are not confused.
- **Availability calendar.** The Open, Partly booked and Booked day grid on the booking page is also built from tokens in `src/styles/site.css`, on top of Cal.com's slots. A site addition, not a design system change.
- **Gallery page lightbox.** A small island around `Gallery`: native `<dialog>`, arrow keys between photos, Escape closes, focus returns to the thumbnail, caption shown. It should wrap the component rather than change it. If `Gallery` needs a per-item click hook, add an optional prop here and log it.
- **Hero or Gallery changes the booking page needs.** None yet. Log any here when they happen, in the same form as the entries above.

## Site-level overrides

These live in `src/styles/site.css`, not in the ported components. They are listed so a snapshot refresh knows to check them.

- **`.sc-sign__figure img, .sc-tl__figure img { height: auto }`** (2026-10-09). `picture()` in `src/lib/images.ts` puts `width` and `height` attributes on every photo through `imgProps`. `bundle.css` gives these two figures `width: 100%` and an `aspect-ratio` but no `height`, so the attribute's height won and the SignPanel photo rendered at its full pixel height. `height: auto` hands control back to the aspect ratio. Hero, FeatureCard and Gallery photos set `height: 100%` in `bundle.css` and need nothing. Drop this rule if a refreshed `bundle.css` sets a height on those figures itself.
- **Footer stacks under 1100px** (2026-10-09). `bundle.css` keeps the SiteFooter brand beside three link columns down to 901px. The email address in the Contact column is an inline-flex link about 203px wide that cannot wrap, so between 901px and about 1105px the columns (163px at 1024) run out of room and the page scrolls sideways by up to 16px. `src/styles/site.css` adds `@media (max-width: 1100px) { .sc-footer__inner { grid-template-columns: 1fr; gap: var(--space-6); } }`, the same stack the bundle applies under 900px, at the site's header breakpoint. Measured after the change: no horizontal overflow at 1024, 1100, 1101, 1105, 1199 and 1280. Above 1200px the columns are 198px and the link still spills 5px into the footer's own padding, which is invisible; a refreshed bundle could let `.sc-footer__col` links wrap or give the Contact column more room, and then this rule can go.

## Site components

Built in site code from the tokens, not ported from the design system. Listed so a snapshot refresh does not go looking for them in `src/components/ds/`.

### 2026-10-09: About page person card

`src/components/PersonCard.astro` is a static Astro component for the board and staff cards on `/about/`, and it closes the first item under Planned above. It is built only from `design-system/tokens.css` and the type classes: a 1px `line` border on `surface-raised`, square corners, no shadow, a square photo slot that shows the file named in `PEOPLE[].photo` from `src/assets/people/` through Astro's `<Image>` (cropped square, lazy) or, until a photo arrives, the person's initials in `display-lg` navy on `sandstone`, the name as a `label`, the role in `body-sm` and `ink-muted`, and a row of small text links with the `linkedin` and `instagram` icons logged above, each named "Name on LinkedIn" for screen readers and opening in a new tab. The page lays the cards out four across, two across under 720px, in `src/styles/pages/about.css`. Nothing in `src/components/ds/` changed for it, so there is nothing to re-apply on a refresh. If the design system ever ships a person card, replace this component with the port and delete this entry.

## Site islands around unchanged components

### 2026-10-09: Gallery page lightbox (a site island, no component change)

- **What:** `src/components/GalleryLightbox.tsx` is a React island that renders the ported `Gallery` exactly as it is, followed by a native `<dialog>`. Nothing in `src/components/ds/` changed for it: no new prop, class or markup inside `Gallery`. This resolves the "Gallery page lightbox" bullet under Planned above without the per-item click hook it anticipated.
- **How the photos become controls:** `Gallery` renders a plain `<img>` per cell and spreads each item's `imgProps` onto it (logged above). The island passes `role="button"`, `tabIndex={0}`, `aria-haspopup="dialog"`, an `aria-label` of "Open: <caption>", and `onClick` and `onKeyDown` (Enter or Space) through that spread, so the image itself is the button that opens the dialog. The attributes are added only after hydration, so without JavaScript the photos stay plain images. The dialog shows the largest generated candidate with its caption, Previous and Next (`Button` secondary on dark, ArrowLeft and ArrowRight as well), Close (icon `x`), Escape through the dialog's own cancel, body scroll locked while open, and focus returned to the thumbnail that opened it.
- **Site-level overrides in `src/styles/pages/gallery.css`** (page CSS reaching the component's classes from the page wrapper `.gallery-mosaic`; check them on a snapshot refresh):
  - `.sc-gallery__item figcaption { pointer-events: none }` so a click on the caption strip reaches the photo under it.
  - The focus ring: the figure's `overflow: hidden` clips the global `:focus-visible` box-shadow drawn outside the image, so the same ring (2px `focus`, 2px `surface` gap) is drawn inset on a `::after` overlay of the figure through `:has(img:focus-visible)`. Drop this if a refreshed `bundle.css` draws a ring for focusable gallery images itself.
  - Under 720px, `.sc-gallery__item { grid-column: span 2 }`: every cell spans both of the component's two mobile columns, so landscapes are full width at about 3:2 and portraits keep two rows at about 3:4. The component's one-column mobile cells crop a landscape to half its width and a portrait to a thin strip, which can cut through the Cross. If the component later changes its mobile grid, revisit this.
  - The icon set has no left arrow, so the Previous button uses `arrow-right` mirrored with `transform: scaleX(-1)` on `.gallery-lightbox__prev .sc-icon`. If `arrow-left` is added to `generated.ts` (Lucide v0.469.0 has it), switch the button to it and delete the rule.

### 2026-10-09: EB Garamond self-hosted, Google Fonts import stripped at build time

- **What:** `design-system/components/bundle.css` opens with `@import url("https://fonts.googleapis.com/css2?family=EB+Garamond...")`. The site leaves that file untouched and removes the line while bundling (`scripts/strip-google-fonts-plugin.mjs`, a Vite transform registered in `astro.config.mjs`). `src/styles/fonts.css` declares the same family from `public/fonts/eb-garamond/` (Google Fonts v33 files, latin and latin-ext subsets, weights 400 to 600 and italic 400, SIL Open Font License), and `BaseLayout.astro` preloads the regular face.
- **Why:** a remote `@import` inside a stylesheet blocks rendering until Google answers. Lighthouse measured about 0.9 s of render delay on every page from that one line, which is most of the gap between the Home page's 81 and the brief's 90. Self-hosting also removes a third-party request from every page view.
- **Component:** none; `bundle.css` is served as it is apart from that line.
- **Re-apply:** nothing to re-apply in the ported files. When the snapshot is refreshed, check that the plugin's pattern still matches the first line of `bundle.css` (`npm run build`, then grep `dist/_astro/*.css` for `googleapis`; there should be no match).

### 2026-10-09: header menu toggle driven by a script, not by hydrating React

- **What:** `SiteHeader` and the `PageHero` wrapper render statically on every page. `src/scripts/header-menu.ts` (loaded once from `BaseLayout.astro`) wires the menu button under 1100px: it toggles `is-open` on the header, `hidden` on the menu, `aria-expanded` on the button, swaps the menu and close icons with their labels, and switches the wordmark back to ink while an overlay header is open, which is what the component's own state does. It also closes on Escape.
- **Why:** hydrating the header (or the hero that carries it) shipped the React runtime to every page for one toggle, the largest single cost in Lighthouse's mobile run. The component is unchanged; only the way its one interactive part is driven on this site changed.
- **Re-apply:** nothing in the ported files. If a refreshed `SiteHeader` changes its class names, ids or icon handling, update the script to match.

### 2026-10-10: FactGrid sets "to" and "or" in the serif

- **What:** `FactGrid` passes each `value` through `factValue()`, which wraps a standalone "to" or "or" in `<span class="sc-fact__word">`. Values without those words render exactly as before. `src/styles/site.css` styles the span in the serif at 0.55em, lowercase.
- **Why:** the owner found "9 TO 8" in display capitals distracting on the booking page; the connector should read as a word.
- **Re-apply:** add the `FACT_WORD` constant and `factValue()` above `FactGrid` and use `{factValue(f.value)}` in the `.sc-fact__value` element.

### 2026-10-10: SiteFooter `instagramHref`

- **What:** an optional `instagramHref` prop renders one more `<li>` after the Facebook link in the footer's Contact column, with the `instagram` icon and the text "Instagram".
- **Why:** the park has an Instagram account (https://www.instagram.com/serracrosspark/); `SITE.instagram` in `src/config/site.ts` feeds it.
- **Re-apply:** add the prop to `SiteFooterProps` and the destructuring, then the conditional `<li>`.

### 2026-10-10: site-level type scale

- **What:** `src/styles/site.css` sets `body`, `.lede`, `.body`, `.body-sm`, `.caption` and the timeline text one step larger than `tokens.css` (20/32, 24/36, 20/32, 18/28, 16/24), with a smaller step under 640px. Display styles are unchanged.
- **Why:** the owner asked for larger running text, especially on the History page.
- **Re-apply:** nothing in the ported files; the rule lives in site.css. If `tokens.json` is changed to these sizes later, delete the override.

### 2026-10-10: InquiryForm `blockLabel` and `blockOptions`

- **What:** two optional props on `InquiryFormProps`, `blockLabel?: string` and `blockOptions?: Choice[]`, defaulting to `'Time of day'` and the component's own `TIME_BLOCKS` array. The time-of-day `ChoiceChips` reads `label={blockLabel}` and `options={blockOptions}`; its `name="block"`, `defaultValue="afternoon"` and `columns={3}` are unchanged. Without the props the markup is identical to the design system's.
- **Why:** the owner's decision of 2026-10-10: there are no fixed three-hour weekend blocks. Events run 9 AM to 8 PM every day, any start time, with a two-hour minimum. The component's chips still read Morning (9 to 12), Afternoon (1 to 4) and Evening (5 to 8), which would tell couples the blocks exist. `src/components/booking/InquiryFallback.tsx` passes `blockLabel="Preferred time of day"` and Morning, Afternoon and Evening with no notes, so the inquiry asks only roughly when and the park office settles the hours. The posted field is still `block` with the same three values, so the hidden Netlify form on the booking page needs no change for it. The date field's help, "Weekend events end by 7:30 PM.", stays: that rule still stands. Pass custom options that include the value `afternoon`, or nothing is checked at first.
- **Component:** `InquiryForm`.
- **Re-apply:** append `; blockLabel?: string; blockOptions?: Choice[]` inside the one-line `InquiryFormProps` interface before its closing brace; add `, blockLabel = 'Time of day', blockOptions = TIME_BLOCKS` after `sent: sentProp` in the destructured props; and in the form body change `<ChoiceChips label="Time of day" name="block" options={TIME_BLOCKS} defaultValue="afternoon" columns={3} />` to `<ChoiceChips label={blockLabel} name="block" options={blockOptions} defaultValue="afternoon" columns={3} />`. If the refreshed design system has dropped the block chips or already takes the options as a prop, skip this and pass the site's options the new way.

### 2026-10-10: terms agreement in the booking island (a site addition, no component change)

- **What:** `src/components/booking/TermsCheckbox.tsx` (the checkbox, its wrapping label and the terms link), `src/components/booking/terms-agreement.ts` (sessionStorage helpers, tested in `terms-agreement.test.ts`) and the `TermsGate` inside `AvailabilityCalendar.tsx`, styled under "terms agreement" in `availability-calendar.css`. Built from tokens: a 1px `line-strong` border on `surface-raised`, square corners, `space-5` padding, a native 24px checkbox with `accent-color: var(--navy)` and the design system's focus ring (`0 0 0 2px var(--surface), 0 0 0 4px var(--focus)`). The Cal.com booker does not mount, on either path, until the box is ticked; the agreement is kept for the visit under the sessionStorage key `scp-terms-agreed`, and later views show one line, "You agreed to the terms and conditions." `InquiryFallback.tsx` renders the same checkbox above the ported `InquiryForm`, stops an unticked send with `onSubmitCapture` on its wrapper (the form element and its button belong to the component, which shows its confirmation as soon as its own submit handler runs, so the check has to come first) and posts `terms=yes`.
- **Component:** none in `src/components/ds/`. Nothing to re-apply. If the design system ever ships a Checkbox, port it and replace `TermsCheckbox`.

### 2026-10-12: InquiryForm `timeField` and `dateHelp`

- **What:** two more optional props on `InquiryFormProps`, in the same additive style as `blockLabel` and `blockOptions`: `timeField?: { name: string; label: string; options: FieldOption[]; help?: string }` and `dateHelp?: string` (default `'Weekend events end by 7:30 PM.'`, the component's own text). When `timeField` is passed, the form renders `<Field label={timeField.label} name={timeField.name} type="select" options={timeField.options} help={timeField.help} />` in the position of the time-of-day `ChoiceChips`, and the chips are not rendered; the chosen value travels in the submitted data under `timeField.name`, because the component's submit handler reads every named control through `FormData`. Without `timeField` the `ChoiceChips` markup is exactly as before (`name="block"`, `defaultValue="afternoon"`, `columns={3}`, `blockLabel`, `blockOptions`). The date field reads `help={dateHelp}`; without the prop its help text is unchanged.
- **Why:** the owner's decisions of 2026-10-12. Events run 8 AM to 8 PM every day, any start time, two-hour minimum, setup and breakdown inside booked time; the separate weekend end time is dropped. Three time-of-day chips no longer fit: the inquiry asks for a start hour instead. `src/components/booking/InquiryFallback.tsx` passes `timeField={{ name: 'start-time', label: 'Start time', options: START_TIMES, help: 'Bookings are at least two hours. The hill closes at 8 PM.' }}`, where `START_TIMES` is every hour from `{ value: '08:00', label: '8 AM' }` to `{ value: '18:00', label: '6 PM' }` (the last start that fits two hours before the gates lock), and `dateHelp="Bookings are at least two hours, any start time between 8 AM and 8 PM."`. It no longer passes `blockLabel` or `blockOptions`. The hidden Netlify twin on the booking page now carries `<input type="text" name="start-time" />` in place of `block`. The design system's `TIME_BLOCKS` constant and the `blockLabel`/`blockOptions` props stay in the file, unused by the site, so the 2026-10-10 entry above still applies on a refresh.
- **Component:** `InquiryForm`.
- **Re-apply:** append `; timeField?: { name: string; label: string; options: FieldOption[]; help?: string }; dateHelp?: string` inside the one-line `InquiryFormProps` interface before its closing brace (after `blockOptions?: Choice[]`); add `, timeField, dateHelp = 'Weekend events end by 7:30 PM.'` after `blockOptions = TIME_BLOCKS` in the destructured props; change `help="Weekend events end by 7:30 PM."` on the `Preferred date` field to `help={dateHelp}`; and wrap the `ChoiceChips` line for `block` as `{timeField ? (<Field label={timeField.label} name={timeField.name} type="select" options={timeField.options} help={timeField.help} />) : (<ChoiceChips ... unchanged ... />)}`. If the refreshed design system already takes a start-time field, pass the site's `START_TIMES` the new way and skip this.

### 2026-10-12: three bold rules in the terms agreement (a site addition, no component change)

- **What:** `TermsRules` in `src/components/booking/TermsCheckbox.tsx` renders `<ul class="terms-rules body-sm" role="list">` with three `<li class="terms-rules__item"><strong class="terms-rules__text">…</strong></li>`: "The park is always open to the public.", "No power or restrooms are available.", "Booked time must include setup and breakdown for you and your vendors." The gate before the booker (`TermsGate` in `AvailabilityCalendar.tsx`) shows it between its sentence and the checkbox, and `InquiryFallback.tsx` shows it above the same checkbox. Styled under "terms agreement" in `availability-calendar.css` from tokens: `body-sm`, `var(--space-2)` between lines, a 7px `accent` square mark on each line like the page's rules list, `font-weight: 600` on the strong text (EB Garamond ships 400 to 600, so 700 would be synthesized).
- **Component:** none in `src/components/ds/`. Nothing to re-apply.

### 2026-10-12: InquiryForm `sentText`

- **What:** one more optional prop on `InquiryFormProps`, `sentText?: ReactNode`, defaulting to the component's own sentence ("The park office will contact you to confirm your date. Once it is confirmed, we hold it for up to 14 days while the site fee arrives."). The "Inquiry sent" view renders `<p className="body">{sentText}</p>` in place of the hard-coded sentence. Without the prop the markup is identical to the design system's.
- **Why:** the Conservancy's terms document (`docs/TERMS-SOURCE.md`, 1.1 and 1.2, supplied 2026-10-12): the full payment comes with the reservation and the reservation is confirmed once the payment is processed. The site mentions no hold on a date anywhere, and the component's confirmation text was the last place that stated the brief's old rule to a visitor (it shows after the fallback inquiry form sends). `src/components/booking/InquiryFallback.tsx` passes `sentText="The park office will reply by email about your date and the site fee. Your reservation is confirmed once the payment is processed."`. The component's default sentence stays as the design system wrote it, like `dateHelp`, so the port's diff against the snapshot is additive.
- **Component:** `InquiryForm`.
- **Re-apply:** append `; sentText?: ReactNode` inside the one-line `InquiryFormProps` interface before its closing brace (after `dateHelp?: string`); add `, sentText = '<the component's own sentence>'` after `dateHelp = 'Weekend events end by 7:30 PM.'` in the destructured props; and in the `if (sent)` branch change the `<p className="body">` that carries that sentence to `<p className="body">{sentText}</p>`. If the refreshed design system has already dropped the old sentence or takes the text as a prop, pass the site's sentence the new way and skip this.
