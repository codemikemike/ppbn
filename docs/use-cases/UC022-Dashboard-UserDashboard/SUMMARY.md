# UC022 — Summary

UC022 adds a logged-in user dashboard with:

- A `/dashboard` overview showing basic activity stats and quick links.
- A `/dashboard/reviews` page listing the user’s reviews.
- A `/dashboard/settings` page enabling profile (name) updates and password changes.
- Two authenticated PATCH APIs (`/api/user/profile`, `/api/user/password`) implemented via `AuthService` and `IUserRepository`.

Clean Architecture boundaries are preserved: UI/API → service → repository → Prisma, and repositories return DTOs rather than Prisma models.
