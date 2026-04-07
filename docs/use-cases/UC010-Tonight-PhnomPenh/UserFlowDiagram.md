# UC010 — User Flow Diagram

```mermaid
flowchart TD
  A[User opens /tonight] --> B[System determines today's date in Phnom Penh]
  B --> C[Load tonight data]
  C --> D[Render sections: Events, Open Bars, Live Music, Featured]
  D --> E{User clicks a bar?}
  E -- No --> F[User keeps browsing]
  E -- Yes --> G[Navigate to /bars/{slug}]
```
