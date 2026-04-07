# UC008 — Code-Backend

## Domain

- `src/domain/dtos/StaffProfileDto.ts`
- `src/domain/interfaces/IStaffRepository.ts`

## Infrastructure

- `src/repositories/staffRepository.ts`
  - `findAllApproved({ bar? })`
  - `findApprovedById(id)`

## Application

- `src/services/staffService.ts`
  - `listApprovedStaffProfiles(bar?)`
  - `getApprovedStaffProfileById(id)`

## API

- `src/app/api/staff/route.ts`
  - `GET /api/staff?bar=`
- `src/app/api/staff/[id]/route.ts`
  - `GET /api/staff/:id`

## Notes

- API routes call services only.
- Services depend on `IStaffRepository` only.
- Repositories are the only layer importing `db`.
