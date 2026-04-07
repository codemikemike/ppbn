# UC019 — Code-UI-Test

## Goal

Verify `/login` form behavior.

## Tests

1. Renders email/password inputs and login button.
2. Shows error message on failed sign-in.
3. Redirects on success.

## Approach

- Component test mocking `next-auth/react` `signIn`.
- E2E test for login flow.

## Note

UI testing tooling may need to be configured before implementing tests.
