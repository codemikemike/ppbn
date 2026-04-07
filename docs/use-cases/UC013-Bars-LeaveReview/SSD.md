# UC013 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor RegisteredUser
  participant System

  RegisteredUser->>System: POST /api/bars/:slug/reviews { rating, comment }
  System-->>RegisteredUser: 200 { review }
```
