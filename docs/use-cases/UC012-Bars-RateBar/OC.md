# UC012 — Operation Contract (OC)

## Operation

`POST /api/bars/:slug/rate` — Rate an approved bar

## Inputs

- Path param: `slug: string`
- Body: `{ rating: number }` where `rating` is an integer 1–5

## Output (Success)

- HTTP 200
- Body: `{ averageRating: number }`

## Output (Failure)

- HTTP 400
- Body: `{ error: string, code: "VALIDATION_ERROR" }`

- HTTP 401
- Body: `{ error: string, code: "UNAUTHORIZED" }`

- HTTP 404
- Body: `{ error: string, code: "NOT_FOUND" }`

- HTTP 500
- Body: `{ error: string, code: "INTERNAL_ERROR" }`

## Preconditions

- User is authenticated.
- `slug` is present and non-empty.
- `rating` is an integer 1–5.

## Postconditions

- A Review row for `(barId, userId)` is created or updated with the selected rating.
