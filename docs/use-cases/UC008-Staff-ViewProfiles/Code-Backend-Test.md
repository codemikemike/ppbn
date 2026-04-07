# UC008 — Code-Backend-Test

## Unit tests (service layer)

- `src/services/__tests__/staffService.test.ts`

### Covered behavior

- `listApprovedStaffProfiles` delegates to repository with correct filter.
- `getApprovedStaffProfileById` returns DTO when found.
- `getApprovedStaffProfileById` throws `NotFoundError` when missing.

### Mocking rules

- Mock the repository implementation.
- Do not import or mock `db` in service tests.
