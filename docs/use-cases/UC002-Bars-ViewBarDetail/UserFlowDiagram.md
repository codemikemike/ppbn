# UC002 — User Flow Diagram

```mermaid
flowchart TD
  A[Visitor navigates to /bars/:slug] --> B[System validates slug]
  B -->|Valid| C[GET bar detail]
  B -->|Invalid| X[Show not found]

  C --> D{Bar exists and is public?\n(isApproved=true, deletedAt=null)}
  D -->|No| X[Show not found]
  D -->|Yes| E[Return BarDetailDto\n(includes images, approved reviews, averageRating)]
  E --> F[Render bar detail page]
  F --> G{Has approved reviews?}
  G -->|Yes| H[Render review list]
  G -->|No| I[Render empty reviews state]
```
