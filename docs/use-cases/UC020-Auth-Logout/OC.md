# UC020 — Operation Contract (OC)

## Operation

`POST /api/auth/logout` — Logout

## Inputs

- None

## Output (Success)

- HTTP 200
- Body: `{ ok: true }`

## Output (Failure)

- HTTP 500
- Body: `{ error: string, code: "INTERNAL_ERROR" }`

## Preconditions

- None (safe to call when already logged out)

## Postconditions

- Authentication cookies are expired/cleared.

## Business Rules Enforced

- Logout clears authentication cookies.
