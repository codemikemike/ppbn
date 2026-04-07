# UC020 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as Navbar
  participant API as POST /api/auth/logout

  User->>UI: Click Logout
  UI->>API: POST logout
  API-->>UI: 200 OK
  UI-->>User: Redirect to /
```
