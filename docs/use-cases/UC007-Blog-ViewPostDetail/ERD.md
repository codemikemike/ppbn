# UC007 — ERD

```mermaid
erDiagram
  USER ||--o{ BLOG_POST : authors

  BLOG_POST {
    string id PK
    string slug
    string title
    string content
    boolean isPublished
    datetime publishedAt
    datetime deletedAt
    string tags
    string coverImageUrl
  }
```
