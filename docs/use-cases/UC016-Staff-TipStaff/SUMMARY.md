# UC016 — Summary

- Adds a logged-in user flow to tip staff profiles.
- UI provides preset amounts ($1, $2, $5, $10, $20) and a custom amount.
- Server validates amount ($1–$100), then records a `StaffTip` row.
- Endpoint: `POST /api/staff/:id/tip` returns `{ success, tipId }`.
- Clean Architecture enforced: UI/API → service → repository → Prisma.
