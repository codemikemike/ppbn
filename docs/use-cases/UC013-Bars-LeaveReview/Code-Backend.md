# UC013 — Code-Backend

## API

- Add `POST /api/bars/[slug]/reviews`.
  - Auth required (session).
  - Validates `{ rating, comment }`.
  - Calls `barService.submitReview(slug, userId, { rating, comment })`.

## Services

- Extend `barService` with:
  - `submitReview(slug, userId, { rating, comment })`

## Repositories

- Extend `IBarRepository` with:
  - `upsertReview(barId, userId, rating, comment)`

## DTOs

- Add `UpsertReviewResultDto`.
