# UC015 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /staff/:id] --> B{Authenticated?}
  B -- No --> C[Show "Login to rate"]
  B -- Yes --> D[Show interactive stars + existing rating]

  D --> E[User clicks a star 1-5]
  E --> F[POST /api/staff/:id/rate {rating}]
  F --> G{Success?}
  G -- Yes --> H[Update UI with userRating + averageRating]
  G -- No --> I[Show error message]
```
