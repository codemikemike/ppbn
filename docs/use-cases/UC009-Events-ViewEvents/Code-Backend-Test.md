# UC009 — Code-Backend-Test

## Unit tests (service layer)

- `src/services/__tests__/eventService.test.ts`

### Covered behavior

- `listUpcomingEvents` delegates to repository with correct filters.
- `getUpcomingEventById` returns DTO when found.
- `getUpcomingEventById` throws `NotFoundError` when missing.

### Mocking rules

- Mock the repository implementation.
- Do not import or mock `db` in service tests.
