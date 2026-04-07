# UC012 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor RegisteredUser
  participant System

  RegisteredUser->>System: POST /api/bars/:slug/rate { rating }
  System-->>RegisteredUser: 200 { averageRating }
```
