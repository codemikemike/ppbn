# UC013 — Bars — Leave Review

## Use Case Name

Leave Review

## Actor

RegisteredUser

## Preconditions

- The user is authenticated.
- The system contains an **approved** and **not soft-deleted** Bar.

## Main Flow

1. User navigates to `/bars/[slug]`.
2. System renders the bar detail page.
3. UI displays a review form for logged-in users.
4. User selects a star rating (1–5).
5. User enters a comment (min 10 characters).
6. UI submits `POST /api/bars/:slug/reviews` with `{ rating, comment }`.
7. System validates authentication and input.
8. System upserts the user's review for that bar.
9. System returns the created/updated review.
10. UI shows success feedback and clears the form.

## Alternative Flows

### 3a. Not Logged In

1. User is not authenticated.
2. UI displays: "Login to leave a review".
3. No review submission is possible.

### 7a. Validation Error

1. `rating` is missing or not an integer 1–5 OR `comment` is too short.
2. System returns `400 Bad Request`.
3. UI shows an error message.

### 2a. Bar Not Found / Not Publicly Visible

1. No matching bar exists OR bar is not approved OR bar is soft-deleted.
2. System returns `404 Not Found`.
3. UI shows an error message.

### 8a. Unexpected System Error

1. System fails to persist the review.
2. System returns `500 Internal Server Error`.
3. UI shows a generic failure message.

## Postconditions

### Success

- A Review row for `(barId, userId)` is created or updated.

### Failure

- No review is stored/updated.

## Business Rules

1. Only authenticated users can submit reviews.
2. Rating must be an integer in the range 1–5.
3. Comment must be at least 10 characters.
4. A user can have at most one review per bar (upsert semantics).
5. Only approved and non-deleted bars are reviewable.

## Special Requirements

1. Follow Clean Architecture boundaries: API routes call services only; services use repository interfaces.
2. Validate all API inputs with Zod.
3. Return DTOs across layer boundaries.
4. Add JSDoc to all exports in UC013 files.

## Frequency of Use

High
