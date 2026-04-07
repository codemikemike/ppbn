# UC001 — Code-Backend

## Domain

- Add `BarDto` and supporting enums in `src/domain/dtos/`.
- Add `IBarRepository` in `src/domain/interfaces/`.

## Infrastructure (Repository)

- Add `barRepository` in `src/repositories/barRepository.ts`.
- Repository queries Prisma and maps Prisma models to `BarDto`.

## Application (Service)

- Add `barService` in `src/services/barService.ts`.
- Service depends on `IBarRepository` only.

## API

- Add `GET src/app/api/bars/route.ts`.
- Route calls `barService.listApprovedBars()` and returns JSON.
