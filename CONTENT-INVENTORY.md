# Content inventory: serracrosspark.com

Source: the live WordPress site at https://serracrosspark.com, ten pages fetched on 2026-10-09. The HTML, a plain-text pass and every image were saved and read page by page. WordPress resized copies (`-WIDTHxHEIGHT`) are collapsed to their originals. Image dimensions come from the downloaded originals. All 40 image files referenced by the ten pages downloaded without error.

## How to read this file

- One section per page, in this order: Home, About, History, Calendar, Booking, Gallery, FAQ, Contact, Donate, Terms and Conditions.
- Each section opens with the URL, the `<title>` tag and the meta description (the old site has none on any page), then the page's main content in reading order. Old-site headings are shown as level 4 headings with their original level noted beneath. Paragraphs are quoted as written, including typos, odd capitals, spacing and literal asterisks. Buttons and links show their label and target.
- Images sit where they appear in the page, as bullets: original URL, alt text (or "none"), caption (or "none") and dimensions in pixels. Hero backgrounds are applied by CSS, so they have no alt and could not have one.
- "Facts on this page" lists the checkable claims the page makes. "Embedded widgets" lists forms, plugins, embeds and scripts in the main content.
- Header and footer elements are the same on every page. They are listed once, under "Site-wide elements", and not repeated.
- The last section, "All images", lists every image file with the pages that use it. The "Candidate for new site?" column reads "review" for every file. Each one will be looked at in the photo pass.
- Old-site text is quoted verbatim even where it breaks the brand voice. Everything else in this file follows the brand voice.
- Open questions raised by this inventory are in CONTENT-TODO.md.

## Site-wide elements

