Serra Cross Park is a one-acre park on the hill above Mission San Buenaventura in Ventura, California, cared for by Serra Cross Conservancy, a 501(c)(3) nonprofit. The website has three jobs, in this order: book weddings and events, tell the story of the Cross, and raise money to care for the hill.

The look comes from the park's own interpretive sign: Mackintosh-style capitals, solid color bands, and Garamond text on a pale ground. Photographs of the real park carry the romance. The system should feel like the sign came indoors and got dressed for a wedding.

## Content fundamentals

**Voice.** Warm, plain and rooted. Write like a neighbor who knows the hill well: short sentences, concrete detail (the islands, the stone, the year), no hype. Reverent about the history without preaching.

**Person.** "We" is the Conservancy. "You" is the couple, the family or the visitor.

**Casing.** Write headings, labels and buttons in sentence case. The display styles set them in capitals, the way the sign does. Body text stays in sentence case.

**Punctuation.** No em dashes: use a period, a comma or a colon. No exclamation marks. One idea per sentence.

**Numbers.** Spell out one to ten in prose ("a two-hour minimum"). Use figures for prices, times, dates and guest counts: $300, 9 AM, 7:30 PM, March 31, 1782, 300 guests. Time blocks read "9 to 12".

**Names.** Serra Cross Park (the place). Serra Cross Conservancy (the nonprofit). The Cross, capitalized when it means this cross. Father Junípero Serra, with the accent. Mission San Buenaventura. The Channel Islands. The Thomas Fire.

**Money words.** A gift or donation is tax-deductible. A site fee reserves a date and is non-refundable; never call it tax-deductible.

| Write | Not |
| --- | --- |
| Married on the hill | Your Dream Wedding Awaits! |
| No restrooms or water on site. Rent portable restrooms and bring water. | Amenities are limited. |
| Every gift replants what the Thomas Fire took. | Make a difference today! |
| The park office will contact you to confirm your date. | We'll be in touch ASAP! |
| The grounds stay open to the public during your event. | Exclusive private venue |

**Facts to keep identical everywhere.** $300 per hour, two-hour minimum. Events 9 AM to 8 PM daily; weekend blocks 9 to 12, 1 to 4 and 5 to 8; weekend events end by 7:30 PM; gates lock at 8 PM. Up to 300 seated or 500 standing. A confirmed date is held for 14 days while the site fee arrives. Tax ID 20-8615264.

## Visual foundations

### Color

The ground is `surface` (paper) and the ink is `navy`, the sign's own pairing. Spend color roughly 70% paper and light surfaces, 20% `navy`, 10% for the band colors and ochre.

The band colors mean what they mean on the sign:

- `green`: the Cross and its history.
- `navy`: weddings, facts, booking.
- `brick`: visiting, the map, directions. Also `danger` for form errors.
- `ochre`: giving, restoration, the Thomas Fire.

Ochre has three tokens for three jobs. `ochre` is the sign's color, for ornaments, rules and band titles 24px or larger. `ochre-fill` is the Give button and ochre card band, with navy text (`on-accent`). `ochre-deep` is small ochre text on light grounds, such as eyebrows and fact labels.

Set text on `surface`, `surface-raised`, `surface-alt` or `sandstone` in `ink` or `ink-muted`. On `navy`, `green` and `brick` use `ink-on-dark` or `ink-on-dark-muted`. Text over photographs goes only on `scrim`. Every text pair named in the token notes meets 4.5:1, and large display text on ochre meets 3:1.

### Typography

Two families. **Strong Glasgow** (`display`) for everything the sign would letter: titles, eyebrows, labels, buttons, navigation and figures. It is always set in capitals. Its lowercase letters are small caps, which the timeline uses for decade years like "1860s". The smallest size is `label` at 15px.

**EB Garamond** (`serif`) for reading: `lede`, `body`, `body-sm`, `caption`. It is the closest open match to the Garamond on the sign. Running text uses old-style figures; forms, prices and chips use lining figures (the components set this).

Use the type classes from tokens directly: `display-xl` for the one hero title per page, `display-lg` for page titles and big numbers, `heading` for section titles and sign bands, `heading-sm` for card and step titles. Under 640px wide the display sizes step down (76 to 46, 52 to 36, 34 to 28).

