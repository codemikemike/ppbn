# UC014 — Code (Backend)

## Domain

- Add `ToggleFavoriteResultDto`
- Extend `IBarRepository` with:
  - `toggleFavorite(barId, userId)`
  - `findUserFavorites(userId)`

## Repositories

- `barRepository.toggleFavorite(barId, userId)`
- `barRepository.findUserFavorites(userId)`

## Services

- `barService.toggleFavorite(slug, userId)`
- `barService.getUserFavorites(userId)`

## API

- `POST /api/bars/[slug]/favorite` (auth required)
  - Returns `{ isFavorited: boolean }`
