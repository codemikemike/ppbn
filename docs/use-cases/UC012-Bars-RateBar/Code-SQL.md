# UC012 — Code-SQL

## Schema

- No schema changes required for MVP.
- Ratings are stored in the existing `reviews` table.

## Constraints

- `reviews` already enforces one row per `(barId, userId)` via `@@unique([barId, userId])`.
