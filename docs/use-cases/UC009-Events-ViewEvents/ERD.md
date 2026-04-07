# UC009 — Entity Relationship Diagram (ERD)

```mermaid
erDiagram
  bars ||--o{ events : hosts

  bars {
    string id PK
    string slug
    string name
  }

  events {
    string id PK
    string barId FK
    string title
    string description
    string eventType
    datetime startTime
    datetime endTime
    boolean isApproved
    datetime deletedAt
  }
```
