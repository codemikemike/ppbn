# UC009 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /events] --> B[System loads upcoming approved events]
  B --> C[Show list view]
  C --> D{Filter by type?}
  D -- No --> E{Switch to calendar view?}
  D -- Yes --> F[System reloads list by type]
  F --> E
  E -- No --> G[User clicks event]
  E -- Yes --> H[System shows calendar view]
  H --> G
  G --> I[Navigate to /events/[id]]
  I --> J[System loads upcoming approved event by id]
  J --> K[Show event details + bar link]
```
