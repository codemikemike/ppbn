# UC003 — Bars — Filter Bars

## Use Case Name

Filter Bars by Area and Category

## Actor

Visitor (Unauthenticated User)

## Preconditions

- The user has access to the public website.
- The system contains zero or more Bar records.

## Main Flow

1. User navigates to `/bars`.
2. User selects an Area filter and/or a Category filter.
3. UI updates the URL using search params:
   - `?area=Riverside&category=HostessBar`
4. System retrieves bars filtered by the selected params.
5. System returns only **approved** and **not soft-deleted** bars.
6. UI highlights the active filters and displays the filtered list.

## Alternative Flows

### 4a. Invalid Filter Value

1. URL contains an invalid `area` and/or `category` value.
2. System returns `400` with a validation error.

### 6a. No Matching Bars

1. No approved bars match the selected filters.
2. UI displays an empty state.

### 4b. Unexpected System Error

1. System fails to retrieve bars.
2. System returns an error response.
3. UI displays a generic failure message.

## Postconditions

### Success

- User sees a filtered list of publicly visible bars.

### Failure

- User sees an error message.
- No data is modified.

## Business Rules

1. Only bars with `isApproved = true` are visible to the public.
2. Soft-deleted bars (`deletedAt != null`) are not visible to the public.
3. When filters are omitted or set to `All`, no filtering is applied for that dimension.

## Special Requirements

1. Filters must be URL-driven via search params.
2. Must not leak unapproved or soft-deleted bars.
3. Must return DTOs across layer boundaries (never Prisma models).
4. Public endpoint must not require authentication.

## Frequency of Use

High — users frequently refine browsing

## Open Issues

1. Should we support multi-select filters? (Decision for UC003: No; single-select for area and category.)
2. Should we persist filters between sessions? (Decision for UC003: URL is the source of truth.)
