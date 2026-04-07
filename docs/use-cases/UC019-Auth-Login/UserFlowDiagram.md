# UC019 — User Flow Diagram

```mermaid
flowchart TD
  A[User visits /login] --> B[Enter email + password]
  B --> C[Click Login]
  C --> D[NextAuth signIn(credentials)]
  D --> E{Authorized?}
  E -->|Yes| F[Create session (JWT)]
  F --> G[Redirect /dashboard]
  E -->|No| H[Show error message]
```
