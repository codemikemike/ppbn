# UC001 — Bars — List All Bars

## Use Case Name

List All Bars

## Actor

Visitor (Unauthenticated User)

## Preconditions

- The user has access to the public website.
- The system contains zero or more Bar records.

## Main Flow

1. User navigates to `/bars`.
2. System requests the list of bars.
3. System returns a list of **approved** and **not soft-deleted** bars.
4. System displays the list, showing each bar’s name and basic metadata (area, category, featured status).

## Alternative Flows

### 3a. No Bars Available

1. System returns an empty list.
2. System displays an empty state message.

### 3b. Unexpected System Error

1. System fails to retrieve bars.
2. System returns an error response.
3. UI displays a generic failure message.

## Postconditions

### Success

- User sees a list of bars currently available for public browsing.

### Failure

- User sees an error message.
- No data is modified.

## Business Rules

1. Only bars with `isApproved = true` are visible to the public.
2. Soft-deleted bars (`deletedAt != null`) are not visible to the public.
3. Default ordering: featured bars first, then alphabetical by name.

## Special Requirements

1. Must not leak unapproved or soft-deleted bars.
2. Must return DTOs across layer boundaries (never Prisma models).
3. Public endpoint must not require authentication.

## Frequency of Use

High — multiple times per day

## Open Issues

1. Should we paginate or infinite-scroll? (Decision for UC001: No pagination; return all approved bars for MVP.)
2. Which bar fields are shown on the list? (Decision for UC001: name, area, category, featured.)
