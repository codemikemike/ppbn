# UC013 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /bars/:slug] --> B{Logged in?}
  B -- No --> C[Show "Login to leave a review"]
  B -- Yes --> D[Show review form]
  D --> E[Select rating + enter comment]
  E --> F[POST /api/bars/:slug/reviews]
  F --> G{Success?}
  G -- Yes --> H[Show success + clear form]
  G -- No --> I[Show error]
```
