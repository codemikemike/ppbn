# UC011 — Code-UI

## Components

- `src/components/map/BarMap.tsx`
  - Client-only Leaflet map with markers and popups.

## Pages

- `src/app/map/page.tsx`
  - Dynamic import of `BarMap` (no SSR)
  - URL-driven filters for area/category
