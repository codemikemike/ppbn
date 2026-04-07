# UC011 — Map — Interactive Map

## Use Case Name

Interactive Map of Bars

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Approved bars exist and are not soft-deleted.
- Bars may have optional coordinates (`latitude`, `longitude`).

## Trigger

- User navigates to `/map`.

## Main Flow

1. User opens the Map page.
2. System loads approved bars (optionally filtered by area and category).
3. System renders an interactive map centered on Phnom Penh.
4. System places a marker for each bar that has coordinates.
5. User clicks a marker.
6. System shows a popup with:
   - Bar name
   - Category
   - Area
   - Link to bar detail page (`/bars/[slug]`).
7. User optionally filters by area and/or category.
8. System reloads the map using the selected filters.

## Alternative Flows

### 4a. No bars with coordinates

1. System loads bars but none have valid coordinates.
2. System renders the map and an empty state message.

### 2a. Backend error

1. System fails to load bar data.
2. API returns 500.
3. Page renders an error state.

## Postconditions

### Success

- User can discover bars spatially via an interactive map.

### Failure

- User sees an error state and can retry.

## Business Rules

1. Only publicly visible bars are shown:
   - `isApproved = true`
   - `deletedAt = null`
2. Only bars with both coordinates are displayed as markers.
3. Filters are URL-driven (area/category) to support shareable links.

## Special Requirements

1. Clean Architecture enforced:
   - Page/API -> service -> repositories -> db
2. Leaflet is client-only rendering (no SSR).
3. Semantic HTML and accessible labeling for filters.
