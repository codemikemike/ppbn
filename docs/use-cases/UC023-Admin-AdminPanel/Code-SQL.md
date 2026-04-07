# UC023 — Code-SQL

No schema changes are required for UC023.

Admin operations reuse existing fields:

- Approval: `isApproved`
- Publish state: `isPublished`, `publishedAt`
- Soft delete: `deletedAt`

All changes are implemented as updates against existing tables.
