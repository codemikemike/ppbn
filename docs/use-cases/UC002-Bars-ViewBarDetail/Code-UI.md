# UC002 — Code-UI

## Route

- Add `/bars/[slug]` page in `src/app/bars/[slug]/page.tsx`.

## Behavior

- Retrieves bar details by `slug`.
- Renders:
  - Name, description, area, category
  - Opening hours
  - Primary image via `ImageWithFallback`
  - Average rating
  - Reviews list (or empty state)

## UI Data

- Consumes `BarDetailDto` only.
