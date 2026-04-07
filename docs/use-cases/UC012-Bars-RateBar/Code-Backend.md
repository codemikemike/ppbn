# UC012 — Code-Backend

## API

- Add `POST /api/bars/[slug]/rate`.
  - Auth required (session).
  - Validates `{ rating }`.
  - Calls `barService.rateBar(slug, userId, { rating })`.

## Services

- Extend `barService` with:
  - `rateBar(slug, userId, { rating })`

## Repositories

- Extend `IBarRepository` with:
  - `upsertRating(barId, userId, rating)`

## DTOs

- Add `RateBarResultDto` for returning `{ averageRating }`.
