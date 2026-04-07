# UC020 — Code-Backend-Test

## Route Behavior

- Calling `POST /api/auth/logout` returns 200.
- Response expires session cookies.
- Calling logout twice is safe and returns 200.
