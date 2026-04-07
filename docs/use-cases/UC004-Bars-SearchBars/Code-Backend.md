# UC004 — Code-Backend

## Domain

- Update `BarListFilters` to include optional `search: string`.

## Infrastructure (Repository)

- Update `barRepository.findAll(filters)`:
  - Add OR search condition on `name` and `description`.

## Application (Service)

- Update `barService.listApprovedBars(filters)` to accept `search` and normalize whitespace.

## API

- Update `GET src/app/api/bars/route.ts` to accept `?search=` and pass to service.
