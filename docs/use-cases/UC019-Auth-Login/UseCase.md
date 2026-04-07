# UC019 — Auth — Login

## Use Case Name

User Login

## Actor

RegisteredUser (Unauthenticated)

## Preconditions

- User is not authenticated.
- User has an existing account (email + password).
- User is on the login page at `/login`.

## Main Flow

1. User navigates to `/login`.
2. System displays login form with fields: email, password.
3. User enters email.
4. User enters password.
5. User clicks "Login".
6. System validates inputs server-side.
7. System authenticates user using NextAuth Credentials provider.
8. System creates a session (JWT strategy).
9. System redirects user to `/dashboard`.

## Alternative Flows

### 6a. Validation Failure

1. System detects invalid or missing fields.
2. System rejects login attempt.
3. UI displays a generic validation error.

### 7a. Invalid Credentials

1. System cannot find a user for the email, or password verification fails.
2. System rejects login attempt.
3. UI displays: "Invalid email or password".

### 7b. Account Soft-Deleted

1. System detects the user account is soft-deleted.
2. System rejects login attempt.
3. UI displays a generic login failure message.

### 7c. Unexpected System Error

1. System encounters an internal error.
2. System rejects login attempt.
3. UI displays: "Login failed. Please try again.".

## Postconditions

### Success

- An authenticated session exists for the user.
- User is redirected to `/dashboard`.

### Failure

- No authenticated session is created.
- User remains unauthenticated on `/login`.

## Business Rules

1. Authentication must not reveal whether an email exists.
2. Password verification uses bcrypt.
3. Soft-deleted users cannot log in.
4. Session strategy: JWT.

## Special Requirements

1. Credentials authentication must use NextAuth.js Credentials provider.
2. Never log or return passwords.
3. Must enforce Clean Architecture boundaries (API/UI → services → repositories → db).

## Frequency of Use

High — several times per day

## Open Issues

1. Should we rate-limit login attempts by IP? (Future enhancement.)
2. Should we add 2FA? (Future enhancement.)
