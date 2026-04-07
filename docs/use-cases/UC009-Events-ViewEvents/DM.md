# UC009 — Domain Model (DM)

```mermaid
classDiagram
  class Event {
    +String id
    +String title
    +String description
    +EventType eventType
    +DateTime startTime
    +DateTime endTime
    +String barId
  }

  class Bar {
    +String id
    +String slug
    +String name
  }

  Bar "1" --> "0..*" Event : hosts
```
