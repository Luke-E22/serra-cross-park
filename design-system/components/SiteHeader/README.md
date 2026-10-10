# SiteHeader

The site's top bar: wordmark, four links, Donate and the booking button. Below 1100px it collapses to a menu toggle.

- **Provide:** `links` (four at most: Weddings, History, Visit, FAQ), `active` (the current link's label), `overlay` when it sits on a hero photo (pass it to `Hero` as `header`), `donateHref`, `bookHref` and `bookLabel` ("Plan your event").
- Donate is always visible, and it is the only `give` button in the header.
- On light pages the header sits on `surface` with a `line` hairline. Add `shadow-sticky` if you make it sticky.
