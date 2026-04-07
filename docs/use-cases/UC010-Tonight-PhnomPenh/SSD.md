# UC010 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant System

  User->>System: GET /tonight
  System-->>User: 200 HTML (Tonight page)

  User->>System: GET /api/tonight
  System-->>User: 200 TonightDto
```
