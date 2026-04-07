# UC004 — Code-SQL

- No migrations.

## Query Notes

- Search is implemented as a case-insensitive substring match:
  - `name LIKE %search%` OR `description LIKE %search%`
- Always enforce:
  - `isApproved = true`
  - `deletedAt = null`
- Search combines with optional `area` and `category` filters.
