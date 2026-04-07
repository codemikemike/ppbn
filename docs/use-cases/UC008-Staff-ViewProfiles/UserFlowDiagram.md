# UC008 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /staff] --> B[System loads approved staff profiles]
  B --> C[Show list cards]
  C --> D{Filter by bar?}
  D -- No --> E[User clicks profile]
  D -- Yes --> F[System reloads list with bar filter]
  F --> E
  E --> G[Navigate to /staff/[id]]
  G --> H[System loads approved profile by id]
  H --> I[Show profile detail + ratings]
```
