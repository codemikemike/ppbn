# UC012 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /bars/:slug] --> B{Logged in?}
  B -- No --> C[Show "Login to rate this bar"]
  B -- Yes --> D[Load existing user rating]
  D --> E[User clicks 1-5 stars]
  E --> F[POST /api/bars/:slug/rate {rating}]
  F --> G{Success?}
  G -- Yes --> H[Show success feedback]
  G -- No --> I[Show error feedback]
```
