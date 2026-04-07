# UC023 — User Flow Diagram

```mermaid
flowchart TD
  A[Admin] --> B[/admin]
  B --> C{Authenticated?}
  C -- No --> L[/login]
  C -- Yes --> D{Role Admin?}
  D -- No --> H[/]
  D -- Yes --> E[Admin Overview]

  E --> EB[/admin/bars]
  E --> ER[/admin/reviews]
  E --> EU[/admin/users]
  E --> EBL[/admin/blog]
  E --> ES[/admin/staff]

  EB --> EB1[Approve/Reject bar]
  EB1 --> EBAPI[PATCH /api/admin/bars/:id/approve]
  EB --> EB2[Delete bar]
  EB2 --> EBDEL[DELETE /api/admin/bars/:id]

  ER --> ER1[Approve/Reject review]
  ER1 --> ERAPI[PATCH /api/admin/reviews/:id/approve]

  EU --> EU1[Change role]
  EU1 --> EUAPI[PATCH /api/admin/users/:id/role]
  EU --> EU2[Delete user]
  EU2 --> EUDEL[DELETE /api/admin/users/:id]

  EBL --> EBL1[Publish/Unpublish]
  EBL1 --> EBLAPI[PATCH /api/admin/blog/:id/publish]

  ES --> ES1[Approve/Reject staff]
  ES1 --> ESAPI[PATCH /api/admin/staff/:id/approve]
```
