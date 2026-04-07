# UC021 — Summary

- Adds forgot-password and reset-password flow.
- Stores a hashed reset token + expiry on `User`.
- API avoids user enumeration by returning generic success for existing/non-existing emails.
- UI includes `/forgot-password` and `/reset-password?token=...`.
- Clean Architecture enforced: API → service → repository → Prisma.
