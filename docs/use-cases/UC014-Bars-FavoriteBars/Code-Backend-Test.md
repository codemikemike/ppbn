# UC014 — Code (Backend Tests)

No unit tests were implemented per the current request.

Recommended follow-ups:

- Service tests for `toggleFavorite` and `getUserFavorites` using a mocked `IBarRepository`
- Repository tests verifying:
  - Create favorite when not present
  - Delete favorite when present
  - Favorites list filters out unapproved/soft-deleted bars