- Site title, rendered as an h1 on every page: "Serra Cross Conservancy", in the custom "Willow" font. Each page therefore has two h1s.
- Header navigation: Donate (/donate/), About (/about/), History (/history/), Calendar (/calendar/), Booking (/booking/), Gallery (/gallery/), FAQ (/faq/), Contact (/contact/), and a Facebook group link to https://www.facebook.com/groups/222411215009. Active link color #ffd300.
- Footer navigation, in this order: Booking, Calendar, Donate, Terms & Conditions (https://serracrosspark.com/terms-and-conditions/), Home, About, History, FAQ. Gallery and Contact are not in the footer menu.
- Footer line: "© 2026 Serra Cross Conservancy - All rights reserved" (the year is generated; "Serra Cross Conservancy" is a link to the home page).
- Header also carries a search overlay (GET to the site root, field `s`) and a WooCommerce cart icon ("Your cart", 0 items) that custom CSS hides. The footer's "accepted payment methods" widget renders an empty list.
- Every page uses a full-width header band with a page-specific background photo set by inline CSS on `#headerbg`, the page title as h1, a decorative divider (on every page except Home) and an empty subtitle container. On every page the h1 opens with `<h1>` and closes with `</h2>`.
- `<head>` on every page: a Google site verification meta tag (content `A-x5km0fMWxUOoZC8MGXWaXg5TPJSZ1A3ulxehcSjS8`), no meta description, no Open Graph or Twitter tags, no JSON-LD. The `<html>` element declares `itemtype="http://schema.org/Product"` on every page.
- Brand colors in the old CSS: banner gradient #338adf to #72d9ae, donate button #2098d1, grey feature bands #f7f7f7. Body text 15px black.
- Platform: WordPress 6.3.13, theme "cleayn" (Playne), WooCommerce 3.4.4, Booking Calendar (booking.bs 8.3.2, Business Small edition), Enable jQuery Migrate Helper, Jetpack lazy images, Cloudflare Rocket Loader and Cloudflare email obfuscation. Theme motion: WOW.js scroll reveals, a parallax band on Home, hover sweeps on buttons.

## Home

- URL: https://serracrosspark.com/ (WordPress page 4639, slug `home`, template `template-homepage-woo.php`)
- Title tag: Serra Cross Conservancy
- Meta description: none
- Header background: image-home.jpg (listed below)

### Content

#### Serra Cross Park
h1. Hero title in white 72px "Willow" over the full-bleed photo. The subtitle slot under it is empty. A down-arrow scroll cue sits below.

- Image: https://serracrosspark.com/wp-content/uploads/2018/11/image-home.jpg. Alt: none (CSS background). Caption: none. 3072x1190.
- Button "Book Your Event" to /booking (hero primary button, white text)

#### About the Conservancy
h2. White 50px title on a blue-to-green gradient band (#338adf to #72d9ae). Text centered, max width 777px.

The Serra Cross Conservancy is a grass roots organization made up of a broad cross-section of our community. We are interested in preserving and maintaining the Serra Cross Park for a variety of personal reasons; we value the Park for the sake of historic preservation and/or are interested in the cross as a religious icon and a landmark attraction to other communities and tourists. But mostly for long-time members of this community, the cross represents what makes Ventura special and serves as an important element of our lives here in Ventura.

- Button "Donate" to /donate (black text on the gradient)

#### Weddings at the Cross
h2. White title over a parallax photo band. Text white, centered, 26px, max width 837px.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/wedding-1.jpg. Alt: none (CSS background). Caption: none. 1199x588.

Serra Cross Park features a beautiful, natural setting with sweeping ocean views, a modest price-tag, and a rich history.

- Button "Book an Event" to /booking

#### Help Us Restore the Park, Charitable Donations Needed
h2, light weight, centered, with a line break after the comma.

All proceeds help restore vegetation lost in the Thomas Fire and the continued beautification of Serra Cross Park. Your donations are greatly appreciated.

(The line above is marked up as a second h2 but styled as normal-weight body text, max width 991px.)

Row of four photos, each a quarter wide, each in its own paragraph. No captions.

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-bench-2010.jpg. Alt: none. Caption: none. 2000x1500. Served at 300x225.
- Image: https://serracrosspark.com/wp-content/uploads/2013/06/plant3.jpg. Alt: none. Caption: none. 887x892. Served at 298x300.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_8096.jpg. Alt: none. Caption: none. 2000x1500. Served at 300x225.
- Image: https://serracrosspark.com/wp-content/uploads/2013/06/plant2.jpg. Alt: none. Caption: none. 225x225. Very low resolution.
- Button "Donate" to /donate (centered, background #2098d1)

#### Stonework
h4. Grey band (#f7f7f7), text on the left half, photo on the right half.

In January 2010, stoneworkers from around the world came to Ventura to work on a ramparts project at the Serra Cross Park.
Led by a family from Japan who has built castle ramparts and walls for eight generations, the project was constructed in 10 days using stone from a quarry in Ojai. The Stone Foundation brought expert “rock knockers” from several states to learn the Japanese method of dry stone walling, which uses no mortar and relies on gravity to hold the stones in place for centuries. Massive stones were shaped by hand, using ancient tools. Of special interest is the spherical stone which sits atop one of the ramparts.

(One paragraph in the source with a line break after the first sentence.)

- Link "Learn more" to /about (plain black text link, not a button)
- Image: https://serracrosspark.com/wp-content/uploads/2018/08/serra-stone.jpg. Alt: none (CSS background on an empty div). Caption: none. 760x507.

#### History of the Cross
h4. Grey band, photo on the left half, text on the right half.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/serra.jpg. Alt: none (CSS background on an empty div). Caption: none. 1000x758.

On Easter Sunday, March 31, 1782, Spanish missionary, Father Junipero Serra, founded Mission San Buenaventura. On the beach south of the present-day mission church, he blessed an area of land and planted a wooden cross. Mission San Buenaventura was the ninth in the series of California Missions to be founded by Father Serra, and it was his last. Serra stayed only three weeks before leaving for Santa Barbara.

- Link "Learn more" to /history (plain black text link)

#### Book Event
h4. Half-width tile. The whole tile is a link to /booking with a hover overlay.

The Serra Cross Conservancy welcomes events from family picnics to educational field trips to weddings and memorial services.

#### Contact Us
h4. Half-width tile. The whole tile is a link to /contact with a hover overlay.

For more information about the Serra Cross Conservancy and the Serra Cross Park

(No closing punctuation in the source.)

### Facts on this page

- Organization: Serra Cross Conservancy, "a grass roots organization made up of a broad cross-section of our community".
- Park: Serra Cross Park, Ventura, California.
- Stated purposes: preserving and maintaining the park; historic preservation; the cross as a religious icon and a landmark attraction for other communities and tourists.
- Donation purpose: "All proceeds help restore vegetation lost in the Thomas Fire and the continued beautification of Serra Cross Park."
- Weddings pitch: "beautiful, natural setting with sweeping ocean views, a modest price-tag, and a rich history". No price is given on this page.
- Events welcomed: family picnics, educational field trips, weddings, memorial services.
- Stonework: January 2010; a ramparts project built in 10 days by stoneworkers from around the world; led by a family from Japan that has built castle ramparts and walls for eight generations; stone from a quarry in Ojai; The Stone Foundation brought "rock knockers" from several states to learn Japanese dry stone walling (no mortar, held by gravity); stones shaped by hand with ancient tools; a spherical stone sits atop one rampart.
- History: Easter Sunday, March 31, 1782, Father Junipero Serra founded Mission San Buenaventura, blessed land and planted a wooden cross on the beach south of the present-day mission church; the ninth California mission he founded and his last; he stayed three weeks before leaving for Santa Barbara.
- Calls to action on this page: /booking three times ("Book Your Event", "Book an Event", "Book Event" tile), /donate twice, /about and /history ("Learn more"), /contact ("Contact Us" tile).
- No prices, hours, capacity, phone numbers, emails, street address, insurance amounts or Tax ID appear on this page.

### Embedded widgets

- Theme call-to-action buttons with a hover sweep effect: plain links, no scripts.
- WOW.js scroll-reveal animations on section titles and feature text.
- Parallax background on the "Weddings at the Cross" band.
- Two identical inline jQuery snippets that match each feature photo panel's height to its text column.
- Linked tiles with hover overlays: "Book Event" to /booking, "Contact Us" to /contact.
- Hero down-arrow scroll cue and a back-to-top button.
- Booking Calendar plugin scripts and theme carousel libraries load on this page but nothing uses them. No forms, iframes, maps, calendars, shortcodes or PayPal buttons in the main content.

## About

- URL: https://serracrosspark.com/about/ (WordPress page 4641)
- Title tag: About – Serra Cross Conservancy
- Meta description: none
- Header background: serra-cross-rainbow-1.jpg (listed below)

### Content

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-rainbow-1.jpg. Alt: none (CSS background on the header band). Caption: none. 720x302.

#### About
h1. Page title in the header band. The subtitle slot is empty.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/ABOUT-serra-park-1.jpg. Alt: none. Caption: none. 270x188. Floated right of the first paragraph and displayed at 425x296, so it is upscaled. Shows three children holding a hand-drawn "Save the Cross" poster at a fundraiser. Nobody is named.

The Serra Cross Conservancy is a grass roots organization made up of a broad cross-section of our community. We are interested in preserving and maintaining the Serra Cross Park for the sake of historic preservation and/or are interested in the cross as a religious icon and a landmark attraction to other communities and tourists. But mostly for long-time members of this community, the cross represents what makes Ventura special and serves as an important element of our lives here in Ventura.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/ABOUT-2.jpg. Alt: none. Caption: none. 188x270. Floated left of the next paragraphs and displayed at 335x481, so it is upscaled. Shows four adults outdoors, the woman in front holding a framed photo of the Cross. Nobody is named.

Visitors who have enjoyed the park and other concerned citizens and businesses contributed to the purchase of the Serra Cross Park. All of them expressed an interest in keeping the cross in its current location and maintaining the land as an open park for the enjoyment of all. The Serra Cross Conservancy is dedicated to making this possible and to improving the park over time.

The Serra Cross Conservancy has the responsibility for managing the park. All of our funding comes from the generous tax-deductible donations of concerned citizens who enjoy the park. The donations pay for property insurance, water, electricity, landscape maintenance, litter pick-up, and any improvements. Volunteers are helping with routine park care and special projects.

The Board of the Serra Cross Conservancy is grateful to everyone who has played a part in making it possible for all of us to enjoy the Serra Cross Park.

For more information about the Serra Cross Conservancy and the Serra Cross Park, please send us a message.

- Link "send us a message" to /contact (inline text link)

Or you can write us at:
P. O. Box 48, Ventura, CA 93002-0048

(One paragraph with a line break. The page ends here, with no closing call to action.)

### Facts on this page

- Organization: Serra Cross Conservancy. Park: Serra Cross Park, Ventura, California.
- Mailing address: P. O. Box 48, Ventura, CA 93002-0048.
- Self-description: "a grass roots organization made up of a broad cross-section of our community".
- The park was purchased with contributions from visitors, concerned citizens and businesses. Contributors wanted the cross kept in its current location and the land kept as an open park for everyone.
- The Conservancy "has the responsibility for managing the park" and is "dedicated to ... improving the park over time".
- "All of our funding comes from the generous tax-deductible donations of concerned citizens."
- Donations pay for property insurance, water, electricity, landscape maintenance, litter pick-up and improvements.
- Volunteers help with routine park care and special projects.
- A Board exists ("The Board of the Serra Cross Conservancy"). No names, officers, founding date or purchase date are given.
- No phone number, email address, hours, prices, Tax ID or staff names on this page.

### Embedded widgets

- None. Classic-editor paragraphs and two floated images. No forms, shortcodes, iframes, maps or buttons.

## History

- URL: https://serracrosspark.com/history/ (WordPress page 4887, template `single-full-page`)
- Title tag: History – Serra Cross Conservancy
- Meta description: none
- Header background: IMG_7728.jpg (listed below)

### Content

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7728.jpg. Alt: none (CSS background on the header band). Caption: none. 1918x1438. View from the park lawn over Ventura, the beach and the pier, with pink and purple flowers in front. The Cross is not in frame.

#### History
h1. Page title in the header band. The subtitle slot is empty.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/history-1.jpg. Alt: none. Caption: none. 188x270. Floated right at the start of the first paragraph, displayed at 185x265.

On Easter Sunday, March 31, 1782, Spanish missionary, Father Junipero Serra, founded Mission San Buenaventura. On the beach south of the present-day mission church, he blessed an area of land and planted a wooden cross. Mission San Buenaventura was the ninth in the series of California Missions to be founded by Father Serra, and it was his last. Serra stayed only three weeks before leaving for Santa Barbara.

Shortly after the Mission’s founding, a large wooden cross was planted on top of a hill overlooking the Mission church. This highly visible cross served as a road sign for travelers in search of the Mission. The original cross was eventually lost to the elements and replaced in the 1860s. After the second cross blew down in a storm on November 5, 1875, it was not replaced for almost 40 years. Then, on Admissions Day, September 9, in 1912, members of the E.C.O. Club, a ladies service organization, erected a new wooden cross in the current location. The E.C.O. Club was dedicated to bringing culture and a historical perspective to the frontier.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/history-2.jpg. Alt: none. Caption: none. 270x188. In its own paragraph, floated left, displayed at 420x292, so it is upscaled.

The land on which the cross was erected did not become a city park until 1918 when Kenneth and Tonie Grant donated 107 hillside acres to the City of San Buenaventura. Over the years, there have been a number of improvements to the property surrounding the cross. The first roads leading up to the cross were built around 1920. As part of the festivities for the 150th anniversary mass on the site on March 31, 1932, the circular stone pedestal around the cross was built, as well as a concrete pathway up to the pedestal. Much of this is in place today with minor adjustments. In 1941, the city replaced the 1912 cross with the one that stands here today.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/history-3.jpg. Alt: none. Caption: none. 205x272. Floated right at the start of the next paragraph, displayed at 350x464, so it is upscaled.

In the spring of 2003, the wooden cross located in Grant Park was threatened by a potential constitutional lawsuit charging that the principle of separation of church and state was being violated by the City of San Buenaventura’s ownership and maintenance of a cross. Similar lawsuits in other communities had resulted in those cities being forced by the courts to divest themselves of their crosses. The City of San Buenaventura City Council voted on July 31, 2003, to sell the cross and an acre of land surrounding it to the highest bidder.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/history-4.jpg. Alt: none. Caption: none. 272x205. In its own paragraph, centered, displayed at 482x364, so it is upscaled.

Much of Serra Cross Park was destroyed by Thomas Fire on December 5, 2017 but The Cross remained thanks to the heroic efforts of the Firefighters. A portion of the new landscape was donated and installed by Pete Dufau of Dufau Landscape in Ventura.

Gallery of seven photos in a three-column grid (WordPress `[gallery]` shortcode), with no heading, intro or captions. Thumbnails have a 2px grey border. Each thumbnail links to the full-size file and there is no lightbox, so a click opens the raw JPEG.

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-sign-posts-2.jpg. Alt: none. Caption: none. 2583x3304 (1.98 MB).
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-bottle-pile.jpg. Alt: none. Caption: none. 2690x1887 (2.55 MB).
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-vegetation.jpg. Alt: none. Caption: none. 1785x1338.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-cross.jpg. Alt: none. Caption: none. 2024x2698.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-sign-posts.jpg. Alt: none. Caption: none. 2024x2698 (2.02 MB).
- Image: https://serracrosspark.com/wp-content/uploads/2018/11/FAQ.jpg. Alt: none. Caption: none. 1800x460. A wide banner-ratio image that does not match the fire photos around it. It is not used on the FAQ page despite its name.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/burned-landscaping.jpg. Alt: none. Caption: none. 1792x1195.

(A trailing empty paragraph follows the gallery.)

### Facts on this page

- Easter Sunday, March 31, 1782: Father Junipero Serra founded Mission San Buenaventura and planted a wooden cross on the beach south of the present-day mission church. The ninth California mission he founded, and his last. He stayed three weeks before leaving for Santa Barbara.
- Shortly after the founding, a large wooden cross was planted on the hill overlooking the Mission church as a road sign for travelers.
- The original hilltop cross was lost to the elements and replaced in the 1860s.
- November 5, 1875: the second cross blew down in a storm and was not replaced for almost 40 years.
- "Admissions Day", September 9, 1912: members of the E.C.O. Club, "a ladies service organization", erected a new wooden cross in the current location. The club "was dedicated to bringing culture and a historical perspective to the frontier".
- 1918: Kenneth and Tonie Grant donated 107 hillside acres to the City of San Buenaventura, making the land a city park.
- Around 1920: the first roads up to the cross were built.
- March 31, 1932: for the 150th anniversary mass, the circular stone pedestal and a concrete pathway were built. Much of this is in place today with minor adjustments.
- 1941: the city replaced the 1912 cross with the one that stands today.
- Spring 2003: a potential constitutional lawsuit over the City's ownership and maintenance of the cross in Grant Park. Other cities had been forced to divest their crosses.
- July 31, 2003: the City Council voted to sell the cross and an acre of land around it to the highest bidder. The page does not say who bought it or when.
- December 5, 2017: the Thomas Fire destroyed much of Serra Cross Park. The Cross survived thanks to the firefighters.
- Pete Dufau of Dufau Landscape in Ventura donated and installed a portion of the new landscape.
- The park is called both "Grant Park" (2003 paragraph) and "Serra Cross Park" (fire paragraph).
- Spelling as written: "Junipero" without the accent, "Admissions Day", "destroyed by Thomas Fire".

### Embedded widgets

- WordPress core `[gallery]` shortcode: seven images, three columns, size "large", each linked to its full-size file. No captions, no lightbox.
- No other forms, iframes, maps or buttons in the main content.

## Calendar

- URL: https://serracrosspark.com/calendar/ (WordPress page 5152, template `single-full-page`)
- Title tag: Calendar – Serra Cross Conservancy
- Meta description: none
- Header background: image-home.jpg (same hero photo as Home)

### Content

#### Calendar
h1. Page title in the header band. The subtitle slot is empty. There is no prose on this page.

Three-column layout.

Left column: the Booking Calendar plugin's one-month date picker for booking resource 1. The saved HTML shows only the placeholder text "Calendar is loading..."; JavaScript paints the calendar. Legend beneath it, each label beside a color swatch:

- "- Available"
- "- Booked"
- "- Partially booked"

An empty "booked times" box fills with that day's booked slots ("Booked Times:") when a booked day is clicked.

Middle column: the booking form (`booking_form1`, submitted by AJAX). Fields in order:

- Start Time: select, 5:00 AM to 9:00 PM in 30-minute steps (33 options), default 1:00 PM. Not required.
- Event Duration: select, "2 hours", "3 hours", "4 hours", "5 hours", "6 hours", "7 hours", "8 hours" plus a trailing blank option. Default 3 hours. Required.
- Title:* text, required.
- First Name: text.
- Last Name: text.
- Email:* text, required, email validation.
- City: text.
- State: text.
- Zip: text.
- Phone: text, no formatting or validation.
- Details: textarea, 5 rows.
- Link "Terms and Conditions" to /terms-and-conditions (opens in a new tab)
- Checkbox "I accept the terms and conditions", required.
- Button "Send" (AJAX submit, with a hidden spinner beside it)

There is no visible date field. The date is set only by clicking a day in the calendar.

Right column: three photos stacked, no captions. The first two have a 2px grey border and 10px padding; the third has no border.

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP.jpg. Alt: none (attribute absent). Caption: none. 1280x854.
- Image: https://serracrosspark.com/wp-content/uploads/2015/08/wedding2.jpg. Alt: none (attribute absent). Caption: none. 1089x525.
- Image: https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-2.jpg. Alt: none (attribute absent). Caption: none. 220x315. Root-relative `src`, stretched to full column width, so it is upscaled.

Approved bookings loaded into the calendar (decoded from the inline script; snapshot 2026-10-09 18:38; no pending bookings and no admin-blocked days at that time):

- Sat Oct 10, 2026, 1:00 PM to 4:00 PM
- Sat Oct 17, 2026, 2:00 PM to 4:00 PM
- Fri Nov 13, 2026, 1:00 PM to 3:00 PM
- Sat Nov 14, 2026, 1:00 PM to 4:00 PM
- Fri Nov 20, 2026, 2:00 PM to 6:00 PM
- Sat Nov 21, 2026, 2:00 PM to 5:00 PM
- Mon Nov 30, 2026, 12:30 PM to 3:30 PM
- Sat Dec 5, 2026, 2:00 PM to 5:00 PM
- Sat Dec 12, 2026, 1:30 PM to 3:30 PM
- Sat Feb 13, 2027, 1:00 PM to 3:00 PM
- Sat Feb 20, 2027, 12:00 PM to 2:00 PM
- Sat Mar 20, 2027, 1:00 PM to 4:00 PM
- Sat Mar 27, 2027, 1:30 PM to 3:30 PM
- Sun Apr 18, 2027, 1:00 PM to 3:00 PM
- Sat May 1, 2027, 2:00 PM to 5:00 PM
- Sat May 1, 2027, 7:00 PM to 9:00 PM (second booking that day)
- Sat May 15, 2027, 10:00 AM to 1:00 PM
- Sat May 22, 2027, 1:00 PM to 4:00 PM
- Sat Jul 10, 2027, 2:00 PM to 4:00 PM
- Sat Sep 4, 2027, 11:00 AM to 2:00 PM
- Sat Sep 18, 2027, 1:00 PM to 5:00 PM
- Sat Sep 25, 2027, 12:00 PM to 4:00 PM
- Sat Oct 16, 2027, 1:00 PM to 4:00 PM
- Sun Apr 16, 2028, 8:00 AM to 1:00 PM (furthest out)

### Facts on this page

- 24 approved bookings on 23 dates as of 2026-10-09. 19 of the 24 fall on a Saturday; the others are two Fridays, a Monday and two Sundays. Durations run 2 to 5 hours, mostly early to mid afternoon.
- Two bookings fall outside the hours stated on the Booking page: Sat May 1, 2027, 7:00 PM to 9:00 PM and Sun Apr 16, 2028, 8:00 AM to 1:00 PM.
- Form options: start times 5:00 AM to 9:00 PM; durations 2 to 8 hours; defaults 1:00 PM and 3 hours.
- Required fields: Title, Email, Event Duration and the terms checkbox. Optional: Start Time, First Name, Last Name, City, State, Zip, Phone, Details.
- Plugin settings: one month shown, single-day selection, bookings allowed up to three years ahead, no weekdays blocked, AM/PM display, locale en_US.
- Thank-you message after submit, shown inline for seven seconds: "Thank you for your online booking.  We will send confirmation of your booking as soon as possible." (double space as written). The plugin's configured thank-you page is https://serracrosspark.com/thank-you.
- No prices, hours, policies or contact details appear on this page.

### Embedded widgets

- WP Booking Calendar (wpdevelop, booking.bs 8.3.2, Business Small): inline month date picker, hourly booking form with start time and duration, AJAX submit to `admin-ajax.php`, legend, booked-times panel, 24 approved bookings injected by inline script.
- An empty payment gateway container and an iDEAL gateway script. No price or payment step is rendered. The plugin's cost hint popovers are hidden by theme CSS.
- Hidden plugin spinner `ajax-loader.gif` (alt "ajax loader") beside the Send button.
- Cloudflare Rocket Loader rewrites every script.

## Booking

- URL: https://serracrosspark.com/booking/ (WordPress page 4895, template `single-full-page`)
- Title tag: Booking – Serra Cross Conservancy
- Meta description: none
- Header background: 18OutdoorReceptionWineBarrels-SCP2.jpg (listed below)

### Content

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP2.jpg. Alt: none (CSS background on the header band). Caption: none. 1280x685. A wide crop of a daytime reception on the lawn: cream umbrellas, round tables, gold chairs, wine barrels, the Cross and the ocean. The same photo as the uncropped file further down.

#### Booking
h1. Page title in the header band. The subtitle slot is empty.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/booking-1.jpg. Alt: none. Caption: none. 220x320. Floated right at the start of the intro, displayed at 288x419, so it is upscaled. A bride and groom on the hilltop lawn with the coastline behind.

The Serra Cross Conservancy encourages everyone to enjoy the park and welcomes events ranging from family picnics to educational field trips to weddings and memorial services. The site, with its unique character and spectacular views, is very popular for private events. *If you are interested in holding your event at the Cross, here are some things you should know.*

(The asterisks are literal characters on the page.)

Rental Fee: A non-refundable donation is required in order to reserve your date. The donation/rental fees are as follows:

- $300.00 per hour with a minimum of two hours*
- *All reservations must include time needed for vendor/client set up, event, and vendor/client break-down
- Availability: 9am–8pm year-round, daily, in set blocks of time. For Saturday and Sunday functions, we suggest morning (9-12 PM), afternoon (1-4PM), or evening (5-8PM) (events must end by 7:30pm).
- Site Capacity: The grounds hold 300 people seated or 500 people standing

**If you’d like to pay by credit card, click Donate below:**

- Button: PayPal "Donate" image button (alt "Donate with PayPal button", title "PayPal - The safer, easier way to pay online!"). Posts to https://www.paypal.com/cgi-bin/webscr with `cmd=_s-xclick` and `hosted_button_id=KSMPQM7ALZ5U8`. No amount is preset. Followed by PayPal's 1x1 tracking pixel.

Two-column block (stacked on mobile):

- Image: https://serracrosspark.com/wp-content/uploads/2019/02/image.png. Alt: none. Caption: none. 1280x1917 PNG (1.9 MB), squeezed to 263x386 by inline style, with a 2px grey border and 10px padding. A single reception table under a cream umbrella with gold chairs, farm fields and the ocean behind.

Important Notes:

(The "Important Notes:" line is opened with a `<div>` and closed with a `</p>` in the source.)

- All guests and equipment must be off the property by 8:00pm. Gates will be locked at 8:00pm
- The grounds must remain open to the general public at all times.
- Electrical outlets are located on the base of the Cross.
- There are no public bathroom facilities at the park; please consider renting portable bathrooms.
- If your event exceeds 100 people, we suggest hiring a valet parking service.
- There is no water available at the park; please bring your own water.

If you would like to book Serra Cross Park for your wedding or private event, please complete the form below and the Serra Cross Park office will be in touch shortly. If you would like to set up a phone call, please email  admin@serracrosspark.com to make a phone appointment.

- Link "admin@serracrosspark.com" (Cloudflare-obfuscated; the decoded href is malformed, see "Facts"). Opens in a new tab.

Once the date is confirmed with you, a tentative hold will be placed on the calendar for up to fourteen days until the site fee is received. Once the site fee is received, you will receive a letter of confirmation.

Booking form: the same Booking Calendar widget and form as the Calendar page (calendar on the left, form in the middle, photos on the right), for the same booking resource and with the same 24 approved bookings. Fields: Start Time, Event Duration, Title*, First Name, Last Name, Email*, City, State, Zip, Phone, Details, link "Terms and Conditions" to /terms-and-conditions, required checkbox "I accept the terms and conditions", button "Send". Legend: "- Available", "- Booked", "- Partially booked".

Right column photos, no captions. The first two have a 2px grey border and 10px padding; the third has no border:

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP.jpg. Alt: none (attribute absent). Caption: none. 1280x854. Wide shot of a reception on the lawn with round tables, umbrellas, wine barrels, the stone plaza, the Cross and the ocean.
- Image: https://serracrosspark.com/wp-content/uploads/2015/08/wedding2.jpg. Alt: none (attribute absent). Caption: none. 1089x525. A bride escorted down the curved path toward the Cross past seated guests, with petals and parasols. Vintage filter.
- Image: https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-2.jpg. Alt: none (attribute absent). Caption: none. 220x315. Root-relative `src`, stretched to full column width. A ceremony at the foot of the Cross with a floral arch.

### Facts on this page

- Events welcomed: family picnics, educational field trips, weddings, memorial services, private events.
- Rental fee: "A non-refundable donation is required in order to reserve your date."
- Rate: $300.00 per hour, minimum two hours. Reservations must include vendor and client setup, the event and breakdown.
- Availability: 9am to 8pm, year-round, daily, "in set blocks of time".
- Saturday and Sunday suggested blocks: morning 9 to 12, afternoon 1 to 4, evening 5 to 8. "events must end by 7:30pm" sits in the same sentence.
- Capacity: 300 seated or 500 standing.
- Credit card payment via a PayPal Donate button, hosted button KSMPQM7ALZ5U8, no preset amount.
- Guests and equipment off the property by 8:00pm; gates locked at 8:00pm.
- Grounds remain open to the general public at all times.
- Electrical outlets on the base of the Cross.
- No public bathrooms; rent portable bathrooms. No water; bring your own.
- Valet parking suggested for events over 100 people.
- Contact: admin@serracrosspark.com, for questions and to set up a phone appointment. No phone number is published.
- Holds: once the date is confirmed, a tentative hold for up to fourteen days until the site fee is received, then a letter of confirmation.
- The email link's Cloudflare-encoded href decodes to "admin@serracrosspark.commailto:admin@serracrosspark.com", so the click target is broken. Without JavaScript the visible text is "[email protected]".
- Time formatting is inconsistent: "9am–8pm", "9-12 PM", "1-4PM", "5-8PM", "7:30pm", "8:00pm".
- The form's start times (5:00 AM to 9:00 PM) and durations (up to 8 hours) are wider than the stated 9am to 8pm hours.
- Upload dates from paths: booking-1 and FAQ-2 2018/08; wine barrel photos 2019/01; image.png 2019/02; wedding2 2015/08.

### Embedded widgets

- PayPal Payments Standard hosted Donate button (form POST to paypal.com, `hosted_button_id=KSMPQM7ALZ5U8`), used here to pay the rental fee by credit card. Includes a 1x1 tracking pixel.
- WP Booking Calendar (booking.bs 8.3.2) calendar and form, as on the Calendar page. iDEAL gateway script loaded but no payment step renders.
- Cloudflare email obfuscation on the admin address; Cloudflare Rocket Loader on all scripts.
- Hidden plugin spinner `ajax-loader.gif` (alt "ajax loader") beside the Send button.

## Gallery

- URL: https://serracrosspark.com/gallery/ (WordPress page 5020, template `single-full-page`)
- Title tag: Gallery – Serra Cross Conservancy
- Meta description: none
- Header background: IMG_7728.jpg (same photo as the History header; also item 13 below)

### Content

#### Gallery
h1. Page title in the header band. The subtitle slot is empty. This is the only text on the page.

Thirteen photos in a four-column grid (WordPress `[gallery]` shortcode, size "large"), each linked to its full-size file. Thumbnails have a 2px grey border. No captions, no alt text, no lightbox, so a click opens the raw file. The subject lines below are a visual reading of each photo, not page text.

- Image: https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP.jpg. Alt: none. Caption: none. 1280x854. Reception on the lawn below the Cross, round tables with white umbrellas, wine barrels, ocean behind.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/01GoldBridesmaidsDressesBareFeet-SCP.jpg. Alt: none. Caption: none. 1280x854. Bride and two bridesmaids in gold sequin dresses seated barefoot on a stone wall holding bouquets.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/06OutdoorWeddingSerraCrossPark-SCP.jpg. Alt: none. Caption: none. 1280x1917. The Cross on its stone plinth dressed for a ceremony with a blush-draped table and florals at its base.
- Image: https://serracrosspark.com/wp-content/uploads/2019/02/image.png. Alt: none. Caption: none. 1280x1917 PNG (1.9 MB). Reception round table with gold chairs under a white umbrella, hills and ocean behind. Same dimensions as the previous file but a different photo.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/Grant-Park-Cross-wedding.jpg. Alt: none. Caption: none. 400x300. Older snapshot of a wedding party at the Cross platform with the coastline behind, roses in front. Lowest resolution on the page.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7727.jpg. Alt: none. Caption: none. 2072x2762. The Cross and stone platform against blue sky and ocean, Channel Islands on the horizon, lawn in front.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7841.jpg. Alt: none. Caption: none. 2024x2698 (2.6 MB). Purple flowering ground cover in front of a stacked-stone wall and stairway. The Cross is not in frame.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7733.jpg. Alt: none. Caption: none. 2498x1563. The stone sphere on the rocks in front, the Cross and ocean behind.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/CROSS-AT-SUNSET-2011.jpg. Alt: none. Caption: none. 2807x2205 (1.48 MB). Silhouette of the Cross and trees against an orange and pink sunset over the ocean, picnic table in front. The filename dates it to 2011.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/02OceanViewWedding-SCP.jpg. Alt: none. Caption: none. 1280x854. Hazy view from the park over Ventura rooftops, the beach, the pier and the coastline. No wedding or Cross in frame despite the name.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-rainbow.jpg. Alt: none. Caption: none. 720x474. Double rainbow over the Cross under storm clouds. Carries a visible watermark in the lower left reading "© West Cooke Photography".
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/cross-with-sphere-close.jpg. Alt: none. Caption: none. 2000x1500. Close view of the stone sphere on the rock outcrop with the Cross and the Channel Islands behind.
- Image: https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7728.jpg. Alt: none. Caption: none. 1918x1438. View from the lawn over Ventura, the beach and the pier with pink and purple flowers in front. Sits alone in the last row.

### Facts on this page

- The only text is the title "Gallery". No captions, alt text, prices, dates, contacts or policies.
- Filename clues: "CROSS-AT-SUNSET-2011" (photo from 2011); "Grant-Park-Cross-wedding" (the Cross is in Grant Park).
- Photo credit inside one image: "© West Cooke Photography" (serra-cross-rainbow.jpg).
- Four files follow a numbered professional-shoot naming scheme ending in "-SCP". image.png looks like part of the same set.
- Twelve files were uploaded in January 2019, one in February 2019.
- Order: four wedding and professional shots, then phone snapshots, then older scenics.

### Embedded widgets

- WordPress core `[gallery]` shortcode: 13 images, four columns, size "large", link to file. Static float grid, no lightbox. Theme carousel scripts load but nothing binds them to the gallery.
- Nothing else in the main content.

## FAQ

- URL: https://serracrosspark.com/faq/ (WordPress page 4892, template `single-full-page`)
- Title tag: FAQ – Serra Cross Conservancy
- Meta description: none
- Header background: cross-with-sphere-close.jpg (2000x1500; also used in the Gallery grid)

### Content

#### FAQ
h1. Page title in the header band. The subtitle slot is empty.

Fifteen question and answer pairs. Each is one paragraph with the question in bold, a line break, and the answer in italics. No headings, lists or accordion.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-1.jpg. Alt: none. Caption: none. 270x220. Floated right at the start of the first question, displayed at 417x340, so it is upscaled.

**How much parking is available and how many cars will it hold?**
Email us for information.

**How many people will the park accommodate?**
250-300.

**Can we serve alcohol?**
Yes, with insurance and a licensed caterer. No self service alcohol is allowed.

**Is the Cross and parking lot area lit at night?**
No, the park is not lit at all. For evening events, you would need to bring in additional lighting.

**Are there bathrooms or running water?**
No, but you may contact JW Enterprises at 1-800-350-3331
or visit www.jwenterprises.com to arrange delivery of portable bathrooms.

- Link "www.jwenterprises.com" to http://www.jwenterprises.com/ (opens in a new tab)

**Is shuttle service for parking provided?**
You may arrange for your own shuttle.

**Do you provide seating/chairs?**
No. Please call a rental company.

- Image: https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-2.jpg. Alt: none. Caption: none. 220x315. In its own paragraph, floated left, displayed at 299x428, so it is upscaled.

**Is there electricity?**
There are 2 20amp circuits located on the Cross base which can accommodate a small PA system.

**Are there dressing/changing facilities?**
No.

**Are there trash bins available?**
Yes. There are multiple trash cans, but we require that all trash be removed from the area following your event.

**How long can we reserve the park for our event?**
A non-refundable donation of $300/hour with a two hour minimum. The park will remain open to the public during daylight hours.

**Who do we call in case of an emergency?**
911 for police/fire/ambulance. Other: 805-258-3153

**What kind of liability insurance do you require for an event?**
For receptions, we require a $1 million, one-day special event policy. These normally cost around $175. Go to wedsafe.com to purchase or, contact your insurance agent.

- Link "wedsafe.com" to http://wedsafe.com/ (opens in a new tab)

**Is there disability access, wheelchair access or disability parking?**
Yes.

**Can we park cars along the street entrance to the park?**
Yes, you may park along one side of the street entering the park. An open fire lane into the park is required for safety.

### Facts on this page

- Parking capacity: not stated. "Email us for information." No email address is given on this page.
- Park capacity: 250-300 people.
- Alcohol: allowed with insurance and a licensed caterer. No self-service alcohol.
- Lighting: the park is not lit at all. Evening events bring their own lighting.
- Bathrooms and running water: none. Portable bathroom vendor named: JW Enterprises, 1-800-350-3331, www.jwenterprises.com.
- Shuttle: arrange your own.
- Seating and chairs: not provided; call a rental company.
- Electricity: two 20-amp circuits on the Cross base, enough for a small PA system.
- Dressing or changing facilities: none.
- Trash: multiple cans on site, but all trash must be removed after the event.
- Reservation: "A non-refundable donation of $300/hour with a two hour minimum." The question asked about how long the park can be reserved and the answer does not say.
- Public access: "The park will remain open to the public during daylight hours."
- Emergency: 911. "Other: 805-258-3153", with no name attached.
- Insurance: for receptions, a $1 million one-day special event policy; "These normally cost around $175"; buy at wedsafe.com or from your own agent.
- Disability access, wheelchair access and disability parking: yes.
- Street parking: along one side of the street entering the park, keeping an open fire lane.
- Hidden characters in the source: an invisible U+202C control character after 805-258-3153 and a non-breaking space after "Yes." in the disability answer. Both outbound links are plain http.

### Embedded widgets

- None. Plain classic-editor paragraphs and two floated images. No accordion, form, map or button.

## Contact

- URL: https://serracrosspark.com/contact/ (WordPress page 4609, template `single-full-page`)
- Title tag: Contact – Serra Cross Conservancy
- Meta description: none
- Header background: CROSS-AT-SUNSET-2011.jpg (2807x2205; also used in the Gallery grid)

### Content

#### Contact
h1. Page title in the header band. The subtitle slot is empty.

**Write to us at:**
Serra Cross Conservancy
P. O. Box 48
Ventura, CA 93002-0048

Hidden status messages (both `display:none`, never shown by any script; dead markup from the old static site):

- "Sending Email. Hold on just a sec…" with a spinner image.
- Image: img/loading.gif (relative path, resolves to https://serracrosspark.com/contact/img/loading.gif, which does not exist). Alt: "Loading...". Title attribute: "Sending Email". Caption: none. Dimensions unknown; the file is missing.
- "Success! Your Email has been sent."

Contact form, laid out as a two-column table with bold right-aligned labels. Posts to http://formspree.io/amber@amberweir.com and redirects to https://serracrosspark.com/booking_thanks.shtml on success. Hidden field `required=email`. No CAPTCHA, no required attributes; the email field is a plain text input.

- First Name: text (name `realname`)
- Last Name: text (name `LastName`, id `A.LastName`)
- Email: text (name `email`)
- Regarding text (name `Regarding`, id `A.City`)
- Message textarea (name `State`, id `A.State`)
- Button "Submit"
- Button "Reset"

For more information about event bookings at Serra Cross Park, please refer to the ‘Booking’ page or email admin@serracrosspark.com.

- Link "admin@serracrosspark.com" (Cloudflare-obfuscated mailto; decodes correctly on this page). "Booking" is in quotes but not linked.

**How do I get to the Cross coming from a location SOUTH of Ventura?**
(A bold paragraph used as a sub-heading. There are no directions from the north.)

- From the 101 Freeway, exit at California Street in Ventura and turn right.
- Use the center lane to head north on California Street towards City Hall.
- Directly in front of City Hall, turn right on Poli Street for several blocks.
- Turn left on Kalorama, then left on Summit.
- Stay on Summit and follow the signs to the parking area.
- **Note: Brakey Rd is closed for vehicle access.**

(In the first three items the street names "101 Freeway,", "California Street" and "Poli Street" are bold. An empty paragraph sits between the email paragraph and the directions heading, and another between the list and the map.)

- Link "Google Maps" to https://www.google.com/maps/place/The+Cross/@34.2846018,-119.2962133,15z/data=!4m5!3m4!1s0x0:0x8355f8b9349b8689!8m2!3d34.2846018!4d-119.2962133 (plain text link above the map)

Google Maps embed, 600x450 iframe, place "The Cross" at 34.2846018, -119.2962133. Embed generated January 23, 2019. Last element on the page.

### Facts on this page

- Mailing address: Serra Cross Conservancy, P. O. Box 48, Ventura, CA 93002-0048.
- Email: admin@serracrosspark.com.
- Contact form delivery: Formspree, to amber@amberweir.com (a personal address), over plain http. Redirect after submit: https://serracrosspark.com/booking_thanks.shtml, an old static page that is probably a 404 on WordPress.
- Form field names were copied from another form: the message field is named `State`, "Regarding" has id `A.City` and "Last Name" has id `A.LastName`, so Formspree emails label the message "State".
- Event booking questions are referred to the "Booking" page.
- Driving directions from the south: 101 Freeway, exit California Street and turn right; center lane north on California toward City Hall; in front of City Hall turn right on Poli Street for several blocks; left on Kalorama, then left on Summit; follow the signs to parking.
- "Brakey Rd is closed for vehicle access."
- Google Maps place name "The Cross"; coordinates 34.2846018, -119.2962133.
- The only image on the page is the hidden, missing loading.gif.

### Embedded widgets

- Hand-coded HTML contact form relayed by Formspree (not a WordPress form plugin). Inline `<style>` block inside the post content. Submit and Reset buttons.
- Two hidden status paragraphs and a missing spinner image, left over from an old AJAX mailer.
- Google Maps embed iframe (600x450) for "The Cross", plus a plain link to the Google Maps place page.
- Cloudflare email obfuscation on the admin address.

## Donate

- URL: https://serracrosspark.com/donate/ (WordPress page 4982, template `single-full-page`)
- Title tag: Donate – Serra Cross Conservancy
- Meta description: none
- Header background: image-home.jpg (3072x1190; the same hero photo as Home)

### Content

#### Donate
h1. Page title in the header band. The subtitle slot is empty.

#### Help Us Restore the Park, Your Tax-deductible Donations Are Needed
h2, 40px light weight, centered, with a line break after the comma.

#### All proceeds help restore vegetation lost in the Thomas Fire and the continued beautification of Serra Cross Park. Your donations are greatly appreciated.
h3, normal weight, centered. Reads as a subtitle.

- Button: PayPal "Donate" image button (alt "Donate with PayPal button", title "PayPal - The safer, easier way to pay online!", graphic https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif with credit card logos). Posts to https://www.paypal.com/cgi-bin/webscr with `cmd=_s-xclick` and `hosted_button_id=KSMPQM7ALZ5U8`, opening PayPal in the top window where the donor picks an amount. The whole form is enlarged 1.4x by an inline CSS transform. Followed by PayPal's 1x1 tracking pixel https://www.paypal.com/en_US/i/scr/pixel.gif.

Tax ID # 20-861526

(Last line of the page, 20px, centered.)

### Facts on this page

- Headline appeal: "Help Us Restore the Park, Your Tax-deductible Donations Are Needed".
- Use of proceeds: restore vegetation lost in the Thomas Fire and the continued beautification of Serra Cross Park.
- Donations are described as tax-deductible.
- Tax ID as printed: "20-861526". That is eight digits. A US EIN has nine.
- Payment processor: PayPal Payments Standard hosted Donate button, `hosted_button_id=KSMPQM7ALZ5U8`. The same button is used on the Booking page for site fees.
- No suggested amounts, address, phone, email, hours or deadline on this page.

### Embedded widgets

- PayPal hosted Donate button pasted into the classic editor as raw HTML, with stray `<br>` tags between the inputs and a 1x1 tracking pixel.
- Nothing else in the main content.

## Terms and Conditions

- URL: https://serracrosspark.com/terms-and-conditions/ (WordPress page 5019, template `single-full-page`)
- Title tag: Terms and Conditions – Serra Cross Conservancy
- Meta description: none
- Header background: image-home.jpg (3072x1190; the same hero photo as Home)
- Reached only from the footer navigation and from the booking form's "Terms and Conditions" link. Not in the header navigation.

### Content

#### Terms and Conditions
h1. Page title in the header band. The subtitle slot is empty.

The Serra Cross Conservancy encourages everyone to enjoy the park and welcomes events ranging from family picnics to educational field trips to weddings and memorial services. The site, with its unique character and spectacular views, is very popular for private events. *If you are interested in holding your event at the Cross, here are some things you should know.*
Rental Fee: A non-refundable donation is required in order to reserve your date. The donation/rental fees are as follows:

(One paragraph with a line break before "Rental Fee:". The asterisks are literal characters.)

- $300.00 per hour with a minimum of two hours*
- *All reservations must include time needed for vendor/client set up, event, and vendor/client break-down
- Availability: 9am–8pm year-round, daily, in set blocks of time. For Saturday and Sunday functions, we suggest morning (9-12 PM), afternoon (1-4PM), or evening (5-8PM) (events must end by 7:30pm).
- Site Capacity: The grounds hold 300 people seated or 500 people standing

Important Notes:

- All guests and equipment must be off the property by 8:00pm. Gates will be locked at 8:00pm
- The grounds must remain open to the general public at all times.
- Electrical outlets are located on the base of the Cross.
- There are no public bathroom facilities at the park; please consider renting portable bathrooms.
- If your event exceeds 100 people, we suggest hiring a valet parking service.
- There is no water available at the park; please bring your own water.

If you would like to book Serra Cross Park for your wedding or private event, please complete the form below or contact Amber Weir at admin@serracrosspark.com. Once the date is confirmed with you, a tentative hold will be placed on the calendar for up to fourteen days until the site fee is received. Once the site fee is received, you will receive a letter of confirmation.

- Link "admin@serracrosspark.com" (Cloudflare-obfuscated; the decoded href is the malformed "admin@serracrosspark.commailto:admin@serracrosspark.com", so the link is broken). No form follows this paragraph.

### Facts on this page

- The page repeats the Booking page's fee, availability, capacity and site rules word for word. It contains no legal terms: no cancellation, weather, damage, cleanup, decoration, noise or liability clauses.
- Rate: $300.00 per hour, two-hour minimum, described as "A non-refundable donation".
- Availability 9am to 8pm daily year-round in set blocks; weekend blocks 9 to 12, 1 to 4, 5 to 8; "events must end by 7:30pm".
- Capacity 300 seated or 500 standing.
- Off the property and gates locked at 8:00pm; grounds open to the public at all times; outlets at the base of the Cross; no bathrooms; no water; valet suggested over 100 people.
- Booking contact named: Amber Weir, admin@serracrosspark.com.
- Hold for up to fourteen days until the site fee is received, then a letter of confirmation.
- "please complete the form below" refers to a form that is not on this page.

### Embedded widgets

- None in the main content. No images either; the only image is the shared header background.
- Cloudflare email obfuscation on the Amber Weir email link.

## All images

Every image file referenced by the ten pages. Dimensions are of the downloaded original. "Hero" means the CSS background of the page's header band. Every row reads "review"; each file will be looked at in the photo pass.

| File | Original URL | Dimensions | Used on | Candidate for new site? |
| --- | --- | --- | --- | --- |
| 01GoldBridesmaidsDressesBareFeet-SCP.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/01GoldBridesmaidsDressesBareFeet-SCP.jpg | 1280x854 | Gallery | review |
| 02OceanViewWedding-SCP.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/02OceanViewWedding-SCP.jpg | 1280x854 | Gallery | review |
| 06OutdoorWeddingSerraCrossPark-SCP.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/06OutdoorWeddingSerraCrossPark-SCP.jpg | 1280x1917 | Gallery | review |
| 18OutdoorReceptionWineBarrels-SCP.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP.jpg | 1280x854 | Calendar, Booking, Gallery | review |
| 18OutdoorReceptionWineBarrels-SCP2.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/18OutdoorReceptionWineBarrels-SCP2.jpg | 1280x685 | Booking (hero). A crop of the file above. | review |
| ABOUT-2.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/ABOUT-2.jpg | 188x270 | About | review |
| ABOUT-serra-park-1.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/ABOUT-serra-park-1.jpg | 270x188 | About | review |
| CROSS-AT-SUNSET-2011.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/CROSS-AT-SUNSET-2011.jpg | 2807x2205 | Gallery, Contact (hero) | review |
| FAQ-1.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-1.jpg | 270x220 | FAQ | review |
| FAQ-2.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/FAQ-2.jpg | 220x315 | Calendar, Booking, FAQ | review |
| FAQ.jpg | https://serracrosspark.com/wp-content/uploads/2018/11/FAQ.jpg | 1800x460 | History (in the fire gallery). Not used on FAQ. | review |
| Grant-Park-Cross-wedding.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/Grant-Park-Cross-wedding.jpg | 400x300 | Gallery | review |
| IMG_7727.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7727.jpg | 2072x2762 | Gallery | review |
| IMG_7728.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7728.jpg | 1918x1438 | History (hero), Gallery (hero and grid) | review |
| IMG_7733.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7733.jpg | 2498x1563 | Gallery | review |
| IMG_7841.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/IMG_7841.jpg | 2024x2698 | Gallery | review |
| IMG_8096.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/IMG_8096.jpg | 2000x1500 | Home (replanting row) | review |
| booking-1.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/booking-1.jpg | 220x320 | Booking | review |
| burned-bottle-pile.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-bottle-pile.jpg | 2690x1887 | History (fire gallery) | review |
| burned-cross.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-cross.jpg | 2024x2698 | History (fire gallery) | review |
| burned-landscaping.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-landscaping.jpg | 1792x1195 | History (fire gallery) | review |
| burned-sign-posts-2.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-sign-posts-2.jpg | 2583x3304 | History (fire gallery) | review |
| burned-sign-posts.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-sign-posts.jpg | 2024x2698 | History (fire gallery) | review |
| burned-vegetation.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/burned-vegetation.jpg | 1785x1338 | History (fire gallery) | review |
| cross-with-sphere-close.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/cross-with-sphere-close.jpg | 2000x1500 | Gallery, FAQ (hero) | review |
| history-1.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/history-1.jpg | 188x270 | History | review |
| history-2.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/history-2.jpg | 270x188 | History | review |
| history-3.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/history-3.jpg | 205x272 | History | review |
| history-4.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/history-4.jpg | 272x205 | History | review |
| image-home.jpg | https://serracrosspark.com/wp-content/uploads/2018/11/image-home.jpg | 3072x1190 | Home (hero), Calendar (hero), Donate (hero), Terms and Conditions (hero) | review |
| image.png | https://serracrosspark.com/wp-content/uploads/2019/02/image.png | 1280x1917 | Booking, Gallery | review |
| plant2.jpg | https://serracrosspark.com/wp-content/uploads/2013/06/plant2.jpg | 225x225 | Home (replanting row) | review |
| plant3.jpg | https://serracrosspark.com/wp-content/uploads/2013/06/plant3.jpg | 887x892 | Home (replanting row) | review |
| serra-cross-bench-2010.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-bench-2010.jpg | 2000x1500 | Home (replanting row) | review |
| serra-cross-rainbow-1.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-rainbow-1.jpg | 720x302 | About (hero). A crop of the file below. | review |
| serra-cross-rainbow.jpg | https://serracrosspark.com/wp-content/uploads/2019/01/serra-cross-rainbow.jpg | 720x474 | Gallery. Watermarked "© West Cooke Photography". | review |
| serra-stone.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/serra-stone.jpg | 760x507 | Home (Stonework panel) | review |
| serra.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/serra.jpg | 1000x758 | Home (History panel) | review |
| wedding-1.jpg | https://serracrosspark.com/wp-content/uploads/2018/08/wedding-1.jpg | 1199x588 | Home (Weddings band) | review |
| wedding2.jpg | https://serracrosspark.com/wp-content/uploads/2015/08/wedding2.jpg | 1089x525 | Calendar, Booking | review |

Not in the table: plugin and third-party image files that are not park photos. The Booking Calendar spinner `ajax-loader.gif` (Calendar, Booking), PayPal's button graphic `btn_donateCC_LG.gif` and 1x1 `pixel.gif` (Donate, Booking), and the missing `img/loading.gif` on Contact. None of these carries over.
