# UC007 — Code (SQL)

No schema changes required.

Reads a single post by slug filtered by:

- `isPublished = true`
- `publishedAt IS NOT NULL`
- `deletedAt IS NULL`

Related posts are filtered by same derived category and limited to 3.
