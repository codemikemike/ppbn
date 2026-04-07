# UC005 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /bars/:slug] --> B[System loads bar detail]
  B --> C[System loads approved reviews]
  C --> D[Show average rating + total reviews]
  D --> E[Render each review as an article]
```
