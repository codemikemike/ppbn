# UC014 — Entity Relationship Diagram

```mermaid
erDiagram
  USERS ||--o{ FAVORITE_BARS : favorites
  BARS ||--o{ FAVORITE_BARS : favoritedBy

  USERS {
    string id PK
    string email
    string role
  }

  BARS {
    string id PK
    string slug UK
    string name
    boolean isApproved
    datetime deletedAt
  }

  FAVORITE_BARS {
    string id PK
    string userId FK
    string barId FK
    datetime createdAt
  }
```
