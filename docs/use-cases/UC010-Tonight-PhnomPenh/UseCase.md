# UC010 — Tonight — Phnom Penh

## Use Case Name

Tonight in Phnom Penh

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Approved bars exist and are not soft-deleted.
- Approved events exist and are not soft-deleted.
- Server can determine the current date in Phnom Penh (UTC+07:00).

## Trigger

- User navigates to `/tonight`.

## Main Flow

1. User opens the Tonight page.
2. System determines the current date for Phnom Penh.
3. System loads all nightlife happening today:
   - Events happening today.
   - Bars open tonight (based on opening hours).
   - Live music venues tonight.
   - Featured bars.
4. System renders the page with SEO-friendly semantic HTML:
   - H1: "Tonight in Phnom Penh"
   - Prominent current date.
   - H2 sections: Events Tonight, Bars Open Tonight, Live Music Tonight, Featured Bars.
5. User can browse and click through to bar detail pages.

## Alternative Flows

### 3a. No data available

1. System returns empty lists for one or more sections.
2. Page renders a helpful empty state per section.

### 3b. Backend error

1. System fails to load tonight data.
2. API returns a 500 error.
3. Page renders an error state.

## Postconditions

### Success

- User sees a complete overview of nightlife happening today.
- User can discover bars and events from a single page.

### Failure

- User sees an error state and can retry later.

## Business Rules

1. Only publicly visible records are returned:
   - Bars: `isApproved = true` and `deletedAt = null`.
   - Events: `isApproved = true` and `deletedAt = null` and the related bar is approved and not deleted.
2. "Events Tonight" includes events that overlap the current Phnom Penh day window.
3. "Bars Open Tonight" is derived from `openingHours` using a consistent definition of "tonight".
4. "Featured Bars" are bars where `isFeatured = true`.
5. "Live Music Tonight" are bars that either:
   - Have category `LiveMusic`, or
   - Have a live music event tonight.

## Special Requirements

1. SEO:
   - Semantic HTML with proper heading structure.
   - Date is visible and machine-readable where relevant.
2. Clean Architecture enforced: Page/API -> Service -> Repositories -> db.
3. No Prisma types outside `src/repositories/`.
