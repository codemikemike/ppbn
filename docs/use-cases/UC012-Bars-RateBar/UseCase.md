# UC012 — Bars — Rate Bar

## Use Case Name

Rate Bar

## Actor

RegisteredUser

## Preconditions

- The user is authenticated.
- The system contains an **approved** and **not soft-deleted** Bar.

## Main Flow

1. User navigates to `/bars/[slug]`.
2. System retrieves the approved bar details.
3. System checks the authenticated session.
4. System retrieves the current user's existing rating for the bar (if any).
5. UI displays an interactive 1–5 star control.
6. User clicks a star to select a rating.
7. UI sends `POST /api/bars/:slug/rate` with `{ rating }`.
8. System validates authentication and input.
9. System upserts the user's rating for that bar.
10. System returns the updated average rating.
11. UI shows success feedback and reflects the selected rating.

## Alternative Flows

### 3a. Not Logged In

1. User is not authenticated.
2. UI displays: "Login to rate this bar".
3. No rating submission is possible.

### 8a. Invalid Rating

1. The request body is missing `rating` or `rating` is not an integer in 1–5.
2. System returns `400 Bad Request`.
3. UI shows an error message.

### 2a. Bar Not Found / Not Publicly Visible

1. No matching bar exists OR bar is not approved OR bar is soft-deleted.
2. System returns `404 Not Found`.
3. UI shows an error message.

### 9a. Unexpected System Error

1. System fails to persist or aggregate rating.
2. System returns `500 Internal Server Error`.
3. UI shows a generic failure message.

## Postconditions

### Success

- The user's rating for the bar is stored (created or updated).
- The bar's updated average rating can be computed.

### Failure

- No rating is stored/updated.

## Business Rules

1. Only authenticated users can rate.
2. Rating must be an integer in the range 1–5.
3. A user can have at most one rating per bar (upsert semantics).
4. Only approved and non-deleted bars are rateable.

## Special Requirements

1. Follow Clean Architecture boundaries: API routes call services only; services use repository interfaces.
2. Validate all API inputs.
3. Return DTOs across layer boundaries.
4. Add JSDoc to all exports in UC012 files.

## Frequency of Use

High
