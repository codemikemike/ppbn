# UC021 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  actor User
  participant System

  User->>System: Submit forgot password(email)
  alt Valid email format
    System-->>User: 200 OK (generic success)
  else Invalid email format
    System-->>User: 400 Bad Request
  end

  User->>System: Submit reset password(token, password)
  alt Token valid + not expired
    System-->>User: 200 OK
  else Token invalid/expired
    System-->>User: 400 Bad Request
  end
```
