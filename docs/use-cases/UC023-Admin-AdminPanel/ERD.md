# UC023 — ERD

```mermaid
erDiagram
  USERS ||--o{ BARS : owns
  USERS ||--o{ REVIEWS : writes
  USERS ||--o{ BLOG_POSTS : authors
  USERS ||--o| STAFF_PROFILES : has

  USERS {
    string id PK
    string email
    string role
    datetime deletedAt
  }

  BARS {
    string id PK
    boolean isApproved
    datetime deletedAt
  }

  REVIEWS {
    string id PK
    boolean isApproved
    datetime deletedAt
  }

  BLOG_POSTS {
    string id PK
    boolean isPublished
    datetime deletedAt
  }

  STAFF_PROFILES {
    string id PK
    boolean isApproved
    datetime deletedAt
  }
```
