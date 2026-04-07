# UC017 — User Flow Diagram

```mermaid
flowchart TD
  A[User views blog post /blog/:slug] --> B[System shows post content]
  B --> C[System shows approved comments]
  C --> D{Authenticated?}
  D -- No --> E[Show "Login to comment"]
  D -- Yes --> F[User enters comment]
  F --> G[Submit comment]
  G --> H{Valid content >= 5 chars?}
  H -- No --> I[Show validation error]
  H -- Yes --> J[POST /api/blog/:slug/comments]
  J --> K{200 OK?}
  K -- No --> L[Show error]
  K -- Yes --> M[Show success + clear form]
```
