# UC003 — Code-SQL

- No migrations.

## Query Notes

- Filters are applied to the `bars` query:
  - `area = <value>` when provided
  - `category = <value>` when provided
  - Always enforce:
    - `isApproved = true`
    - `deletedAt = null`
  - Ordering:
    - `isFeatured desc`, `name asc`
