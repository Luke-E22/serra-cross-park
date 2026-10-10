# InquiryForm

The event inquiry: who, what, when and how many. The park office follows up to confirm the date.

- **Provide:** `onSubmit(data)` (fields: name, partner, email, phone, eventType, date, guests, block, message), plus an optional `title` and `defaultEventType` (`wedding`, `vows`, `memorial`, `gathering`, `school`).
- After submit it shows the confirmation, including the 14-day hold. Wire `onSubmit` to the site's form handler.
- The help text repeats the rules couples need while choosing: weekend events end by 7:30 PM; up to 300 seated or 500 standing.
