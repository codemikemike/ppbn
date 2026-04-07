# UC016 — User Flow Diagram

```mermaid
flowchart TD
  A[User views staff profile /staff/:id] --> B{Authenticated?}
  B -- No --> C[Show "Login to tip"]
  B -- Yes --> D[User clicks Tip]
  D --> E[Open tip modal]
  E --> F[Select preset amount OR enter custom amount]
  F --> G[Optional message]
  G --> H[Submit tip]
  H --> I{Valid amount $1..$100?}
  I -- No --> J[Show validation error]
  I -- Yes --> K[POST /api/staff/:id/tip]
  K --> L{200 OK?}
  L -- No --> M[Show error]
  L -- Yes --> N[Show success + close modal]
```
