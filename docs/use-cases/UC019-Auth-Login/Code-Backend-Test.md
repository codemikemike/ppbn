# UC019 — Code-Backend-Test

## Goal

Verify authentication behavior without touching the database directly.

## Tests

1. `authenticateUser` returns `UserDto` for valid credentials.
2. `authenticateUser` throws `UnauthorizedError` for invalid credentials.
3. `authenticateUser` throws `UnauthorizedError` for soft-deleted users.
4. Validation failures throw `ValidationError`.

## Approach

- Unit tests for `AuthService` with mocked `IUserRepository`.

## Note

If a test runner is not configured yet, set up the project’s chosen runner before implementing these tests.
