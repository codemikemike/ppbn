# UC009 — Code-SQL

## Data sources

Uses existing tables:

- `events`
- `bars`

## Visibility constraints

Only publicly visible events:

- `events.isApproved = true`
- `events.deletedAt IS NULL`
- upcoming/current:
  - `events.startTime >= NOW()` OR (`events.endTime IS NOT NULL` AND `events.endTime >= NOW()`)

## Example queries (conceptual)

### List upcoming events with filters

```sql
SELECT e.*, b.slug AS barSlug, b.name AS barName
FROM events e
JOIN bars b ON b.id = e.barId
WHERE e.isApproved = TRUE
  AND e.deletedAt IS NULL
  AND (
    e.startTime >= NOW()
    OR (e.endTime IS NOT NULL AND e.endTime >= NOW())
  )
  AND (:type IS NULL OR e.eventType = :type)
  AND (:barId IS NULL OR e.barId = :barId)
ORDER BY e.startTime ASC;
```

### Fetch upcoming event by id

```sql
SELECT e.*, b.slug AS barSlug, b.name AS barName
FROM events e
JOIN bars b ON b.id = e.barId
WHERE e.id = :id
  AND e.isApproved = TRUE
  AND e.deletedAt IS NULL
  AND (
    e.startTime >= NOW()
    OR (e.endTime IS NOT NULL AND e.endTime >= NOW())
  );
```
