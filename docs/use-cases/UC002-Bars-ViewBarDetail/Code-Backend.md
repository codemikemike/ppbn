# UC002 — Code-Backend

## Domain

- Add `BarDetailDto` in `src/domain/dtos/BarDetailDto.ts`.
- Update `IBarRepository` to add `findBySlug(slug: string)`.

## Infrastructure (Repository)

- Update `barRepository` in `src/repositories/barRepository.ts`:
  - Implement `findBySlug(slug)`.
  - Query a public bar by `slug`.
  - Include images and approved reviews.
  - Map Prisma models to `BarDetailDto`.

## Application (Service)

- Update `barService` in `src/services/barService.ts`:
  - Add `getApprovedBarBySlug(slug)`.

## API

- Add `GET src/app/api/bars/[slug]/route.ts`.
- Route calls `barService.getApprovedBarBySlug(slug)` and returns JSON.
