# UC022 — Quick Start

## Pages

- `/dashboard`
- `/dashboard/reviews`
- `/dashboard/settings`

## API

### PATCH /api/user/profile

Request:

```json
{ "name": "New Name" }
```

Response (200):

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "New Name",
    "role": "RegisteredUser"
  }
}
```

### PATCH /api/user/password

Request:

```json
{ "currentPassword": "CurrentPassword1", "newPassword": "NewPassword1" }
```

Response (200):

```json
{ "success": true }
```

## Dev

- Run `npm run dev`
- Ensure `NEXTAUTH_SECRET` and database connection are configured.
