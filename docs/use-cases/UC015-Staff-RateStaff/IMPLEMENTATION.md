# UC015 — Implementation Notes

## Scope

- Logged-in users can rate a staff profile with a 1–5 star rating
- Ratings are upserted into `staff_ratings`
- API returns `{ averageRating, userRating }`

## Files

### UI

- `src/components/staff/StaffStarRating.tsx`
- `src/app/staff/[id]/page.tsx`

### API

- `src/app/api/staff/[id]/rate/route.ts`

### Application

- `src/services/staffService.ts`

### Infrastructure

- `src/repositories/staffRepository.ts`

### Domain

- `src/domain/dtos/RateStaffResultDto.ts`
- `src/domain/validations/staffSchema.ts`
- `src/domain/interfaces/IStaffRepository.ts`

## Clean Architecture Validation

- API routes call services only
- Services depend on repository interfaces only
- Repositories are the only layer importing Prisma/db
- Prisma types are not imported outside repositories

## Testing

No tests implemented per request.
