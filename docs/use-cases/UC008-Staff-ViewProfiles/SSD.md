# UC008 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant System

  User->>System: GET /staff?bar=optional
  System-->>User: 200 StaffProfileDto[]

  User->>System: GET /staff/{id}
  System-->>User: 200 StaffProfileDetailDto
```
