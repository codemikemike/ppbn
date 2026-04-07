# UC008 — Code-SQL

## Data sources

Uses existing tables:

- `staff_profiles`
- `staff_ratings`
- `users` (for reviewer name)

## Visibility constraints

Only publicly visible profiles:

- `staff_profiles.isApproved = true`
- `staff_profiles.isActive = true`
- `staff_profiles.deletedAt IS NULL`

## Example queries (conceptual)

### List approved profiles (optional bar filter)

```sql
SELECT sp.*, AVG(sr.rating) AS averageRating
FROM staff_profiles sp
LEFT JOIN staff_ratings sr ON sr.staffProfileId = sp.id
WHERE sp.isApproved = TRUE
  AND sp.isActive = TRUE
  AND sp.deletedAt IS NULL
  AND (:bar IS NULL OR sp.currentBar = :bar)
GROUP BY sp.id
ORDER BY sp.displayName ASC;
```

### Fetch profile detail with ratings

```sql
SELECT sp.*
FROM staff_profiles sp
WHERE sp.id = :id
  AND sp.isApproved = TRUE
  AND sp.isActive = TRUE
  AND sp.deletedAt IS NULL;
```

Ratings:

```sql
SELECT sr.*, u.name AS userName
FROM staff_ratings sr
JOIN users u ON u.id = sr.userId
WHERE sr.staffProfileId = :id
ORDER BY sr.createdAt DESC;
```
