# UC021 — Quick Start

## UI

1. Open `/forgot-password`.
2. Enter an email and submit.
3. Check the server logs for a reset link.
4. Open the reset link (`/reset-password?token=...`).
5. Set a new password.

## API

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}' \
  http://localhost:3000/api/auth/forgot-password
```

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"token":"<token>","password":"NewPassword1"}' \
  http://localhost:3000/api/auth/reset-password
```
