# UC016 — Quick Start

## UI

1. Go to `/staff/[id]`.
2. If logged in, click "Tip".
3. Pick a preset amount or enter a custom amount.
4. Optionally add a message.
5. Submit and confirm success.

## API

Example (requires an authenticated session cookie):

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"amount":5,"message":"Thanks!"}' \
  http://localhost:3000/api/staff/<staffId>/tip
```

Expected response:

```json
{ "success": true, "tipId": "..." }
```
