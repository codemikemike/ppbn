# UC003 — Code-Backend

## Domain

- Reuse existing `BarArea` and `BarCategory` DTO types.
- Reuse `BAR_CATEGORY_LABELS` for UI labels.

## Infrastructure (Repository)

- Update `barRepository` in `src/repositories/barRepository.ts`:
  - Add `findAll(filters)`.
  - Apply optional `area` and `category` filters.

## Application (Service)

- Update `barService` in `src/services/barService.ts`:
  - `listApprovedBars(filters)` delegates to repository.

## API

- Update `GET src/app/api/bars/route.ts`:
  - Parse `area` and `category` query params.
  - Validate values.
  - Call service with filters.
