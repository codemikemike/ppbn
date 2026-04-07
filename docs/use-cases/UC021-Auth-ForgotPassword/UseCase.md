# UC021 — Auth — Forgot Password

## Use Case Name

Forgot Password

## Actor

Visitor / RegisteredUser (Unauthenticated)

## Preconditions

- User can access the Forgot Password page at `/forgot-password`.

## Main Flow

1. User navigates to `/forgot-password`.
2. System displays a form with an email input.
3. User enters an email address.
4. User submits the form.
5. System validates the email format.
6. System generates a password reset token and expiry (if the email exists).
7. System stores the token and expiry for the user.
8. System sends a reset email containing a reset link (logged for now).
9. System always returns a success response to avoid revealing whether the email exists.
10. UI shows a success message.

## Alternative Flows

### 5a. Invalid Email Format

1. System rejects the request and returns `400 Bad Request`.
2. UI shows a validation error.

### 6a. Email Does Not Exist

1. System does not create or store a reset token.
2. System still returns success.

### 8a. Email Delivery Not Implemented

1. System logs a reset link instead of sending a real email.

## Postconditions

### Success

- If the user exists, a reset token and expiry are stored for the user.
- The user receives a reset link (via logs until an email provider is added).
- The UI shows a success message.

### Failure

- No reset token is created for invalid email input.

## Business Rules

1. The response must not reveal whether an email exists.
2. Reset tokens must be secure and time-limited.
3. Tokens must be invalidated after successful password reset.

## Special Requirements

1. API:
   - `POST /api/auth/forgot-password` accepts `{ email }`.
   - `POST /api/auth/reset-password` accepts `{ token, password }`.
2. UI:
   - `/forgot-password` has an email form and success state.
   - `/reset-password` reads `?token=...` and allows setting a new password.
3. Clean Architecture boundaries must be respected.

## Open Issues

1. Email provider integration (SendGrid, SES, etc.) is out of scope.
2. Admin moderation / rate limiting is out of scope.
