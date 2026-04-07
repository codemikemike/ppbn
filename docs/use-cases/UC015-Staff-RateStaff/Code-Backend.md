# UC015 — Code (Backend)

## Domain

- `RateStaffResultDto`
- `rateStaffSchema` (Zod) for `{ rating: number }`
- Extend `IStaffRepository` with:
  - `upsertRating(staffId, userId, rating)`
  - `getUserRating(staffId, userId)`

## Repository

- `staffRepository.upsertRating(...)` uses Prisma `staffRating.upsert`
- `staffRepository.getUserRating(...)` uses Prisma `staffRating.findUnique`

## Service

- `staffService.rateStaff(staffId, userId, rating)` validates staff visibility then calls repository

## API

- `POST /api/staff/[id]/rate` (auth required)
  - Body: `{ rating: number }`
  - Returns: `{ averageRating: number, userRating: number }`
