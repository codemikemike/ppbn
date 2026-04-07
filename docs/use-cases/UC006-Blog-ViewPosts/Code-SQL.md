# UC006 — Code (SQL)

No schema changes required.

Reads from `blog_posts` filtered by:

- `isPublished = true`
- `publishedAt IS NOT NULL`
- `deletedAt IS NULL`

Orders by `publishedAt DESC`.
