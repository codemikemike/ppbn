# UC004 — Operation Contract (OC)

## Operation

`GET /api/bars?search=&area=&category=` — Search and filter approved bars

## Inputs

- Query params (optional):
  - `search: string`
  - `area: BarArea`
  - `category: BarCategory`

## Output (Success)

- HTTP 200
- Body: `BarDto[]`

## Output (Failure)

- HTTP 400
- Body: `{ error: string, code: "VALIDATION_ERROR" }`

- HTTP 500
- Body: `{ error: string, code: "INTERNAL_ERROR" }`

## Preconditions

- `area` and `category` must be valid values if present.
- `search` may be empty; empty search behaves as omitted.

## Postconditions

- No data is created/updated/deleted.

## Business Rules Enforced

- Only `isApproved = true`
- Only `deletedAt = null`
- Search matches `name` OR `description` (case-insensitive)
- Sort order: `isFeatured desc`, `name asc`
