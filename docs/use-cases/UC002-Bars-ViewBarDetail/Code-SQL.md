# UC002 — Code-SQL

## Schema

- No new tables or migrations required.
- Uses existing tables:
  - `bars`
  - `bar_images`
  - `reviews`
  - `users`

## Query Notes

- Bar lookup uses `slug` (indexed).
- Reviews are filtered to public visibility:
  - `isApproved = true`
  - `deletedAt = null`
- Images are ordered so a primary image can be selected.

## Indexes

- Existing indexes in schema support:
  - `bars.slug`
  - `reviews.barId`, `reviews.isApproved`, `reviews.deletedAt`
  - `bar_images.barId`, `bar_images.isPrimary`
