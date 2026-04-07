# UC010 — Code-SQL

## Data sources

Uses existing tables:

- `events`
- `bars`

## Visibility constraints

- Bars: `bars.isApproved = TRUE` and `bars.deletedAt IS NULL`
- Events: `events.isApproved = TRUE` and `events.deletedAt IS NULL` and related bar is visible

## Example queries (conceptual)

### Events overlapping today

```sql
SELECT e.*, b.slug AS barSlug, b.name AS barName
FROM events e
JOIN bars b ON b.id = e.barId
WHERE e.isApproved = TRUE
  AND e.deletedAt IS NULL
  AND b.isApproved = TRUE
  AND b.deletedAt IS NULL
  AND e.startTime < :endOfDay
  AND (e.endTime IS NULL OR e.endTime >= :startOfDay);
```

### Featured bars

```sql
SELECT b.*
FROM bars b
WHERE b.isApproved = TRUE
  AND b.deletedAt IS NULL
  AND b.isFeatured = TRUE
ORDER BY b.name ASC;
```

### Bars open tonight

Opening hours are stored as text (e.g. `18:00-02:00`) and are evaluated in application code.
