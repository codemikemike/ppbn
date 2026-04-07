# UC020 — Domain Model (DM)

```mermaid
classDiagram
  class Session {
    +User user
  }

  class User {
    +string id
    +string email
    +string? name
    +string role
  }

  Session --> User
```
