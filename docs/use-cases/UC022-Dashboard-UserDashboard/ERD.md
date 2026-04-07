# UC022 — ERD

```mermaid
erDiagram
  USERS ||--o{ REVIEWS : writes
  BARS ||--o{ REVIEWS : receives

  USERS ||--o{ FAVORITE_BARS : favorites
  BARS ||--o{ FAVORITE_BARS : is_favorited

  USERS ||--o{ STAFF_RATINGS : rates
  STAFF_PROFILES ||--o{ STAFF_RATINGS : is_rated

  USERS {
    string id PK
    string email
    string name
    string password
  }

  REVIEWS {
    string id PK
    string barId FK
    string userId FK
    int rating
    text content
    datetime deletedAt
  }

  FAVORITE_BARS {
    string id PK
    string userId FK
    string barId FK
    datetime createdAt
  }

  STAFF_RATINGS {
    string id PK
    string userId FK
    string staffProfileId FK
    int rating
    datetime createdAt
  }
```
