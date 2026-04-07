# UC020 — Design Class Diagram (DCD)

```mermaid
classDiagram
  class Navbar {
    +render()
    +handleLogout()
  }

  class LogoutRoute {
    +POST()
  }

  Navbar --> LogoutRoute
```
