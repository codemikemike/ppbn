# UC003 — Operation Contract (OC)

## Operation

`GET /api/bars?area=&category=` — List approved bars filtered by area/category

## Inputs

- Query params (optional):
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

- If `area` is provided, it must be a valid `BarArea` value.
- If `category` is provided, it must be a valid `BarCategory` value.

## Postconditions

- No data is created/updated/deleted.

## Business Rules Enforced

- Only `isApproved = true`
- Only `deletedAt = null`
- Sort order: `isFeatured desc`, `name asc`
