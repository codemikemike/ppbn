# UC014 — Operation Contracts

## Operation 1: toggleFavorite

### Contract: toggleFavorite(slug: string, userId: string): ToggleFavoriteResultDto

**Cross-References**: UC014 Main Flow (Toggle Favorite)

**Preconditions**:

- `slug` is not null or empty
- `userId` is not null or empty
- An approved, non-deleted Bar exists with `Bar.slug = slug`
- The user is authenticated

**Postconditions**:

- If no FavoriteBar existed for (userId, barId):
  - A new FavoriteBar row is created
  - Returns `{ isFavorited: true }`
- If a FavoriteBar existed for (userId, barId):
  - The FavoriteBar row is deleted
  - Returns `{ isFavorited: false }`
- No other entities are modified

## Operation 2: getUserFavorites

### Contract: getUserFavorites(userId: string): BarDto[]

**Cross-References**: UC014 Main Flow (View Favorites)

**Preconditions**:

- `userId` is not null or empty
- The user is authenticated

**Postconditions**:

- Returns an ordered list of approved, non-deleted bars that the user has favorited
- If the user has no favorites, returns an empty array
- No data is modified in the database

## Invariants

1. `(userId, barId)` in FavoriteBar is unique
2. Favorites require authentication
3. Only approved, non-deleted bars appear in favorites
