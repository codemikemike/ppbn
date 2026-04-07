# UC009 — Code-UI

## Pages

- `src/app/events/page.tsx`
  - Lists upcoming events sorted by date.
  - Filters by `type` query param.
  - Provides a calendar view option via a `view` query param.

- `src/app/events/[id]/page.tsx`
  - Shows event details and a link to the bar page.

## Accessibility

- Events rendered as `<article>` elements.
- Dates and times rendered in `<time>` elements.
- Proper heading structure (`h1` then `h2`).
