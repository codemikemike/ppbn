# UC020 — Auth — Logout

## Use Case Name

Logout

## Actor

RegisteredUser (Authenticated User)

## Preconditions

- User is authenticated.
- User has an active session.

## Main Flow

1. User clicks `Logout` in the navigation bar.
2. System invalidates the user session (clears session cookies).
3. System redirects the user to a public page (e.g., `/`).
4. Navigation updates to show `Login`.

## Alternative Flows

### 2a. Already Logged Out

1. User is not authenticated.
2. UI shows `Login` instead of `Logout`.

### 2b. Unexpected System Error

1. Logout fails due to an unexpected error.
2. UI displays a generic failure message.

## Postconditions

### Success

- User session is terminated.
- Protected routes require authentication again.

### Failure

- User may remain authenticated.
- No data is modified.

## Business Rules

1. Only authenticated users can perform logout.
2. Logout must remove/expire authentication cookies.

## Special Requirements

1. Must not access the database from UI or API routes.
2. Logout must be safe to call multiple times.
3. Must use NextAuth session management.

## Frequency of Use

Medium — multiple times per user per week

## Open Issues

1. Should we redirect to `/` or `/login` after logout? (Decision for UC020: redirect to `/`.)
