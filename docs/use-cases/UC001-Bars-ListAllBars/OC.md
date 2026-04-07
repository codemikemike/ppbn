# UC001 — Operation Contract (OC)

## Operation

`GET /api/bars` — List all approved bars

## Inputs

- None

## Output (Success)

- HTTP 200
- Body: `BarDto[]`

## Output (Failure)

- HTTP 500
- Body: `{ error: string, code: "INTERNAL_ERROR" }`

## Preconditions

- None

## Postconditions

- No data is created/updated/deleted.

## Business Rules Enforced

- Only `isApproved = true`
- Only `deletedAt = null`
- Sort order: `isFeatured desc`, `name asc`
