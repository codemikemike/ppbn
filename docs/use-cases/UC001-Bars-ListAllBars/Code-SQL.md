# UC001 — Code-SQL

## Notes

- The `bars` table already exists in the current schema.
- No migration is required for UC001.

## Query (Conceptual)

```sql
SELECT
  id,
  slug,
  name,
  area,
  category,
  isFeatured
FROM bars
WHERE isApproved = TRUE
  AND deletedAt IS NULL
ORDER BY isFeatured DESC, name ASC;
```

## Index Considerations

- Existing indexes on `isApproved`, `deletedAt`, and `name/slug` support this query.