The Strong Glasgow files in `fonts/` are the free demo, licensed for personal use only, and they draw an "HF" badge in place of each digit. `components/bundle.css` lends Big Shoulders Display digits to the display face so figures read correctly. Before the site goes live, license Strong Glasgow (desktop and web) from Herofonts, replace the three files, and delete the three figure rules in `bundle.css`.

### Layout and spacing

Content sits in a 1200px container (`container`) with 24px gutters (`space-5`), 16px under 640px. Sections are 96px tall in padding (`space-9`), 64px on mobile (`space-8`). Lines of body text stay under 680px (`measure`). Photographs and color bands may bleed to the page edge; text never does.

Use the layout helpers in `bundle.css`: `.sc-container`, `.sc-section`, `.sc-section--alt` (on `surface-alt`) and `.sc-section--dark` (on `navy`). Alternate paper and `surface-alt` sections on long pages, and give each page at most one navy section above the footer.

### Shape, borders and shadow

Corners are square (`radius-none`) on photos, bands, buttons and cards, like the sign. Inputs and chips take `radius-sm` (2px). Circles (`radius-round`) are only for the FAQ toggle. Separate things with borders, not shadows: `line` for decorative hairlines, `line-strong` wherever a border must be seen. The two shadows are `shadow-sticky` under a sticky header and `shadow-raised` under the open mobile menu.

### The sign band

The signature motif is a solid band of `green`, `navy`, `brick` or `ochre` with a display title in paper, taken straight from the sign. It appears in `SignPanel` and as the label on `FeatureCard`. Never round its corners, outline it, or fill it with a gradient.

### Imagery

Use real photographs of the park: the Cross, the ocean and the Channel Islands, the stone ramparts, the salvia, and real weddings held here. No stock photography. Prefer bright midday or golden hour light. Keep the Cross upright and whole; never crop through it. Archival photographs stay sepia or black and white with a caption, and are never colorized. Write alt text that says what is in the frame.

### Motion

Keep it quiet. Buttons fade their color over 150ms. Card photos zoom 3% on hover. No parallax, autoplaying carousels or scroll animations. Everything stops under reduced motion.

### Focus and states

Keyboard focus is a 2px `surface` gap inside a 2px `focus` (navy) ring, so it shows on paper, on navy and on photos. Hover darkens navy fills to `navy-deep`, brightens the Give button to `ochre-fill-hover`, fills secondary buttons, and turns links `brick`. Errors use `danger` with the circle-alert icon and words; confirmations use `success` with the check icon and words. Status never relies on color alone.

## Iconography

Icons come from Lucide (open source, ISC license): a 24px grid, 1.5 stroke and round caps. The brand had no icon set, so Lucide stands in, chosen because its thin, even line sits well beside Garamond. The 28 icons used are in Icons; in code use the `Icon` component. Icons always sit beside words, except the menu and close toggles. No emoji anywhere.

The dotted O ornament is not an icon. It marks hero eyebrows, timeline years, centered section titles and the footer's legal line.

## Logo

The wordmark is SERRA CROSS PARK in Strong Glasgow Bold. The lockup adds SERRA CROSS CONSERVANCY between two rules, for anywhere the nonprofit must be named. A stacked version fits square spaces. Navy files go on light grounds and paper files on navy or photographs (see Logos). There is no symbol: the name carries the place. Keep clear space equal to the cap height on all sides. Never redraw, outline, stretch, recolor or reset the wordmark in another face.

## Giving

Serra Cross Conservancy is a 501(c)(3) nonprofit, Tax ID 20-8615264. Show that line on every donation surface and in the footer of every page. One-time gifts start at $50, $100, $250 and $500, with an Other amount. Site fees are paid through the same `GivingForm`, on its own tab, at $300 per hour with a two-hour minimum.

## Using this system

Components live in `components/bundle.js` as `window.SerraCross` and expect React 18 on the page. Their styles are in `components/bundle.css`, which reads every value from the tokens and loads EB Garamond from Google Fonts. Build pages from the components in this order: `SiteHeader` (or a `Hero` carrying it), sections opened by `SectionHeading`, then content components, then `SiteFooter`.
