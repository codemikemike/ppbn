# UC014 — Implementation Notes

## Scope

- Toggle bar favorites for authenticated users
- Heart icon favorite button with optimistic UI
- Dashboard page listing user favorites with remove option

## Files

### UI

- `src/components/bars/FavoriteButton.tsx`
- `src/app/bars/[slug]/page.tsx`
- `src/app/dashboard/favorites/page.tsx`

### API

- `src/app/api/bars/[slug]/favorite/route.ts`

### Application

- `src/services/barService.ts`

### Infrastructure

- `src/repositories/barRepository.ts`

### Domain

- `src/domain/dtos/ToggleFavoriteResultDto.ts`
- `src/domain/interfaces/IBarRepository.ts`

## Clean Architecture Validation

- API routes call services only
- Services depend on `IBarRepository`
- Repositories are the only layer importing Prisma/db
- DTOs cross boundaries, Prisma types remain inside repositories

## Testing

- No automated tests implemented per current request (documented as a follow-up)
