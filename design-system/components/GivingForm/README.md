# GivingForm

One place to give: a one-time gift, or the site fee that reserves an event date.

- **Provide:** `defaultTab` (`gift` or `fee`), `amounts` (50, 100, 250 and 500 by default), `rate` (300), `minHours` (2), `maxHours` (11), `ein`, and `onSubmit({ kind, amount, hours })` to hand off to the payment processor.
- Gifts carry the 501(c)(3) line with the Tax ID. Site fees don't claim to be tax-deductible: they reserve a date and are non-refundable.
- Link straight to the fee tab from booking emails.
