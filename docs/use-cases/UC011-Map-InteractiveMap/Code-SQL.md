# UC011 — Code-SQL

## Data sources

- `bars`

## Example query (conceptual)

```sql
SELECT id, slug, name, area, category, isFeatured, latitude, longitude
FROM bars
WHERE isApproved = TRUE
  AND deletedAt IS NULL
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND (:area IS NULL OR area = :area)
  AND (:category IS NULL OR category = :category)
ORDER BY isFeatured DESC, name ASC;
```
