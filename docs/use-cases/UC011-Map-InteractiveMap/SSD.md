# UC011 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant System

  User->>System: GET /map?area=&category=
  System-->>User: 200 HTML

  User->>System: GET /api/map?area=&category=
  System-->>User: 200 BarDto[]
```
