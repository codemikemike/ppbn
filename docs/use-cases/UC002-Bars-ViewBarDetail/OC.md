# UC002 — Operation Contract (OC)

## Operation

`GET /api/bars/:slug` — View an approved bar by slug

## Inputs

- Path param: `slug: string`

## Output (Success)

- HTTP 200
- Body: `BarDetailDto`

## Output (Failure)

- HTTP 404
- Body: `{ error: string, code: "NOT_FOUND" }`

- HTTP 500
- Body: `{ error: string, code: "INTERNAL_ERROR" }`

## Preconditions

- `slug` is present and non-empty.

## Postconditions

- No data is created/updated/deleted.

## Business Rules Enforced

- Only `isApproved = true`
- Only `deletedAt = null`
- Include only reviews with `isApproved = true` and `deletedAt = null`
- Average rating computed from included reviews
