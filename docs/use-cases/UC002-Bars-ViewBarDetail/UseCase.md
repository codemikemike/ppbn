# UC002 — Bars — View Bar Detail

## Use Case Name

View Bar Detail

## Actor

Visitor (Unauthenticated User)

## Preconditions

- The user has access to the public website.
- The system contains zero or more Bar records.

## Main Flow

1. User navigates to `/bars/[slug]`.
2. System validates the `slug` parameter.
3. System retrieves the bar by `slug`.
4. System returns the bar details for an **approved** and **not soft-deleted** bar.
5. System includes:
   - Bar metadata (name, description, area, category, opening hours)
   - Primary image (or a placeholder)
   - Approved reviews
   - Calculated average rating from approved reviews
6. UI displays the bar detail page.

## Alternative Flows

### 3a. Bar Not Found / Not Publicly Visible

1. No matching bar exists OR bar is not approved OR bar is soft-deleted.
2. System returns `404 Not Found`.
3. UI displays a not found page.

### 5a. No Reviews

1. Bar exists but has zero approved reviews.
2. System returns `averageRating = null` and an empty review list.
3. UI displays an empty review state.

### 3b. Unexpected System Error

1. System fails to retrieve the bar.
2. System returns an error response.
3. UI displays a generic failure message.

## Postconditions

### Success

- User sees the bar detail page.

### Failure

- User sees an error or not found page.
- No data is modified.

## Business Rules

1. Only bars with `isApproved = true` are visible to the public.
2. Soft-deleted bars (`deletedAt != null`) are not visible to the public.
3. Only reviews with `isApproved = true` and `deletedAt = null` are visible to the public.
4. Average rating is computed from the visible (approved) reviews.

## Special Requirements

1. Must not leak unapproved or soft-deleted data.
2. Must return DTOs across layer boundaries (never Prisma models).
3. Public endpoint must not require authentication.

## Frequency of Use

High — multiple times per day

## Open Issues

1. Should unapproved reviews be shown to their author? (Decision for UC002: No; public view shows approved reviews only.)
2. How many reviews should be returned? (Decision for UC002: Return all approved reviews for MVP.)
