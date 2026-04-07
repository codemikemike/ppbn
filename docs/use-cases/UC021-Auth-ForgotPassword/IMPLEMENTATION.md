# UC021 — Implementation Notes

## Scope

- Allow a user to request a password reset link via email.
- Allow a user to reset their password using a secure token.

## API

- `POST /api/auth/forgot-password` accepts `{ email }`.
  - Always returns success for valid email format.
  - Generates a secure token for existing users, stores token hash + expiry, and logs a reset link.
- `POST /api/auth/reset-password` accepts `{ token, password }`.
  - Validates token exists and is not expired.
  - Updates password (bcrypt hash) and clears token fields.

## Security

- Token is generated with strong randomness and stored as a hash.
- Token expires after a short window.
- Forgot-password endpoint avoids revealing whether an email exists.

## Architecture

- API routes call `authService` only.
- `AuthService` uses `IUserRepository` only.
- `userRepository` is the only layer that talks to Prisma.

## Data

- Adds `passwordResetToken` and `passwordResetExpiry` fields on `User`.
