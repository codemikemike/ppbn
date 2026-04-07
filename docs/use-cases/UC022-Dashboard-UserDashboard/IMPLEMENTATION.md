# UC022 — Implementation Notes

## Routes (UI)

- `/dashboard` — shows welcome + stats + quick links (auth required)
- `/dashboard/reviews` — shows current user’s reviews (auth required)
- `/dashboard/settings` — profile + password forms (auth required)

## API

- `PATCH /api/user/profile` — updates the current user’s profile
- `PATCH /api/user/password` — changes the current user’s password

## Application Layer

- Extend `AuthService` with:
  - `getDashboardStats(userId)`
  - `listMyReviews(userId)`
  - `updateUserProfile(userId, dto)`
  - `changePassword(userId, dto)`

## Infrastructure Layer

- Extend `IUserRepository` + `userRepository` with:
  - `findByIdWithPassword(id)`
  - `updateProfile(id, data)`
  - `getDashboardStats(userId)`
  - `listMyReviews(userId)`

## Domain Layer

- Add DTOs:
  - `DashboardStatsDto`
  - `UserReviewListItemDto`
- Add validation:
  - `updateUserProfileSchema`
  - `changePasswordSchema`

## Notes

- Presentation layer uses `getServerSession(authOptions)` for authentication gating.
- API error responses follow existing `DomainError` patterns.
