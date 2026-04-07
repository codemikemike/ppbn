# UC022 — Dashboard — User Dashboard

## Actors

- **RegisteredUser** (primary)

## Goal

Allow a logged-in user to access a personal dashboard showing activity stats, view their reviews, and manage account settings (profile + password).

## Preconditions

- The user is authenticated (valid NextAuth session).

## Trigger

- User navigates to `/dashboard`.

## Main Success Scenario

1. The user opens `/dashboard`.
2. The system verifies the user is authenticated.
3. The system displays a dashboard with:
   - A welcome message.
   - Stats: review count, favorite bars count, staff ratings count.
   - Quick links to common dashboard pages.
4. The user navigates to `/dashboard/reviews`.
5. The system displays a list of the user’s reviews.
6. The user navigates to `/dashboard/settings`.
7. The system displays settings sections:
   - Update profile (name)
   - Change password
8. The user updates their profile.
9. The system validates input, persists the change, and confirms success.
10. The user changes their password.
11. The system validates input, verifies current password, updates the password hash, and confirms success.

## Extensions

- **E1 — Unauthenticated access**
  - At step 2, if no session exists, the system redirects the user to `/login`.

- **E2 — Invalid input**
  - At steps 9 or 11, if validation fails, the system returns a validation error with field-level issues.

- **E3 — Incorrect current password**
  - At step 11, if the current password is invalid, the system returns an unauthorized error.

## Postconditions

- On success, user profile and/or password may be updated.
- The dashboard views are rendered without direct database access from the presentation layer.
