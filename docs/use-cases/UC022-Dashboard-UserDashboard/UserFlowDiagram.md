# UC022 — User Flow Diagram

```mermaid
flowchart TD
  A[User] --> B[/dashboard]
  B --> C{Authenticated?}
  C -- No --> D[/login]
  C -- Yes --> E[Dashboard view]
  E --> F[See stats + quick links]
  F --> G[/dashboard/reviews]
  F --> H[/dashboard/favorites]
  F --> I[/dashboard/settings]

  G --> G1[View my reviews]

  I --> I1[Update profile]
  I1 --> I2[PATCH /api/user/profile]
  I2 --> I3[Success or validation error]

  I --> P1[Change password]
  P1 --> P2[PATCH /api/user/password]
  P2 --> P3[Success or error]
```
