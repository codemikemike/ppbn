# UC019 — Code-SQL

## Notes

- No migration is required for UC019.

## Queries (Conceptual)

```sql
SELECT id, email, name, password, role, deletedAt
FROM users
WHERE email = ?
LIMIT 1;
```

Rules:

- Reject if `deletedAt IS NOT NULL`.
