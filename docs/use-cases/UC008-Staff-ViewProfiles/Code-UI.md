# UC008 — Code-UI

## Pages

- `src/app/staff/page.tsx`
  - Lists approved staff profiles.
  - Provides bar filter via query param `?bar=`.
  - Each card links to `/staff/[id]`.

- `src/app/staff/[id]/page.tsx`
  - Shows staff profile details and ratings.

## Components

- Uses existing UI primitives (`Card`, `Button`, `Input`, `Label`) and `ImageWithFallback`.

## Accessibility

- Semantic structure: `<main>`, `<section>`, `<article>`, `<header>`, `<aside>`.
- Proper heading structure (`h1` then `h2`).
- `alt` text on images.
