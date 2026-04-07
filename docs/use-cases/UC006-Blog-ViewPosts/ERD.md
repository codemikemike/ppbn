# UC006 — ERD

```mermaid
erDiagram
  USER ||--o{ BLOG_POST : authors

  USER {
    string id PK
    string name
  }

  BLOG_POST {
    string id PK
    string slug
    string title
    string excerpt
    string content
    boolean isPublished
    datetime publishedAt
    datetime deletedAt
  }
```
