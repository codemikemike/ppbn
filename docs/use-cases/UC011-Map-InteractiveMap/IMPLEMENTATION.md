# UC011 — Implementation Notes

## Key decisions

- Map rendering is client-only via `react-leaflet` (no SSR).
- Popups include a direct link to bar detail pages.
- API and page only return/show bars with valid coordinates.

## Non-goals

- Route planning or directions.
- Clustering markers.
- Advanced filtering beyond area/category.
