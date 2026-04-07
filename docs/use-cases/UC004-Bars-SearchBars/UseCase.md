# UC004 — Bars — Search Bars

## Use Case Name

Search Bars

## Actor

Visitor (Unauthenticated User)

## Preconditions

- The user has access to the public website.
- The system contains zero or more Bar records.

## Main Flow

1. User navigates to `/bars`.
2. User enters a search term in the search input.
3. UI updates the URL search param: `?search=rose`.
4. System retrieves bars matching the search term.
5. Search matches on bar `name` or `description`.
6. Search combines with existing filters (`area`, `category`) when present.
7. UI displays the matching list.

## Alternative Flows

### 4a. Empty Search Term

1. Search term is empty or whitespace.
2. System treats search as not applied and returns normal filtered list.

### 7a. No Matching Bars

1. No approved bars match the search term (and filters).
2. UI displays an empty state.

### 4b. Unexpected System Error

1. System fails to retrieve bars.
2. System returns an error response.
3. UI displays a generic failure message.

## Postconditions

### Success

- User sees a list of bars matching search and filters.

### Failure

- User sees an error message.
- No data is modified.

## Business Rules

1. Only bars with `isApproved = true` are visible to the public.
2. Soft-deleted bars (`deletedAt != null`) are not visible to the public.
3. Search is case-insensitive.

## Special Requirements

1. Search must be URL-driven via `?search=`.
2. Search must combine with area/category filters.
3. Must return DTOs across layer boundaries (never Prisma models).
4. Public endpoint must not require authentication.

## Frequency of Use

High — searching is common during browsing

## Open Issues

1. Should we support fuzzy search? (Decision for UC004: No; substring match only.)
2. Should we debounce on client? (Decision for UC004: No; URL-driven submit/enter key for MVP.)
