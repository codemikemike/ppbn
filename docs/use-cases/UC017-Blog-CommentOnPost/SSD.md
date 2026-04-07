# UC017 — System Sequence Diagram (SSD)

```mermaid
sequenceDiagram
  actor User
  participant System

  User->>System: View blog post page
  System-->>User: Shows post + approved comments

  alt User authenticated
    User->>System: Submit comment(content)
    alt Valid content
      System-->>User: 200
    else Validation error
      System-->>User: 400
    end
  else User not authenticated
    System-->>User: Shows "Login to comment"
  end
```
