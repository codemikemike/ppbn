# UC014 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /bars/:slug] --> B{Authenticated?}
  B -- No --> C[Show heart icon + tooltip "Login to save favorites"]
  B -- Yes --> D[Show heart icon reflecting current state]

  D --> E[User clicks heart icon]
  E --> F[Optimistic UI toggle]
  F --> G[POST /api/bars/:slug/favorite]
  G --> H{Success?}
  H -- Yes --> I[Keep UI state from response]
  H -- No --> J[Revert UI + show error]

  A2[User opens /dashboard/favorites] --> K[Load favorites]
  K --> L[Render list of favorite bars]
  L --> M[User clicks "Remove"]
  M --> N[Toggle favorite off]
  N --> O[Refresh favorites list]
```
