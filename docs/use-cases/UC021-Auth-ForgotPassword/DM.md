# UC021 — Domain Model (DM)

```mermaid
classDiagram
  class User {
    +String id
    +String email
    +String password
    +String? passwordResetToken
    +DateTime? passwordResetExpiry
  }
```
