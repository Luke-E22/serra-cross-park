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

## Planned

- **About page person card.** Built in site code from the tokens in `src/styles/site.css`: square corners, a `line` border, no shadow, four across on desktop and two on mobile, a `sandstone` square with navy initials until a photo arrives. A site addition, not a design system change, so it is noted here only so the two are not confused.
- **Availability calendar.** The Open, Partly booked and Booked day grid on the booking page is also built from tokens in `src/styles/site.css`, on top of Cal.com's slots. A site addition, not a design system change.
- **Gallery page lightbox.** A small island around `Gallery`: native `<dialog>`, arrow keys between photos, Escape closes, focus returns to the thumbnail, caption shown. It should wrap the component rather than change it. If `Gallery` needs a per-item click hook, add an optional prop here and log it.
- **Hero or Gallery changes the booking page needs.** None yet. Log any here when they happen, in the same form as the entries above.

## Site-level overrides

These live in `src/styles/site.css`, not in the ported components. They are listed so a snapshot refresh knows to check them.

- **`.sc-sign__figure img, .sc-tl__figure img { height: auto }`** (2026-10-09). `picture()` in `src/lib/images.ts` puts `width` and `height` attributes on every photo through `imgProps`. `bundle.css` gives these two figures `width: 100%` and an `aspect-ratio` but no `height`, so the attribute's height won and the SignPanel photo rendered at its full pixel height. `height: auto` hands control back to the aspect ratio. Hero, FeatureCard and Gallery photos set `height: 100%` in `bundle.css` and need nothing. Drop this rule if a refreshed `bundle.css` sets a height on those figures itself.
