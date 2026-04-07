# UC003 — Domain Model (DM)

```mermaid
classDiagram
  class Bar {
    +String id
    +String slug
    +String name
    +BarArea area
    +BarCategory category
    +Boolean isFeatured
    +Boolean isApproved
    +DateTime? deletedAt
  }

  class BarDto {
    +string id
    +string slug
    +string name
    +BarArea area
    +BarCategory category
    +boolean isFeatured
  }

  Bar --> BarDto : maps to
```
