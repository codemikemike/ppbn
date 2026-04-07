# UC021 — Entity Relationship Diagram (ERD)

```mermaid
erDiagram
  USERS {
    string id PK
    string email
    string password
    string passwordResetToken
    datetime passwordResetExpiry
  }
```
