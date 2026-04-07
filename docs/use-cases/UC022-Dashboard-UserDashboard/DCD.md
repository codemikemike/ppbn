# UC022 — Design Class Diagram (DCD)

```mermaid
classDiagram
  class AuthService {
    -IUserRepository userRepository
    +getDashboardStats(userId) DashboardStatsDto
    +listMyReviews(userId) UserReviewListItemDto[]
    +updateUserProfile(userId, dto) UserDto
    +changePassword(userId, dto) void
  }

  class IUserRepository {
    <<interface>>
    +findByIdWithPassword(id) (UserDto & password) | null
    +updateProfile(id, data) UserDto
    +getDashboardStats(userId) DashboardStatsDto
    +listMyReviews(userId) UserReviewListItemDto[]
    +updatePassword(userId, passwordHash) void
  }

  class DashboardStatsDto {
    +number reviewsCount
    +number favoriteBarsCount
    +number staffRatingsCount
  }

  class UserReviewListItemDto {
    +string id
    +number rating
    +string content
    +Date createdAt
    +bar: { slug, name }
  }

  AuthService --> IUserRepository
```
