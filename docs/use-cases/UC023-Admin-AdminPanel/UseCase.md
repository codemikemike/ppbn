# UC023 — Admin — Admin Panel

## Actors

- **Admin** (primary)

## Goal

Provide an administrator-only panel to manage content and users across the system.

## Preconditions

- The user is authenticated.
- The user has role `Admin`.

## Trigger

- Admin navigates to `/admin`.

## Main Success Scenario

1. Admin navigates to `/admin`.
2. The system verifies the user is authenticated and has role `Admin`.
3. The system displays an admin dashboard overview with key stats.
4. Admin navigates to each admin section via sidebar:
   - `/admin/bars`
   - `/admin/reviews`
   - `/admin/users`
   - `/admin/blog`
   - `/admin/staff`
5. Admin performs management actions:
   - Approve/reject pending bars, reviews, and staff profiles.
   - Delete (soft delete) bars, reviews, blog posts, staff profiles, and users (where supported by routes).
   - Change user roles.
   - Publish/unpublish blog posts.
6. The system persists changes and returns confirmation.

## Extensions

- **E1 — Not authenticated**
  - At step 2, if no session exists, redirect to `/login`.

- **E2 — Not authorized**
  - At step 2, if role is not `Admin`, redirect to `/`.
  - For API requests, return `403`.

- **E3 — Validation error**
  - If input validation fails for role/publish/approve operations, return `400` with field issues.

- **E4 — Not found**
  - If the target resource does not exist or is deleted, return `404`.

## Postconditions

- Admin actions may update approval state, publish state, roles, or soft-delete records.
- The admin panel remains accessible only to admins.
